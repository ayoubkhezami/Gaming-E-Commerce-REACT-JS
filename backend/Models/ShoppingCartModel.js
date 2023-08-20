const mongoose = require('mongoose');
const UserSchema = require('./UserModel');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },

  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  totalprice: Number,
  delivery: {
    type: Boolean,
    default: false,
  },
  orderStatus: {
    type: Boolean,
    default: false,
  },
  PayStatus: {
    type: Boolean,
    default: false,
  },
  MethodePay: {
    type: String,
    default:'Unknown', 
  },
  location: {
    type: String,
    default:'Unknown', 
  },
  client: {
    type: String,
    ref: 'userRole',
  },
  date: {
    type: Date,
    default: Date.now, 
  },
});

const ShoppingCart = mongoose.model('ShoppingCart', cartSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = {
  ShoppingCart,
  CartItem,
};
