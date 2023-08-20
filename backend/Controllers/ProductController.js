const ProductModel=require('../Models/ProductModel')
const GenreModel=require('../Models/GenreModel')
const ReviewModel=require('../Models/ReviewModel')

module.exports.get = async (req, res) => {
  try {
    // Fetch all products
    const products = await ProductModel.find().lean();

    const productIds = products.map((product) => product._id);
    const reviews = await ReviewModel.find({ productId:productIds });

    const reviewsByProductId = {};
    reviews.forEach((review) => {
      if (!reviewsByProductId[review.productId]) {
        reviewsByProductId[review.productId] = [];
      }
      reviewsByProductId[review.productId].push(review);
    });

    products.forEach((product) => {
      const productReviews = reviewsByProductId[product._id];
      if (productReviews) {
        product.reviews = productReviews;
      } else {
        product.reviews = []; 
      }
    });

    res.send(products);
  } catch (err) {
    return res.status(500).json({ err: 'Internal server error' });
  }
};
module.exports.getgenre= async (req,res)=>{
    try {
      // Fetch all products and populate the genre field
      const products = await ProductModel.find().populate('genre').lean();
  
      
      
  
      res.send(products);
    } catch (err) {
      return res.status(500).json({ err: 'Internal server error' });
    }
  }



module.exports.save= async(req,res)=>{

    const {name,description,category,qty,image,game_title,price,genre} = req.body
    try{
      const Genrename= await GenreModel.findOne({name:genre})
      let Objectid=Genrename._id
    ProductModel
    .create({name,description,category,qty,image,game_title,price,genre:Objectid})
    .then((data)=>{
        console.log("Product has been added to the inventory...")
        res.send(data);
    })}
    catch(err){
      return res.status(500).json({ err: 'Internal server error' });
    }
}

module.exports.update= async(req,res)=>{

    const {_id,qty,image,price}= req.body
    if(!image){
      ProductModel
      .findByIdAndUpdate(_id,{qty,price})
      .then(()=>(res.send("product information updated SUCCESSFULLY...")))
      .catch((err)=>{
        console.log(`Error while updating info for product : ${_id} :${err}`)
})
    }
    else{
    ProductModel
    .findByIdAndUpdate(_id,{qty,image,price})
    .then(()=>{res.send("product information updated sucessfully...")})
    .catch((err)=>{
            console.log(`Error while updating info for product : ${_id} :${err}`)
    })}
}


module.exports.delete= async(req,res)=>{

    const {_id,name} = req.body
    ProductModel
    .findByIdAndDelete(_id)
    .then(()=>{res.status(201).send("product deleted sucessfully...")})
    .catch((err)=>{
            console.log(`Error while deleting ${name}'s account :${err}`)
    })
} 

module.exports.findone = async (req, res) => {
    const { id } =req.query;
    console.log( id);
  

    try {
      const product = await ProductModel.findOne({

        _id: id
      });
      const reviews = await ReviewModel.find({ productId:product._id });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.send(product);
      }
    } catch (err) {
      return res.status(500).json({ err: 'Internal server error' });
    }
  };

  module.exports.review = async (req, res) => {
    try {
      const rating = req.body.rating;
      const productId = req.params.productId;
      const userId = req.body.id; // Assuming you have a middleware that sets the authenticated user ID in req.user.id
  
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      let review = await ReviewModel.findOne({ productId });
  
      if (review) {
        if (review.userId.includes(userId)) {
          return res.status(400).json({ error: 'You have already rated this product' });
        }
  
        review.totalReviews += 1;
        review.ratingtotal += rating;
        review.rating = (review.ratingtotal / review.totalReviews).toFixed(1);
        review.userId.push(userId);
      } else {
        review = new ReviewModel({ productId, rating });
        review.totalReviews = 1;
        review.ratingtotal = rating;
        review.userId = [userId];
      }
  
      await review.save();
  
      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  