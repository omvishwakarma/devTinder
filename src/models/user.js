const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fistName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
    },
    age:{
        type: Number,
        required: true,
        min: 18,
        max: 100,
    },
    gender:{
        type: String,
        required: true,
        validate(value){
            if(!['male', 'female', 'other'].includes(value)){
                throw new Error('Invalid gender');
            }
        },
        runValidators: true, // this will run the validator function before saving the data
    },
    password:{
        type: String,
    },
    skills:{
        type: [String],
        required: true,
    },
    createdAt:{
        type: Date,
    },
}, {
    timestamps: true, // this will add createdAt and updatedAt fields to the schema 
} )



const userModel = mongoose.model('User', userSchema);

module.exports = userModel;