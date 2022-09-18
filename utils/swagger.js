const swaggerJsDoc = require('swagger-jsdoc');

module.exports = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jungle Meet Apis Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for JungleMeet Queuing',
    },
  },
  apis: ['controllers/*.js'],
});
