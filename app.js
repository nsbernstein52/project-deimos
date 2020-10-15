// require('newrelic');
require('dotenv').config();

// const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const cors = require('cors');
const pg = require('./pg/query.js');
const { request } = require('http');

const PORT = process.env.PORT || 3000;
const app = express();

const pathname = path.join(__dirname, '../public/index.html');

// const pathname = path.join(__dirname, '../');

// dotenv.load(); 

app.use(cors());
app.use(express.json());

let entryTime = new Date();
console.log('a: ENTERING at: ', new Date().toLocaleTimeString());

// QQQ
app.get('/', (request, response) => {
  response.sendFile(pathname);
});

// API CALLS

// CRUD

// app.get('/productsdb/', (request, response) => {
app.get('/products/list', (request, response) => {
  // console.log('a:: gAPs: ENTERED');
  pg.getAllProducts()
  .then((products) => {
    // console.log('a:: gAPs: r.r.[3]: COMPLETED', products[3]);
    response.send(products);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
});

// app.get('/productsdb/products/:id', (request, response) => {
app.get('/products/:id', (request, response) => {
  // let entryTime = new Date();
  // console.log('a:: gP: ENTERED: request.url: ', request.url);
  // console.log('a:: gP: ENTERED');
  pg.getProduct(request.params.id)
  .then((product) => {
    // console.log('a:: gP: r.r.[0]: COMPLETED', product);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    response.send(product);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // .catch(error => console.error(error));
});

// app.get('/productsdb/features/:id', (request, response) => {
app.get('/products/:id/features', (request, response) => {
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

// app.get('/productsdb/styles/:id', (request, response) => { // get ONLY style info
app.get('/products/:id/styles', (request, response) => { // get ONLY style info
  // let entryTime = new Date();
  // console.log('a:: gSs: ENTERED');
  
  pg.getStyles(request.params.id) // promise A, .then callback waits until promise B resolves and A.then resolves with B's resolved value
  // pg.getStyles(request.params.id, printASFOP)
  .then((styles) => {
    // console.log('a:: gSs: r.r.[0]: COMPLETED', features);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    console.log(styles);
    response.send(styles);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // console.log('app duration to complete call [ms]: ', new Date() - entryTime, request.url);
  // .catch(error => console.error(error));
});

// getStylesInApp
app.get('/products/styles/:id', (request, response) => {
  pg.getOnlyStyle(request.params.id)
  .then((styles) => {
    // console.log('a:: gSs: r.r.[0]: COMPLETED', features);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    // console.log(styles);
    for (let i = 0; i < styles.length; i++) {
      console.log('a: gOSs: loop.i: ', i);
      // getPhotos for a style_id
      styles[i].photos = [];
      app.get('/products/:id/photos', (request, response) => {
        // let entryTime = new Date();
        console.log('a:gOSs: gPhs: ENTERED');
        // pg.getPhotos(request.params.id)
        // let currentStyleId = i;
        // pg.getPhotos(currentStyleId)
        pg.getPhotos(i)
        .then((photos) => {
          // console.log('a:: gPhs: r.rs: COMPLETED', photos);
          // console.log('duration to complete call: ', new Date() - entryTime, request.url);
          console.log(photos);
          response.send(photos);
          // styles[currentStyleId].photos = [photos];
          styles[i].photos = [photos.rows];
        })
        .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
        // .catch(error => console.error(error));
      });

      styles[i].skus = {"XS": 8};
    };
    console.log('end: ', styles);
    // for (let i = 0; i < styles.length; i++) {
    //   // getPhotos for a style_id
    //   app.get('/productsdb/photos/:id', (request, response) => {
    //     // let entryTime = new Date();
    //     // console.log('a:: gPhs: ENTERED');
    //     pg.getPhotos(request.params.id)
    //     .then((photos) => {
    //       // console.log('a:: gPhs: r.rs: COMPLETED', photos);
    //       // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    //       styles[request.params.id]
    //       response.send(photos);
    //     })
    //     .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
    //     // .catch(error => console.error(error));
    //   });
    // }    

    response.send(styles);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // console.log('app duration to complete call [ms]: ', new Date() - entryTime, request.url);
  // .catch(error => console.error(error));
});

// app.get('/productsdb/skus/:id', (request, response) => {
app.get('/products/:id/skus', (request, response) => {
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

// app.get('/productsdb/photos/:id', (request, response) => {
app.get('/products/:id/photos', (request, response) => {
  // let entryTime = new Date();
  // console.log('a:: gPhs: ENTERED');
  // console.log('a:: gPhs: r.p.i: ', request.params.id);
  pg.getPhotos(request.params.id)
  .then((photos) => {
    // console.log('a:: gPhs: r.rs: COMPLETED', photos);
    // console.log('duration to complete call: ', new Date() - entryTime, request.url);
    // console.log(photos.length);
    response.send(photos);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
  // .catch(error => console.error(error));
});

console.log('a:: LEAVING at: ', new Date().toLocaleTimeString());

module.exports = app;
