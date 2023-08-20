const mongoose = require('mongoose');
const RoleSchema = new mongoose.Schema({

    name : {type : String , required : true , default : "userRole"}
})

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type : String , 
    required:true, 
    unique: true},
  
  phone_number: {
    type: String
  },
  password: String,
  profileImage:  String,
  emailToken:{ type: String},
  verified : {
      type:Boolean,
      default:false
    },
  role :RoleSchema,
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);