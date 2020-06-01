// require('newrelic');
require('dotenv').config();

// const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const cors = require('cors');
const pg = require('./pg/query.js');

const PORT = process.env.PORT || 3000;
const app = express();
// const pathname = path.join(__dirname, '../');

// dotenv.load(); 

app.use(cors());
app.use(express.json());

let entryTime = new Date();
// console.log('a.js: ENTERING');

// QQQ
app.get('/', (request, response) => {
  response.sendFile(pathname);
});

// API CALLS

// CRUD

app.get('/productsdb/', (request, response) => {
  console.log('a:: gAPs: ENTERED');
  pg.getAllProducts()
  .then((products) => {
    console.log('a:: gAPs: r.r.[3]: COMPLETED', products[3]);
    response.send(products);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
});

app.get('/productsdb/:id', (request, response) => {
  // let entryTime = new Date();
  console.log('a:: gP: ENTERED: request.url: ', request.url);
  // console.log('a:: gP: ENTERED');
  pg.getProduct(request.params.id)
  .then((product) => {
    console.log('a:: gP: r.r.[0]: COMPLETED', product);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    response.send(product);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // .catch(error => console.error(error));
});

app.get('/productsdb/:id/features', (request, response) => {
  // let entryTime = new Date();
  // console.log('a:: gFs: ENTERED');
  pg.getFeatures(request.params.id)
  .then((features) => {
    // console.log('a:: gFs: r.r.[0]: COMPLETED', features);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    response.send(features);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // .catch(error => console.error(error));
});

// // getOneProductStyle for a product_id
// app.get('/productsdb/products/id/styles', (request, response) => {
//   // console.log('a:: gOPS: ENTERED');
//   pg.getOneProductStyle(request.params.id)
//   .then((style) => {
//     // console.log('a:: gOPS: r.rs: COMPLETED', style);
//     response.send(style);
//   })
//   .catch(error => console.error(error));
// });

app.get('/productsdb/:id/styles', (request, response) => {
  // let entryTime = new Date();
  // console.log('a:: gSs: ENTERED');
  pg.getStyles(request.params.id)
  .then((styles) => {
    // console.log('a:: gSs: r.rs: COMPLETED', styles);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    response.send(styles);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // .catch(error => console.error(error));
});

// getSkus for a style_id
app.get('/productsdb/:id/skus', (request, response) => {
  // let entryTime = new Date();
  // console.log('a:: gSks: ENTERED');
  pg.getSkus(request.params.id)
  .then((skus) => {
    // console.log('a:: gSks: r.rs: COMPLETED', skus);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    response.send(skus);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // .catch(error => console.error(error));
});

// getPhotos for a style_id
app.get('/productsdb/:id/photos', (request, response) => {
  // let entryTime = new Date();
  // console.log('a:: gPhs: ENTERED');
  pg.getPhotos(request.params.id)
  .then((photos) => {
    // console.log('a:: gPhs: r.rs: COMPLETED', photos);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    response.send(photos);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // .catch(error => console.error(error));
});

// console.log('a:: LEAVING');

app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`, new Date());
});
