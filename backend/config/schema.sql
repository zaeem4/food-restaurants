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

CREATE TABLE menus (
    id bigserial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    meal_id bigint NOT NULL REFERENCES meals(id),
    restaurant_id bigint NOT NULL REFERENCES restaurants(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  company_id bigint REFERENCES companies(id),
  restaurant_id bigint REFERENCES restaurants(id),
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
  restaurant_id bigint REFERENCES restaurants(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


