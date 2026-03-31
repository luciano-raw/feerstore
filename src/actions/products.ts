"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const shippingDetails = formData.get("shippingDetails") as string
    const imageFiles = formData.getAll("images") as File[]

    let imageUrls: string[] = []

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Filter empty selections and limit to 3 images max
    const validImages = imageFiles.filter(f => f && f.size > 0).slice(0, 3)

    if (validImages.length > 0 && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      for (const image of validImages) {
        // Validation for Max 2MB
        if (image.size > 2 * 1024 * 1024) {
          throw new Error(`La imagen ${image.name} supera el tamaño máximo de 2MB.`)
        }

        const fileExt = image.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const arrBuffer = await image.arrayBuffer()
        const buffer = new Uint8Array(arrBuffer)

        const { error } = await supabase.storage
          .from('products')
          .upload(fileName, buffer, {
            contentType: image.type,
            upsert: false
          })

        if (error) {
          console.error("Supabase Upload Error:", error)
          throw new Error("Error al subir una de las imágenes")
        }

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)
          
        imageUrls.push(publicUrl)
      }
    } else if (validImages.length > 0) {
       console.log("Supabase credentials missing. Skipping image upload.");
    }

    if (imageUrls.length === 0) {
      imageUrls = ["/placeholder.jpg"]
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        category,
        description,
        shippingDetails,
        images: imageUrls
      }
    })

    revalidatePath("/admin/products")
    revalidatePath(`/category/${category}`)
    revalidatePath("/")
    
    return { success: true, product }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Error interno al crear producto" }
  }
}

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  })
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath("/admin/products")
}
