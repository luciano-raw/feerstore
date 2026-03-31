"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ProductGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fallback para productos sin imagen válida
  const safeImages = images && images.length > 0 ? images : ["/placeholder.jpg"]

  return (
    <div className="flex flex-col gap-4 h-[500px] w-full">
      {/* Featured Main Image */}
      <div className="flex-1 w-full relative bg-secondary rounded-2xl overflow-hidden border">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${safeImages[currentIndex]})` }}
          />
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
              <div 
                className="absolute inset-0 bg-center bg-cover bg-secondary"
                style={{ backgroundImage: `url(${image})` }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
