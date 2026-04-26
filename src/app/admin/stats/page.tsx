"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/actions/analytics"
import { BarChart3, TrendingUp, DollarSign, PackageOpen, MousePointerClick, ArrowLeft } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"
import Link from "next/link"

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Cargando estadísticas...</p>
      </div>
    )
  }

  if (!stats) return <div className="p-8 text-center">Error al cargar estadísticas.</div>

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/20 hover:bg-secondary/40 px-3 py-1.5 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Link>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Rendimiento del Negocio</h1>
            <p className="text-muted-foreground">Analiza tus visitas, clics y el valor de tu inventario en tiempo real.</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 border rounded-xl bg-card shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h3 className="font-medium">Capital en Stock</h3>
            </div>
            <p className="text-3xl font-bold">${stats.totalMoneyInStock.toLocaleString("es-CL")}</p>
          </div>

          <div className="p-6 border rounded-xl bg-card shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="font-medium">Visitas Totales</h3>
            </div>
            <p className="text-3xl font-bold">{stats.totalViews}</p>
          </div>

          <div className="p-6 border rounded-xl bg-card shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <PackageOpen className="w-5 h-5 text-orange-500" />
              <h3 className="font-medium">Artículos en Bodega</h3>
            </div>
            <p className="text-3xl font-bold">{stats.totalItemsInStock}</p>
          </div>

          <div className="p-6 border rounded-xl bg-card shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <MousePointerClick className="w-5 h-5 text-purple-500" />
              <h3 className="font-medium">Producto Más Visto</h3>
            </div>
            <p className="text-xl font-bold truncate" title={stats.topProducts[0]?.name || "N/A"}>
              {stats.topProducts[0]?.name || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.topProducts[0]?.clicks || 0} clics
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Vistas Web Chart */}
          <div className="p-6 border rounded-xl bg-card shadow-sm">
            <h2 className="text-xl font-bold mb-6">Visitas a la Web (Últimos 30 días)</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.viewsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} minTickGap={20} />
                  <YAxis tick={{fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="visitas" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="p-6 border rounded-xl bg-card shadow-sm">
            <h2 className="text-xl font-bold mb-6">Productos Más Populares (Top 5)</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topProducts} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} tickFormatter={(val) => val.length > 15 ? val.slice(0, 15) + '...' : val} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="clicks" fill="#d946ef" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Changes Chart */}
          <div className="p-6 border rounded-xl bg-card shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Movimientos de Inventario (Últimos 30 días)</h2>
            <p className="text-sm text-muted-foreground mb-4">Muestra los productos deducidos por ventas y los productos añadidos por ajustes manuales.</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.inventoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} minTickGap={20} />
                  <YAxis tick={{fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Legend />
                  <Bar dataKey="ventas" name="Deducciones (Ventas)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ajustes" name="Adiciones (Ajustes)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
