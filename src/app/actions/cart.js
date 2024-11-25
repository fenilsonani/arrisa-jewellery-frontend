// app/actions/cart.js
'use server'

import { cookies } from 'next/headers'

// Get cart from cookies (simplified to just product ids and quantities)
export async function getCart() {
    const cartCookie = cookies().get('cart')?.value

    if (cartCookie) {
        try {
            return JSON.parse(cartCookie)
        } catch (error) {
            return {}
        }
    }

    return {}
}

// Save cart to cookies
async function saveCart(cart) {
    cookies().set('cart', JSON.stringify(cart), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365 // 1 year
    })
}

// Add item to cart
export async function addToCart(productId) {
    const cart = await getCart()

    // If product already exists, increment quantity
    cart[productId] = (cart[productId] || 0) + 1

    await saveCart(cart)
    return cart
}

// Remove item from cart
export async function removeFromCart(productId) {
    const cart = await getCart()

    delete cart[productId]

    await saveCart(cart)
    return cart
}

// Update item quantity
export async function updateCartItemQuantity(productId, quantity) {
    const cart = await getCart()

    if (quantity > 0) {
        cart[productId] = quantity
    } else {
        delete cart[productId]
    }

    await saveCart(cart)
    return cart
}

// Clear entire cart
export async function clearCart() {
    const cart = {}

    await saveCart(cart)
    return cart
}

// Get total number of items in cart
export async function getCartItemCount() {
    const cart = await getCart()

    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
}