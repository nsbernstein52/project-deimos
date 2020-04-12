// DROP DATABASE IF EXISTS productsdb;
// CREATE DATABASE productsdb;
\c productsdb;



CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price INT
);

CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  name TEXT,
  sale_price INT,
  original_price INT,
  default_style INT DEFAULT 0
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  style_id INT REFERENCES styles(id),
  url TEXT,
  thumbnail_url TEXT
);

CREATE TABLE skus (
  id SERIAL PRIMARY KEY,
  style_id INT REFERENCES styles(id),
  size TEXT,
  quantity INT
);

CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  feature TEXT,
  value TEXT
);

CREATE INDEX products_index ON products (id);
CREATE INDEX product_features_index ON features (product_id);
CREATE INDEX product_styles_index ON styles (product_id);
CREATE INDEX style_skus_index ON skus(style_id);
CREATE INDEX style_photos_index ON photos(style_id);
