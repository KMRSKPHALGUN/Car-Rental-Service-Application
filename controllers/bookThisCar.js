const User = require("../models/user");
const Car = require("../models/car");
const bookCar = require("../models/bookings");

exports.bookthiscar = async(req, res) =>{
    if(req.isAuthenticated()){
        const book = req.body.book;
        const agency = req.body.agency;
        const user = req.user.name;
        const startdate = req.body.startdate;
        const enddate = req.body.enddate;
        
        const booked = await bookCar.findOne({carId:book});
        if(booked)
        {
            let b = false;
            const len = booked.startdate.length;
            for(let i=0; i<len; i++)
            {
                if(new Date(startdate) <= new Date(booked.startdate[i]) && new Date(enddate) >= new Date(booked.startdate[i]))
                {
                    b = true;
                    break;
                }
                else if(new Date(startdate) <= new Date(booked.enddate[i]) && new Date(enddate) >= new Date(booked.enddate[i]))
                {
                    b = true;
                    break;
                }
                else if(new Date(startdate) >= new Date(booked.startdate[i]) && new Date(enddate) <= new Date(booked.enddate[i]))
                {
                    b = true;
                    break;
                }
            }
            if(b)
            {
                res.redirect("/bookcars?message=Sorry+the+car+has+been+booked+in+these+dates.");
            }
            else
            {
                await bookCar.updateOne({carId:book}, {$push: {custId:[req.user._id], startdate:[startdate], enddate:[enddate]}});
                if(new Date(startdate) > new Date())
                {
                    await Car.findOneAndUpdate({_id:book},{ $set: {"status":"Available"}});
                }
                else
                {
                    await Car.findOneAndUpdate({_id:book},{ $set: {"status":"Booked"}});
                }

                res.redirect("/userdashboard");
            }
        }
        else
        {
            const booking = new bookCar({
                carId:book,
                custId:req.user._id,
                agencyId:agency,
                startdate:startdate,
                enddate:enddate,
            });

            await booking.save();
        

        
            if(new Date(startdate) > new Date())
            {
                await Car.findOneAndUpdate({_id:book},{ $set: {"status":"Available"}});
            }
            else
            {
                await Car.findOneAndUpdate({_id:book},{ $set: {"status":"Booked"}});
            }

            res.redirect("/userdashboard");
        }
  
    }
    else{
       res.redirect("/login");
    }
}