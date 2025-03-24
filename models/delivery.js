// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Delivery Schema for Mongoose
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: [true, 'Order reference is required']
    },
    deliveryBoy: {
        type: String,
        required: [true, 'Delivery boy name is required'],
        trim: true,
        minlength: [3, 'Delivery boy name must be at least 3 characters long'],
        maxlength: [50, 'Delivery boy name cannot exceed 50 characters']
    },
    status: {
        type: String,
        required: [true, 'Delivery status is required'],
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], // Assuming these are possible statuses
        default: 'pending'
    },
    trackingUrl: {
        type: String,
    },
    estimatedDeliveryTime: {
        type: Number,
        min: [0, 'Estimated delivery time cannot be negative'],
        required: [true, 'Estimated delivery time is required']
    }
}, { timestamps: true });

// Create the Mongoose model
const deliveryModel = mongoose.model('delivery', deliverySchema);

// Define the Joi validation schema
const validateDelivery = (data) => {
    const schema = Joi.object({
        order: Joi.string().required(), // Expecting ObjectId as a string
        deliveryBoy: Joi.string().min(3).max(50).required().trim(),
        status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').required(),
        trackingUrl: Joi.string().uri(),
        estimatedDeliveryTime: Joi.number().min(0).required()
    });

    return schema.validate(data);
};

// Export the validation function and model
module.exports = {
    validateDelivery,
    deliveryModel
};
