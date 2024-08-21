const Bookings = require("../models/bookings");
const Car = require("../models/car");

exports.cancel = async(req, res) =>{
    if(req.isAuthenticated()){
        const role = req.user.role;
        if(role == "User"){
          const carid = req.body.carid;
          const user = req.user._id;
    
          const booking = await Bookings.findOne({carId:carid});
          const index = booking.custId.indexOf(user);
          await Bookings.updateOne({carId:carid}, {$pull: {custId: booking.custId[index], startdate: booking.startdate[index], enddate: booking.enddate[index]}});
    
          await Car.findOneAndUpdate({_id:carid},{ $set: {"status":"Available"}});
          res.redirect("/userdashboard");
        }
        else{
          res.redirect("/agencydashboard");
        }
      }
    
      else{
        res.redirect("/login");
      }
}