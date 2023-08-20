const UserModel=require("../Models/UserModel")
const nodemailer = require('nodemailer');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const { generatorOTP ,mailTransport,generateToken } = require('./utils/mail.js')
const verficationToken  = require('../Models/token.js')
const mongoose = require('mongoose');
const { v4: uuidv4} =require('uuid');
const path = require('path');


module.exports.get= async(req,res)=>{
    const users= await UserModel.find()
    res.send(users)
       
}
module.exports.findOne = (req, res) => {
  const {  id } = req.query;

  UserModel.findById(id)
  .then(user => {
      if(!user) {
          return res.status(404).send({
              message: "user not found with id " + id
          });            
      }
      res.send(user);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "user not found with id " + id
          });                
      }
      return res.status(500).send({
          message: "Error retrieving user with id " + id
      })
  });
};

module.exports.save = async (req, res) => {
  const { username, email, phone_number, profileImage, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Please provide all required fields.' });
    return;
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({ message: 'Error occurred while encrypting the password.' });
      return;
    }

    const otp = generatorOTP();

    UserModel.create({
      username,
      email,
      phone_number,
      password: hashedPassword,
      role: { name: 'userRole' },
      profileImage,
      emailToken: otp,
    })
    .then(data => {
      // res.send(data);
      sendVerificationEmail(data,res);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    });
});
};
const sendVerificationEmail =({_id , email,emailToken},res)=>{
  const currentUrl ="http://localhost:5000";
  const mailOptions ={
    from : 'swiftcodeentreprise@gmail.com',
    to : email,
    subject:'verify your account ',
    html:`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
    
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <title></title>
    
      <style type="text/css">
        @media only screen and (min-width: 620px) {
          .u-row {
            width: 600px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }
          .u-row .u-col-100 {
            width: 600px !important;
          }
        }
        
        @media (max-width: 620px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
          .u-row {
            width: 100% !important;
          }
          .u-col {
            width: 100% !important;
          }
          .u-col>div {
            margin: 0 auto;
          }
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }
        
        p {
          margin: 0;
        }
        
        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }
        
        * {
          line-height: inherit;
        }
        
        a[x-apple-data-detectors='true'] {
          color: inherit !important;
          text-decoration: none !important;
        }
        
        table,
        td {
          color: #000000;
        }
        
        #u_body a {
          color: #0000ee;
          text-decoration: underline;
        }
      </style>
    
    
    
      <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
    
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                        <img align="center" border="0" src="https://assets.unlayer.com/projects/175033/1690735215882-160224.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 44%;max-width: 264px;"
                                          width="264" />
    
                                      </td>
                                    </tr>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
    
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #642057;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
    
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 6px dotted #000000;border-left: 6px dotted #000000;border-right: 6px dotted #000000;border-bottom: 6px dotted #000000;">
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                        <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;"
                                          width="150.8" />
    
                                      </td>
                                    </tr>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 140%;"><strong>T H A N K S&nbsp; &nbsp;F O R&nbsp; &nbsp;S I G N I N G&nbsp; &nbsp;U P !</strong></p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 28px; line-height: 39.2px;"><strong><span style="line-height: 39.2px; font-size: 28px;">Verify Your E-mail Address </span></strong>
                                      </span>
                                    </p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
    
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 22px; line-height: 35.2px;">Hi,${email} </span></p>
                                    <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;">You're almost ready to get started. Please click on the button below to verify your email address and enjoy exclusive cleaning services with us! </span></p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div align="center">
                                    <a href=${currentUrl + "/verify/"+  _id + "/" +emailToken} target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #b96ad9; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                      <span style="display:block;padding:14px 44px 13px;line-height:120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong><span style="line-height: 19.2px; font-size: 16px;">VERIFY YOUR EMAIL</span></strong>
                                      </span>
                                      </span>
                                    </a>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 20px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                                    <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">Thanks,</span></p>
                                    <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">The Company Team</span></p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
    
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
    
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                        <img align="center" border="0" src="https://assets.unlayer.com/projects/175033/1690736497159-Now%20Showing.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 560px;"
                                          width="560" />
    
                                      </td>
                                    </tr>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
    
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #000000;">
                  <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
    
                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
    
                          <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
    
                                  <div style="font-size: 14px; color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">Copyrights © Company All Rights Reserved</span></p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
    
    
            </td>
          </tr>
        </tbody>
      </table>
    
    </body>
    
    </html>`
  
  };
 
    const newVerification = new verficationToken({
      owner:_id,
      vtoken:emailToken,
      createdAt:Date.now(),
      expiresAt:Date.now()+21600000,
    });
    newVerification.save() 
    .then(()=>{
      mailTransport().sendMail(mailOptions)
      .then(()=>{
        res.json({
          status :"PENDING"
        })
        console.log('Verified' );

      })
      .catch((error)=>{
        console.log('Error Sending Mail:',error );
      })
          
    }
    )
    .catch((error)=> {
      console.log("Error in sending verification Email",error);
    })
       

  .catch(()=>{
    res.status(500).send({
      message: err.message || "Some error occurred while ."
  });
  })
}
module.exports.verify = (req, res) => {
  let { owner, vtoken } = req.params;
  verficationToken
    .find({ owner })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hasheduniqueString = result[0].vtoken;

        if (expiresAt < Date.now()) {
          verficationToken
            .deleteOne({ owner })
            .then(result => {
              UserModel.deleteOne({ _id: owner })
                .then(() => {
                  let message = "Link has expired. Please sign up again";
                  res.redirect(`/verified?error=true&message=${message}`);
                })
                .catch((error) => {
                  let message =
                    "Account record doesn't exist or has been verified already";
                  res.redirect(`/verified?error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log("Error deleting the user", error);

              let message =
                "An error occurred while clearing expired user verification record";
              res.redirect(`/verified?error=true&message=${message}`);
            });
        } else {
          bcrypt
            .compare(vtoken, hasheduniqueString)
            .then((result) => {
              if (result) {
                UserModel.updateOne({ _id: owner }, { verified: true })
                  .then(() => {
                    verficationToken
                      .deleteOne({ owner })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname, "../Models/verified.html")
                        );
                      })
                      .catch((error) => {
                        console.log("Error updating account", error);
                      });
                  })
                  .catch((error) => {
                    console.log("Error updating account", error);
                  });
              } else {
                let message = "Invalid verification details passed";
                res.redirect(`/verified?error=true&message=${message}`);
              }
            })
            .catch((error) => {
              let message = "An error occurred while comparing uniqueString";
              res.redirect(`/verified?error=true&message=${message}`);
            });
        }
      } else {
        let message = "Account  has been verified already";
        res.redirect(`/verified?error=true&message=${message}`);
      }
    })
    .catch((error) => {
      let message = "An error occurred while finding verification token";
      res.redirect(`/verified?error=true&message=${message}`);
    });
};


 module.exports.verified= (req, res) => {

  const filePath = path.join(__dirname, '../Models/verified.html');
  res.sendFile(filePath);
  
 }
     

module.exports.update = (req, res) => {
  const { id } = req.params;


  // Find user and update it with the request body
  UserModel.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + id
        });
      }

      // Update user fields
      user.username = req.body.username;
      user.phone_number = req.body.phone_number;
      user.profileImage = req.body.profileImage;

      // If password is provided and changed, encrypt it with bcrypt
      if (req.body.password && req.body.password !== user.password) {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).send({
              message: "Error occurred while encrypting the password."
            });
          }
          user.password = hashedPassword;

          // Save the updated user
          user.save()
            .then(updatedUser => {
              res.send(updatedUser);
            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating user with id " + req.params.id
              });
            });
        });
      } else {
        // Save the updated user without changing the password
        user.save()
          .then(updatedUser => {
            res.send(updatedUser);
          })
          .catch(err => {
            res.status(500).send({
              message: "Error updating user with id " + req.params.id
            });
          });
      }
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "User not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.id
      });
    });
};
module.exports.delete= async(req,res)=>{
    const {_id,username} = req.body
    UserModel
        .findByIdAndDelete(_id)
        .then(()=>{res.status(201).send("Account deleted sucessfully...")})
        .catch((err)=>{
            console.log(`Error while deleting ${username}'s account :${err}`)
        })
                } 



const privateKey = 'SwiftCode';
const  sessions = {};

module.exports.signIn = (req, res) => {
  const sessionId = uuidv4();
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({
      error: true,
      message: "Username or email and password are required.",
    });
  }

  let query;
  if (username) {
    query = { username: username };
  } else {
    query = { email: email };
  }

  UserModel.findOne(query)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: true,
          message: "User not found.",
        });
      } else {
        if (!user.verified) {
          return res.status(400).json({
            error: true,
            status: "FAILED",
            message: "Email hasn't been verified.",
          });
        } else {
          bcrypt.compare(password, user.password)
            .then((same) => {
              if (same) {
                const token = jwt.sign({ id: user._id }, privateKey, {
                  expiresIn: '4h',
                });
                sessions[sessionId] = { user, userId: user._id };
                res.cookie('session', sessionId);
                res.cookie('username', user.username);


                res.json({ token, user,sessionId,  msg: "Successfully signed in." });
                console.log(sessionId);
                console.log(user.username);

              } else {
                return res.status(401).json({
                  error: true,
                  message: "Invalid password or email.",
                });
              }
            })
            .catch((error) => {
              console.error('Error occurred while comparing passwords:', error);
              res.status(500).json({
                error: true,
                message: "Internal server error.",
              });
            });
        }
      }
    })
    .catch((error) => {
      console.error('Error occurred while signing in:', error);
      res.status(500).json({
        error: true,
        message: "Internal server error.",
      });
    });
};




