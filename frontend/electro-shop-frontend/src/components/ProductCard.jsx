import { Link } from "react-router-dom"
import { Check, Plus } from "lucide-react"
import { useState } from "react"
import { useCart } from "../context/CartContext.jsx"
import { formatPrice } from "../lib/format.js"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e) {
    e.preventDefault()
    addToCart(product.id, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary/60"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-muted backdrop-blur">
            {product.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-pretty font-medium leading-snug">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-mono text-lg font-semibold">{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Добавить ${product.name} в корзину`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {added ? "Добавлено" : "В корзину"}
          </button>
        </div>
      </div>
    </Link>
  )
}
