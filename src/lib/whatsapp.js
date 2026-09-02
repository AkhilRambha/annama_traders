/**
 * WhatsApp utility — single source of truth.
 * 
 * WHATSAPP NUMBER: from existing CartDrawer → 917093010264
 * Do NOT duplicate this number elsewhere.
 */

export const WHATSAPP_NUMBER = "917093010264";

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

/**
 * Open WhatsApp to order a single product.
 * @param {object} product
 * @param {object} customer  { name, phone, email?, address, quantity }
 */
export function whatsappOrder(product, customer) {
  const qty      = customer.quantity || 1;
  const subtotal = product.price * qty;

  let msg = `🛍️ *ORDER INQUIRY — Alankrita*\n\n`;
  msg += `Hello Alankrita,\n\nI would like to purchase this item:\n\n`;
  msg += `*Product:* ${product.name}\n`;
  msg += `*Category:* ${product.category}\n`;
  msg += `*Product ID:* ${product.id}\n`;
  msg += `*Price:* ${formatPrice(product.price)}\n`;
  msg += `*Quantity:* ${qty}\n`;
  msg += `*Total:* ${formatPrice(subtotal)}\n\n`;
  msg += `*Customer Details:*\n`;
  msg += `Name: ${customer.name}\n`;
  msg += `Phone: ${customer.phone}\n`;
  if (customer.email) msg += `Email: ${customer.email}\n`;
  msg += `Address: ${customer.address}\n\n`;
  msg += `Please confirm availability and provide payment details. Thank you! 🙏`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

/**
 * Open WhatsApp to order all cart items.
 * @param {Array}  cartItems
 * @param {object} customer  { name, phone, email?, address }
 */
export function whatsappCart(cartItems, customer) {
  let msg = `🛍️ *ORDER INQUIRY — Alankrita*\n\n`;
  msg += `Hello Alankrita,\n\nI would like to place the following order:\n\n`;

  cartItems.forEach((item, i) => {
    const subtotal = item.price * item.quantity;
    msg += `*${i + 1}. ${item.name}*\n`;
    msg += `   Category: ${item.category}\n`;
    msg += `   Quantity: ${item.quantity}\n`;
    msg += `   Price: ${formatPrice(item.price)}\n`;
    msg += `   Subtotal: ${formatPrice(subtotal)}\n\n`;
  });

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  msg += `*Order Total: ${formatPrice(total)}*\n\n`;
  msg += `*Customer Details:*\n`;
  msg += `Name: ${customer.name}\n`;
  msg += `Phone: ${customer.phone}\n`;
  if (customer.email) msg += `Email: ${customer.email}\n`;
  msg += `Address: ${customer.address}\n\n`;
  msg += `Please confirm availability and provide payment details. Thank you! 🙏`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}
