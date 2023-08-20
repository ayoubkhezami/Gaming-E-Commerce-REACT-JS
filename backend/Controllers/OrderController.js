const OrderModel = require("../Models/OrderModel");
const UserModel = require("../Models/UserModel")
const {ShoppingCart} =require("../Models/ShoppingCartModel")

module.exports.get=async (req,res)=>{
    const orders= await OrderModel.find()
    console.log(orders)
    res.send(orders)
}
module.exports.save =async (req,res)=>{
    const {shoppingcart,orderby} = req.body
    try{
      const client= await UserModel.findOne({username:orderby})
      const cart=await ShoppingCart.findOne({_id:shoppingcart})
      if(cart){console.log("couldn't find anything")}
    OrderModel
    .create({shoppingcart:cart._id,orderby:client._id})
    .then((data)=>{
        console.log("Product has been added to the inventory...")
        console.log(data)
        res.send(data);
    })}
    catch(err){
      return res.status(500).json({ err: 'Internal server error' });
    }
    }

module.exports.update=async (req,res)=>{
    const {_id}= req.body
    OrderModel
    .findByIdAndUpdate(_id,{orderStatus:true})
    .then(()=>{res.send("Order has been delivered => deleting order from the list  ...")
                    })
    .catch((err)=>{
            console.log(`Error while updating info for product : ${_id} :${err}`)
    })
}
module.exports.delete=async (req,res)=>{
        const {_id,orderby} = req.body
        OrderModel
        .findByIdAndDelete(_id)
        .then(()=>{res.status(201).send("order deleted sucessfully...")})
        .catch((err)=>{
                console.log(`Error while deleting ${orderby}'s order :${err}`)
        })
      }
module.exports.findone=async (req,res)=>{
    const { orderby, id } = req.params;
    console.log(orderby, id);

    const client= await UserModel.findOne({username:orderby})
    if (client){
        console.log(`Client found :${client}`)
    
    {
        try {
            
            const order = await OrderModel.findById({
                _id:id,
                orderby:orderby

            });
            console.log(order);
            if (!order) {
                res.status(404).json({ error: 'order not found' });
            } else {
                res.send(order);
            }
            } catch (err) {
            return res.status(500).json({ err: 'Internal server error' });
            }}
        }}
module.exports.findmany=async (req,res)=>{
        const { orderby} = req.params;
        console.log(orderby);
        
        const client= await UserModel.findOne({username:orderby})
        if (client){
            console.log(`Client found ${client}`)
        
            {
             try {
                    const order = await OrderModel.find({
                       orderby:client._id
        
                    });
                    console.log(order);
                    if (!order) {
                        res.status(404).json({ error: 'order not found' });
                    } else {
                        res.send(order);
                    }
                    } catch (err) {
                    return res.status(500).json({ err: 'Internal server error' });
                    }}
                }}
module.exports.History=async (req,res)=>{
    const { orderby} = req.body;
    const carts=[]
    console.log(orderby);    
         try {  
            const client= await UserModel.findOne({username:orderby})
            if (client){
                console.log(`Client found ${client}`)}
                const order = await OrderModel.find({
                   orderby:client._id,
                   orderStatus:true
    
                });

                
               
                
                if (!order) {
                    res.status(404).json({ error: 'order not found' });
                } else {
                    await Promise.all(order.map(async(item)=>{
                        const cart =await ShoppingCart.findById(item.shoppingcart)
                        if (cart){
                            carts.push(cart)

                        }
                    }))
                   
                    res.send(carts)
                }
                } catch (err) {
                return res.status(500).json({ err: 'Internal server error' });
                }
            }
