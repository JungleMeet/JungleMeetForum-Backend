const swaggerJsDoc = require('swagger-jsdoc');

module.exports = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Virtual Queuing Apis Documentation',
      version: '1.0.0',
      contact: {
        name: 'Roy',
        email: 'wanyansuroy@gmail.com',
      },
      description: 'This is the API documentation for Virtual Queuing',
    },
  },
  apis: ['controllers/*.js'],
});
