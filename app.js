// app.js
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const dnsRecordRouter = require('./routes/dnsRecordRouter')
const bodyParser = require('body-parser')
const { mongoose } = require('mongoose');

require('dotenv').config({path: './.env'});

const swaggerui = require('swagger-ui-express');

const spacs = require('./doc/api')





/** DB connections */
// mongoose.connect(process.env.DB_URL);
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));


const app = express();

// middlewares
app.use(cors({
    origin: true
}))
// app.use(dotenv());
app.use(cookieParser())
app.disable("x-powered-by")
app.use(bodyParser.json())

app.use("/api/doc", swaggerui.serve, swaggerui.setup(spacs))

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
*/
app.get('/api/test', (req, res) => {
    res.json({
        "message": "Hello from /api/test"
    });

})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

app.use('/api/v1', authRouter);

app.use('/api/v1/domain/records', dnsRecordRouter);



module.exports = app;
