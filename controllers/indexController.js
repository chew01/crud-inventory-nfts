var Product = require('../models/product');
var Category = require('../models/category');

var async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      products: (callback) => {
        Product.countDocuments({}, callback);
      },
      products_in_stock: (callback) => {
        Product.countDocuments({ stock: { $gt: 0 } }, callback);
      },
      products_out_of_stock: (callback) => {
        Product.countDocuments({ stock: 0 }, callback);
      },
      categories: (callback) => {
        Category.countDocuments({}, callback);
      },
      stock: (callback) => {
        Product.aggregate(
          [{ $group: { _id: null, totalStock: { $sum: '$stock' } } }],
          callback
        );
      },
    },
    (err, results) => {
      res.render('index', { title: 'Dashboard', error: err, results: results });
    }
  );
};
