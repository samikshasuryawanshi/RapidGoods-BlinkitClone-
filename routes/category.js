const express = require('express');
const router = express.Router();
const {categoryModel , validateCategory} = require('../models/category');
const upload = require('../config/multer_config')

router.post('/create', async function(req, res){
   let category = await categoryModel.create({
        name:req.body.name,
    })
    res.redirect("back");
})


module.exports = router;