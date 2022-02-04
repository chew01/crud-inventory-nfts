var Product = require('../models/product');
var Category = require('../models/category');

exports.product_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Product list');
};

exports.product_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: Product details' + req.params.id);
};

exports.product_create_get = (req, res, next) => {
  Category.find()
    .sort()
    .exec((err, result) => {
      if (err) next(err);
      res.render('product_form', {
        title: 'Create new product',
        categories: result,
      });
    });
};

exports.product_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Product create post');
};

exports.product_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete get');
};

exports.product_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete post');
};

exports.product_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Product update get');
};

exports.product_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Product update post');
};
