// require('newrelic');

const express = require('express');
const app = express();
const pg = require("./pg/query.js");

// const PORT = process.env.PORT || 3000;
const PORT = 3000;

app.use(express.json());

console.log( new Date());
// console.log("a.js: ENTERING");

// getAllProducts
app.get('/productsdb/', (req, res) => {
  // console.log("a:: gP: ENTERED");
  pg.getAllProducts()
  .then((results) => {
    // console.log("a:: gAPs: r.r.[3]: COMPLETED", results[3]);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// getProduct
app.get('/productsdb/:id', (req, res) => {
  // console.log("a:: gP: ENTERED");
  pg.getProduct(req.params.id)
  .then((results) => {
    // console.log("a:: gP: r.r.[0]: COMPLETED", results);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// getFeatures for a product_id 
app.get('/productsdb/features/:id', (req, res) => {
  // console.log("a:: gFs: ENTERED");
  pg.getFeatures(req.params.id)
  .then((results) => {
    // console.log("a:: gFs: r.r.[0]: COMPLETED", results);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// // getOneProductStyle for a product_id
// app.get('/productsdb/products/id/styles', (req, res) => {
//   // console.log("a:: gOPS: ENTERED");
//   pg.getOneProductStyle(req.params.id)
//   .then((results) => {
//     // console.log("a:: gOPS: r.rs: COMPLETED", results);
//     res.send(results);
//   })
//   .catch(err => console.log(err));
// });

// getStyles for a product_id
app.get('/productsdb/styles/:id', (req, res) => {
  // console.log("a:: gSs: ENTERED");
  pg.getStyles(req.params.id)
  .then((results) => {
    // console.log("a:: gSs: r.rs: COMPLETED", results);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// getSkus for a style_id
app.get('/productsdb/skus/:id', (req, res) => {
  // console.log("a:: gSks: ENTERED");
  pg.getSkus(req.params.id)
  .then((results) => {
    // console.log("a:: gSks: r.rs: COMPLETED", results);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// getPhotos for a style_id
app.get('/productsdb/photos/:id', (req, res) => {
  // console.log("a:: gPhs: ENTERED");
  pg.getPhotos(req.params.id)
  .then((results) => {
    // console.log("a:: gPhs: r.rs: COMPLETED", results);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// console.log("a:: LEAVING");

app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});