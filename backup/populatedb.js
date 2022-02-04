#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Product = require('./models/product');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = [];
var categories = [];

function categoryCreate(name, description, cb) {
  var category = new Category({ name, description });

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function productCreate(name, description, category, price, stock, cb) {
  var product = new Product({ name, description, category, price, stock });

  product.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Product: ' + product);
    products.push(product);
    cb(null, product);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'Early 2000s',
          'Memes created in the early 2000s',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Late 2000s',
          'Memes created in the late 2000s',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Early 2010s',
          'Memes created in the early 2010s',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Late 2010s',
          'Memes created in the late 2010s',
          callback
        );
      },
      function (callback) {
        categoryCreate('2020s', 'Memes created in the 2020s', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createProducts(cb) {
  async.parallel(
    [
      function (callback) {
        productCreate(
          'Numa Numa Video',
          'Numa Numa is a video created by New Jersey amateur videographer Gary Brolsma, in which he performs a lip dub of the song "Dragostea din tei" by the Moldovan pop group O-Zone. Since its online debut on Newgrounds in December of 2004, the video has gained significant fame both online and offline for its parodies and re-enactment videos.',
          categories[0],
          100,
          2,
          callback
        );
      },
      function (callback) {
        productCreate(
          'Chocolate Rain',
          'Chocolate Rain is a viral video created by Tay Zonday featuring a performance of his song "Chocolate Rain" that he wrote and produced. The video has been parodied and remixed in thousands of instances, eventually leading to Tay himself appearing on a number of television shows and being parodied on South Park.',
          categories[1],
          80,
          3,
          callback
        );
      },
      function (callback) {
        productCreate(
          "Mom's spaghetti",
          'Mom\'s Spaghetti is a bait-and-switch copypasta derived from the lyrics of Eminem\'s 2002 hit rap single "Lose Yourself." Originating from the 4chan imageboard community, it is a notable example of spaghetti stories that usually start out as a personal anecdote about an embarrassing or socially awkward episode before ending abruptly with a sudden appearance of spaghetti.',
          categories[2],
          70,
          1,
          callback
        );
      },
      function (callback) {
        productCreate(
          'Salt Bae',
          'Salt Bae is a nickname given to Turkish chef Nusret Gökçe, who was widely discussed on social media following the circulation of a viral video in which he flamboyantly sprinkles salt on a carved steak.',
          categories[3],
          140,
          2,
          callback
        );
      },
      function (callback) {
        productCreate(
          'Amogus',
          'Amogus is a bastardized version of the name of the 2018 video game Among Us. In January 2021, the word gained popularity as a catchphrase used in ironic memes, often used to replace dialogue in cartoons, and as a way of shitposting by spamming the phrase alongside sus. Additionally, Amogus refers to the simplified drawing of a crewmate from Among Us used in the memes.',
          categories[4],
          200,
          3,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createProducts],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Products: ' + products);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
