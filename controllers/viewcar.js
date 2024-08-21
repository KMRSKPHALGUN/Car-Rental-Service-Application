const Car = require("../models/car");
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Function to get latitude and longitude from location name
async function getCoordinates(location) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: 'New York, USA',
          key: process.env.GOOGLE_MAPS_API_KEY,
        }
      });
  
      if (response.data.results.length > 0) {
        return {
          lat: response.data.results[0].geometry.location.lat,
          lon: response.data.results[0].geometry.location.lng,
        };
      } else {
        throw new Error('No coordinates found for the location');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error.message);
      throw error;
    }
}

exports.viewCar = async(req, res) => {
    if(req.isAuthenticated()){
        const role = req.user.role;
        if(role == "Agency"){
          const book = req.body.carid;
          Car.findOne({_id:book},function(err,car){
             if(!err){
               res.render("viewcar",{car:car});
             }
          });
        }
        else{
          res.redirect("/userdashboard");
        }
    }
    else{
        res.redirect("/login");
    }
}