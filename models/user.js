const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Car = require("./car").schema;

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    role:{type:String,required:true,default:"User"},
    dlImage: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);