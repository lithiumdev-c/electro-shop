import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  apiAddToCart,
  apiRemoveFromCart,
  apiUpdateCart,
  getProducts,
} from "../lib/api.js"

const CartContext = createContext(null)

const STORAGE_KEY = "electro-shop-cart"

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Backend returns keys as strings; keep a clean { id: qty } object with
// positive integer quantities only.
function normalize(cart) {
  const out = {}
  for (const [id, qty] of Object.entries(cart || {})) {
    const q = Number(qty)
    if (q > 0) out[Number(id)] = q
  }
  return out
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => normalize(loadCart()))
  const [products, setProducts] = useState([])

  // Cache the full product catalog so we can render cart line items locally.
  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const productMap = useMemo(() => {
    const map = {}
    for (const p of products) map[p.id] = p
    return map
  }, [products])

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      // Optimistic local update for snappy UX.
      setCart((prev) => normalize({ ...prev, [productId]: (prev[productId] || 0) + quantity }))
      try {
        const { cart: updated } = await apiAddToCart(cart, productId, quantity)
        setCart(normalize(updated))
      } catch {
        /* keep optimistic state if API is unavailable */
      }
    },
    [cart],
  )

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) return removeFromCart(productId)
      setCart((prev) => normalize({ ...prev, [productId]: quantity }))
      try {
        const { cart: updated } = await apiUpdateCart(cart, productId, quantity)
        setCart(normalize(updated))
      } catch {
        /* ignore */
      }
    },
    [cart],
  )

  const removeFromCart = useCallback(
    async (productId) => {
      setCart((prev) => {
        const next = { ...prev }
        delete next[productId]
        return next
      })
      try {
        const { cart: updated } = await apiRemoveFromCart(cart, productId)
        setCart(normalize(updated))
      } catch {
        /* ignore */
      }
    },
    [cart],
  )

  const clearCart = useCallback(() => setCart({}), [])

  // Derived line items + totals (same math as the backend cart service).
  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const product = productMap[Number(id)]
        if (!product) return null
        return {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity,
          subtotal: Number((product.price * quantity).toFixed(2)),
        }
      })
      .filter(Boolean)
  }, [cart, productMap])

  const total = useMemo(
    () => Number(items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2)),
    [items],
  )

  const itemsCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  const value = {
    cart,
    items,
    total,
    itemsCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
