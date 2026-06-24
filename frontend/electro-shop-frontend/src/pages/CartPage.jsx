import { Link } from "react-router-dom"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext.jsx"
import { formatPrice } from "../lib/format.js"

export default function CartPage() {
  const { items, total, itemsCount, updateQuantity, removeFromCart, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-surface text-muted">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Корзина пуста</h1>
          <p className="text-sm text-muted">Добавьте товары из каталога, чтобы оформить заказ.</p>
        </div>
        <Link
          to="/"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Корзина</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Очистить
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.product_id}
              className="flex gap-4 rounded-xl border border-border bg-surface p-3"
            >
              <Link
                to={`/product/${item.product_id}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-2"
              >
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  to={`/product/${item.product_id}`}
                  className="line-clamp-2 text-sm font-medium leading-snug hover:text-accent"
                >
                  {item.name}
                </Link>
                <span className="mt-1 text-sm text-muted">{formatPrice(item.price)} / шт.</span>

                <div className="mt-auto flex items-center gap-3 pt-2">
                  <div className="inline-flex items-center rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      aria-label="Уменьшить количество"
                      className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      aria-label="Увеличить количество"
                      className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product_id)}
                    aria-label={`Удалить ${item.name}`}
                    className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="hidden shrink-0 flex-col items-end justify-center sm:flex">
                <span className="font-mono font-semibold">{formatPrice(item.subtotal)}</span>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold">Итого</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <dt>Товаров</dt>
              <dd>{itemsCount} шт.</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-foreground">
              <dt>К оплате</dt>
              <dd className="font-mono">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            onClick={() => alert("Оформление заказа — демо. Интеграцию оплаты можно добавить отдельно.")}
          >
            Оформить заказ
          </button>
          <Link
            to="/"
            className="mt-3 block text-center text-sm text-muted transition-colors hover:text-foreground"
          >
            Продолжить покупки
          </Link>
        </aside>
      </div>
    </div>
  )
}
