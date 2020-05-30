// const { Pool, Client } = require('pg')
const { Pool } = require('pg')
const pool = new Pool({
  database: 'productsdb',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  // process.env.DB_USER should be recognized by root
  // host private dns 
  // security group allow ot access each other
  // ipAddress: 3.16.68.230/32,
  // password: 'PW',
  port: 5432 // GOOD?  BAD?
  // port: 4000 // GOOD?  BAD?
});

// console.log( new Date());
// console.log('q.js: ENTERING');

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// });

// TEST POOL:  the pool will emit an error on behalf of any idle clients
//   if it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected postgres pool error on idle client', err);
  process.exit(-1);
});

// TEST CLIENT:  callback - checkout a client
pool.connect((connectionErr, client, done) => {
  if (connectionErr) throw connectionErr;
  client.query('SELECT * FROM resources WHERE id = $1', [1], (queryErr, res) => {
    done();
    if (queryErr) {
      console.error('Failed to get resources from postgres pool: ', queryErr);
    }
  });
});

// getAllProducts
const getAllProducts = () => {
  // let values = [];
  console.log('q: gAP: ENTERED');
  return pool.query('SELECT * FROM products')
  .then(res => {
    console.log('q: gAPs r.r[3]:', res.rows[3]);
    // return res.rows[0];
    return res.rows;
  })
};

// getProduct
const getProduct = (id) => {
  let values = [id];
  console.log('q: gP: id ENTERED', id);
  return pool.query('SELECT * FROM products where id = $1', values)
  .then(res => {
    console.log('q: gP r.r[0]:', res.rows[0]);
    // return res.rows[0];
    return res.rows;
  })
};

//getFeatures for a product_id
const getFeatures = (product_id) => {
  let values = [product_id];
  // console.log('q: gFs: product_id ENTERED', product_id);
  return pool.query('SELECT * FROM features where product_id = $1', values)
  .then(res => {
    // console.log('q: gS r.rs:', res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

//getStyles for a product_id
const getStyles = (product_id) => {
  let values = [product_id];
  // console.log('q: gSs: product_id ENTERED', product_id);
  return pool.query('SELECT * FROM styles where product_id = $1', values)
  .then(res => {
    // console.log('q: gS r.rs:', res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

//getSkus for a style_id
const getSkus = (style_id) => {
  let values = [style_id];
  // console.log('q: gSks: style_id ENTERED', style_id);
  return pool.query('SELECT * FROM skus where style_id = $1', values)
  .then(res => {
    // console.log('q: gSks r.rs:', res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

//getPhotos for a style_id
const getPhotos = (style_id) => {
  let values = [style_id];
  // console.log('q: gPhs: style_id ENTERED', style_id);
  return pool.query('SELECT * FROM photos where style_id = $1', values)
  .then(res => {
    // console.log('q: gPhs r.rs:', res.rows);
    // return res.rows[0];
    return res.rows;
  })
};

// console.log('q.js: LEAVING');

module.exports = {
  getAllProducts,
  getProduct,
  getFeatures,
  getStyles,
  getSkus,
  getPhotos
}

