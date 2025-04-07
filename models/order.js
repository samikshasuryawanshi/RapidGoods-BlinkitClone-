// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Order Schema for Mongoose
const orderSchema = mongoose.Schema({
    orderId:{
        type:String,
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, 'User reference is required']
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: [true, 'Product reference is required']
        }
    ],
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price cannot be negative']
    },
    address: {
        type: String,
        trim: true,
        minlength: [10, 'Address must be at least 10 characters long'],
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    status: {
        type: String,
        required: [true, 'Order status is required'],
        enum: ['pending', 'processed', 'shipped', 'delivered', 'canceled'], // Assuming these are possible statuses
        default: 'pending'
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
        required: [true, 'Payment reference is required']
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "delivery",
    }
}, { timestamps: true });

// Create the Mongoose model
const orderModel = mongoose.model('order', orderSchema);

// Define the Joi validation schema
const validateOrder = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(), // Expecting ObjectId as a string
        products: Joi.array().items(Joi.string().required()).min(1).required(), // Ensure at least one product
        totalPrice: Joi.number().min(0).required(),
        address: Joi.string().min(10).max(200).required().trim(),
        status: Joi.string().valid('pending', 'processed', 'shipped', 'delivered', 'canceled').required(),
        payment: Joi.string().required(), // Expecting ObjectId as a string
        delivery: Joi.string().required() // Expecting ObjectId as a string
    });

    return schema.validate(data);
};

// Export the validation function and model
module.exports = {
    validateOrder,
    orderModel
};
