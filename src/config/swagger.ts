import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reddit API',
      version: '1.0.0',
      description: 'Reddit is a social media platform where users share and discuss content.',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ["src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