const generateRandomPassword = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
};

module.exports.ResetPassword = (req, res) => {
  const { email } = req.body;
  
  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.json({
          status: "FAILED",
          message: "Email not found",
        });
      }

      if (!user.verified) {
        return res.json({
          status: "FAILED",
          message: "Email hasn't been verified.",
        });
      }

      const newPassword = generateRandomPassword();

      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          res.json({
            status: "FAILED",
            message: "Error occurred while generating new password.",
          });
        } else {
          UserModel.findByIdAndUpdate(user._id, { password: hashedPassword })
            .then(() => {
                  sendResetEmail(user, newPassword, res);
            })
            .catch(() => {
              res.json({
                status: "FAILED",
                message: "Error occurred while updating user's password.",
              });
            });
        }
      });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "Error occurred while checking for existing user.",
      });
    });
};

const sendResetEmail = ({ email }, newPassword, res) => {
  const mailOptions = {
    from: 'swiftcodeentreprise@gmail.com',
    to: email,
    subject: 'Reset Password',
    html: `<!DOCTYPE html>
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
    
        @media (max-width:660px) {
          .row-content {
            width: 100% !important;
          }
    
          .stack .column {
            width: 100%;
            display: block;
          }
    
          .mobile_hide {
            max-width: 0;
            min-height: 0;
            max-height: 0;
            font-size: 0;
            display: none;
            overflow: hidden;
          }
    
          .desktop_hide,
          .desktop_hide table {
            max-height: none !important;
            display: table !important;
          }
        }
      </style>
    </head>
    
    <body style="text-size-adjust: none; background-color: #f8f8f9; margin: 0; padding: 0;">
      <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;">
        <tbody>
          <tr>
            <td>
              <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; background-color: #1aa19c; width: 640px; margin: 0 auto;" width="640">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad">
                                    <div class="alignment" align="center">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;"><span>&#8202;</span></td>
                                        </tr>
                                      </table>
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
              <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; background-color: #420505; width: 640px; margin: 0 auto;" width="640">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                    <div class="alignment" align="center" style="line-height:10px"><a  target="_blank" style="outline:none" tabindex="-1"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/1029529_1014515/editor_images/55ec2d3f-0138-46ed-8749-c56b2148f1f1.png" style="height: auto; display: block; border: 0; max-width: 256px; width: 100%;" width="256" alt="Your logo." title="Your logo."></a></div>
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
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; background-color: #fff; width: 640px; margin: 0 auto;" width="640">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="width:100%;">
                                    <div class="alignment" align="center" style="line-height:10px"><a  target="_blank" style="outline:none" tabindex="-1"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/4036/___passwordreset.gif" style="height: auto; display: block; border: 0; max-width: 640px; width: 100%;" width="640" alt="Image of lock &amp; key." title="Image of lock &amp; key."></a></div>
                                  </td>
                                </tr>
                              </table>
                              <table class="divider_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-top:30px;">
                                    <div class="alignment" align="center">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span>&#8202;</span></td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
                                    <div style="font-family: Arial, sans-serif">
                                      <div class style="font-size: 12px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Forgot Your Password?</strong></span></p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
                                    <div style="font-family: 'Trebuchet MS', Tahoma, sans-serif">
                                      <div class style="font-size: 12px; font-family: 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                        <p style="margin: 0; text-align: center; font-size: 16px; mso-line-height-alt: 24px;"><span style="font-size:16px;"><strong>We received a request to reset your password. Don’t worry,</strong></span></p>
                                        <p style="margin: 0; text-align: center; font-size: 16px; mso-line-height-alt: 24px;"><span style="font-size:16px;"><strong>we are here to help you.</strong></span></p>
                                        <p style="margin: 0; text-align: center; font-size: 16px; mso-line-height-alt: 18px;">&nbsp;</p>
                                        <p style="margin: 0; text-align: center; font-size: 16px; mso-line-height-alt: 18px;">&nbsp;</p>
                                        <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 24px;"><strong>🔑</strong><strong> <span style="font-size:18px;"><u>Your New Password :</u></span></strong></p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="button_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
                                    <div class="alignment" align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:210px;v-text-anchor:middle;" arcsize="57%" stroke="false" fillcolor="#ee5e7d"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a  target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#ee5e7d;border-radius:35px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;"><strong>${newPassword}</strong></span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
                                  </td>
                                </tr>
                              </table>
                              <table class="divider_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-bottom:12px;padding-top:60px;">
                                    <div class="alignment" align="center">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span>&#8202;</span></td>
                                        </tr>
                                      </table>
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
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; background-color: #3b2434; width: 640px; margin: 0 auto;" width="640">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; text-align: left; font-weight: 400; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                    <div class="alignment" align="center" style="line-height:10px"><a  target="_blank" style="outline:none" tabindex="-1"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/1029529_1014515/editor_images/55ec2d3f-0138-46ed-8749-c56b2148f1f1.png" style="height: auto; display: block; border: 0; max-width: 224px; width: 100%;" width="224" alt="Your logo. " title="Your logo. "></a></div>
                                  </td>
                                </tr>
                              </table>
                              <table class="divider_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;">
                                    <div class="alignment" align="center">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #555961;"><span>&#8202;</span></td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad" style="padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;">
                                    <div style="font-family: sans-serif">
                                      <div class style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                        <p style="margin: 0; font-size: 17px; text-align: center; mso-line-height-alt: 16.8px;"><span style="color:#95979c;font-size:12px;">Copyrights © Company All Rights Reserved</span></p>
                                        
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
    
    </html>`,
  };

  mailTransport().sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({
        status: "FAILED",
        message: "Error occurred while sending reset email.",
      });
    } else {
      // Email sent successfully
      res.json({
        status: "SUCCESS",
        message: "Reset email sent successfully.",
      });
    }
  });
};

