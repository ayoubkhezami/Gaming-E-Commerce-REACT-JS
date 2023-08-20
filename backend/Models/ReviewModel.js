const mongoose = require('mongoose');
require('./ProductModel')

const reviewSchema = new mongoose.Schema(
    {
  productId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Product', required: true 
    },
    userId:[{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'userRole', required: true 
    } 
    ],
  rating: { type: Number, required: true },
  totalReviews: { type: Number, required: true },
  ratingtotal: { type: Number, required: true },

    }
    );

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
