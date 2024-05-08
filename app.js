// app.js
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')



const app = express();

// middlewares
app.use(cors())
app.use(cookieParser())
app.disable("x-powered-by")

/**
 * api routes
*/
app.use('/api/v1', authRouter);



module.exports = app;
