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

export async function getDashboardStats() {
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
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
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

  // Group page views by day for the chart
  const viewsByDay = recentViews.reduce((acc: any, view) => {
    const date = view.createdAt.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
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
        gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    },
    select: { createdAt: true, change: true }
  })

  const changesByDay = inventoryChanges.reduce((acc: any, changeRecord) => {
    const date = changeRecord.createdAt.toISOString().split('T')[0]
    if (!acc[date]) acc[date] = { date, ventas: 0, ajustes: 0 }
    
    if (changeRecord.change < 0) {
      acc[date].ventas += Math.abs(changeRecord.change) // Represent as positive for the chart
    } else {
      acc[date].ajustes += changeRecord.change
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
