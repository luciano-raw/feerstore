import { CartItem } from "@/store/cart"

export function generateWhatsAppLink(items: CartItem[], customerName: string) {
  // Número actualizado entregado por el usuario (formato internacional sin el signo '+')
  const phoneNumber = "56930531304" 
  
  let message = `¡Hola! 👋 Soy *${customerName}* y quiero confirmar el siguiente pedido:\n\n`
  
  message += `🛍️ *RESUMEN DE MI COMPRA:*\n`
  message += `-------------------------------------------------\n`
  
  let total = 0
  
  items.forEach((item, index) => {
    const subtotal = item.price * item.quantity
    total += subtotal
    
    // Formato tipo boleta o voucher para fácil lectura
    message += `🔸 *${item.quantity}x* ${item.name}\n`
    message += `   ↳ Precio: $${item.price.toLocaleString("es-CL")} c/u\n`
    message += `   ↳ Subtotal: $${subtotal.toLocaleString("es-CL")}\n`
    message += `-------------------------------------------------\n`
  })
  
  message += `\n💰 *TOTAL A PAGAR:* $${total.toLocaleString("es-CL")}\n\n`
  message += `Quedo a la espera de las instrucciones para realizar la transferencia y coordinar el envío/retiro. ¡Muchas gracias! ✨`

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}
