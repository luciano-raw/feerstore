import { ProductForm } from "@/components/admin/product-form"
import { getProducts, deleteProduct } from "@/actions/products"
import { Trash2 } from "lucide-react"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-primary">Gestión de Productos</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProductForm />
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Catálogo Actual ({products.length})</h2>
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium">Miniatura</th>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Categoría</th>
                    <th className="px-4 py-3 font-medium">Precio</th>
                    <th className="px-4 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No hay productos. Añade uno desde el formulario.
                      </td>
                    </tr>
                  ) : null}
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 capitalize">{p.category.replace('_', ' ')}</td>
                      <td className="px-4 py-3">${p.price.toLocaleString("es-CL")}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={async () => {
                          "use server"
                          await deleteProduct(p.id)
                        }}>
                          <button className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Eliminar Producto">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
