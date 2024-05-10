// const { default: mongoose } = require("mongoose");
// const userModel = require("../model/Users");

const { prisma } = require("../db");

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
  };

  // update for PROD server
  if (process.env.NODE_ENV === "production") {
    CookieOptions.secure = true;
  }

  res.cookie("jwt", token, CookieOptions);

  // update the cookie
  // return the token
  return token;
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Check for existing USer
  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (isUserExist) {
    return res.status(400).json({
      meesage: `User with ${email} already exist`,
    });
  }

  // if it is new user, hash password and insert into DB
  const cryptPassword = await hashedPassword(password);

  // Create user and push into DB
  try {
    const createUser = await prisma.user.create({
      data: {
        email: email,
        password: cryptPassword,
        username: username,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    // generate access token
    const accesstoken = this.createSendToken(createUser, res);

    // if success
    res.status(201).json({
      message: "successed",
      data: createUser,
      accesstoken,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error.message}`,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('given', email  );
  
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide a email and password" });
  }

  const muser = await prisma.user.findUnique({
    where: { email: email },
  });

  // if user not found
  if (!muser) {
    return res.status(401).json({
        status: 401,
        message: "Email ID does not exist. Please check again"
    });
  }
  
  //validate passwd
  const passwordMatch = await validatePassword(password, muser.password);

  if (!passwordMatch) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid password. Check again!" });
  }

  const accesstoken = this.createSendToken(user, res);
  //eliminate the password field!!
  museruser.password = undefined;

  res.status(200).json({
    message: "success",
    accesstoken,
    data: muser,
  });

};
