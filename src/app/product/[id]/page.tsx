import { AddToCartControls } from "@/components/add-to-cart-button"
import { ProductGallery } from "@/components/product-gallery"
import { ShareProduct } from "@/components/share-product"
import { ProductSchema } from "@/components/json-ld"
import { PrismaClient } from "@prisma/client"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Truck, MapPin, ArrowLeft } from "lucide-react"

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
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/20 hover:bg-secondary/40 px-3 py-1.5 rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Catálogo
            </Link>
          </div>
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
              <div className="flex items-end gap-3 mb-6">
                <p className={`text-2xl md:text-3xl font-semibold ${product.discountPrice != null ? 'text-green-500 dark:text-green-400' : 'text-primary'}`}>
                  ${(product.discountPrice ?? product.price).toLocaleString("es-CL")}
                </p>
                {product.discountPrice != null && (
                  <p className="text-lg md:text-xl text-muted-foreground font-medium line-through pb-0.5 decoration-destructive/50 decoration-2">
                    ${product.price.toLocaleString("es-CL")}
                  </p>
                )}
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>
                  Acerca de este producto
                </h3>
                <div className="text-muted-foreground text-[1.05rem] leading-relaxed whitespace-pre-wrap bg-secondary/10 p-6 rounded-2xl border border-secondary/30 shadow-sm">
                  {product.description}
                </div>
              </div>

              <div className="mb-6 flex items-center gap-2">
                {product.stock > 0 ? (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${product.stock <= 3 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' : 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'}`}>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${product.stock <= 3 ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${product.stock <= 3 ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                    </span>
                    {product.stock === 1 ? "¡Última unidad disponible!" : `Stock Disponible: ${product.stock} unidades`}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full text-sm font-bold border border-destructive/20">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                    </span>
                    Agotado Temporalmente
                  </div>
                )}
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
