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

  let stylesArgs = [product_id];
  // console.log('q: gSs: product_id ENTERED', product_id);
  // SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = $1', stylesArgs
  return pool.query('SELECT *, products.id AS id, skus.id AS sku_id, photos.id AS photo_id FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id WHERE products.id = $1', stylesArgs)
  .then(styles => {
        // console.log('q: gP: product.rows: ', product.rows);
        const allStylesObjs = {
          product_id: product_id,
          results: [],
        };

        // const allStylesObjs = {
        //   product_id: product_id,
        //   results: [{ eachStyle: { fooA, fooB, ..., photos: [], skews: {} }}],
        //   results: [ { style_id, name, ..., photos: [], skews: {} }, {...}, {...} ],
        // };
        const stylesObj = {};
        const styleIdsArr = [];
        let styleCounter = 0;
        let photoCounter = 0;
        let skuCounter = 0;

        // console.log('q: gSs: sLoopTop, s.r.l: ', styles.rows.length)

        for (let styleCount = 0; styleCount < styles.rows.length; styleCount++) {
          // console.log('q: gSs: sLoopTop, sC: ', styleCount)
          // const stylesObj = {
            // style_id: styles.rows[styleCount].id,
            // name: styles.rows[styleCount].name,
            // original_price: styles.rows[styleCount].original_price,
            // sale_price: styles.rows[styleCount].sale_price,
            // default: styles.rows[styleCount].default,
            // photos: [],
            // skus: {},
          // }
          stylesObj.style_id = styles.rows[styleCount].id;
          stylesObj.name = styles.rows[styleCount].name;
          stylesObj.original_price = styles.rows[styleCount].original_price;
          stylesObj.sale_price = styles.rows[styleCount].sale_price;
          stylesObj.default = styles.rows[styleCount].default;
          stylesObj.photos = [];
          stylesObj.skus = {};
        // console.log('q: gSs: sObj: ', stylesObj);
          // allStyleObjs.foo =
          // allStyleObjs[ 'foo' ] =
          // allStyleObjs[ styleCount ] =
          // allStyleObjs[ 0 ] =

          // console.log('q: gSs: sCLoopMiddle: sIA, sO.s.id:', styleIdsArr, stylesObj.style_id);
          if (! styleIdsArr.includes(stylesObj.style_id)) {
            styleIdsArr.push(stylesObj.style_id);
            styleIdsArrSorted = styleIdsArr.sort((a,b) => a-b);
            styleCounter++;
            console.log('q: gSs: sCLoop: sCntr: ', styleCounter);
          };
          // console.log('q: gSs: s.r[0]: ', styles.rows[0])
          // console.log('q: gSs: s.r[1]: ', styles.rows[1])

          for (let styleCount2 = 0; styleCount2 < styleCounter; styleCount2++) {

            // console.log('q: gSs: sCLoop: sC2, sCntr: ', styleCount2, styleCounter);
            // const photosIdsArr = [];
          // for (let photoCounter = 0; photoCounter < styles.rows[styleCount].photos.length; photoCounter++) {
            let photoTempObj = {
              thumbnail_url: styles.rows[styleCount].thumbnail_url,
              url: styles.rows[styleCount].url,
            };
            if (! stylesObj.photos.includes(photoTempObj)) {
              stylesObj.photos.push(photoTempObj);
              photoCounter++;
            }

            let skuTempObj = {
              size: styles.rows[styleCount].size,
              quantity: styles.rows[styleCount].quantity,
            };
            if (! stylesObj.skus.hasOwnProperty(skuTempObj)) {
              stylesObj.skus = skuTempObj;
              skuCounter++;
            }

          };
          allStylesObjs.results.push(stylesObj);
          //   // console.log('q: gSs O:', styleObjs);
          //   stylesObj.photos.push(photoObjs);
          // }

          // for (let skusKey in styles.rows) { // photoCount = 0; photoCount < styles.rows.length; photoCount++) {
          //   let skuObj = {
          //     skusKey: styles.rows[skusKey].value
          //   }
          //       // console.log('q: gP fO:', styleObjs);
          //   stylesObj.photos.push(photoObjs);
          // }
        }
        console.log('q: gSs: s.r.length: ', styles.rows.length);
        // console.log('q: gSs: s.r[0]: ', styles.rows[0]);
        // console.log('q: gSs: s.r[0]: ', styles.rows[1]);
        // console.log('q: gSs: s.r[0]: ', styles.rows[2]);
        // console.log('q: gSs: s.r[0]: ', styles.rows[100]);
        // console.log('q: gSs: s.r[1]: ', styles.rows[1]);
        console.log('q: gSs: sIdsAr.length: ', styleIdsArr.length);
        console.log('q: gSs: UNIQUE sIds: ', styleIdsArrSorted);
      // console.log('q: gP pI:', allStylesObjs);
        // return allStylesObjs;
    // console.log('q: gS r.rs:', styles.rows);
    // return styles.rows[0];
    // return styles.rows;
    console.log('query duration to complete call [ms]: ', new Date() - entryTime);

    // return stylesObj;
    return allStylesObjs.results[1];
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};


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
