CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE items (
  item_id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE shopping_lists (
  list_id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(customer_id),
  list_name VARCHAR(255) NOT NULL
);

CREATE TABLE shopping_list_items (
  list_item_id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES shopping_lists(list_id),
  item_id INTEGER REFERENCES items(item_id),
  quantity INTEGER NOT NULL
);