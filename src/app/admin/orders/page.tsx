import { getOrders, updateOrderStatus } from "@/actions/orders"
import { ClipboardList, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/20 hover:bg-secondary/40 px-3 py-1.5 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Link>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Pedidos de Clientes</h1>
            <p className="text-muted-foreground">Revisa los pedidos, confirma ventas y descuenta el stock automáticamente.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay pedidos registrados todavía.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-xl bg-card p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4 border-b pb-4">
                  <div>
                    <h3 className="font-bold text-lg">Pedido #{order.id.slice(-6).toUpperCase()}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("es-CL")}
                    </p>
                    <p className="font-medium mt-1">Cliente: {order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primary">${order.total.toLocaleString("es-CL")}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      order.status === "completed" ? "bg-green-100 text-green-800" :
                      order.status === "cancelled" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status === "whatsapp_sent" ? "Pendiente" : 
                       order.status === "completed" ? "Completado" : "Cancelado"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>${(item.price * item.quantity).toLocaleString("es-CL")}</span>
                    </div>
                  ))}
                </div>

                {order.status === "whatsapp_sent" && (
                  <div className="flex gap-3 mt-4">
                    <form action={async () => {
                      "use server"
                      await updateOrderStatus(order.id, "completed")
                    }} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Confirmar Venta (Descontar Stock)
                      </button>
                    </form>
                    <form action={async () => {
                      "use server"
                      await updateOrderStatus(order.id, "cancelled")
                    }} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 py-2 rounded-md transition-colors font-medium">
                        <XCircle className="w-4 h-4" />
                        Cancelar (No Descontar)
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
