// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Payment Schema for Mongoose
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: [true, 'Order reference is required']
    },
    amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    method: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: ['credit_card', 'debit_card', 'UPI', 'cash', 'bank_transfer'], // Assuming these are possible methods
    },
    status: {
        type: String,
        required: [true, 'Payment status is required'],
    },
    transactionId: {
        type: String,
        required: [true, 'Transaction ID is required'],
        trim: true,
        unique: true,
    }
}, { timestamps: true });

// Create the Mongoose model
const paymentModel = mongoose.model('payment', paymentSchema);

// Define the Joi validation schema
const validatePayment = (data) => {
    const schema = Joi.object({
        order: Joi.string().required(), // Expecting ObjectId as a string
        amount: Joi.number().min(0).required(),
        method: Joi.string().valid('credit_card', 'debit_card', 'UPI', 'cash', 'bank_transfer').required(),
        status: Joi.string().required(),
        transactionId: Joi.string().required().trim()
    });

    return schema.validate(data);
};

// Export the validation function and model
module.exports = {
    validatePayment,
    paymentModel
};
