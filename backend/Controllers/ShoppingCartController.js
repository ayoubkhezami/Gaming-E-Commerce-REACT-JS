const { ShoppingCart, CartItem} = require('../Models/ShoppingCartModel')
const session = require('express-session');
const UserModel = require('../Models/UserModel');

const ProductModel = require('../Models/ProductModel');
require('dotenv').config();
const nodemailer = require('nodemailer');

  async function sendEmail(emailAddress, subject, message) {
    const transporter = nodemailer.createTransport({
      // Add your email service provider's configuration here
      // Example for Gmail:
      service: 'Gmail',
      auth: {
        user: process.env.user, // Replace with your email address
        pass: process.env.pass, // Replace with your email password
      },
    });
  
    const mailOptions = {
      from: process.env.user, // Replace with your email address
      to: emailAddress,
      subject: subject,
      html: message,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');
    } catch (error) {
      console.error('Error sending email:', error);
    }}


module.exports.save = async (req, res) => {
  const { items, totalprice, username, IdUser } = req.body;

  const client = username;
  const user = await UserModel.findOne({ username: client });

  if (!user || client !== user.username) {
    return res.status(401).json({ error: "Session isn't valid" });
  }

  try {
    // Find the user's existing cart if it exists
    let cart = await ShoppingCart.findOne({ client: IdUser, orderStatus: false });

    if (!cart) {
      // If no cart exists or the existing cart has orderStatus true, create a new one
      const cartItems = [];

      for (const item of items) {
        const { product, name, quantity, price} = item;
        const productExists = await ProductModel.findById(product);
        if (!productExists) {
          return res.status(400).json({ error: 'Product not found' });
        }
        const cartItem = new CartItem({
          product,
          name,
          quantity,
          price,
          
        });
        cartItems.push(cartItem);
      }

      // Calculate the total price of the cart based on cart items
      let calculatedTotalPrice = 0;
      for (const item of cartItems) {
        calculatedTotalPrice += item.quantity * item.price;
      }

      // Check if the calculated total price matches the provided total price
      if (totalprice !== calculatedTotalPrice) {
        return res.status(400).json({ error: 'Total price does not match the sum of cart items' });
      }

      // Create a new cart document
      cart = new ShoppingCart({
        items: cartItems,
        totalprice,
        client: IdUser, // Store the user's ID as the client for the cart
      });
    } else {
      // If cart exists and orderStatus is false, handle updating or adding new items
      for (const item of items) {
        const { product, name, quantity, price } = item;
        const existingItemIndex = cart.items.findIndex(cartItem => cartItem.product.toString() === product);
        if (existingItemIndex !== -1) {
          // If the item already exists in the cart, update it
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // If the item doesn't exist in the cart, create a new one
          const productExists = await ProductModel.findById(product);
          if (!productExists) {
            return res.status(400).json({ error: 'Product not found' });
          }
          const cartItem = new CartItem({
            product,
            name,
            quantity,
            price,
            
          });
          cart.items.push(cartItem);
        }
      }

      // Calculate the total price of the cart based on updated cart items
      cart.totalprice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    }

    // Save the cart to the database or update the existing cart
    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};






module.exports.update = async (req, res) => {
  const { cartItemId, quantity, cartId } = req.body;

  try {
    const cart = await ShoppingCart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItemIndex = cart.items.findIndex(item => item.id === cartItemId);

    if (cartItemIndex === -1) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cart.items[cartItemIndex].quantity = quantity;

    await cart.save();

    cart.totalprice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports.deleteAll =  async (req,res)=>{
    //id passed is the shopping cart Id 
    const {_id} = req.body
    ShoppingCart
    .findByIdAndDelete(_id)
    .then(()=>{res.status(201).send("cart has been emptied...")})
    .catch((err)=>{
            console.log(`Error while emptying the shopping cart :${err}`)
    })

}
module.exports.deleteOne =  async (req,res)=>{
    const { cartId, cartItemId } = req.body;

    try {
  
      const cart = await ShoppingCart.findById(cartId);
  

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  

      const cartItemIndex = cart.items.findIndex(item => item.id === cartItemId);
  
      if (cartItemIndex === -1) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      cart.items.splice(cartItemIndex, 1);
      cart.totalprice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

      await cart.save();
  
      return res.status(200).json({ message: 'Cart item deleted successfully', cart });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

//admin 
module.exports.get =  async (req,res)=>{
    const cart = await ShoppingCart.find()
    res.send(cart)
}
module.exports.findone= async(req,res)=>{
    const { id,username } = req.body;

   
    try {
    
        const shoppingcart = await ShoppingCart.find({
            _id:id,
            client:username

        });
        if (!shoppingcart) {
            res.status(404).json({ error: 'there is no shopping cart for this user' });
        } else {
            res.send(shoppingcart);
        }
        } catch (err) {
        return res.status(500).json({ err: 'Internal server error' });
        }

}

module.exports.findmany = async (req, res) => {
  const { IdUser } = req.query;

  try {
    // Fetch the shopping cart items with orderStatus: false
    const shoppingcart = await ShoppingCart.find({
      client: IdUser,
      orderStatus: false,
    });

    if (!shoppingcart || shoppingcart.length === 0) {
      return res.status(404).json({ error: 'There is no shopping cart for this user with orderStatus: false' });
    }

    res.send( shoppingcart );
  } catch (err) {
    return res.status(500).json({ err: 'Internal server error' });
  }
};
module.exports.history = async (req, res) => {
  const { IdUser } = req.query;

  try {
    // Fetch the shopping cart items with orderStatus: false
    const shoppingcart = await ShoppingCart.find({
      client: IdUser,
      orderStatus: true,
    });

    if (!shoppingcart || shoppingcart.length === 0) {
      return res.status(404).json({ error: 'There is no shopping cart for this user with orderStatus: true' });
    }

    res.send( shoppingcart );
  } catch (err) {
    return res.status(500).json({ err: 'Internal server error' });
  }
};

//Cash
module.exports.Cash= async(req,res)=>{
  const {Username,id,location}=req.body
  const {cartId}=req.params
  const Newdate = new Date()

  try{
    const client= await UserModel.findOne({username:Username,_id:id})
    if(!client){
      console.log("Client not found ")
    }
    else{
        ShoppingCart
        .findByIdAndUpdate(cartId,{orderStatus:true,location:location,date:Newdate,MethodePay:"Cash"})
        .then(async ()=>{
          const userEmail = client.email; 
          try {
          const shopping = await  ShoppingCart.findOne({
            _id:cartId,
            client: id,
            orderStatus: true,
          });
     
          if (shopping && shopping.items) {
            // Shopping cart found and has items
            const items = shopping.items;
            const emailMessage = `<!DOCTYPE html>
            <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
            
            <head>
              <title></title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
              <style>
                * {
                  box-sizing: border-box;
                }
            
                body {
                  margin: 0;
                  padding: 0;
                }
            
                a[x-apple-data-detectors] {
                  color: inherit !important;
                  text-decoration: inherit !important;
                }
            
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                }
            
                p {
                  line-height: inherit
                }
            
                .desktop_hide,
                .desktop_hide table {
                  mso-hide: all;
                  display: none;
                  max-height: 0px;
                  overflow: hidden;
                }
            
                .image_block img+div {
                  display: none;
                }
            
                @media (max-width:685px) {
                  .mobile_hide {
                    display: none;
                  }
            
                  .row-content {
                    width: 100% !important;
                  }
            
                  .stack .column {
                    width: 100%;
                    display: block;
                  }
            
                  .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                  }
            
                  .desktop_hide,
                  .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                  }
                }
              </style>
            </head>
            
            <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
              <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                            <div class="alignment" align="center" style="line-height:10px"><a  target="_blank" style="outline:none" tabindex="-1"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/1029529_1014515/editor_images/55ec2d3f-0138-46ed-8749-c56b2148f1f1.png" style="display: block; height: auto; border: 0; max-width: 200px; width: 100%;" width="200" alt="Logo" title="Logo"></a></div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4d1e2; border-radius: 0; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                            <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/821/image-01_5.png" style="display: block; height: auto; border: 0; max-width: 266px; width: 100%;" width="266" alt="Image" title="Image"></div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:30px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #0c2b5b; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:38px;"><strong>Dear ${Username},</strong></span></p>
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">&nbsp;</p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #0c2b5b; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><strong><span style="font-size:22px;">THANKS FOR YOUR PAYMENT!</span></strong></p>
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:58px;"><strong>😉</strong></span></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #763b54; border-radius: 0; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 30px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="width:100%;">
                                            <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/821/icon-01_2.png" style="display: block; height: auto; border: 0; max-width: 24px; width: 100%;" width="24" alt="Image" title="Image"></div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:15px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 21px; color: #ffffff; line-height: 1.5;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Invoice No:</p>
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><strong>${shopping._id}</strong></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad" style="width:100%;">
                                            <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/821/icon-03_2.png" style="display: block; height: auto; border: 0; max-width: 25px; width: 100%;" width="25" alt="Image" title="Image"></div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 21px; color: #ffffff; line-height: 1.5;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Amount Due:</p>
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><strong>${shopping.totalprice + 10 } $</strong></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9b4d6e; color: #000; border-radius: 0; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="66.66666666666667%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 30px; padding-right: 30px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 16.8px;"><span style="font-size:20px;"><strong>Client:</strong></span></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 21px; color: #ffffff; line-height: 1.5;">
                                                <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;">ID: ${id}</p>
                                                <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;">Location ${location}</p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 35px; padding-top: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 21px; color: #ffffff; line-height: 1.5;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Amount Due:<br>Subtotal+delivery(10$)</p>
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><strong>${shopping.totalprice + 10 } $</strong></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9b4d6e; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><strong>No.</strong></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><strong>ITEM DESCRIPTION</strong></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-3" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><strong>PRICE</strong></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-4" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><strong>QTY</strong></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                                                ${items.map((item, index) =>`
            
                              <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9b4d6e; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #6DA3CD; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">${index + 1}</p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-2" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #6DA3CD; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">${item.name}</p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-3" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #6DA3CD; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">${item.price} $</p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td class="column column-4" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #6DA3CD; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;">${item.quantity}</p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                                                `)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9b4d6e; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="paragraph_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#ffffff;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:19.2px;">
                                              <p style="margin: 0;">Subtotal : ${shopping.totalprice} $</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9b4d6e; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="button_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center"><w:anchorlock/><v:textbox inset="5px,0px,0px,0px"><center style="color:#000000; font-family:Tahoma, Verdana, sans-serif; font-size:16px"><a href="http://localhost:3000/Shop" target="_blank" style="text-decoration:none;display:inline-block;color:#000000;background-color:#ffde79;border-radius:21px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:10px;padding-bottom:10px;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:25px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break:break-word;"><span style="line-height: 32px;" data-mce-style><strong>Go Back to Shopping 🛒</strong></span></span></span></a></div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <h1 style="margin: 0; color: #8a3c90; direction: ltr; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Question or Need Help?</strong></h1>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="divider_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="pad">
                                            <div class="alignment" align="center">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="60%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                <tr>
                                                  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 2px solid #000000;"><span>&#8202;</span></td>
                                                </tr>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                      <table class="paragraph_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="color:#101112;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">
                                              <p style="margin: 0; margin-bottom: 12px;"><strong>📞Call Us: +216 24611837&nbsp; </strong></p>
                                              <p style="margin: 0; margin-bottom: 12px;"><strong>OR </strong></p>
                                              <p style="margin: 0;"><strong>📨 Send Email: chattichiheb35@gmail.com</strong></p>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tbody>
                          <tr>
                            <td>
                              <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 665px; margin: 0 auto;" width="665">
                                <tbody>
                                  <tr>
                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                      <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                        <tr>
                                          <td class="pad">
                                            <div style="font-family: sans-serif">
                                              <div class style="font-size: 14px; font-family: 'Lato', Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 16.8px; color: #555555; line-height: 1.2;">
                                                <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:11px;"><strong>Copyrights © Company All Rights Reserved</strong></span></p>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table><!-- End -->
            </body>
            
            </html>`;
            const emailSubject = 'Payment receipt';
       

            sendEmail(userEmail, emailSubject, emailMessage)
          } else {
            // Shopping cart not found or doesn't have items
            console.log("Shopping cart not found or has no items.");
          }

 
        }catch (error) {
          console.log('Error encountered during fetching shopping cart:', error);
        }
        })
        .then(()=>{
          res.send("Order has been delivered => deleting order from the list  ...")}
        )

    }


  }
  catch(error){
    console.log('Error encountered during transaction:'+error)
  }
}

//update adress for payment par card
module.exports.address=async (req,res)=>{
  const { id } = req.params;
  const { location } = req.body;

  ShoppingCart
  .findByIdAndUpdate(id,{location:location})
  .then(()=>{res.send("Location Add  ...")
                  })
  .catch((err)=>{
          console.log(`Error while updating info for product `)
  })
}

module.exports.order=async (req,res)=>{
  const { cartId } = req.params;
  ShoppingCart
  .findByIdAndUpdate(cartId,{PayStatus:true,orderStatus:true,MethodePay:"card"})
  .then(()=>{res.send("Order has been delivered => deleting order from the list  ...")
                  })
  .catch((err)=>{
          console.log(`Error while updating info for product `)
  })
}

module.exports.Monthlyrevenue = async (req, res) => {
  try {
    const revenueByMonth = await ShoppingCart.aggregate([
      {
        $match: {
          PayStatus: true // Filter documents with PayStatus true
        }
      },
      {
        $project: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          totalprice: 1,
        },
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          totalRevenue: { $sum: '$totalprice' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.send({ revenueByMonth });
  } catch (error) {
    console.log("error encountered....");
    throw error;
  }
};

module.exports.DailyRevenue = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day
  
  try {
    const revenueForToday = await ShoppingCart.aggregate([
      {
        $match: {
          date: { $gte: today }, // Filter documents with date greater than or equal to today
          PayStatus: true, // Additional condition
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalprice' },
        },
      },
    ]);
    
    const revenueByYear = await ShoppingCart.aggregate([
      {
        $match: {
          PayStatus: true, // Additional condition
        },
      },
      {
        $group: {
          _id: { $year: '$date' }, // Group by year
          total: { $sum: '$totalprice' },
        },
      },
      {
        $sort: { _id: 1 }, // Sort the results by year in ascending order
      },
    ]);
    
    const dailyRevenue = revenueForToday.length > 0 ? revenueForToday[0].totalRevenue : 0;
    const total = revenueByYear.reduce((acc, yearData) => acc + yearData.total, 0);
    
    res.send({ dailyRevenue, total });
  } catch (error) {
    console.log("Error encountered:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.ProductsQuantity = async (req, res) => {
  try {
    const soldProducts = await ShoppingCart.aggregate([
      {
        $match: { PayStatus: true } // Filtrer les paniers avec PayStatus à true
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.name', // Grouper par nom du produit

          totalQuantitySold: { $sum: '$items.quantity' }
        }
      }
    ]);

    res.json({ soldProducts });
  } catch (error) {
    console.error('Error calculating sold quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


