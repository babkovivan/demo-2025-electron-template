const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

const dbPath = path.join(app.getPath('userData'), 'database.db')
console.log('📂 Путь к базе данных:', dbPath)
const db = new Database(dbPath)

db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS ProductTypes (
    product_type TEXT PRIMARY KEY,
    coefficient REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    article_code TEXT UNIQUE NOT NULL,
    min_price_for_partner REAL NOT NULL,
    product_type TEXT REFERENCES ProductTypes(product_type) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Partners (
    partner_id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_type TEXT,
    partner_name TEXT NOT NULL,
    director_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    legal_address TEXT NOT NULL,
    inn TEXT UNIQUE NOT NULL,
    rating INTEGER
  );

  CREATE TABLE IF NOT EXISTS Sales (
    sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_id INTEGER REFERENCES Partners(partner_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Products(product_id) ON DELETE CASCADE,
    quantity_sold INTEGER NOT NULL,
    sale_date TEXT NOT NULL
  );
`)

const hasProducts = db.prepare(`SELECT COUNT(*) as count FROM Products`).get().count
if (hasProducts === 0) {
  const insertType = db.prepare('INSERT INTO ProductTypes (product_type, coefficient) VALUES (?, ?)')
  insertType.run('Ламинат', 2.35)
  insertType.run('Массивная доска', 5.15)
  insertType.run('Паркетная доска', 4.34)
  insertType.run('Пробковое покрытие', 1.5)

  const insertProduct = db.prepare(`
    INSERT INTO Products (product_name, article_code, min_price_for_partner, product_type)
    VALUES (?, ?, ?, ?)
  `)
  insertProduct.run('Паркетная доска Ясень темный однополосная 14 мм', '8758385', 4456.90, 'Паркетная доска')
  insertProduct.run('Инженерная доска Дуб Французская елка однополосная 12 мм', '8858958', 7330.99, 'Паркетная доска')
  insertProduct.run('Ламинат Дуб дымчато-белый 33 класс 12 мм', '7750282', 1799.33, 'Ламинат')
  insertProduct.run('Ламинат Дуб серый 32 класс 8 мм с фаской', '7028748', 3890.41, 'Ламинат')
  insertProduct.run('Пробковое напольное клеевое покрытие 32 класс 4 мм', '5012543', 5450.59, 'Пробковое покрытие')

  const insertPartner = db.prepare(`
    INSERT INTO Partners (partner_type, partner_name, director_name, email, phone, legal_address, inn, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  insertPartner.run('ЗАО', 'База Строитель', 'Иванова Александра Ивановна', 'aleksandraivanova@ml.ru', '493 123 45 67', 'Юрга, ул. Лесная, 15', '2222455179', 7)
  insertPartner.run('ООО', 'Паркет 29', 'Петров Василий Петрович', 'vppetrov@vl.ru', '987 123 56 78', 'Северодвинск, ул. Строителей, 18', '3333888520', 7)
  insertPartner.run('ПАО', 'Стройсервис', 'Соловьев Андрей Николаевич', 'ansolovev@st.ru', '812 223 32 00', 'Приморск, ул. Парковая, 21', '4440391035', 7)
  insertPartner.run('ОАО', 'Ремонт и отделка', 'Воробьева Екатерина Валерьевна', 'ekaterina.vorobeva@ml.ru', '444 222 33 11', 'Реутов, ул. Свободы, 51', '1111520857', 5)
  insertPartner.run('ЗАО', 'МонтажПро', 'Степанов Степан Сергеевич', 'stepanov@stepan.ru', '912 888 33 33', 'Старый Оскол, ул. Рабочая, 122', '5552431140', 10)

  const insertSale = db.prepare(`
    INSERT INTO Sales (partner_id, product_id, quantity_sold, sale_date)
    VALUES (?, ?, ?, ?)
  `)
  insertSale.run(1, 1, 15500, '2023-03-23')
  insertSale.run(1, 3, 12350, '2023-12-18')
  insertSale.run(1, 4, 37400, '2024-06-07')
  insertSale.run(2, 2, 35000, '2022-12-02')
  insertSale.run(2, 5, 1250, '2023-05-17')
  insertSale.run(2, 3, 1000, '2024-06-07')
  insertSale.run(2, 1, 7550, '2024-07-01')
  insertSale.run(3, 1, 7250, '2023-01-22')
  insertSale.run(3, 2, 2500, '2024-07-05')
  insertSale.run(4, 4, 59050, '2023-03-20')
  insertSale.run(4, 3, 37200, '2024-03-12')
  insertSale.run(4, 5, 4500, '2024-05-14')
  insertSale.run(5, 3, 50000, '2023-09-19')
  insertSale.run(5, 4, 670000, '2023-11-10')
  insertSale.run(5, 1, 35000, '2024-04-15')
  insertSale.run(5, 2, 25000, '2024-06-12')
}

module.exports = db
