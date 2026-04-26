"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "@/actions/audit"

export async function updateUserRole(userId: string, role: string | null) {
  const client = await clerkClient()
  
  // clerk merges properties in publicMetadata. So to remove a role we pass null or empty
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role }
  })
  
  const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress || userId
  
  await logAdminAction({
    action: "UPDATE_ROLE",
    entityType: "USER",
    entityName: email,
    details: role === "admin" ? "Se otorgó rol de Administrador" : "Se retiró rol de Administrador"
  })
  
  revalidatePath("/admin/users")
}

export async function updateUserDiscount(userId: string, discount: number) {
  const client = await clerkClient()
  
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { discount }
  })
  
  const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress || userId
  
  await logAdminAction({
    action: "UPDATE_DISCOUNT",
    entityType: "USER",
    entityName: email,
    details: `Descuento actualizado a ${discount}%`
  })
  
  revalidatePath("/admin/users")
}

export async function getUsers() {
    const client = await clerkClient()
    const usersResponse = await client.users.getUserList({
        limit: 100,
        orderBy: '-created_at'
    })
    return usersResponse.data
}
