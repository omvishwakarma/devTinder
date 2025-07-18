const validator = require('validator')

const validatingSignupData = (data) => {
    const {firstName, lastName, emailId, age, gender, password, skills} = data

    if(!validator.isEmail(emailId)){
        throw new Error('Invalid email')
    }

    if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong')
    }

    if(!validator.isNumeric(age)){
        throw new Error('Age must be a number')
    }

    if(!validator.isIn(gender, ['male', 'female', 'other'])){
        throw new Error('Invalid gender')
    }
    
    
}

const validateEditProfileData = (data) => {
    const {firstName, lastName, age, gender, skills} = data
    if(!validator.isAlpha(firstName)){
        throw new Error('First name must be a string')
    }
    if(!validator.isAlpha(lastName)){
        throw new Error('Last name must be a string')
    }
    if(!validator.isNumeric(age)){
        throw new Error('Age must be a number')
    }

    if(!validator.isIn(gender, ['male', 'female', 'other'])){
        throw new Error('Invalid gender')
    }

    
}

module.exports = {
    validatingSignupData
}