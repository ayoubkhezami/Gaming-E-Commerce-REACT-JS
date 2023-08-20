require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { ShoppingCart } = require('../Models/ShoppingCartModel');
const UserModel=require("../Models/UserModel")
const YOUR_DOMAIN = 'http://localhost:3001';

module.exports.checkout = async (req, res) => {
  try {
    
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.cartItems),
      },

    });
  
    const line_items = req.body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            metadata: {
              id: item.product,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });
    
    try {
      const session = await stripe.checkout.sessions.create({
        line_items,
        customer: customer.id,

        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/checkout-success`, // Ajouter le paramètre d'URL ici
        cancel_url: `${YOUR_DOMAIN}/card`,
      });
    
      res.send({ url: session.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
