var GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const {userModel} = require("../models/user")
const passport = require('passport')

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
 async function(request, accessToken, refreshToken, profile, cb) {
    try{
    let user = await userModel.findOne({email : profile.emails[0].value});

    if(!user){
    user = new userModel({
        name : profile.displayName,
        email : profile.emails[0].value,
      });
    await user.save();
    }
    cb(null,user);
    }
    catch(err){
      cb(err,false);
    }
  }
));

//it basically add the id , username etc(id go to the session).
passport.serializeUser(function(user,cb){
  return cb(null,user._id);
});

//it used to get the whole data(getting the data from the session)
//we are giving id bcoz we add the id on the serialize function
passport.deserializeUser(async function(id,cb){
 let user = await userModel.findOne({_id : id});
  return cb(null,user);
})

module.exports = passport;



