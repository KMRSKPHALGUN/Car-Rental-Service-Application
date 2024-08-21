const Car = require("../models/car");

exports.delete = async(req, res) =>{
    const carid = req.body.carid;
    await Car.deleteOne({_id:carid});
    res.redirect("/agencydashboard");
}