const swaggerJsDoc = require('swagger-jsdoc');

module.exports = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jungle Meet Apis Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for JungleMeet Queuing',
    },
    servers: [
      {
        url: 'http://localhost:3000/v1',
        description: 'Local Server',
      },
    ],
  },
  apis: ['controllers/*.js'],
});
