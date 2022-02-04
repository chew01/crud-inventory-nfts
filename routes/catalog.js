var express = require('express');
var router = express.Router();

var indexController = require('../controllers/indexController');
var categoryController = require('../controllers/categoryController');
var productController = require('../controllers/productController');

// GET home page
router.get('/', indexController.index);

// CATEGORY //

// GET create category
router.get('/categories/create', categoryController.category_create_get);

// POST create category
router.post('/categories/create', categoryController.category_create_post);

// GET delete category
router.get('/categories/:id/delete', categoryController.category_delete_get);

// POST delete category
router.post('/categories/:id/delete', categoryController.category_delete_post);

// GET update category
router.get('/categories/:id/update', categoryController.category_update_get);

// POST update category
router.post('/categories/:id/update', categoryController.category_update_post);

// GET category details
router.get('/categories/:id', categoryController.category_detail);

// GET category list
router.get('/categories', categoryController.category_list);

// PRODUCT //

// GET create product
router.get('/products/create', productController.product_create_get);

// POST create product
router.post('/products/create', productController.product_create_post);

// GET delete product
router.get('/products/:id/delete', productController.product_delete_get);

// POST delete product
router.post('/products/:id/delete', productController.product_delete_post);

// GET update product
router.get('/products/:id/update', productController.product_update_get);

// POST update product
router.post('/products/:id/update', productController.product_update_post);

// GET product details
router.get('/products/:id', productController.product_detail);

// GET product list
router.get('/products', productController.product_list);

module.exports = router;
