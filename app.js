// app.js
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const dnsRecordRouter = require('./routes/dnsRecordRouter')
const bodyParser = require('body-parser')
require('dotenv').config({path: './.env'});

/** DB connections */
// mongoose.connect(process.env.DB_URL);


const app = express();

// middlewares
app.use(cors())
// app.use(dotenv());
app.use(cookieParser())
app.disable("x-powered-by")
app.use(bodyParser.json())

/**
 * api routes
*/
app.get('/api/test', (req, res) => {
    res.json({
        "message": "Hello from /api/test"
    });

})

app.use('/api/v1', authRouter);

app.use('/api/v1/domain/records', dnsRecordRouter);



module.exports = app;
