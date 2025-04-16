
CREATE TABLE ProductTypes (
    product_type VARCHAR(50) PRIMARY KEY,
    coefficient DECIMAL(5, 2) NOT NULL
);

CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    article_code VARCHAR(20) UNIQUE NOT NULL,
    min_price_for_partner DECIMAL(10, 2) NOT NULL,
    product_type VARCHAR(50) REFERENCES ProductTypes(product_type) ON DELETE CASCADE
);

CREATE TABLE Partners (
    partner_id SERIAL PRIMARY KEY,
    partner_type VARCHAR(50),
    partner_name VARCHAR(255) NOT NULL,
    director_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    legal_address TEXT NOT NULL,
    inn BIGINT UNIQUE NOT NULL,
    rating INT
);


CREATE TABLE Sales (
    sale_id SERIAL PRIMARY KEY,
    partner_id INT REFERENCES Partners(partner_id) ON DELETE CASCADE,
    product_id INT REFERENCES Products(product_id) ON DELETE CASCADE,
    quantity_sold INT NOT NULL,
    sale_date DATE NOT NULL
);

INSERT INTO ProductTypes (product_type, coefficient)
VALUES
('Ламинат', 2.35),
('Массивная доска', 5.15),
('Паркетная доска', 4.34),
('Пробковое покрытие', 1.5);
INSERT INTO Products (product_name, article_code, min_price_for_partner, product_type)
VALUES
('Паркетная доска Ясень темный однополосная 14 мм', '8758385', 4456.90, 'Паркетная доска'),
('Инженерная доска Дуб Французская елка однополосная 12 мм', '8858958', 7330.99, 'Паркетная доска'),
('Ламинат Дуб дымчато-белый 33 класс 12 мм', '7750282', 1799.33, 'Ламинат'),
('Ламинат Дуб серый 32 класс 8 мм с фаской', '7028748', 3890.41, 'Ламинат'),
('Пробковое напольное клеевое покрытие 32 класс 4 мм', '5012543', 5450.59, 'Пробковое покрытие');
INSERT INTO Partners (partner_type, partner_name, director_name, email, phone, legal_address, inn, rating)
VALUES
('ЗАО', 'База Строитель', 'Иванова Александра Ивановна', 'aleksandraivanova@ml.ru', '493 123 45 67', '652050, Кемеровская область, город Юрга, ул. Лесная, 15', 2222455179, 7),
('ООО', 'Паркет 29', 'Петров Василий Петрович', 'vppetrov@vl.ru', '987 123 56 78', '164500, Архангельская область, город Северодвинск, ул. Строителей, 18', 3333888520, 7),
('ПАО', 'Стройсервис', 'Соловьев Андрей Николаевич', 'ansolovev@st.ru', '812 223 32 00', '188910, Ленинградская область, город Приморск, ул. Парковая, 21', 4440391035, 7),
('ОАО', 'Ремонт и отделка', 'Воробьева Екатерина Валерьевна', 'ekaterina.vorobeva@ml.ru', '444 222 33 11', '143960, Московская область, город Реутов, ул. Свободы, 51', 1111520857, 5),
('ЗАО', 'МонтажПро', 'Степанов Степан Сергеевич', 'stepanov@stepan.ru', '912 888 33 33', '309500, Белгородская область, город Старый Оскол, ул. Рабочая, 122', 5552431140, 10);
INSERT INTO Sales (partner_id, product_id, quantity_sold, sale_date)
VALUES
((SELECT partner_id FROM Partners WHERE partner_name = 'База Строитель'), 
 (SELECT product_id FROM Products WHERE product_name = 'Паркетная доска Ясень темный однополосная 14 мм'), 15500, '2023-03-23'),
((SELECT partner_id FROM Partners WHERE partner_name = 'База Строитель'), 
 (SELECT product_id FROM Products WHERE product_name = 'Ламинат Дуб дымчато-белый 33 класс 12 мм'), 12350, '2023-12-18'),
((SELECT partner_id FROM Partners WHERE partner_name = 'База Строитель'), 
 (SELECT product_id FROM Products WHERE product_name = 'Ламинат Дуб серый 32 класс 8 мм с фаской'), 37400, '2024-06-07'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Паркет 29'), 
 (SELECT product_id FROM Products WHERE product_name = 'Инженерная доска Дуб Французская елка однополосная 12 мм'), 35000, '2022-12-02'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Паркет 29'), 
 (SELECT product_id FROM Products WHERE product_name = 'Пробковое напольное клеевое покрытие 32 класс 4 мм'), 1250, '2023-05-17'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Паркет 29'), 
 (SELECT product_id FROM Products WHERE product_name = 'Ламинат Дуб дымчато-белый 33 класс 12 мм'), 1000, '2024-06-07'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Паркет 29'), 
 (SELECT product_id FROM Products WHERE product_name = 'Паркетная доска Ясень темный однополосная 14 мм'), 7550, '2024-07-01'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Стройсервис'), 
 (SELECT product_id FROM Products WHERE product_name = 'Паркетная доска Ясень темный однополосная 14 мм'), 7250, '2023-01-22'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Стройсервис'), 
 (SELECT product_id FROM Products WHERE product_name = 'Инженерная доска Дуб Французская елка однополосная 12 мм'), 2500, '2024-07-05'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Ремонт и отделка'), 
 (SELECT product_id FROM Products WHERE product_name = 'Ламинат Дуб серый 32 класс 8 мм с фаской'), 59050, '2023-03-20'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Ремонт и отделка'), 
 (SELECT product_id FROM Products WHERE product_name = 'Ламинат Дуб дымчато-белый 33 класс 12 мм'), 37200, '2024-03-12'),
((SELECT partner_id FROM Partners WHERE partner_name = 'Ремонт и отделка'), 
 (SELECT product_id FROM Products WHERE product_name = 'Пробковое напольное клеевое покрытие 32 класс 4 мм'), 4500, '2024-05-14'),
((SELECT partner_id FROM Partners WHERE partner_name = 'МонтажПро'), 
 (SELECT product_id FROM Products WHERE product_name = 'Ламинат Дуб дымчато-белый 33 класс 12 мм'), 50000, '2023-09-19'),
((SELECT partner_id FROM Partners WHERE partner_name = 'МонтажПро'), 
 (SELECT product_id FROM Products WHERE product_name = 'Ламинат Дуб серый 32 класс 8 мм с фаской'), 670000, '2023-11-10'),
((SELECT partner_id FROM Partners WHERE partner_name = 'МонтажПро'), 
 (SELECT product_id FROM Products WHERE product_name = 'Паркетная доска Ясень темный однополосная 14 мм'), 35000, '2024-04-15'),
((SELECT partner_id FROM Partners WHERE partner_name = 'МонтажПро'), 
 (SELECT product_id FROM Products WHERE product_name = 'Инженерная доска Дуб Французская елка однополосная 12 мм'), 25000, '2024-06-12');
SELECT * FROM Sales WHERE partner_id NOT IN (SELECT partner_id FROM Partners);
SELECT * FROM Sales WHERE product_id NOT IN (SELECT product_id FROM Products);
SELECT COUNT(*) FROM Products GROUP BY article_code HAVING COUNT(*) > 1;
SELECT COUNT(*) FROM Partners GROUP BY email HAVING COUNT(*) > 1;