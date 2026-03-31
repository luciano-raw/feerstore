"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"

export type ProductType = {
  id: string
  name: string
  price: number
  category: string
  images: string[]
  stock: number
}

export function ProductCard({ product }: { product: ProductType }) {
  const [isHovered, setIsHovered] = useState(false)
  const isOutOfStock = product.stock === 0

  return (
    <div 
      className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block overflow-hidden relative aspect-square">
        <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors z-10" />
        {product.images.map((image: string, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 bg-center bg-contain bg-no-repeat ${
              index === (isHovered && product.images.length > 1 ? 1 : 0) ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-destructive/90 backdrop-blur text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              Agotado Temporalmente
            </span>
          </div>
        )}
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
