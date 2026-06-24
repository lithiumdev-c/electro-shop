import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from "lucide-react"
import { getProduct } from "../lib/api.js"
import { useCart } from "../context/CartContext.jsx"
import { formatPrice } from "../lib/format.js"
import { ErrorState, Spinner } from "../components/States.jsx"

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function load() {
    setStatus("loading")
    setError("")
    getProduct(id)
      .then((data) => {
        setProduct(data)
        setStatus("ready")
      })
      .catch((err) => {
        setError(err.message)
        setStatus("error")
      })
  }

  useEffect(() => {
    load()
    setQuantity(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function handleAdd() {
    addToCart(product.id, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Назад к каталогу
      </button>

      {status === "loading" && <Spinner label="Загружаем товар…" />}
      {status === "error" && <ErrorState message={error} onRetry={load} />}

      {status === "ready" && product && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            {product.category?.name && (
              <Link
                to="/"
                className="mb-3 inline-flex w-fit rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-accent"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-semibold font-mono">{formatPrice(product.price)}</p>

            {product.description && (
              <p className="mt-6 text-pretty leading-relaxed text-muted">{product.description}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-lg border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Уменьшить количество"
                  className="grid h-11 w-11 place-items-center text-muted transition-colors hover:text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-mono font-medium" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Увеличить количество"
                  className="grid h-11 w-11 place-items-center text-muted transition-colors hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-hover sm:flex-none"
              >
                {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                {added ? "Добавлено в корзину" : "Добавить в корзину"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
