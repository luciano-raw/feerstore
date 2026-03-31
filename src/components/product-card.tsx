import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"

export type ProductType = {
  id: string
  name: string
  price: number
  category: string
  images: string[]
}

export function ProductCard({ product }: { product: ProductType }) {
  const imageUrl = product.images?.[0] || "/placeholder-product.jpg"

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      <Link href={`/product/${product.id}`} className="block overflow-hidden relative aspect-square">
        <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors z-10" />
        {/* We use a div with background image for placeholder. Switch to next/image when real URLs are available */}
        <div 
          className="w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-300" 
          style={{ backgroundImage: `url(${imageUrl})`, backgroundColor: "var(--secondary)" }}
        />
      </Link>
      
      <div className="p-4 flex flex-col gap-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">
            ${product.price.toLocaleString("es-CL")}
          </span>
          <button 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Añadir al carrito"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
