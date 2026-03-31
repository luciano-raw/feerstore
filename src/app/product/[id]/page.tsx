import { AddToCartControls } from "@/components/add-to-cart-button"
import { ProductGallery } from "@/components/product-gallery"
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Gallery Intersect */}
            <div className="w-full">
              <ProductGallery images={product.images} />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-start">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold mb-6">
                ${product.price.toLocaleString("es-CL")}
              </p>
              
              <div className="prose dark:prose-invert mb-8">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <AddToCartControls product={product} />
              
              <div className="mt-8 pt-6 border-t space-y-4">
                {product.shippingDetails && (
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="text-sm font-bold mb-1">Información de Envío/Retiro</h3>
                    <p className="text-sm text-foreground/80">{product.shippingDetails}</p>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium">Calculado al pagar</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Categoría</span>
                  <span className="font-medium capitalize">{product.category.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  )
}
