import { CartItem } from '@/store/cart'

// Replace this with the actual WhatsApp number of the store owner
const WHATSAPP_NUMBER = "56912345678"

export const generateWhatsAppLink = (items: CartItem[], customerName: string) => {
  let message = `¡Hola Feer Store! Mi nombre es *${customerName}* y me gustaría comprar lo siguiente:\n\n`
  
  let total = 0
  items.forEach(item => {
    message += `🛍️ ${item.quantity}x ${item.name} ($${item.price.toLocaleString("es-CL")})\n`
    total += item.price * item.quantity
  })
  
  message += `\n💰 *Total: $${total.toLocaleString("es-CL")}*\n\nQuedo atento/a para coordinar el pago y el envío. ¡Gracias!`
  
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}
