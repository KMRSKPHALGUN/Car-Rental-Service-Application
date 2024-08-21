const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    carId:String,
    custId:[String],
    agencyId:String,
    startdate:[String],
    enddate:[String]
});

module.exports = mongoose.model("Bookings", bookingSchema);