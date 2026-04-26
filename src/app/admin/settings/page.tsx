import { getStoreSettings } from "@/actions/settings"
import { SettingsForm } from "./settings-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/20 hover:bg-secondary/40 px-3 py-1.5 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Panel
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-primary">Configuración Global</h1>
        <p className="text-muted-foreground mb-8">Administra el comportamiento de toda tu tienda, banners y recepciones de WhatsApp.</p>
        
        <SettingsForm initialData={settings} />
      </main>
    </div>
  )
}
