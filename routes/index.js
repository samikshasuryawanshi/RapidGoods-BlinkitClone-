const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

// router.get("/",function(req,res){
//     res.render("admin_login")
// })

router.get("/",function(req,res){
    res.redirect("/products")
})


router.get("/map/:orderid",function(req,res){
    res.render("map",{orderid : req.params.orderid});
})



module.exports = router