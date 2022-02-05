var Product = require('../models/product');
var Category = require('../models/category');
const { body, validationResult } = require('express-validator');
var async = require('async');

exports.product_list = (req, res, next) => {
  Product.find()
    .sort({ name: 1 })
    .exec((err, result) => {
      if (err) return next(err);
      res.render('product_list', {
        title: 'Product List',
        product_list: result,
      });
    });
};

exports.product_detail = (req, res, next) => {
  Product.findById(req.params.id)
    .populate('category')
    .exec((err, result) => {
      if (err) next(err);
      if (result == null) {
        var err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      res.render('product_detail', { product: result });
    });
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

exports.product_create_post = [
  // validation
  body('name', 'Product name required').trim().isLength({ min: 1 }).escape(),
  body('description').escape(),
  body('category', 'Category must be selected')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Price cannot be negative')
    .isLength({ min: 1 })
    .withMessage('Price must be stated')
    .escape(),
  body('stock')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Stock cannot be negative')
    .isLength({ min: 1 })
    .withMessage('Stock must be stated')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      Category.find()
        .sort()
        .exec((err, result) => {
          if (err) return next(err);
          res.render('product_form', {
            title: 'Create new product',
            categories: result,
            product: product,
            errors: errors.array(),
          });
        });
      return;
    } else {
      Product.findOne({ name: req.body.name }).exec((err, result) => {
        if (err) return next(err);
        if (result) {
          res.redirect(result.url);
        } else {
          product.save((err) => {
            if (err) return next(err);
            res.redirect(product.url);
          });
        }
      });
    }
  },
];

exports.product_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete get');
};

exports.product_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Product delete post');
};

exports.product_update_get = (req, res, next) => {
  async.parallel(
    {
      product: (callback) => {
        Product.findById(req.params.id).exec(callback);
      },
      categories: (callback) => {
        Category.find().sort().exec(callback);
      },
    },
    (err, result) => {
      if (err) return next(err);
      if (result.product == null) {
        var err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      res.render('product_form', {
        title: 'Update product',
        product: result.product,
        categories: result.categories,
      });
    }
  );
};

exports.product_update_post = [
  // validation
  body('name', 'Product name required').trim().isLength({ min: 1 }).escape(),
  body('description').escape(),
  body('category', 'Category must be selected')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Price cannot be negative')
    .isLength({ min: 1 })
    .withMessage('Price must be stated')
    .escape(),
  body('stock')
    .trim()
    .isInt({ min: 0 })
    .withMessage('Stock cannot be negative')
    .isLength({ min: 1 })
    .withMessage('Stock must be stated')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      Category.find()
        .sort()
        .exec((err, result) => {
          if (err) return next(err);
          res.render('product_form', {
            title: 'Update product',
            categories: result,
            product: req.body,
            errors: errors.array(),
          });
        });
      return;
    } else {
      var product = new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        _id: req.params.id,
      });
      Product.findByIdAndUpdate(
        req.params.id,
        product,
        {},
        (err, updated_product) => {
          if (err) next(err);
          res.redirect(updated_product.url);
        }
      );
    }
  },
];
