import { AddToCartControls } from "@/components/add-to-cart-button"
import { ProductGallery } from "@/components/product-gallery"
import { ShareProduct } from "@/components/share-product"
import { ProductSchema } from "@/components/json-ld"
import { PrismaClient } from "@prisma/client"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Truck, MapPin } from "lucide-react"

const prisma = new PrismaClient()

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) return {}

  const isBubbaluu = product.name.toLowerCase().includes('bubbaluu')
  const title = isBubbaluu 
    ? `${product.name} | Bubbaluu Chile | FerLu Store`
    : `${product.name} | FerLu Store`
  
  const description = `${product.description.substring(0, 120)}... Compra en FerLu Store con envíos a Talca, Linares, Longaví y todo Chile. Especialistas en belleza.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `https://ferlu.store/product/${id}`,
    },
  }
}

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
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>
                  Acerca de este producto
                </h3>
                <div className="text-muted-foreground text-[1.05rem] leading-relaxed whitespace-pre-wrap bg-secondary/10 p-6 rounded-2xl border border-secondary/30 shadow-sm">
                  {product.description}
                </div>
              </div>

              <AddToCartControls product={product} />
              
              <ShareProduct productName={product.name} productId={product.id} />
              
              <div className="mt-8 pt-6 border-t space-y-6">
                {(product.deliveryMethod || (product.pickupPoints && product.pickupPoints.length > 0) || product.shippingDetails) && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 border-l-4 border-primary pl-2 uppercase tracking-wider text-muted-foreground">
                      Envío y Retiro
                    </h3>
                    
                    {(product.deliveryMethod || product.shippingDetails) && (
                      <div className="flex items-center gap-3 text-sm font-medium bg-secondary/10 p-3 rounded-lg border border-secondary/20">
                        <Truck className="w-5 h-5 text-primary shrink-0" />
                        <span>{product.deliveryMethod || product.shippingDetails}</span>
                      </div>
                    )}
                    
                    {product.pickupPoints && product.pickupPoints.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" /> Puntos de retiro disponibles:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.pickupPoints.map(point => (
                            <span key={point} className="px-3 py-1.5 bg-background border-2 border-input text-xs font-bold rounded-lg shadow-sm hover:border-primary transition-colors cursor-default">
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Categoría</span>
                    <span className="font-medium capitalize">{product.category.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      <ProductSchema product={product} />
    </div>
  )
}
