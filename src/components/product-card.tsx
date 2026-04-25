"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/store/cart"

export type ProductType = {
  id: string
  name: string
  price: number
  discountPrice?: number | null
  category: string
  images: string[]
  stock: number
}

export function ProductCard({ product }: { product: ProductType }) {
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isOutOfStock = product.stock === 0
  const vipDiscount = useCart((state) => state.vipDiscount)

  useEffect(() => {
    setMounted(true)
  }, [])

  const basePrice = product.discountPrice ?? product.price
  const hasVipDiscount = mounted && vipDiscount > 0
  const finalPrice = hasVipDiscount ? basePrice * (1 - vipDiscount / 100) : basePrice
  const hasOffer = product.discountPrice != null

  return (
    <div 
      className={`group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md ${hasOffer ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] ring-1 ring-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block overflow-hidden relative aspect-square">
        <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors z-10" />
        {product.images.map((image: string, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === (isHovered && product.images.length > 1 ? 1 : 0) ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} - Imagen ${index + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        ))}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
            <span className="bg-destructive/90 backdrop-blur text-destructive-foreground text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm">
              <span className="md:hidden">Agotado</span>
              <span className="hidden md:inline">Agotado Temporalmente</span>
            </span>
          </div>
        )}
      </Link>
      
      <div className="p-3 md:p-4 flex flex-col gap-1.5 md:gap-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm md:text-lg line-clamp-2 md:line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1 md:mt-2">
          <div className="flex flex-col">
            <span className={`font-bold text-base md:text-lg ${hasOffer ? 'text-green-500 dark:text-green-400' : 'text-primary'}`}>
              ${finalPrice.toLocaleString("es-CL")}
            </span>
            {(hasVipDiscount || hasOffer) && (
              <span className="text-xs md:text-sm text-muted-foreground font-medium line-through mt-0.5 decoration-destructive/50 decoration-2">
                ${product.price.toLocaleString("es-CL")} {hasVipDiscount ? `(-${vipDiscount}%)` : ""}
              </span>
            )}
          </div>
          <button 
            className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
            title="Añadir al carrito"
          >
            <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
