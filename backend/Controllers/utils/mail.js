const optGenerator = require('otp-generator')
const nodemail = require('nodemailer')
const jwt = require('jsonwebtoken')

let otp= ''

exports.generatorOTP = () => {
    const OTP = optGenerator.generate(10,{specialChars: false});
    return OTP
};

 exports.mailTransport = ()=>
    nodemail.createTransport({
        service: process.env.service,
        auth:{
            user:process.env.user,
            pass:process.env.pass
        }

    }) 

exports.generateToken =(id)=>{
    return jwt.sign({id},process.env.jwt_Secret,{
        expiresIn: "1d",
    })
}