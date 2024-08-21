const User = require("../models/user");
const passport = require("passport");

exports.register = async(req, res) => {
    const userName = req.body.username;
    const passWord = req.body.password;
    const name = req.body.name;
    const role = req.body.role;

    User.register({username:userName,name:name,role:role},passWord,function(err,user){
    if(err){
        console.log(err);
        res.redirect("/register");
    }

    else{
        passport.authenticate("local")(req,res,function(){
        if(role == "User"){
            res.redirect("/bookcars");
        }

        else{
            res.redirect("agencydashboard")
        }
    });
    }
});
}

exports.login = async(req, res) => {
    const userName = req.body.username;
    const passWord = req.body.password;

    const user = new User({
    username:userName,
    password:passWord
    });


    req.login(user, function(err){
    if(err){
        console.log(err);
    }

    else{
        passport.authenticate("local")(req,res,function(){

        res.redirect("/bookcars");

        });
    }
    });
}