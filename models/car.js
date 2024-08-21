const mongoose = require("mongoose");

const carSchema = mongoose.Schema({
    model:String,
    make:String,
    year: {
        type: Number,
        min: [1886, 'The year must be later than 1885'],  // Example minimum year for cars
        max: [new Date().getFullYear(), 'The year cannot be in the future'] // Prevent future years
    },
    location:String,
    number:String,
    capacity:String,
    rent:String,
    status:{type:String,default:"Available"},
    // customer:String,
    // enddate:String,
    // startdate:String,
    agency:String,
    fueltype:String
});

module.exports = mongoose.model("Car",carSchema);