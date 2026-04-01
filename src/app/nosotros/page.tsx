import { Truck, MapPin, Sparkles, Heart } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-primary/5 flex items-center overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">
              Nuestra Esencia
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed">
              En FerLu Store creemos que el cuidado personal es el primer paso hacia el amor propio. Nos especializamos en cosmética, salud capilar y bienestar corporal.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                Nuestra Pasión
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Nacimos con una misión clara: acercar los mejores productos de cuidado personal y belleza a tu rutina diaria. Seleccionamos rigurosamente cada crema, tratamiento y loción para asegurar que ofrezcan resultados reales y una experiencia sensorial de lujo.
                </p>
                <p>
                  Pasar de una simple tienda a tu rincón de confianza para el "skincare" es nuestro mayor orgullo. Porque cada tipo de piel y de cabello merece un cuidado especializado y libre de compromisos.
                </p>
              </div>
            </div>
            
            <div className="bg-secondary/20 p-8 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Heart className="h-40 w-40" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary relative z-10">¿Por qué FerLu?</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex gap-3 text-muted-foreground">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full text-primary shrink-0"><Sparkles className="h-4 w-4" /></div>
                  <span className="font-medium text-foreground">Selección Premium:</span> Productos testeados y avalados para el cuidado integral.
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full text-primary shrink-0"><Sparkles className="h-4 w-4" /></div>
                  <span className="font-medium text-foreground">Asesoría Personalizada:</span> No solo vendemos, te acompañamos a elegir lo que mejor se adapta a ti.
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <div className="mt-1 bg-primary/10 p-1 rounded-full text-primary shrink-0"><Sparkles className="h-4 w-4" /></div>
                  <span className="font-medium text-foreground">Amor por lo que hacemos:</span> Cada pedido va preparado cuidadosamente pensando en tu gran apertura.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics & Shipping */}
      <section className="py-20 bg-primary/5 border-t border-primary/10">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-primary mb-4">Llegamos donde tú estés</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestra logística está diseñada para ser rápida, segura y siempre cerca tuyo. Con un fuerte enfoque regional y cobertura nacional absoluta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background rounded-3xl p-8 shadow-sm border border-border/50 flex flex-col items-center text-center space-y-4 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">Región del Maule</h3>
              <p className="text-muted-foreground">
                Orgullosos de nuestras raíces. Ofrecemos entregas directas y presenciales en las principales ciudades de la séptima región:
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="bg-secondary/50 px-4 py-1.5 rounded-full text-sm font-bold text-foreground">📍 Talca</span>
                <span className="bg-secondary/50 px-4 py-1.5 rounded-full text-sm font-bold text-foreground">📍 Linares</span>
                <span className="bg-secondary/50 px-4 py-1.5 rounded-full text-sm font-bold text-foreground">📍 Longaví</span>
              </div>
            </div>

            <div className="bg-background rounded-3xl p-8 shadow-sm border border-border/50 flex flex-col items-center text-center space-y-4 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold">A todo Chile</h3>
              <p className="text-muted-foreground">
                ¿Estás en otra región? ¡No hay problema! Hacemos envíos seguros y rápidos a todo el territorio nacional a través de las empresas de courier más confiables. 
              </p>
              <p className="text-sm font-medium text-primary mt-4">
                Tu rutina de cuidado personal llegará intacta hasta la puerta de tu casa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