module.exports.AdminLogin= async (req,res)=>{
  const sessionId = uuidv4();
  const {email, password } = req.body;

  if ( !email || !password) {
    return res.status(400).json({
      error: true,
      message: "email or  password are required.",
    });
  }

 

  UserModel.findOne({email:email})
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: true,
          message: "Admin not found .",
        });
      } else {
        if (!user.verified) {
          return res.status(400).json({
            error: true,
            status: "FAILED",
            message: "Email hasn't been verified.",
          });
        } else {
          bcrypt.compare(password, user.password)
            .then((same) => {
              if ((same) && ((user.role.name==="admin")||(user.role.name==="Supadmin"))){
                const token = jwt.sign({ id: user._id }, privateKey, {
                  expiresIn: '4h',
                });
                sessions[sessionId] = { user, userId: user._id };
                res.cookie('session', sessionId);
                res.cookie('Admin', user.username);


                res.json({ token, user,sessionId,  msg: "Successfully signed in." });
                console.log(sessionId);
                console.log(user.username);

              } else {
                return res.status(401).json({
                  error: true,
                  message: "User doesn't Have Admin priveleges or Credentials are incorrect.",
                });
              }
            })
            .catch((error) => {
              console.error('Error occurred while comparing passwords:', error);
              res.status(500).json({
                error: true,
                message: "Internal server error.",
              });
            });
        }
      }
    })
    .catch((error) => {
      console.error('Error occurred while signing in:', error);
      res.status(500).json({
        error: true,
        message: "Internal server error.",
      });
    });

}

