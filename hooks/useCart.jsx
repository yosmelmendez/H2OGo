"use client"

import { useCallback } from "react"
import { useLocalStorage } from "./useLocalStorage"

// Custom hook for shopping cart functionality
export function useCart() {
  const [cart, setCart] = useLocalStorage("cart", [])

  const addToCart = useCallback(
    (product) => {
      setCart((currentCart) => {
        const existingItem = currentCart.find((item) => item.id === product.id)

        if (existingItem) {
          return currentCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
          return [...currentCart, { ...product, quantity: 1 }]
        }
      })
    },
    [setCart],
  )

  const removeFromCart = useCallback(
    (productId) => {
      setCart((currentCart) => currentCart.filter((item) => item.id !== productId))
    },
    [setCart],
  )

  const updateQuantity = useCallback(
    (productId, quantity) => {
      setCart((currentCart) =>
        currentCart.map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)),
      )
    },
    [setCart],
  )

  const clearCart = useCallback(() => {
    setCart([])
  }, [setCart])

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }
}
