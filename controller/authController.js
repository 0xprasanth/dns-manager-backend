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
  // const isUserExist = await prisma.user.findUnique({
  //   where: { email: email },
  // });

  // if (isUserExist) {
  //   return res.status(400).json({
  //     meesage: `User with ${email} already exist`,
  //   });
  // }

  // if it is new user, hash password and insert into DB

  // Create user and push into DB
  try {
    const cryptPassword = await hashedPassword(password);
    // const createUser = await prisma.user.create({
    //   data: {
    //     email: email,
    //     password: cryptPassword,
    //     username: username,
    //   },
    //   select: {
    //     id: true,
    //     email: true,
    //     username: true,
    //   },
    // });
    const createUser = await userModel.create({
      username: username,
      email: email,
      password: cryptPassword
    });

    // generate access token
    const accesstoken = this.createSendToken(createUser, res);

    createUser.password = undefined;

    // if success
    res.status(201).json({
      message: "successed",
      data: createUser,
      accesstoken,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("given", email);

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide a email and password" });
  }

  // const muser = await prisma.user.findUnique({
  //   where: { email: email },
  // });

  try {
    // if user not found
    const user = await userModel.findOne({
      email: email
    })

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Email ID does not exist. Please check again",
      });
    }

    //validate passwd
    const passwordMatch = await validatePassword(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid password. Check again!" });
    }

    const accesstoken = this.createSendToken(user, res);
    //eliminate the password field!!
    user.password = undefined;

    res.status(200).json({
      message: "success",
      accesstoken,
      data: user,
    });

  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(500).json({
      message: ``,
    });
  }
};
