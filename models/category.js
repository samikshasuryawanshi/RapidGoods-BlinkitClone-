// Import required modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Category Schema for Mongoose
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique:true,
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [50, 'Category name cannot exceed 50 characters']
    }
}, { timestamps: true });

// Create the Mongoose model
const categoryModel = mongoose.model('category', categorySchema);

// Define the Joi validation schema
const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required().trim()
    });

    return schema.validate(data);
};

// Export the validation function and model
module.exports = {
    validateCategory,
    categoryModel
};
