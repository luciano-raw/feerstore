import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Fetch products to give context to the AI
  const products = await prisma.product.findMany({
    select: {
      name: true,
      price: true,
      description: true,
      category: true,
    }
  })

  const productContext = products.map(p => 
    `- ${p.name}: $${p.price.toLocaleString('es-CL')}. Categoría: ${p.category}. Descripción: ${p.description}`
  ).join("\n")

  const systemPrompt = `
    Eres "FerLu AI", el asistente virtual experto de FerLu Store, una tienda de cosmética y cuidado capilar/corporal en Chile.
    
    Tus reglas de oro:
    1. Sé amable, carismático y profesional. Usa emojis ocasionalmente ✨.
    2. Tu conocimiento se limita a los productos de FerLu Store y temas de belleza/cosmética.
    3. Si te preguntan algo fuera de este contexto (política, código, otros temas), declina amablemente diciendo que solo puedes ayudar con temas de la tienda.
    4. Tenemos envíos a TODO Chile. 
    5. Ofrecemos entregas presenciales en la Región del Maule: Talca, Linares y Longaví.
    6. Los precios están en Pesos Chilenos (CLP).
    7. Si el cliente está decidido a comprar, indícale que puede añadir los productos al carrito y finalizar la compra para ser redirigido a nuestro WhatsApp oficial.

    PRODUCTOS ACTUALES EN TIENDA:
    ${productContext}

    Responde siempre en español de Chile. Ayuda al cliente a elegir según su tipo de piel o cabello si te lo preguntan.
  `

  const result = streamText({
    model: google("gemini-1.5-flash"),
    messages,
    system: systemPrompt,
  })

  return result.toTextStreamResponse()
}
