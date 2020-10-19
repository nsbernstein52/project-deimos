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

// console.log('q: process.env: ', process.env);
// console.log( new Date());
// console.log('q.js: ENTERING');

// pool.query('SELECT NOW()', (error, response) => {
//   console.log(error, response)
//   pool.end()
// });

// TEST POOL:  the pool will emit an error on behalf of any idle clients
//   if it contains if a backend error or network partition happens
pool.on('error', (error, client) => {
  console.error('Unexpected postgres pool error on idle client', error);
  process.exit(-1);
});

// TEST CLIENT:  callback - checkout a client
pool.connect((connectionError, client, done) => {
  if (connectionError) throw connectionError;
  client.query('SELECT * FROM products WHERE id = $1', [1], (queryError, response) => { // response, standalone?
    done();
    if (queryError) {
      console.error('Failed to get products from postgres pool: ', queryError);
    }
  });
});

const getAllProducts = () => {
  // console.log('q: gAPs: ENTERED');
  return pool.query('SELECT * FROM products')
  .then(products => {
    // console.log('q: gAPs r.r[3]:', products.rows[3]);
    return products.rows;
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};

const getProduct = (id) => {
  let productValues = [id];
  // console.log('q: gP: id ENTERED', id);
  return pool.query('SELECT * FROM products INNER JOIN features ON products.id = features.product_id WHERE products.id = $1', productValues)
  .then(product => {
    // console.log('q: gP: product.rows: ', product.rows);
    const productInfo = {
      // temp: product.rows[0].id,
      // temp: undefined,
      // id: product.rows[0].id,
      id: id,
      name: product.rows[0].name,
      slogan: product.rows[0].slogan,
      description: product.rows[0].description,
      category: product.rows[0].category,
      default_price: product.rows[0].default_price,
      features: [],
    };
    // // console.log('q: gP: p.r[0].feature: ', product.rows[0].feature)
    // // console.log('q: gP: p.r[0].value: ', product.rows[0].value)
    // // console.log('q: gP: p.r[1].feature: ', product.rows[1].feature)
    // // console.log('q: gP: p.r[1].value: ', product.rows[1].value)
    for (let featureCount = 0; featureCount < product.rows.length; featureCount++) {
      let featureObj = {
        feature: product.rows[featureCount].feature,
        value: product.rows[featureCount].value,
      }
      // console.log('q: gP fO:', featureObj);
      productInfo.features.push(featureObj);
    }
    // console.log('q: gP pI:', productInfo);
    return productInfo;
    // console.log('q: gP r.r[0]:', product.rows[0]);
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};

/*
const getOnlyProduct = (id) => {
  let productArgs = [id];
  // console.log('q: gP: id ENTERED', id);
  return pool.query('SELECT * FROM products WHERE products.id = $1', productArgs)
  .then(product => {
    // console.log('q: gP: product.rows: ', product.rows);
    return product.rows;
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};
*/

const getFeatures = (product_id) => {
  let featuresValues = [product_id];
  // console.log('q: gFs: product_id ENTERED', product_id);
  return pool.query('SELECT * FROM features where product_id = $1', featuresValues)
  .then(features => {
    // console.log('q: gFs r.rs:', features.rows);
    return features.rows;
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};

const getStyles = (product_id, printASFOP) => {
  let entryTime = new Date();
  // console.log('q: gSs: product_id ENTERED', product_id);

  const allStylesForOneProduct = {
    product_id: product_id,
    results: [],
  };

  let stylesArgs = [product_id];
  return pool.query('SELECT * FROM styles where product_id = $1', stylesArgs)
  .then(styles => {
    console.log('q: gSs: sBeforeLoop, s.r.l: ', styles.rows.length)
    let stylesCounter = 0;
    const promiseArr = [];

    for (let stylesRowsCount = 0; stylesRowsCount < styles.rows.length; stylesRowsCount++) {
      // console.log('q: gSs: sLoopTop, sC: ', stylesRowsCount)
      let styleObj = {};
      styleObj.style_id = styles.rows[stylesRowsCount].id;
      styleObj.name = styles.rows[stylesRowsCount].name;
      styleObj.original_price = styles.rows[stylesRowsCount].original_price;
      styleObj.sale_price = styles.rows[stylesRowsCount].sale_price;
      styleObj["default?"] = styles.rows[stylesRowsCount].default_style;
      // styleObj.photos = [];
      // styleObj.skus = {};
      // console.log('q: gSs: sObj: ', styleObj);

      stylesCounter++;
      // console.log('q: gSs: sCntr: sCInLoop: ', stylesCounter);
      allStylesForOneProduct.results.push(styleObj);

//  /*
      let photoArgs = [stylesCounter]; // styleId
      // console.log('q: gSs: pArgs: ', photoArgs);g
      let photoPromise = pool.query('SELECT * FROM photos where style_id = $1', photoArgs)
      .then(photos => {
        // let photoRows = photos.rows[0]; //get rid of [0]
        // styleObj.photos.push(photos.rows);
        // let photoProps = {}
        // console.log('q: gSs: p.rows[sC].url, p.rows[sC].thmbnlUrl: ', photos.rows[stylesCounter].url, photos.rows[stylesCounter].thumbnail_url); // [ {..}, {..}]
        let photosArr = [];
        // let photoItem = {};
        for (photoCounter = 0; photoCounter < photos.rows.length; photoCounter++) {
          let url = photos.rows[photoCounter].url;
          let thumbnail_url = photos.rows[photoCounter].thumbnail_url;
          let photoItem = {url, thumbnail_url};
          photosArr.push(photoItem)
        }
        styleObj.photos = photosArr;
        // styleObj.photos = photos.rows;
        // console.log('q: gSs: sO.photos: ', styleObj.photos);
        // promiseArr.push(photoPromise);
      });
      promiseArr.push(photoPromise);

      
      let skuArgs = [stylesCounter]; // styleId
      let skuPromise = pool.query('SELECT * FROM skus where style_id = $1', skuArgs)
      .then(skus => {
        console.log(skus);
        let skusObj = {};
        for (skuCounter = 0; skuCounter < skus.rows.length; skuCounter++) {
          let size = skus.rows[skuCounter].size;
          let quantity = skus.rows[skuCounter].quantity;
          // console.log('q: gSs: sO.size, sO.qty: ', skusObj.size, skusObj.quantity);
          skusObj[size] = quantity;
          // console.log('q: gSs: sO[size]: ', skusObj[size]);
          styleObj.skus = skusObj;
        }
      });
      promiseArr.push(skuPromise);

// */
      // console.log('q: aSFOP: atEnd', JSON.stringify(allStylesForOneProduct, null, 2))
      // return allStylesForOneProduct;
    }
    const allStylesPromise = Promise.all(promiseArr)
    .then( () => {
      // console.log('q: gSs: allStylesPromise: aSFOP: ', allStylesForOneProduct);
      // return 10;
      return allStylesForOneProduct;
    }); 

    console.log('query duration to complete call [ms]: ', new Date() - entryTime);
    // return allStylesForOneProduct;
    return allStylesPromise;
  })
  .catch((error) => { console.error('error from DB', error); }) // eslint-disable-line
};

const getOnlyStyle = (product_id) => {
  let stylesArgs = [product_id];
  // console.log('q: gOS: product_id ENTERED', product_id);
  return pool.query('SELECT * FROM styles where product_id = $1', stylesArgs)
  .then(styles => {
    return styles.rows;
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};


//getSkus for a style_id
const getSkus = (style_id) => {
  let skusValues = [style_id];
  // console.log('q: gSks: style_id ENTERED', style_id);
  return pool.query('SELECT * FROM skus where style_id = $1', skusValues)
  .then(skus => {
    // console.log('q: gSks r.rs:', skus.rows);
    // return skus.rows[0];
    return skus.rows;
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};

//getPhotos for a style_id
const getPhotos = (style_id) => {
  let photoValues = [style_id];
  // console.log('q: gPhs: style_id ENTERED', style_id);
  return pool.query('SELECT * FROM photos where style_id = $1', photoValues)
  .then(photos => {
    // console.log('q: gPhs r.rs:', photos.rows);
    // return photos.rows[0];
    return photos.rows;
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};

// console.log('q.js: LEAVING');

module.exports = {
  getAllProducts,
  // getOnlyProduct,
  getProduct,
  getFeatures,
  // getAllStyleInfo,
  getStyles,
  getOnlyStyle,
  getSkus,
  getPhotos
}
