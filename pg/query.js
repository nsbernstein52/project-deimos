const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  database: 'productsdb',
  password: 'Psa2020s',
  port: 5432,
})

console.log( new Date());
console.log("q.js: ENTERING");

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const getProduct = (id) => {
  let values = [id];
  console.log("q: gP: id ENTERED", id);
  return pool.query("SELECT * FROM products where id = $1", values)
  .then(res => {
    console.log("q: gP r.r[0]:", res.rows[0]);
    return res.rows[0];
  })
};

console.log("q.js: LEAVING");

module exports = {
  getProduct
}

