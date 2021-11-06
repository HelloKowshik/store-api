const {
  getAllProductsTest,
  getAllProducts,
} = require('../controllers/productController');

const productRouter = require('express').Router();

productRouter.route('/static').get(getAllProductsTest);
productRouter.route('/').get(getAllProducts);

module.exports = productRouter;
