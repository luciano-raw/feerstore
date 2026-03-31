import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  
  if (!user) {
    redirect("/sign-in")
  }
  
  const email = user.primaryEmailAddress?.emailAddress
  
  // Verificación estricta del email de administrador
  if (email !== "luciano.raw04@gmail.com") {
    // Si no es el admin, lo regresamos a la tienda
    redirect("/")
  }

  return (
    <div className="bg-muted/20 min-h-screen">
      {children}
    </div>
  )
}
