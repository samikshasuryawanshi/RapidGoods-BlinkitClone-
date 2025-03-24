// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Admin Schema for Mongoose
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength:3,
        maxlength:50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['admin', 'superadmin'], // Assuming there are specific roles
        default: 'admin'
    }
}, { timestamps: true });

// Create the Mongoose model
const adminModel = mongoose.model('admin', adminSchema);

// Define the Joi validation schema
const validateAdmin = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required().trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'superadmin').required() // Validate against allowed roles
    });

    return schema.validate(data);
};

// Export the validation function and model
module.exports = {
    validateAdmin,
    adminModel
};
