require('dotenv').config();
require('express-async-errors');
const express = require('express');
const notFoundMiddleWire = require('./middlewires/not-found');
const errorMiddleWire = require('./middlewires/error-handler');
const connectDB = require('./db/connect');
const productRouter = require('./routes/router');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products Route</a>');
});

app.use('/api/v1/products', productRouter);

app.use(notFoundMiddleWire);
app.use(errorMiddleWire);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log('OK', PORT));
  } catch (err) {
    console.log(err);
  }
};

start();
