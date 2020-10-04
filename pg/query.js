// const { Pool, Client } = require('pg')
const { Pool } = require('pg')
const pool = new Pool({
  database: 'productsdb30',
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
const getProduct = (id) => {
  let productValues = [id];
  // console.log('q: gP: id ENTERED', id);
  return pool.query('SELECT * FROM products WHERE products.id = $1', productValues)
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

// const getAllStyleInfo = (id) => {
//   Promise.all([getStyles(id), getSkus(id), getPhotos(id)])
//     .then((values) => {
//     console.log(values);
//   });
// }

// getAllStyleInfo(99);

const getStyles = (product_id) => {
  let entryTime = new Date();
  // console.log('q: gSs: product_id ENTERED', product_id);

  // const allStylesForOneProduct = {
  //   product_id: product_id,
  //   results: [ /*forEachStyle*/ { id, name, o_p, s_default, photos: [], skus: {} }, {...}, {...} ],
  // };
  const allStylesForOneProduct = {
    product_id: product_id,
    results: [],
  };

  let stylesArgs = [product_id];
  // SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = $1', stylesArgs
  // return pool.query('SELECT *, products.id AS id, skus.id AS sku_id, photos.id AS photo_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = $1', stylesArgs)
  return pool.query('SELECT * FROM styles where product_id = $1', stylesArgs)
  .then(styles => {

    // const stylesRowsLength = styles.rows.length;
    // console.log('q: gSs: sBeforeLoop, sRL: ', stylesRowsLength);
    const styleObjs = {};
    const styleIdsArr = [];
    let stylesCounter = 0;
    let photosCounter = 0;
    let skusCounter = 0;

    console.log('q: gSs: sBeforeLoop, s.r.l: ', styles.rows.length)

    for (let stylesRowsCount = 0; stylesRowsCount < styles.rows.length; stylesRowsCount++) {
      // console.log('q: gSs: sLoopTop, sC: ', stylesRowsCount)
      let styleObj = {};
      styleObj.style_id = styles.rows[stylesRowsCount].id;
      styleObj.name = styles.rows[stylesRowsCount].name;
      styleObj.original_price = styles.rows[stylesRowsCount].original_price;
      styleObj.sale_price = styles.rows[stylesRowsCount].sale_price;
      styleObj.default = styles.rows[stylesRowsCount].default;
      styleObj.photos = [];
      styleObj.skus = {};
      // styleObj.photos = [];
      // styleObj.skus = {};

      // console.log('q: gSs: sObj: ', styleObj);
      // allStyleObjs.foo =
      // allStyleObjs[ 'foo' ] =
      // allStyleObjs[ stylesRowsCount ] =
      // allStyleObjs[ 0 ] =

      // console.log('q: gSs: sCLoopMiddle: sIA, sO.s.id:', styleIdsArr, styleObjs.style_id);
      if (! styleIdsArr.includes(styleObj.style_id)) {
        // if (styleIdsArr.includes(styleObj.style_id)) {
        // } else {
        styleIdsArr.push(styleObj.style_id);
        // styleIdsArrSorted = styleIdsArr.sort((a,b) => a-b);
        stylesCounter++;
        allStylesForOneProduct.results.push(styleObj);
        // console.log('q: gSs: sCntr: sCInLoop: ', stylesCounter);
        // console.log('q: gSs: sIdsArr: sCInLoop: ', styleIdsArr)
      };
      styleObj.photos.push({"url": "pURL_" + stylesCounter}, {"thumbnail_url": "pThumb_" + stylesCounter});
      // allStylesForOneProduct.results[stylesCounter-1].photos.push("p" + stylesCounter);
      // console.log('q: gSs: s.r[1]: ', styles.rows[1])
      // let skuKey = "sku" + stylesCounter;
      styleObj.skus = {"skuKey0": "sku_" + stylesCounter + "_0", "skuKey_1": "sku_" + stylesCounter + "_1"};


      // let photoArgs = styleIdsArr[stylesCounter] // styleId
      // let photoArgs = []; // styleId
      let photoArgs = [stylesCounter] // styleId
      // console.log('q: gSs: pArgs: ', photoArgs);
      // photoArgs.push(styleObj.style_id); // styleId
      // // console.log('q: gSs: sIdsArr[sC]: ', styleIdsArr[stylesCounter]);
      
      // return pool.query('SELECT * FROM photos where style_id = $1', photoArgs)
      // .then(photos => {
      //   console.log('q: gSs:: p.q.Photos:', photos.rows);
      // //   // return photos.rows[0];
      //   styleObj.photos.push(photos);
      //   // allStylesForOneProduct.results[stylesCounter - 1].photos.push(photos);
      //   // photosCounter++;

      // //   // return photos.rows;
      // })
    }
    console.log('q: gSs: sIdsArr: NearEnd: ', styleIdsArr)
    console.log('query duration to complete call [ms]: ', new Date() - entryTime);
    return allStylesForOneProduct;

  })
  .catch((error) => { console.error('error from DB', error); }) // eslint-disable-line
};

  // styleIdsArrSorted = styleIdsArr.sort((a,b) => a-b);
  // console.log('q: gSs: sIdsAr.length: ', styleIdsArr.length);
  // console.log('q: gSs: UNIQUE sIds: ', styleIdsArrSorted[179]);
  // console.log('q: gSs: afterLoop: UNIQUE sIdsArrS: ', styleIdsArrSorted);
  // console.log('q: gSs: aSsFOP: ', allStylesForOneProduct);
  // console.log('q: gSs: sCInLoop: sIdsArr: ', styleIdsArrSorted);
  // console.log('q: gSs: s.r.length: ', styles.rows.length);

    

/*        
  for (let stylesCount = 0; stylesCount < stylesCounter; stylesCount++) {

      // console.log('q: gSs: sCLoop: sC2, sCntr: ', stylesCount2, stylesCounter);
    // const photosIdsArr = [];
    // for (let photosCounter = 0; photosCounter < styles.rows[stylesRowsCount].photos.length; photosCounter++) {
      let photoObj = {
        thumbnail_url: styles.rows[stylesRowsCount].thumbnail_url,
        url: styles.rows[stylesRowsCount].url,
      };
      if (! styleObj.photos.includes(photoTempObj)) {
        styleObj.photos.push(photoTempObj);
        photosCounter++;
      }

      let skuTempObj = {
        size: styles.rows[stylesRowsCount].size,
        quantity: styles.rows[stylesRowsCount].quantity,
      };
      if (! styleObj.skus.hasOwnProperty(skuTempObj)) {
        styleObj.skus = skuTempObj;
        skusCounter++;
      }

    };
*/          
    // allStylesForOneProduct.results.push(styleObj);
    //   // console.log('q: gSs O:', styleObj);
    //   styleObj.photos.push(photoObjs);
    // }

    // for (let skusKey in styles.rows) { // photoCount = 0; photoCount < styles.rows.length; photoCount++) {
    //   let skuObj = {
    //     skusKey: styles.rows[skusKey].value
    //   }
    //       // console.log('q: gP fO:', styleObj);
    //   styleObj.photos.push(photoObjs);
    // }

    //   for (let photosCounter = 0; photosCounter < styles.rows[stylesRowsCount].photos.length; photosCounter++) {
    //     let photoTempObj = {
    //       thumbnail_url: styles.rows[stylesRowsCount].thumbnail_url,
    //       url: styles.rows[stylesRowsCount].url,
    //     };
    //     if (! styleObj.photos.includes(photoTempObj)) {
    //       styleObj.photos.push(photoTempObj);
    //       photosCounter++;
    //     }
    //   }
    // }
    
        
      // console.log('q: gP pI:', allStylesForOneProduct);
        // return allStylesForOneProduct;
    // console.log('q: gS r.rs:', styles.rows);
    // return styles.rows[0];
    // return styles.rows;
    // console.log('query duration to complete call [ms]: ', new Date() - entryTime);

    // return styleObj;
    // return allStylesForOneProduct.results[1];
    // return allStylesForOneProduct.results[179];
//     return allStylesForOneProduct.results;
//   })
//   .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
// };


const getStylesOld = (product_id) => {
  let stylesArgs = [product_id];
  // console.log('q: gSs: product_id ENTERED', product_id);
  // SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id WHERE products.id = $1', stylesArgs
  return pool.query('SELECT * FROM styles where product_id = $1', stylesArgs)
  // SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id  WHERE products.id = $1', stylesValues)
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
  getProduct,
  getFeatures,
  // getAllStyleInfo,
  getStyles,
  getStylesOld,
  getSkus,
  getPhotos
}
