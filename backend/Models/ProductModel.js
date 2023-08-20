const mongoose = require('mongoose')
const GenreSchema = require('./GenreModel')

const ProductSchema = mongoose.Schema({

    name : {
        type:String,
        required:true,
        unique:true
    },
    description : String,
    category:{
        type: String,
        enum : ['cosmetics', 'electronics', 'clothes']
         },
    qty : {
        type:Number ,
        required:true
    },
    image : String,
    game_title :String,
    price : Number,
    genre: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Genre', 
      },
    
    



})
module.exports=mongoose.model('Product',ProductSchema)
