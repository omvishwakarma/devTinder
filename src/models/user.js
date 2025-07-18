const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email');
            }
        },
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
        required: true,
        minlength: 8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password is not strong');
            }
        },
    },
    skills:{
        type: [String],
        required: true,
    }
}, {
    timestamps: true, // this will add createdAt and updatedAt fields to the schema 
} )

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "Dev@Tinder$1301", {expiresIn: "1d"}); // expires in 1 day
    return token;
}

userSchema.methods.isValidPassword = async function(password){
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}



const userModel = mongoose.model('User', userSchema);

module.exports = userModel;