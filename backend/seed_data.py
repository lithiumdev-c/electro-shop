# backend/seed_data.py
"""
Скрипт для заполнения базы данных тестовыми данными.
Создает категории и товары для демонстрации работы приложения.
Использует placeholder изображения с unsplash.com.
"""

from app.database import SessionLocal, init_db
from app.models.category import Category
from app.models.product import Product


def create_categories(db):
    """
    Создает категории товаров для робототехники и DIY-электроники.

    Args:
        db: Сессия SQLAlchemy

    Returns:
        dict: Словарь созданных категорий {slug: Category}
    """
    categories_data = [
        {"name": "Микроконтроллеры и платы", "slug": "microcontrollers"},
        {"name": "Одноплатные компьютеры", "slug": "single-board-computers"},
        {"name": "Робототехника и LEGO конструкторы", "slug": "robotics-lego"},
        {"name": "3D-принтеры и расходные материалы", "slug": "3d-printing"},
    ]

    categories = {}
    for cat_data in categories_data:
        category = Category(**cat_data)
        db.add(category)
        categories[cat_data["slug"]] = category

    db.commit()

    # Обновляем объекты после commit для получения ID
    for category in categories.values():
        db.refresh(category)

    return categories


def create_products(db, categories):
    """
    Создает товары в новых инженерных категориях.

    Args:
        db: Сессия SQLAlchemy
        categories: Словарь категорий
    """
    products_data = [
        # Микроконтроллеры и платы (microcontrollers)
        {
            "name": "Arduino Uno R4 Minima",
            "description": "Обновленная легендарная плата на базе 32-битного микроконтроллера Renesas RA4M1 (ARM Cortex-M4). Идеальный старт для изучения схемотехники и программирования электроники.",
            "price": 25.00,
            "category_id": categories["microcontrollers"].id,
            "image_url": "https://images.unsplash.com/photo-1608564697171-2dc611523b69?w=400"
        },
        {
            "name": "ESP32-WROOM-32D Development Board",
            "description": "Мощный отладочный модуль с поддержкой Wi-Fi и Bluetooth. Отличное решение для проектов умного дома, интернета вещей (IoT) и беспроводного сбора данных.",
            "price": 8.50,
            "category_id": categories["microcontrollers"].id,
            "image_url": "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400"
        },
        {
            "name": "Raspberry Pi Pico H",
            "description": "Миниатюрная и производительная плата на базе собственного чипа RP2040 от Raspberry Pi Foundation. Поставляется с уже распаянными разъемами. Поддерживает C/C++ и MicroPython.",
            "price": 7.20,
            "category_id": categories["microcontrollers"].id,
            "image_url": "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=400"
        },

        # Одноплатные компьютеры (single-board-computers)
        {
            "name": "Raspberry Pi 5 (8GB RAM)",
            "description": "Новое поколение культового одноплатника. В 2-3 раза быстрее предшественников, имеет на борту 8 ГБ оперативной памяти, поддержку интерфейса PCIe и два порта micro-HDMI с поддержкой 4K 60Hz.",
            "price": 120.00,
            "category_id": categories["single-board-computers"].id,
            "image_url": "https://images.unsplash.com/photo-1629652487043-fb2825838f8c?w=400"
        },
        {
            "name": "Orange Pi Zero 3 (4GB)",
            "description": "Компактный и крайне бюджетный одноплатный компьютер на базе Allwinner H618. Оснащен встроенным Wi-Fi модулем и Ethernet-разъемом. Прекрасно подходит для серверов автоматизации.",
            "price": 35.00,
            "category_id": categories["single-board-computers"].id,
            "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"
        },

        # Робототехника и LEGO конструкторы (robotics-lego)
        {
            "name": "LEGO Technic: Робот-изобретатель Mindstorms",
            "description": "Продвинутый робототехнический набор LEGO. Включает интеллектуальный хаб, моторы, датчики цвета и расстояния. Позволяет собирать интерактивных программируемых роботов через Scratch или Python.",
            "price": 420.00,
            "category_id": categories["robotics-lego"].id,
            "image_url": "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=400"
        },
        {
            "name": "LEGO Education SPIKE Prime (Основной набор)",
            "description": "Учебно-методическое решение для изучения STEAM-дисциплин в школах и кружках робототехники. Содержит яркие строительные элементы, удобные датчики и моторы для быстрого прототипирования.",
            "price": 450.00,
            "category_id": categories["robotics-lego"].id,
            "image_url": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"
        },
        {
            "name": "Гусеничная робоплатформа на Arduino",
            "description": "Комплект для сборки двухмоторного вездеходного робота. Включает шасси, драйвер моторов L298N, ультразвуковой дальномер для обхода препятствий и ИК-пульт для дистанционного управления.",
            "price": 55.00,
            "category_id": categories["robotics-lego"].id,
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"
        },

        # 3D-принтеры и расходные материалы (3d-printing)
        {
            "name": "3D-принтер Creality Ender-3 V3 KE",
            "description": "Высокоскоростной FDM-принтер нового поколения на базе ОС Creality OS (Klipper). Скорость печати до 500 мм/с, автоматическая калибровка стола, direct-экструдер Sprite и поддержка удаленного управления.",
            "price": 349.00,
            "category_id": categories["3d-printing"].id,
            "image_url": "https://images.unsplash.com/photo-1615840287214-7fe58a8f3685?w=400"
        },
        {
            "name": "Пластик PLA Filament 1.75мм (Черный, 1кг)",
            "description": "Экологически чистый и биоразлагаемый материал для 3D-печати. Практически не дает усадки, не пахнет при печати. Отличный выбор как для начинающих, так и для серийного моделирования.",
            "price": 22.00,
            "category_id": categories["3d-printing"].id,
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400"
        },
        {
            "name": "Фотополимерный 3D-принтер Anycubic Photon Mono M5s",
            "description": "Сверхвысокое разрешение 12K для печати миниатюр с поразительной детализацией. Система автоматического выравнивания платформы без ручной регулировки винтов и умное обнаружение ошибок.",
            "price": 580.00,
            "category_id": categories["3d-printing"].id,
            "image_url": "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400"
        },
    ]

    for product_data in products_data:
        product = Product(**product_data)
        db.add(product)

    db.commit()
    print(f"✅ Успешно создано {len(products_data)} товаров.")


def seed_database():
    """
    Главная функция для заполнения базы данных.
    Создает таблицы, категории и товары.
    """
    print("🚀 Запуск процесса наполнения базы данных (Seeding)...")

    # Инициализируем БД (создаем таблицы, если их нет)
    init_db()
    print("✅ Таблицы в базе данных проверены/созданы.")

    # Создаем сессию
    db = SessionLocal()

    try:
        # Проверяем, не заполнена ли уже БД, чтобы избежать дубликатов
        existing_categories = db.query(Category).count()
        if existing_categories > 0:
            print("⚠️  База данных уже содержит данные. Пропускаем наполнение.")
            return

        # Создаем новые инженерные категории
        print("📁 Создание категорий...")
        categories = create_categories(db)
        print(f"✅ Создано категорий: {len(categories)}")

        # Создаем тематические товары
        print("📦 Создание товаров...")
        create_products(db, categories)

        print("🎉 Наполнение базы данных успешно завершено!")

    except Exception as e:
        print(f"❌ Ошибка в процессе сидинга: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()