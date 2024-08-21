const Car = require("../models/car");


exports.bookCar = async(req, res) => {
    if(req.isAuthenticated()){
        const role = req.user.role;
        if(role == "User"){
          const book = req.body.book;
          Car.findOne({_id:book},function(err,car){
             if(!err){
               res.render("bookthiscar",{car:car});
             }
          });
        }
        else{
          res.redirect("/agencydashboard");
        }
    }
    else{
        res.redirect("/login");
    }
}