const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// drop if exists command?
const productsSchema = new Schema(
  [
    {
      id: Number,
      name: String,
      slogan: String,
      description: String,
      category: String,
      default_price: Number,
      features: [
        {
          feature: String,
          value: String,
        }
      ],
      styles: [
        {
          id: Number,
          name: String,
          sale_price: Number,
          original_price: Number,
          default_style: Number,
          photos: [
            {
              thumbnail: String,
              url: String, 
            }
          ],
          skus: {
            size: String,
            quantity: Number,
          }
        }
      ]
    }    
  ]
);
