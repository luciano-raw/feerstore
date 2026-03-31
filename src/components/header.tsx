import Link from "next/link"
import { Menu } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { CartIcon } from "./cart-icon"
import { MobileMenu } from "./mobile-menu"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function Header() {
  const { userId } = await auth()
  const user = await currentUser()
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "luciano.raw04@gmail.com"
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              FerLu Store
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/category/capilares_corporales"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Capilares y Cuidado
            </Link>
            <Link
              href="/category/joyas"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Joyas
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors mr-2">
                Panel Admin
              </Link>
            )}
            {!userId ? (
              <SignInButton mode="modal">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Iniciar Sesión</span>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
          
          <CartIcon />
          
          <ThemeToggle />

          <MobileMenu>
            <nav className="flex flex-col gap-4">
              <Link href="/category/capilares_corporales" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2">
                Capilares y Corporal
              </Link>
              <Link href="/category/joyas" className="text-lg font-medium hover:text-primary transition-colors border-b pb-2">
                Joyas
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-lg font-bold text-primary hover:text-primary/80 transition-colors border-b pb-2">
                  Panel Administrador
                </Link>
              )}
              {!userId ? (
                <div className="mt-2 flex">
                  <SignInButton mode="modal">
                    <span className="text-lg font-medium text-primary cursor-pointer">Iniciar Sesión o Registrarse</span>
                  </SignInButton>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-3">
                  <UserButton />
                  <span className="text-sm text-muted-foreground font-medium">Mi Cuenta</span>
                </div>
              )}
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}
