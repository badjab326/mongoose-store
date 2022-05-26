const express = require('express');
const Product = require('../models/products.js');

const router = express.Router();

// Routes

// Seed
const productSeed = require('../models/productSeed.js');

router.get('/seed', (req, res) => {
	Product.deleteMany({}, (error, allProducts) => {});

	Product.create(productSeed, (error, data) => {
		res.redirect('/store')
	})
});

// Create
router.post('/', (req, res) => {
	Product.create(req.body, (error, createdProduct) => {
		res.redirect('/store')
	})
});

// New
router.get('/new', (req, res) => {
	res.render('new.ejs')
});

//Index
router.get('/', (req, res) => {
	Product.find({}, (error, allProducts) => {
		res.render('index.ejs', {
			products: allProducts,
		})
	})
});

// Show
router.get('/:id', (req, res) => {
    if (req.body.qty === '0') {
		//if 0 product wont be available for purchase
		req.body.qty === 'OUT OF STOCK';
    }

	Product.findById(req.params.id, (err, foundProduct) => {
		res.render('show.ejs', {
			product: foundProduct,
            index: req.params.id
		})
	})
});

// Edit
router.get('/:id/edit', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
		res.render('edit.ejs', {
			product: foundProduct,
            index: req.params.id
		})
	})
});

// Update
router.put('/:id', async (req, res) => {
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        price: req.body.price,
        qty: req.body.qty,
        index: req.params.id
    }
    await Product.findOneAndUpdate({index: req.params.id}, updatedProduct)
    res.redirect(`/store/${req.params.id}`)
});

// Buy
router.put("/:id/buy", (req, res) => {
    Product.findByIdAndUpdate(
      req.params.id,
      {$inc: {qty: -1}},
      {
        new: true,
      },
      (error, updatedProduct) => {
        res.redirect(`/store/${req.params.id}`)
      }
    )
  });

// Delete
router.delete("/:id", (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, data) => {
      res.redirect("/store")
    })
  });


// Exports
module.exports = router;