import { useEffect, useMemo, useState } from "react"
import { Cpu } from "lucide-react"
import { getCategories, getProducts } from "../lib/api.js"
import ProductCard from "../components/ProductCard.jsx"
import { ErrorState, ProductCardSkeleton } from "../components/States.jsx"

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [status, setStatus] = useState("loading") // loading | error | ready
  const [error, setError] = useState("")

  function load() {
    setStatus("loading")
    setError("")
    Promise.all([getProducts(), getCategories()])
      .then(([productData, categoryData]) => {
        setProducts(productData.products || [])
        setCategories(categoryData || [])
        setStatus("ready")
      })
      .catch((err) => {
        setError(err.message)
        setStatus("error")
      })
  }

  useEffect(() => {
    load()
  }, [])

  const visibleProducts = useMemo(() => {
    if (!activeCategory) return products
    return products.filter((p) => p.category_id === activeCategory)
  }, [products, activeCategory])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="mb-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2 p-8 sm:p-12">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-xs font-medium text-accent">
            <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
            Магазин для инженеров и мейкеров
          </span>
          <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Электроника, микроконтроллеры и робототехника
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted">
            Платы Arduino и ESP32, одноплатные компьютеры, наборы LEGO Mindstorms, 3D-принтеры и
            расходные материалы — всё для ваших проектов в одном месте.
          </p>
        </div>
      </section>

      {/* Category filter */}
      {status === "ready" && categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Фильтр по категориям">
          <CategoryChip
            label="Все товары"
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>
      )}

      {/* Content */}
      {status === "error" ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <section aria-label="Товары">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {status === "loading"
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {status === "ready" && visibleProducts.length === 0 && (
            <p className="py-16 text-center text-muted">В этой категории пока нет товаров.</p>
          )}
        </section>
      )}
    </div>
  )
}

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )
}
