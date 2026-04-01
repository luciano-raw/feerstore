import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { ProductCard } from "@/components/product-card"
import { SearchBar } from "@/components/search-bar"
import { getStoreSettings } from "@/actions/settings"

const prisma = new PrismaClient()

export default async function Home() {
  const latestProducts = await prisma.product.findMany({
    where: {
      category: { not: 'joyas' }
    },
    orderBy: { createdAt: 'desc' },
    take: 8
  })
  
  const settings = await getStoreSettings()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-primary">
                  Resalta tu Belleza
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Descubre nuestra colección exclusiva de cuidado capilar y corporal, diseñada para potenciar tu amor propio.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  href="/category/capilares_corporales"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:scale-105 active:scale-95"
                >
                  Cuidado Personal
                </Link>
              </div>
              
              <SearchBar />
            </div>
          </div>
          
          {/* Decorative shapes for cute aesthetic */}
          <div className="absolute top-1/4 left-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl flex" />
        </section>

        {/* Featured Products Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground mb-4">
              Novedades Destacadas
            </h2>
            <div className="w-24 h-1 bg-primary rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Descubre los últimos ingresos de FerLu Store en cuidado personal y capilar. Todo seleccionado para resaltar lo mejor de ti.
            </p>
          </div>

          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-secondary/20 rounded-2xl">
              <p className="text-muted-foreground text-lg">Pronto subiremos nuestros mejores productos aquí.</p>
            </div>
          )}
        </section>

        {/* Promotional Banner (Below Featured Products) */}
        {settings?.bannerIsActive && settings.heroBannerUrl && (
          <section className="container mx-auto px-4 pb-16 md:pb-24">
            <div className="w-full max-w-6xl mx-auto rounded-[2rem] overflow-hidden shadow-lg relative group bg-secondary/30">
              {/* Aspect Ratio: Mobile ~3:1 (e.g. 600x200), Desktop ~4:1 (e.g. 1200x300) */}
              <div className="aspect-[3/1] md:aspect-[4/1]">
                <img 
                  src={settings.heroBannerUrl} 
                  alt="FerLu Store Promoción Especial" 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.03]" 
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
