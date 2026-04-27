"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/actions/analytics"
import { BarChart3, TrendingUp, DollarSign, PackageOpen, MousePointerClick, ArrowLeft } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '12m'>('30d')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getDashboardStats(timeframe)
        setStats(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [timeframe])

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Rendimiento del Negocio</h1>
              <p className="text-muted-foreground">Analiza tus visitas, clics y el valor de tu inventario.</p>
            </div>
          </div>
          
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="bg-secondary/30 border border-secondary text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-medium cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="12m">Últimos 12 meses</option>
          </select>
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
            <h2 className="text-xl font-bold mb-6">Visitas a la Web {timeframe === '7d' ? '(Últimos 7 días)' : timeframe === '30d' ? '(Últimos 30 días)' : '(Últimos 12 meses)'}</h2>
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
            <h2 className="text-xl font-bold mb-6">Movimientos de Inventario {timeframe === '7d' ? '(Últimos 7 días)' : timeframe === '30d' ? '(Últimos 30 días)' : '(Últimos 12 meses)'}</h2>
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
          {/* Audit Logs Table */}
          <div className="p-6 border rounded-xl bg-card shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Historial de Actividad Reciente</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-secondary/30 text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Acción</th>
                    <th className="px-4 py-3">Entidad</th>
                    <th className="px-4 py-3">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.auditLogs?.length > 0 ? (
                    stats.auditLogs.map((log: any) => (
                      <tr key={log.id} className="border-b hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                          {format(new Date(log.createdAt), "dd MMM, HH:mm", { locale: es })}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {log.userEmail || "Sistema"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {log.entityName || "-"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {log.details || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No hay actividad reciente registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
