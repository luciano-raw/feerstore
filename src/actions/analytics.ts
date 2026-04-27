"use server"

import { prisma } from "@/lib/prisma"

export async function trackPageView(path: string) {
  try {
    await prisma.pageView.create({
      data: { path }
    })
  } catch (e) {
    console.error("Error tracking page view:", e)
  }
}

export async function trackProductClick(productId: string) {
  try {
    await prisma.productClick.create({
      data: { productId }
    })
  } catch (e) {
    console.error("Error tracking product click:", e)
  }
}

export async function getDashboardStats(timeframe: '7d' | '30d' | '12m' = '30d') {
  let dateGte = new Date()
  if (timeframe === '7d') {
    dateGte.setDate(dateGte.getDate() - 7)
  } else if (timeframe === '30d') {
    dateGte.setDate(dateGte.getDate() - 30)
  } else if (timeframe === '12m') {
    dateGte.setMonth(dateGte.getMonth() - 12)
  }
  const [totalViews, topProducts, inventoryTotal, recentViews, auditLogs] = await Promise.all([
    prisma.pageView.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { clicks: { _count: 'desc' } },
      include: { _count: { select: { clicks: true } } }
    }),
    prisma.product.aggregate({
      _sum: {
        stock: true,
      }
    }),
    prisma.pageView.findMany({
      where: {
        createdAt: {
          gte: dateGte
        }
      },
      select: {
        createdAt: true
      }
    }),
    prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    })
  ])

  // Get total money in stock (needs to be calculated manually because we need to multiply price * stock per row, which Prisma aggregate doesn't support directly yet)
  const allProducts = await prisma.product.findMany({ select: { stock: true, price: true } })
  const totalMoneyInStock = allProducts.reduce((sum, p) => sum + (p.stock * p.price), 0)

  // Group page views by period for the chart
  const viewsByDay = recentViews.reduce((acc: any, view) => {
    const key = timeframe === '12m' 
      ? view.createdAt.toISOString().slice(0, 7) // YYYY-MM
      : view.createdAt.toISOString().split('T')[0] // YYYY-MM-DD
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const chartData = Object.keys(viewsByDay).sort().map(date => ({
    date,
    visitas: viewsByDay[date]
  }))

  // Inventory changes for chart
  const inventoryChanges = await prisma.inventoryChange.findMany({
    where: {
      createdAt: {
        gte: dateGte
      }
    },
    select: { createdAt: true, change: true }
  })

  const changesByDay = inventoryChanges.reduce((acc: any, changeRecord) => {
    const key = timeframe === '12m' 
      ? changeRecord.createdAt.toISOString().slice(0, 7)
      : changeRecord.createdAt.toISOString().split('T')[0]
    
    if (!acc[key]) acc[key] = { date: key, ventas: 0, ajustes: 0 }
    
    if (changeRecord.change < 0) {
      acc[key].ventas += Math.abs(changeRecord.change) // Represent as positive for the chart
    } else {
      acc[key].ajustes += changeRecord.change
    }
    return acc
  }, {})

  const inventoryChartData = Object.values(changesByDay).sort((a: any, b: any) => a.date.localeCompare(b.date))

  return {
    totalViews,
    totalMoneyInStock,
    totalItemsInStock: inventoryTotal._sum.stock || 0,
    topProducts: topProducts.map(p => ({ name: p.name, clicks: p._count.clicks })),
    viewsChartData: chartData,
    inventoryChartData,
    auditLogs
  }
}
