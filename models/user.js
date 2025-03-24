// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Address Schema for Mongoose
const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        trim: true,
        minlength:2,
        maxlength:50,
    },
    zip: {
        type: String,
        required: true,
        trim: true,
        min:10000,
        max:999999,
    },
    city: {
        type: String,
        required: true,
        trim: true,
        minlength:2,
        maxlength:50,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength:2,
        maxlength:250,
    }
});

// Define the User Schema for Mongoose
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength :3,
        maxlength :50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
        trim: true
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
        type: Number,
        match: [/^[0-9]{10}$/, 'Phone number must be a valid 10-digit number']
    },
    addresses: {
        type: [AddressSchema],
    }
}, { timestamps: true });


// Create the Mongoose model
const userModel = mongoose.model('user', userSchema);


// Define the Joi validation schema
const validateUser = (data) => {
   const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
    addresses: Joi.array()
    .items(
        Joi.object({
            state:Joi.string().min(2).max(50).required().trim(),
            zip:Joi.number().min(10000).max(999999).required().trim(),
            city:Joi.string().min(2).max(50).required().trim(),
            address:Joi.string().min(2).max(50).required().trim()
        })
    )
    .max(5),
   });

    return schema.validate(data);
};

// Export the validation function and model
module.exports = {
    validateUser,
    userModel
};
