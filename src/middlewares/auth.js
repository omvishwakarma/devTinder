const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    // get the token from the request
    // verify the token
    // get the user id from the token
    // get the user from the database
    // if the user is not found, return an error
    // if the user is found, add the user to the request
    // call the next middleware
    try{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    const decodedMsg = await jwt.verify(token, "Dev@Tinder$1301");
    const {_id} = decodedMsg;
    const user = await User.findOne({_id});
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
    } catch(error){
        res.status(400).send("Error getting user=>", error.message);
    }


}

module.exports = userAuth;