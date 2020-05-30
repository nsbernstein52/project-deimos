// require('newrelic');
require('dotenv').config();
// const dotenv = require('dotenv');

const path = require('path');
const express = require('express');
const cors = require('cors');
const pg = require('./pg/query.js');

const PORT = process.env.PORT || 3000;
const app = express();
// const pathname  =path.join(__dirname, '../');

// dotenv.load(); 

app.use(cors());
app.use(express.json());

let entryTime = new Date();
// console.log('a.js: ENTERING');

// QQQ
app.get('/', (request, response) => {
  res.sendFile(pathname);
});

app.get('/productsdb/', (req, res) => {
  console.log('a:: gAP: ENTERED');
  pg.getAllProducts()
  .then((results) => {
    console.log('a:: gAPs: r.r.[3]: COMPLETED', results[3]);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// CRUD
app.get('/productsdb/:id', (req, res) => {
  // let entryTime = new Date();
  console.log('a:: gP: ENTERED: req.url: ', req.url);
  // console.log('a:: gP: ENTERED');
  pg.getProduct(req.params.id)
  .then((results) => {
    console.log('a:: gP: r.r.[0]: COMPLETED', results);
    // console.log('duration to complete call: ', new Date() - entryTime, req.url);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// getFeatures for a product_id 
app.get('/productsdb/:id/features', (req, res) => {
  // let entryTime = new Date();
  // console.log('a:: gFs: ENTERED');
  pg.getFeatures(req.params.id)
  .then((results) => {
    // console.log('a:: gFs: r.r.[0]: COMPLETED', results);
    // console.log('duration to complete call: ', new Date() - entryTime, req.url);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// // getOneProductStyle for a product_id
// app.get('/productsdb/products/id/styles', (req, res) => {
//   // console.log('a:: gOPS: ENTERED');
//   pg.getOneProductStyle(req.params.id)
//   .then((results) => {
//     // console.log('a:: gOPS: r.rs: COMPLETED', results);
//     res.send(results);
//   })
//   .catch(err => console.log(err));
// });

// getStyles for a product_id
app.get('/productsdb/:id/styles', (req, res) => {
  // let entryTime = new Date();
  // console.log('a:: gSs: ENTERED');
  pg.getStyles(req.params.id)
  .then((results) => {
    // console.log('a:: gSs: r.rs: COMPLETED', results);
    // console.log('duration to complete call: ', new Date() - entryTime, req.url);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// getSkus for a style_id
app.get('/productsdb/:id/skus', (req, res) => {
  // let entryTime = new Date();
  // console.log('a:: gSks: ENTERED');
  pg.getSkus(req.params.id)
  .then((results) => {
    // console.log('a:: gSks: r.rs: COMPLETED', results);
    // console.log('duration to complete call: ', new Date() - entryTime, req.url);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// getPhotos for a style_id
app.get('/productsdb/:id/photos', (req, res) => {
  // let entryTime = new Date();
  // console.log('a:: gPhs: ENTERED');
  pg.getPhotos(req.params.id)
  .then((results) => {
    // console.log('a:: gPhs: r.rs: COMPLETED', results);
    // console.log('duration to complete call: ', new Date() - entryTime, req.url);
    res.send(results);
  })
  .catch(err => console.log(err));
});

// console.log('a:: LEAVING');

app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`, new Date());
});