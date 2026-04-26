"use server"

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function logAdminAction({
  action,
  entityType,
  entityName,
  details
}: {
  action: string
  entityType: string
  entityName?: string
  details?: string
}) {
  try {
    const user = await currentUser()
    // It's possible that someone without a session does this if APIs are unprotected, but normally it'll be an admin.
    const email = user?.emailAddresses[0]?.emailAddress || "Sistema / Usuario Desconocido"
    
    await prisma.auditLog.create({
      data: {
        userId: user?.id,
        userEmail: email,
        action,
        entityType,
        entityName,
        details
      }
    })
  } catch (error) {
    console.error("Error logging admin action", error)
  }
}
