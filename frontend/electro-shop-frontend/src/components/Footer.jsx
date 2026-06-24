export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} ElectroShop. Электроника и робототехника.</p>
        <p className="font-mono text-xs">React + Vite + Tailwind · FastAPI backend</p>
      </div>
    </footer>
  )
}