module.exports.CreatAdmin = async (req, res) => {
  const { username, email, phone_number, profileImage } = req.body;

  if (!username || !email ) {
    res.status(400).json({ message: 'Please provide all required fields.' });
    return;
  }
    const pass = generateRandomPassword();

  bcrypt.hash(pass, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send({ message: 'Error occurred while encrypting the password.' });
      return;
    }

    const otp = generatorOTP();

    UserModel.create({
      username,
      email,
      phone_number,
      password: hashedPassword,
      role: { name: 'admin' },
      profileImage,
      emailToken: otp,
      verified: true
    })
    .then(data => {
      // res.send(data);
      sendCompte(data,res, pass);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    });
});
};
const sendCompte =({_id , email,Cin},res, pass)=>{
  //chnwa chikoun fyh email 
  const mailOptions ={
    from : 'swiftcodeentreprise@gmail.com',
    to : email,
    subject:'Your account',
    html:`<h3>Hello, ${email}</h3><br/> <p>This your account.</p>
    <br/> <p>Password : ${pass} .</p>`
  
  };
  mailTransport().sendMail(mailOptions, (error, info) => {
      if (error) {
        res.json({
          status: "FAILED",
          message: "Error occurred while sending reset email.",
        });
      } else {
        // Email sent successfully
        res.json({
          status: "SUCCESS",
          message: "Reset email sent successfully.",
        });
      }
    });
}

module.exports.getadmin= async(req,res)=>{
  const adminUsers = await UserModel.find({ 'role.name': 'admin' });
  res.send(adminUsers)
     
}