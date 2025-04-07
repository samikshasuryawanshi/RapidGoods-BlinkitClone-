const express = require('express');
const router = express.Router();
const {productModel , validateProduct} = require('../models/product')
const {categoryModel , validateCategory} = require('../models/category');
const upload = require('../config/multer_config')
const {validateAdmin,userIsLoggedIn}  = require('../middlewares/admin');
const { cartModel } = require('../models/cart');

router.get('/',userIsLoggedIn,async function(req, res){

  let somethingInCart = false;

   // Fetching 10 random products from the database and grouping them by category.
   const result = await productModel.aggregate([
       {
         $group: {
           _id: "$category", // Group by category
           products: { $push: "$$ROOT" }, // Push all products of this category into an array
         },
       },
       {
         $project: {
           _id: 0,
           category: "$_id",
           products: { $slice: ["$products", 10] }, // Limit products to the first 10 in each category
         },
       },
       
     ]);


    let cart =  await cartModel.findOne({user : req.session.passport.user});
    // console.log(cart);
    
    if(cart && cart.products.length > 0)  somethingInCart = true;


     //to select any three products and show it into the cart using this

    let randomProduct = await productModel.aggregate([
      {$sample:{size : 5}}
     ])
   
     //converting the array into object
     const resultObject = result.reduce((acc, item) => {
       acc[item.category] = item.products;
       return acc;
     }, {});
    //  console.log(resultObject);
     
   res.render("index", {products : resultObject,randomProduct,somethingInCart,cartCount : cart ? cart.products.length:0});
})

router.get('/delete/:id',validateAdmin,async function(req, res){
    if(req.user.admin){
        let prods = await productModel.findOneAndDelete({_id: req.params.id});
        return res.redirect("/admin/products")
    }
    res.send("you are not allowed to delete this product")
    
 })

router.post('/delete',validateAdmin,async function(req, res){
    if(req.user.admin){
        let prods = await productModel.findOneAndDelete({_id: req.body.product_id});
        return res.redirect("back")
    }
    res.send("you are not allowed to delete this product")
    
 })



router.post('/', upload.single("image"), async function(req, res){

    //to identify errors
    let {name,price,category,stock,description,image} = req.body;
   let {error} =  validateProduct({name,price,category,stock,description,image});
   if(error) return res.send(error.message);


   //if the category is not specified then create new one
   let isCategory =  await categoryModel.findOne({name:category})
   if(!isCategory){
     await categoryModel.create({name:category})
   }



   //create product
   let product = await productModel.create({
    name,
    price,
    category,
    stock,
    description,
    image:req.file.buffer,
   })

   res.redirect("/admin/dashboard");
})


module.exports = router;