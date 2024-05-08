const { default: mongoose } = require("mongoose");
const userModel = require("../model/Users");

const {
  signToken,
  hashedPassword,
  validatePassword,
} = require("../utils/validate");

exports.createSendToken = (user, res) => {
    const token = signToken(user.id);

    const CookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    // update for PROD server
    if (process.env.NODE_ENV==="production") {
        CookieOptions.secure = true;
    }
    
    res.cookie("jwt", token, CookieOptions);

    // update the cookie 
    // return the token
    return token;
};

exports.signup = async (req, res) => {
    const data = req.body
    console.log(data);
    // Check for existing USer
    const isUserExist = await userModel.find({
        email: {$eq: "kyle"}
    })

    if(isUserExist){
        return res.status(400).json({
            meesage: `User with ${email} already exist`
        })
    }

    // if it is new user, hash password and insert into DB
    const cryptPassword = await hashedPassword(password);

    // Create user and push into DB

    try{
        const user = await userModel.create({
            username, email, password: cryptPassword
        })

        // generate access token
        const accesstoken = this.createSendToken(user, res);

        // if success
        res.status(201).json({
            message: "successed",
            data: user,
            accesstoken
        });
    }catch(error){
        res.status(500).json({
            message: `Error: ${error.meesage}`
        })
    }
};

exports.login = async (req, res) => {
  res.status(200).json({
    message: "Hello from /login",
  });
};
