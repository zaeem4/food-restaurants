CREATE TABLE users (
  "id" bigserial PRIMARY KEY,
  "user_name" varchar UNIQUE NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar,
  "role" varchar default(NULL),
  "updated_at" timestamp,
  "created_at" timestamp
);

CREATE TABLE permissions (
  "id" bigserial PRIMARY KEY,
  "role"  varchar UNIQUE NOT NULL,
  "scope" json NOT NULL,
  "updated_at" timestamp,
  "created_at" timestamp
);


CREATE TABLE restaurants (
    id bigserial PRIMARY KEY,
    user_id bigint REFERENCES users(id),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    tax_number VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    fee_type VARCHAR(255) NOT NULL,
    fee_value VARCHAR(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meals (
    id bigserial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    photo_location VARCHAR(255),
    restaurant_id bigint NOT NULL REFERENCES restaurants(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
    id bigserial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mealsingredients (
    id bigserial PRIMARY KEY,
    meal_id bigint NOT NULL REFERENCES meals(id),
    ingredient_id bigint NOT NULL REFERENCES ingredients(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    id bigserial PRIMARY KEY,
    user_id bigint REFERENCES users(id),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    tax_number VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    shifts VARCHAR(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company_id bigint REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
    id bigserial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    meal_id bigint NOT NULL REFERENCES meals(id),
    restaurant_id bigint NOT NULL REFERENCES restaurants(id),
    day VARCHAR(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  company_id bigint REFERENCES companies(id),
  restaurant_id bigint REFERENCES restaurants(id),
  employee_id bigint REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ordersmenus (
  order_id bigint REFERENCES Orders(id),
  menu_id bigint REFERENCES menus(id),
  PRIMARY KEY (order_id, menu_id)
);

CREATE TABLE invoices (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  amount DECIMAL(10, 2) NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  restaurant_id bigint REFERENCES restaurants(id),
  company_id bigint REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kitchens (
  id serial PRIMARY KEY,
  user_id bigint REFERENCES users(id),
  description TEXT NOT NULL,
  restaurant_id bigint REFERENCES restaurants(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "public"."users" ("id","user_name","email","password","role","updated_at","created_at") VALUES (1,'test1','admin1@test.com','$2b$10$gkewYUcVj07NesBirUbmoe8WkMVio/RMRhjhHXFyiy79F2uC2.Rpi','admin','2023-07-31 15:06:54','2023-07-31 15:06:54');
INSERT INTO "public"."users" ("id","user_name","email","password","role","updated_at","created_at") VALUES (3,'restaurant1','restaurant1@test.com','$2b$10$gkewYUcVj07NesBirUbmoe8WkMVio/RMRhjhHXFyiy79F2uC2.Rpi','restaurant','2023-08-01 16:24:35','2023-08-01 16:24:35');
INSERT INTO "public"."users" ("id","user_name","email","password","role","updated_at","created_at") VALUES (7,'company1','company1@test.com','$2b$10$gkewYUcVj07NesBirUbmoe8WkMVio/RMRhjhHXFyiy79F2uC2.Rpi','company','2023-08-05 21:58:07','2023-08-05 21:58:07');
INSERT INTO "public"."users" ("id","user_name","email","password","role","updated_at","created_at") VALUES (8,'rider1','rider1@test.com','$2b$10$gkewYUcVj07NesBirUbmoe8WkMVio/RMRhjhHXFyiy79F2uC2.Rpi','rider','2023-08-05 21:58:07','2023-08-05 21:58:07');
INSERT INTO "public"."users" ("id","user_name","email","password","role","updated_at","created_at") VALUES (14,'kitchen1','kitchen1@test.com','$2b$10$gkewYUcVj07NesBirUbmoe8WkMVio/RMRhjhHXFyiy79F2uC2.Rpi','kitchen','2023-08-28 20:50:46','2023-08-28 20:50:46');

INSERT INTO "public"."permissions" ("id","role","scope","updated_at","created_at") VALUES (1,'admin','{"dashboard":true,"restaurants":true,"meals":true,"invoices":true,"companies":true,"menus":true,"orders":false,"employees":false,"reports":false, "kitchens":false}','2023-07-31 15:55:20','2023-07-31 15:55:20');
INSERT INTO "public"."permissions" ("id","role","scope","updated_at","created_at") VALUES (2,'restaurant','{"dashboard":false,"restaurants":false,"meals":false,"invoices":true,"companies":true,"menus":true,"orders":true,"employees":false,"reports":false,"kitchens":true}','2023-07-31 15:55:20','2023-07-31 15:55:20');
INSERT INTO "public"."permissions" ("id","role","scope","updated_at","created_at") VALUES (3,'company','{"dashboard":false,"restaurants":false,"meals":false,"invoices":false,"companies":false,"menus":true,"orders":true,"employees":true,"reports":true,"kitchens":false}','2023-07-31 15:55:20','2023-07-31 15:55:20');
INSERT INTO "public"."permissions" ("id","role","scope","updated_at","created_at") VALUES (5,'rider','{"dashboard":false,"restaurants":false,"meals":false,"invoices":false,"companies":false,"menus":false,"orders":true,"employees":false,"reports":false,"kitchens":false}','2023-07-31 15:55:20','2023-07-31 15:55:20');
INSERT INTO "public"."permissions" ("id","role","scope","updated_at","created_at") VALUES (6,'kitchen','{"dashboard":false,"restaurants":false,"meals":false,"invoices":false,"companies":false,"menus":false,"orders":true,"employees":false,"reports":false,"kitchens":false}','2023-07-31 15:55:20','2023-07-31 15:55:20');
