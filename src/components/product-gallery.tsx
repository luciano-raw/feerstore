"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function ProductGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isZooming, setIsZooming] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setPosition({ x, y })
  }

  // Fallback para productos sin imagen válida
  const safeImages = images && images.length > 0 ? images : ["/placeholder.jpg"]

  return (
    <div className="flex flex-col gap-4 h-[500px] w-full">
      {/* Featured Main Image */}
      <div 
        className={`flex-1 w-full relative bg-secondary rounded-2xl overflow-hidden border ${isZooming ? 'cursor-zoom-in' : 'cursor-crosshair'} touch-none`}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1, 
              scale: isZooming ? 2.5 : 1 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 transition-transform ease-out will-change-transform"
            style={{ 
              transformOrigin: isZooming ? `${position.x}% ${position.y}%` : "center center"
            }}
          >
            <Image
              src={safeImages[currentIndex]}
              alt="Vista del producto"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {safeImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                index === currentIndex ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
