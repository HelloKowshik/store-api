const Products = require('../models/productModel');

module.exports.getAllProductsTest = async (req, res) => {
  const search = 'al';
  // const products = await Products.find({
  //   name: { $regex: search, $options: 'i' },
  // });

  // const products = await Products.find({}).sort('name -price');
  const products = await Products.find({ price: { $gt: 100 } })
    .sort('name price')
    .select('name price')
    .limit(10);
  res.status(200).json({ total: products.length, data: products });
};

module.exports.getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numberFilter } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = { $regex: company, $options: 'i' };
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  // const products = await Products.find(queryObject);
  let product = Products.find(queryObject);
  if (sort) {
    const sl = sort.split(',').join(' ');
    product = product.sort(sl);
  } else {
    product = product.sort('createdAt');
  }
  if (fields) {
    const fl = fields.split(',').join(' ');
    product = product.select(fl);
  }

  if (numberFilter) {
    const charMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numberFilter.replace(regEx, (match) => `-${charMap[match]}-`);
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  product = product.skip(skip).limit(limit);

  const products = await product;
  res.status(200).json({ total: products.length, data: products });
};

//5:06:00
