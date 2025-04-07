const express = require('express');
const router = express.Router();
const {cartModel,validateCart} = require("../models/cart");
const {validateAdmin,userIsLoggedIn} = require("../middlewares/admin");
const { session } = require('passport');
const {productModel} = require('../models/product');



router.get("/",userIsLoggedIn, async function(req,res){
    try {
     let cart = await cartModel.findOne({user:req.session.passport.user}).populate("products")//req.session.passport.user used to retrieve the user information


     let cartDataStructure= {};
     cart.products.forEach((product)=>{
        let key = product._id.toString();
        if(cartDataStructure[key]){
            cartDataStructure[key].quantity+=1;
        }else{
            cartDataStructure[key] = {
               ...product._doc,
               quantity:1,
            }
        }
     })

    let finalArray =  Object.values(cartDataStructure);

    let finalPrice = cart.totalPrice + 34;
    
     res.render("cart",{cart:finalArray,
        finalPrice,
        userid: req.session.passport.user 
    });
    } catch (error) {
        res.send(error.message);
    }
})

router.get("/add/:id",userIsLoggedIn, async function(req,res){
    try {
     let cart = await cartModel.findOne({user:req.session.passport.user}) 
     let product = await productModel.findOne({_id : req.params.id});
     if(!cart){
        cart = await cartModel.create({
            user:req.session.passport.user,
            products:[req.params.id],
            totalPrice:Number(product.price),
        })
     }else{
         cart.products.push(req.params.id);
         cart.totalPrice =Number(cart.totalPrice)+ Number(product.price);
         await cart.save();
     }

     res.redirect("back");
      
    } catch (error) {
        res.send(error.message);
    }
})




router.get("/remove/:id",userIsLoggedIn, async function(req,res){
    try {
     let cart = await cartModel.findOne({user:req.session.passport.user}) 
     let product = await productModel.findOne({_id : req.params.id});
     if(!cart){
       return res.send("There is nothing in the cart1")
     }else{
        let index = cart.products.indexOf(req.params.id)
        cart.products.splice(index,1);
        cart.totalPrice =Number(cart.totalPrice)- Number(product.price);


        await cart.save();
     }

     res.redirect("back");
      
    } catch (error) {
        res.send(error.message);
    }
})



router.get("/remove/:id",userIsLoggedIn, async function(req,res){
    try {
        let cart = await cartModel.findOne({user : req.session.passport.user});
        if(!cart){
           return res.send("Cart is empty")
        }

        let index = cart.products.indexOf(req.params.id)
        if(index !== -1){
           cart.products.splice(index,1);
           await cart.save();
        }else{
            return res.send("Item is not in the cart!")
        }

        res.redirect("back");

    } catch (error) {
        res.send(error.message);
    }

})


module.exports = router;