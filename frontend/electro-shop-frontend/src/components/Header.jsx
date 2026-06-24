import { Link, NavLink } from "react-router-dom"
import { CircuitBoard, ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext.jsx"

export default function Header() {
  const { itemsCount } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <CircuitBoard className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg">
            Electro<span className="text-accent">Shop</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Основная навигация">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? "text-foreground" : "text-muted hover:text-foreground"
              }`
            }
          >
            Каталог
          </NavLink>
        </nav>

        <Link
          to="/cart"
          className="relative inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Корзина</span>
          {itemsCount > 0 && (
            <span
              className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-background"
              aria-label={`${itemsCount} товаров в корзине`}
            >
              {itemsCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
