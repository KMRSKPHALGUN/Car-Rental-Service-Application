
//requiring the packages

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const multer = require("multer");
const cors = require("cors");



//initialisation and setiing view engine etc.
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(session({
  secret:"Rocketcodesisawesome",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

const ds=multer.diskStorage({
  destination: "./public/uploads",
  filename:(req,file,cb)=>{

      cb(null, file.originalname);
  }
});

const upload = multer({storage: ds});



//connection to DB
mongoose.connect("mongodb://localhost:27017/Car_Rental_Service");


//creating userSchema and carSchema

const User = require("./models/user");
const Car = require("./models/car");
const Bookings = require("./models/bookings");



//adding plugin to the user Schema
// userSchema.plugin(passportLocalMongoose);





//creating mongoose model




// passport strategies initialisation
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//handling get requests

//homepage
app.get("/",function(req,res){
  res.render("home");
});




//register page
app.get("/register",function(req,res){
  if(req.isAuthenticated()){
    const role = req.user.role;
    if(role == "User"){
      res.redirect("/userdashboard");
    }

    else{
      res.redirect("/agencydashboard");
    }
  }
  else{
    res.render("register");
  }
  
});



//login page
app.get("/login",function(req,res){
  if(req.isAuthenticated()){
    const role = req.user.role;
    if(role == "User"){
      res.redirect("/userdashboard");
    }

    else{
      res.redirect("/agencydashboard");
    }
  }
  else{
    res.render("login");
  }

});




//bookcars page
app.get("/bookcars", function(req, res) {
  // Create a base query that only retrieves cars that are not booked
  const query = {
    status: { $ne: "Booked" } // Only show available cars
  };

  // Check if the request contains any filters
  if (req.query.fuelType && req.query.fuelType !== "") {
    query.fuelType = req.query.fuelType;
  }

  if (req.query.mmy && req.query.mmy.trim() !== "") {
    const mmy = req.query.mmy.trim();

    // Separate the year part from make/model
    const yearMatch = mmy.match(/\b\d{4}\b/); // Match a 4-digit number
    if (yearMatch) {
      query.year = Number(yearMatch[0]); // Convert the year string to a number
    }

    // Create a regex for make and model fields excluding the year part
    const modelMakeRegex = mmy.replace(/\b\d{4}\b/, '').trim();
    const [make, model] = modelMakeRegex.trim().split(" ", 2);

    if (make) {
      query.make = new RegExp(make, "i");
    }
    
    if (model) {
      query.model = new RegExp(model, "i");
    }
  }

  if (req.query.minRent && req.query.maxRent) {
    query.rent = { $gte: req.query.minRent, $lte: req.query.maxRent };
  } else if (req.query.minRent) {
    query.rent = { $gte: req.query.minRent };
  } else if (req.query.maxRent) {
    query.rent = { $lte: req.query.maxRent };
  }

  if (req.isAuthenticated()) {
    const role = req.user.role;
    if (role === "Agency") {
      return res.redirect("/agencydashboard");
    } else {
      // Query the database with the constructed query object
      Car.find(query, function(err, cars) {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        res.render("bookcars", { cars: cars });
      });
    }
  } else {
    // Query the database with the constructed query object
    Car.find(query, function(err, cars) {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      res.render("bookcars", { cars: cars });
    });
  }
});





//booked cars page for Agency
app.get("/bookedcars",function(req,res){


  if(req.isAuthenticated()){
    const role = req.user.role;
    if(role == "Agency"){

    const agencyid = req.user._id;

    Car.find({agency:agencyid},function(err,cars){
      let bookedcars = cars.filter(function(currentCar){
        return currentCar.status == "Booked";
      });

      res.render("bookedcars",{cars:bookedcars});

    });


    }

    else{
      res.redirect("/bookcars");
    }

}
else{
   res.redirect("/login");
}
});





//userdashboard page
app.get("/userdashboard",function(req,res){
  if (req.isAuthenticated()) {
    const userId = req.user._id;  // Get the currently logged-in user ID

    // Find bookings where the user is listed in the customerIds
    Bookings.find({ custId: userId }, function(err, bookings) {
        if (err) {
            console.log(err);
            return res.redirect("/login");
        }

        // Extract the car IDs from the bookings
        const carIds = bookings.map(booking => booking.carId);

        // Find the cars using the car IDs
        Car.find({ _id: { $in: carIds } }, function(err, cars) {
            if (err) {
                console.log(err);
                return res.redirect("/login");
            }

            // Render the user dashboard with the list of booked cars
            res.render("userdashboard", { cars: cars });
        });
    });
  }
  else {
    res.redirect("/login");
  }
});






//agencydashboard page
app.get("/agencydashboard",function(req,res){
if(req.isAuthenticated()){
  const role = req.user.role;
  if(role == "Agency"){
    Car.find({agency:req.user._id, status:{$ne:"Booked"}}, function(err,cars){
      res.render("agencydashboard", {cars: cars});
    });
  }
  else{
    res.redirect("/userdashboard");
  }
}

else{
  res.redirect("/login");
}
});





//addnewcars page for Agency
app.get("/addnewcars",function(req,res){
  if(req.isAuthenticated()){
    const role = req.user.role;
    if(role == "Agency"){
       res.render("addnewcars");
    }

    else{
      res.redirect("/bookcars");
    }
  }

  else{
    res.redirect("/login")
  }
});









//logout
app.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){
      console.log(err);
    }
  });
  res.redirect("/");
});






const authController = require("./controllers/authController");
const addnewcars = require("./controllers/addNewCars");
const bookcars = require("./controllers/bookCars");
const bookthiscar = require("./controllers/bookThisCar");
const cancelBooking = require("./controllers/cancelBooking");
const deleteCar = require("./controllers/deleteCar");
const viewcar = require("./controllers/viewcar");

//handling POST requests
//regsiter page
app.post("/register", upload.single("image"), authController.register);

// login page
app.post("/login", authController.login);

//addnewcars page for Agency
app.post("/addnewcars", addnewcars.addCar);

//bookcars page for User
app.post("/bookcars", bookcars.bookCar);

//bookthiscar page for User
app.post("/bookthiscar", bookthiscar.bookthiscar);

app.post("/viewcar", viewcar.viewCar);



//agencydashboard page for agency
app.post("/agencydashboard",function(req,res){
if(req.isAuthenticated()){
  const role = req.user.role;
    if(role == "Agency"){
       const carid = req.body.carid;
       Car.findOne({_id:carid},function(err,foundCar){
         res.render("updatethiscar",{car:foundCar});
       });

    }

    else{
      res.redirect("/userdashboard");
    }
}

else{
  res.redirect("/login");
}
});



//updatethiscar for agency
app.post("/updatethiscar", async function(req,res){
  const id = req.body.update;
  const model = req.body.model;
  const number = req.body.number;
  const rent = req.body.rent;
  const status = req.body.status;
  const capacity = req.body.capacity;
  const agency = req.user.username;
  if(req.isAuthenticated()){

    await Car.updateOne({_id:id},{ $set: {model:model,number:number,rent:rent,status:status,capacity:capacity}});

    res.redirect("/agencydashboard");
  }
  else{
   res.redirect("/login");
  }

});



//cancel booking for user
app.post("/userdashboard", cancelBooking.cancel);

app.post("/deleteCar", deleteCar.delete);

const port = process.env.PORT||3000;
//setting up server
app.listen(port, function(){
  console.log(`Server is running on http://localhost:${port}`);
});
