// const { Pool, Client } = require('pg')
const { Pool } = require('pg')
const pool = new Pool({
  user: 'nsb52',
  database: 'productsdb',
  password: 'Psa2020s',
  port: 5432 // GOOD?  BAD?
});

// console.log( new Date());
// console.log("q.js: ENTERING");

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// });

// getAllProducts
const getAllProducts = () => {
  // let values = [];
  // console.log("q: gP: id ENTERED");
  return pool.query("SELECT * FROM products")
  .then(res => {
    // console.log("q: gAPs r.r[3]:", res.rows[3]);
    // return res.rows[0];
    return res.rows;
  })
};

// getProduct
const getProduct = (id) => {
  let values = [id];
  // console.log("q: gP: id ENTERED", id);
  return pool.query("SELECT * FROM products where id = $1", values)
  .then(res => {
    // console.log("q: gP r.r[0]:", res.rows[0]);
    // return res.rows[0];
    return res.rows;
  })
};

//getFeatures for a product_id
const getFeatures = (product_id) => {
  let values = [product_id];
  // console.log("q: gFs: product_id ENTERED", product_id);
  return pool.query("SELECT * FROM features where product_id = $1", values)
  .then(res => {
    // console.log("q: gS r.rs:", res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

//getStyles for a product_id
const getStyles = (product_id) => {
  let values = [product_id];
  // console.log("q: gSs: product_id ENTERED", product_id);
  return pool.query("SELECT * FROM styles where product_id = $1", values)
  .then(res => {
    // console.log("q: gS r.rs:", res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

//getSkus for a style_id
const getSkus = (style_id) => {
  let values = [style_id];
  // console.log("q: gSks: style_id ENTERED", style_id);
  return pool.query("SELECT * FROM skus where style_id = $1", values)
  .then(res => {
    // console.log("q: gSks r.rs:", res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

//getPhotos for a style_id
const getPhotos = (style_id) => {
  let values = [style_id];
  // console.log("q: gPhs: style_id ENTERED", style_id);
  return pool.query("SELECT * FROM photos where style_id = $1", values)
  .then(res => {
    // console.log("q: gPhs r.rs:", res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

// console.log("q.js: LEAVING");

module.exports = {
  getAllProducts,
  getProduct,
  getFeatures,
  getStyles,
  getSkus,
  getPhotos
}

