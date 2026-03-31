"use client"

import { useState } from "react"
import { createProduct } from "@/actions/products"

export function ProductForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    
    // Check if SUPABASE variables might be missing visually
    
    const formData = new FormData(e.currentTarget)
    const result = await createProduct(formData)
    
    if (result?.success) {
      setMessage("¡Producto creado correctamente!")
      // @ts-ignore
      e.target.reset()
    } else {
      setMessage(result?.error || "Error al crear el producto")
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg bg-card p-6 border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Añadir Nuevo Producto</h2>
      
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes("Error") ? "bg-destructive/10 text-destructive" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Nombre del producto</label>
        <input name="name" required className="w-full rounded-md border border-input bg-background px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Precio (CLP)</label>
        <input name="price" type="number" required className="w-full rounded-md border border-input bg-background px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select name="category" required className="w-full rounded-md border border-input bg-background px-3 py-2 h-10">
          <option value="capilares_corporales">Capilares y Cuidado Corporal</option>
          <option value="joyas">Joyas</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea name="description" required rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Detalles de Envío o Retiro</label>
        <textarea name="shippingDetails" rows={2} placeholder="Ej: Retiro en tienda local disponible el mismo día. Envíos nacionales por pagar." className="w-full rounded-md border border-input bg-background px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imágenes del Producto (Máx 3)</label>
        <p className="text-xs text-muted-foreground mb-2">Máximo 2MB por foto. Formatos: JPG, PNG, WEBP.</p>
        <input name="images" type="file" accept="image/*" multiple className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full h-10 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Creando..." : "Guardar Producto"}
      </button>
    </form>
  )
}
