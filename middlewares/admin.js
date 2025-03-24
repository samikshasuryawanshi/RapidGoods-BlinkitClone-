const jwt = require("jsonwebtoken")
require("dotenv").config();


async function validateAdmin(req, res, next) {
   try{
    let token = req.cookies.token;
    if(!token) return res.send("You need to login first!");
        
    let data =await jwt.verify(token,process.env.JWT_KEY);
    req.user = data;
    next();
   }
   catch(err){
    return res.send(err.message);
   }
}

async function userIsLoggedIn(req,res,next){
   if(req.isAuthenticated()){
      return next();
   }

   res.redirect("/users/login");
}
module.exports = {validateAdmin,userIsLoggedIn} ;