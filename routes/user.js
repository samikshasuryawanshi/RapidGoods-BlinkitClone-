const express = require('express');
const router = express.Router();
const {userModel , validateUser} = require('../models/user')
const {userIsLoggedIn} = require('../middlewares/admin')
const {orderModel} = require('../models/order')


router.get("/login",(req,res)=>{
    res.render("user_login")
})

router.get("/profile", userIsLoggedIn, async (req, res) => {
    try {
        // Get the current user's data
        const user = await userModel.findById(req.user._id);
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Get user's orders
        const orders = await orderModel.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(3);

        // Get cart count for the header
        const cartCount = user.cart ? user.cart.length : 0;

        res.render("user", {
            user: {
                ...user.toObject(),
                orders: orders
            },
            cartCount: cartCount
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Error loading profile page");
    }
});

router.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.session.destroy((err)=>{
            if(err){
                return next(err);
            }
            res.clearCookie("connect.sid");
            res.redirect("/users/login")
        })
    })
    
})

module.exports = router;