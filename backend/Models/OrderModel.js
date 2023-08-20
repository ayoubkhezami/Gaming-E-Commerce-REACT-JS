const mongoose = require('mongoose')
const shoppingcart = require('./ShoppingCartModel')
const user=require('./UserModel')
const orderSchema = new mongoose.Schema({
   
      shoppingcart: 
        {
          type: mongoose.Schema.Types.ObjectId,
          required:true
        },
      
      orderby: {
        type:mongoose.Schema.Types.ObjectId,
        require:true
      },
      orderStatus: {
        type: Boolean,
        default:false
    }},{
        
            timestamps: true,
          

    })

module.exports=mongoose.model('Order',orderSchema)