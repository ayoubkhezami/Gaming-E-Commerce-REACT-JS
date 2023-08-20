const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const verficationTokenSchema = new mongoose.Schema({
    owner : {type: String,required:true},
    vtoken:{type:String , require:true},
    createdAt:Date,
    expiresAt:Date
})

verficationTokenSchema.pre("save",async function(next){
    if ( this.isModified("vtoken")){
        const hash = await bcrypt.hash(this.vtoken,10)
        this.vtoken = hash
    }
    next()
});

verficationTokenSchema.methods.compareToken = function(vtoken) {
    return bcrypt.compare(vtoken, this.vtoken);
  };
  

module.exports = mongoose.model('verficationToken', verficationTokenSchema)