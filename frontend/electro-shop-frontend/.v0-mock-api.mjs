import { createServer } from "node:http"

const categories = [
  { id: 1, name: "Микроконтроллеры и платы", slug: "microcontrollers" },
  { id: 2, name: "Одноплатные компьютеры", slug: "single-board-computers" },
  { id: 3, name: "Робототехника и LEGO конструкторы", slug: "robotics-lego" },
  { id: 4, name: "3D-принтеры и расходные материалы", slug: "3d-printing" },
]
const catById = Object.fromEntries(categories.map((c) => [c.id, c]))

const raw = [
  ["Arduino Uno R4 Minima", "Обновленная легендарная плата на базе 32-битного микроконтроллера Renesas RA4M1.", 25, 1, "photo-1608564697171-2dc611523b69"],
  ["ESP32-WROOM-32D Development Board", "Мощный отладочный модуль с поддержкой Wi-Fi и Bluetooth для IoT.", 8.5, 1, "photo-1555664424-778a1e5e1b48"],
  ["Raspberry Pi Pico H", "Миниатюрная плата на чипе RP2040. Поддерживает C/C++ и MicroPython.", 7.2, 1, "photo-1517055729445-fa7d27394b48"],
  ["Raspberry Pi 5 (8GB RAM)", "Новое поколение одноплатника: 8 ГБ ОЗУ, PCIe, два micro-HDMI 4K 60Hz.", 120, 2, "photo-1629652487043-fb2825838f8c"],
  ["Orange Pi Zero 3 (4GB)", "Компактный бюджетный одноплатник на Allwinner H618 с Wi-Fi и Ethernet.", 35, 2, "photo-1544244015-0df4b3ffc6b0"],
  ["LEGO Technic: Робот-изобретатель Mindstorms", "Продвинутый робонабор: хаб, моторы, датчики цвета и расстояния.", 420, 3, "photo-1560942485-b2a11cc13456"],
  ["LEGO Education SPIKE Prime", "Учебное решение для STEAM: датчики и моторы для прототипирования.", 450, 3, "photo-1587654780291-39c9404d746b"],
  ["Гусеничная робоплатформа на Arduino", "Комплект вездеходного робота: шасси, L298N, дальномер, ИК-пульт.", 55, 3, "photo-1485827404703-89b55fcc595e"],
  ["3D-принтер Creality Ender-3 V3 KE", "Высокоскоростной FDM-принтер на Klipper, до 500 мм/с, автокалибровка.", 349, 4, "photo-1615840287214-7fe58a8f3685"],
  ["Пластик PLA Filament 1.75мм (Черный, 1кг)", "Биоразлагаемый материал для 3D-печати, минимальная усадка.", 22, 4, "photo-1581092160607-ee22621dd758"],
  ["Фотополимерный 3D-принтер Anycubic Photon Mono M5s", "Разрешение 12K для миниатюр, автовыравнивание платформы.", 580, 4, "photo-1563770660941-20978e870e26"],
]

const products = raw.map((p, i) => ({
  id: i + 1,
  name: p[0],
  description: p[1],
  price: p[2],
  category_id: p[3],
  image_url: `https://images.unsplash.com/${p[4]}?w=400`,
  created_at: new Date().toISOString(),
  category: catById[p[3]],
}))

const send = (res, code, body) => {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  })
  res.end(JSON.stringify(body))
}

createServer((req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, {})
  const url = new URL(req.url, "http://localhost")
  const path = url.pathname
  if (path === "/api/products") return send(res, 200, { products, total: products.length })
  if (path === "/api/categories") return send(res, 200, categories)
  let m
  if ((m = path.match(/^\/api\/products\/category\/(\d+)$/))) {
    const list = products.filter((p) => p.category_id === Number(m[1]))
    return send(res, 200, { products: list, total: list.length })
  }
  if ((m = path.match(/^\/api\/products\/(\d+)$/))) {
    const p = products.find((x) => x.id === Number(m[1]))
    return p ? send(res, 200, p) : send(res, 404, { detail: "Not found" })
  }
  send(res, 404, { detail: "Not found" })
}).listen(8000, () => console.log("mock api on :8000"))
