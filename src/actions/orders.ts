"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function createOrder(data: { customerName: string; customerPhone?: string; total: number; items: { productId: string; quantity: number; price: number }[] }) {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        total: data.total,
        status: "whatsapp_sent",
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })
    
    revalidatePath("/admin/orders")
    return order
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

export async function getOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    // If the status is changing to "completed", we need to deduct stock and create InventoryChange
    if (status === "completed") {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true }
      })

      if (order && order.status !== "completed") {
        for (const item of order.items) {
          const product = await prisma.product.findUnique({ where: { id: item.productId } })
          if (product) {
            const newStock = product.stock - item.quantity
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: newStock }
            })

            await prisma.inventoryChange.create({
              data: {
                productId: product.id,
                previousStock: product.stock,
                newStock: newStock,
                change: -item.quantity,
                reason: "SALE"
              }
            })
          }
        }
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    })
    
    revalidatePath("/admin/orders")
    revalidatePath("/admin/stats")
    revalidatePath("/admin/inventory")
    return updatedOrder
  } catch (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }
}
