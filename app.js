require('dotenv').config();
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./db/connect');
const swaggerJsDoc = require('./utils/swagger');

const v1Router = require('./routes');

const app = express();

app.use(express.json());
// extra security package
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(morgan('dev'));

// routes
app.use('/v1', v1Router);

// health check api
app.get('/health-check', (request, response) => response.status(200).send({ message: 'healthy' }));

// swagger api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

// TODO: error handler
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // await connectDB(process.env.LOCAL_STRING);
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

start();
