// schema.shape.js

// A
// shape of schema for SQL and for NoSQL-Reference

const ProductsList = [ // GET /products/list
    {
      "id": null, // NUMBER
      "name": null, // TEXT
      "slogan": null, // TEXT
      "description": null, // TEXT
      "category": null, // TEXT
      "default_price": null, // NUMBER
    }
]

const Product = { // GET /products/:product_id
  "id": null,  // SERIAL, PRIMARY KEY
  "name": null, // TEXT
  "slogan": null, // TEXT
  "description": null, // TEXT
  "category": null, // TEXT
  "default_price": null, // NUMBER // NOTE: API returns only thru default price
  "features": [
    {
      "feature": null, // TEXT
      "value": null // TEXT
    }
  ]
};

const Styles = [ // GET /products/:product_id/styles
  {
    "id": null,  // SERIAL, PRIMARY KEY
    "name": null, // TEXT
    "sale_price": null, // NUMBER
    "original_price": null, // NUMBER
    "default_style": null, // NUMBER 1 or 0
    "photos": [
      {
        "thumbnail": null, // TEXT
        "url": null // TEXT 
      }
    ],
    "skus": {
      "size": null, // TEXT: XS, S, M, L XL
      "quantity": null // NUMBER
    }
  }
]

// WARNING: SOMETHING IS WRONG ABOVE HERE

// B
// shape of schema for NoSQL-Embedded

const Products = [
  {
    "id": null, // NUMBER
    "name": null, // TEXT
    "slogan": null, // TEXT
    "description": null, // TEXT
    "category": null, // TEXT
    "default_price": null, // NUMBER
    "features": [
      {
        "feature": null, // TEXT
        "value": null // TEXT
      }
    ],
    "styles": [
      {
        "id": null,  // SERIAL, PRIMARY KEY
        "name": null, // TEXT
        "sale_price": null, // NUMBER
        "original_price": null, // NUMBER
        "default_style": null, // NUMBER 1 or 0
        "photos": [
          {
            "thumbnail": null, // TEXT
            "url": null // TEXT 
          }
        ],
        "skus": {
          "size": null, // TEXT: XS, S, M, L XL
          "quantity": null // NUMBER
        }
      }
    ]
  }    
]
