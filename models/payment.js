// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Payment Schema for Mongoose
const paymentSchema = mongoose.Schema({
    orderId :{
        type : String,
        required :true,
    },
    paymentId:{
        type:String,
    },
    signature:{
        type:String,
    },
    amount:{
        type:Number,
        required:true,
    },
    currency:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"pending",
    },
});

// Create the Mongoose model
const paymentModel = mongoose.model('payment', paymentSchema);

// Export the validation function and model
module.exports = {
    paymentModel
};
