import { clerkClient } from "@clerk/nextjs/server"
import { ShieldAlert, UserIcon, Mail } from "lucide-react"

export default async function AdminUsersPage() {
  const client = await clerkClient()
  const usersResponse = await client.users.getUserList({
    orderBy: "-created_at",
    limit: 100
  })
  
  const users = usersResponse.data

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestión de Usuarios</h1>
        </div>
        
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Usuario</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Rol / Estado</th>
                  <th className="px-6 py-4 font-medium">Fecha de Registro</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No hay usuarios registrados aún.
                    </td>
                  </tr>
                )}
                {users.map((u) => {
                  const email = u.emailAddresses[0]?.emailAddress || "Sin email"
                  const isAdmin = email === "luciano.raw04@gmail.com"
                  
                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.imageUrl} alt="" className="w-8 h-8 rounded-full bg-secondary" />
                          <span className="font-medium">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {email}
                      </td>
                      <td className="px-6 py-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Administrador
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                            <UserIcon className="w-3.5 h-3.5" />
                            Cliente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          disabled={isAdmin}
                          className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Otorgar Descuento
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
