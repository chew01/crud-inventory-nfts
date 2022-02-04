var Category = require('../models/category');
var Product = require('../models/product');
const { body, validationResult } = require('express-validator');
const async = require('async');

exports.category_list = (req, res, next) => {
  Category.find()
    .sort()
    .exec((err, result) => {
      if (err) return next(err);
      res.render('category_list', {
        title: 'Category List',
        category_list: result,
      });
    });
};

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category: (callback) => {
        Category.findById(req.params.id).exec(callback);
      },
      category_products: (callback) => {
        Product.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, result) => {
      if (err) return next(err);
      if (result == null) {
        var err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
      console.log(result.category_products);
      res.render('category_detail', {
        category: result.category,
        category_products: result.category_products,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.render('category_form', { title: 'Create new category' });
};

exports.category_create_post = [
  // validate and sanitize
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
  body('description').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // error exists, render form again with errors
      res.render('category_form', {
        title: 'Create new category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // form is valid
      Category.findOne({ name: req.body.name }).exec((err, result) => {
        if (err) return next(err);
        if (result) {
          // category exists, redirect to the page
          console.log(result.url);
          res.redirect(result.url);
        } else {
          // category does not exist, create and redirect to new page
          category.save((err) => {
            if (err) return next(err);
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

exports.category_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete get');
};

exports.category_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Category delete post');
};

exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) return next(err);
    if (category == null) {
      var err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category_form', {
      title: 'Update category',
      category: category,
    });
  });
};

exports.category_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Category update post');
};
