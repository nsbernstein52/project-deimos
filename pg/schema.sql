DROP DATABASE IF EXISTS productsdb30;
CREATE DATABASE productsdb30;
\c productsdb30;



CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price INT
);

CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  feature TEXT,
  value TEXT
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

CREATE INDEX products_index ON products (id);
CREATE INDEX product_features_index ON features (product_id);
CREATE INDEX product_styles_index ON styles (product_id);
CREATE INDEX style_skus_index ON skus(style_id);
CREATE INDEX style_photos_index ON photos(style_id);

/*
query scripts

product
SELECT * FROM products where id = $1;
SELECT * FROM features where product_id = $1;
SELECT * FROM products INNER JOIN features ON products.id = features.product_id WHERE products.id = $1;

styles
SELECT * FROM styles where products_id = $1;
for style ids:
SELECT * FROM skus where styles_id = $1;
SELECT * FROM photos where styles_id = $1;
SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id  WHERE products.id = 1;
SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id  WHERE products.id = 1 AND id = 1;

SELECT *, products.id AS id, skus.id AS sku_id, photos.id AS photo_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = 1;

SELECT *, products.id AS product_id, skus.id AS sku_id, photos.id AS photo_id, styles.id AS style_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = 1;
SELECT *, products.id AS product_id, skus.id AS sku_id, photos.id AS photo_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = 1 AND id = 1;
SELECT *, products.id AS product_id, skus.id AS sku_id, photos.id AS photo_id, styles.id AS style_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = 1 AND styles.id = 1;
SELECT *, products.id AS product_id, skus.id AS sku_id, photos.id AS photo_id, styles.id AS style_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE product_id = 1 AND style_id = 1;
SELECT *, products.id AS product_id, skus.id AS sku_id, photos.id AS photo_id, styles.id AS style_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE product_id = 1 AND style_id = 1 AND photos.id = 1 AND skus.id = 1;
SELECT *, products.id AS product_id, skus.id AS sku_id, photos.id AS photo_id, styles.id AS style_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = 1 AND styles.id = 1 AND photos.id = 1 AND skus.id = 1;
SELECT *, products.id AS product_id, skus.id AS sku_id, photos.id AS photo_id, styles.id AS style_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = 1 AND styles.id = 2 AND photos.id = 1 AND skus.id = 1;
SELECT *, products.id AS product_id, styles.id AS style_id, photos.id AS photo_id, skus.id AS sku_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = 1 AND styles.id = 1 AND photos.id = 1 AND skus.id = 1;

COPY products FROM '/Users/nsb52/sdc/data30/products-30.csv' HEADER csv;
COPY features FROM '/Users/nsb52/sdc/data30/features-30.csv' HEADER csv;
COPY styles FROM '/Users/nsb52/sdc/data30/styles-30.csv' HEADER csv;
COPY skus FROM '/Users/nsb52/sdc/data30/skus-30.csv' HEADER csv;
COPY photos FROM '/Users/nsb52/sdc/data30/photos-30.csv' HEADER csv;

SELECT * FROM products WHERE id < 5;
SELECT * FROM features WHERE id < 5;
SELECT * FROM styles WHERE id < 5;
SELECT * FROM skus WHERE id < 5;
SELECT * FROM photos WHERE id < 5;
*/