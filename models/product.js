// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Product Schema for Mongoose
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Product name must be at least 3 characters long'],
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
        minlength:3,
        maxlength:50,
    },
    stock: {
        type: Number,
        required: [true, 'Stock status is required']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 500 characters']
    },
    image: {
        type: Buffer,
    }
}, { timestamps: true });

// Create the Mongoose model
const productModel = mongoose.model('product', productSchema);

// Define the Joi validation schema
const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required().trim(),
        price: Joi.number().min(0).required(),
        category: Joi.string().min(3).max(50).required().trim(),
        stock: Joi.number().required(),
        description: Joi.string().max(500).optional().trim(),
        image: Joi.string().optional(),
    });

    return schema.validate(data);
};
// Export the validation function and model
module.exports = {
    validateProduct,
    productModel
};
