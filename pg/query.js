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
  let stylesValues = [product_id];
  // console.log('q: gSs: product_id ENTERED', product_id);
  // SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id  WHERE products.id = 
  // return pool.query('SELECT * FROM styles where product_id = $1', stylesValues)
  return pool.query('SELECT * FROM products INNER JOIN styles ON products.id = styles.product_id INNER JOIN skus ON styles.id = skus.style_id INNER JOIN photos ON styles.id = photos.style_id  WHERE products.id = $1', stylesValues)
  .then(styles => {
    return styles.rows;
  })
  .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
};
        // console.log('q: gP: product.rows: ', product.rows);
        // const stylesInfo = {
        //   product_id: styles.rows[0].product_id,
        //   results: [],
        // };
        // console.log('q: gP: p.r[0].feature: ', styles.rows[0].feature)
        // console.log('q: gP: p.r[0].value: ', styles.rows[0].value)
        // console.log('q: gP: p.r[1].feature: ', styles.rows[1].feature)
        // console.log('q: gP: p.r[1].value: ', styles.rows[1].value)
        // for (let styleCount = 0; styleCount < styles.rows.length; styleCount++) {
        //   let stylesObj = {
        //     style_id: styles.rows[styleCount].style_id,
        //     name: styles.rows[0].name,
        //     original_price: styles.rows[0].original_price,
        //     sale_price: styles.rows[0].sale_price,
        //     default: styles.rows[styleCount].default,
        //     photos: [],
        //     skus: {},
        //   }
        //   for (let photoCount = 0; photoCount < styles.rows.length; photoCount++) {
        //     let photoObj = {
        //       thumbnail_url: styles.rows[photoCount].thumbnail_url,
        //       url: styles.rows[photoCount].url,
        //     }
                // console.log('q: gP fO:', stylesObj);
          // stylesInfo.photos.push(photoObj);
        // }
        // console.log('q: gP pI:', stylesInfo);
        // return stylesInfo;
    // console.log('q: gS r.rs:', styles.rows);
    // return styles.rows[0];
    // return styles.rows;
//   })
//   .catch((error) => { console.error('error from DB', error); }); // eslint-disable-line
// };

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
  getSkus,
  getPhotos
}
