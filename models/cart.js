// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Cart Schema for Mongoose
const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, 'User is required']
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, 'Product is required']
        }
    ],
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price cannot be negative']
    }
}, { timestamps: true });

// Create the Mongoose model
const cartModel = mongoose.model('cart', cartSchema);

// Define the Joi validation schema
const validateCart = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(), // Expecting ObjectId as a string
        products: Joi.array().items(Joi.string().required()).required(), // Ensures at least one product
        totalPrice: Joi.number().min(0).required()
    });

    return schema.validate(data);
};

// Export the validation function and model
module.exports = {
    validateCart,
    cartModel
};
