import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const docOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Game API with Swagger",
      version: "0.1.0",
      description: "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Game",
        url: "https://test.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: ["bearer"],
      },
    ],
  },
  apis: ["./src/docs/*.yml"],
};

export default docOptions;
