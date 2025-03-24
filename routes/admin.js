const express = require('express');
const router = express.Router();
const {adminModel} = require('../models/admin');
const {validateAdmin} = require("../middlewares/admin")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { productModel } = require('../models/product');
const { categoryModel } = require('../models/category');

require('dotenv').config();


if( typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "DEVELOPMENT"){
    router.get('/create', async (req, res) => {
        try{
           let salt = await bcrypt.genSalt(10);
           let hash = await bcrypt.hash("admin",salt);
      
          let user = new adminModel({
              name: "admin",
              password: hash,
              email:"okkok@theekhai.com",
              role:"admin",
           }) 
           await user.save();
      
           let token = jwt.sign({email:"okkok@theekhai.com",admin:true},process.env.JWT_KEY)
           res.cookie("token", token)
           res.send("Admin created")
        }
        catch(err){
            res.send(err.message);
        }
    
       })    
    
}

router.get("/login", (req, res) => {
    res.render("admin_login")
})

//post login
router.post("/login",  async (req, res) => {
    let {email, password} = req.body;
   let admin = await adminModel.findOne({email});

   if(!admin){
    return res.send("This admin is not available")
   }

   let valid = await bcrypt.compare(password,admin.password);
   if(valid){
    let token = jwt.sign({email,admin:true},process.env.JWT_KEY)
    res.cookie("token", token)
    res.redirect("/admin/dashboard");
   }
   
})

//admin dashboard rout
router.get("/dashboard",validateAdmin,async (req, res) => {
    let prodCount = await productModel.countDocuments()
    let catCount = await categoryModel.countDocuments()
    
    res.render("admin_dashboard",{prodCount, catCount});
})


//products route
router.get("/products",validateAdmin, async (req, res) => {


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

  //converting the array into object
  const resultObject = result.reduce((acc, item) => {
    acc[item.category] = item.products;
    return acc;
  }, {});


  //for in loop
//   for(let key in resultObject) {
//     console.log(resultObject[key]);
//   }

res.render("admin_products", {products: resultObject});
})


//logout route
router.get("/logout", (req, res) => {
    res.cookie("token","");
    res.redirect("/admin/login");
})




module.exports = router;