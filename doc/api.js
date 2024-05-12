const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const app = require('../app');
const { version } = require('mongoose');



const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DNS Manager API Doc",
            version: "0.1",
            desription: "Develop backend API for automating management of domains and DNS records in bulk on AWS Route 53. ",
            contact: {
                name: "Prasanth A R",
                url: "github.com/ptech12",
            }
        },
        servers: [
            {
                url: "https://dns-manager-backend-production.up.railway.app"
            }
        ]
    },
    apis: ["../routes/*.js", "../app.js"]
}


const spacs = swaggerjsdoc(options)



module.exports = spacs;