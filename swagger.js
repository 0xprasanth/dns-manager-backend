const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DNS Manager API Doc",
      version: "0.1",
      desription:
        "Develop backend API for automating management of domains and DNS records in bulk on AWS Route 53. ",

      contact: {
        name: "Prasanth A R",
        email: "raviprasanth45@gmail.com",
        url: "github.com/ptech12",
      },
      version: "1.0.0",
    },
    servers: [
        {
          url: "https://dns-manager-backend-production.up.railway.app/api/v1",
          description: "Live Server",
        },
      {
        url: "http://localhost:3001/api/v1",
        description: "Local server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = swaggerDocs;
