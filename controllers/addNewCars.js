const Car = require("../models/car");
const User = require("../models/user");

exports.addCar = async(req, res) => {
    if(req.isAuthenticated()){

        const role = req.user.role;
   
        if(role == "Agency"){
            const id = req.user._id;
   
            const car = new Car ({
                model:req.body.model,
                make:req.body.make,
                year:req.body.year,
                number:req.body.number,
                capacity:req.body.capacity,
                fueltype:req.body.fueltype,
                location:req.body.location,
                rent:req.body.rent,
                agency:req.user._id,
            });
   
            await car.save();
            res.redirect("/agencydashboard");
        }
   
        else{
          res.redirect("/bookcars")
        }
    }

    else{
       res.redirect("/login");
    }
}