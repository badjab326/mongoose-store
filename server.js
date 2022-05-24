// Dependencies
const express = require('express');
const app = express();
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const Product = require('./models/products.js');

// Database Connection
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));

// Routes

// Seed
const productSeed = require('./models/productSeed.js');

app.get('/store/seed', (req, res) => {
	Product.deleteMany({}, (error, allProducts) => {});

	Product.create(productSeed, (error, data) => {
		res.redirect('/store');
	});
});

// Create
app.post('/store', (req, res) => {
	if (req.body.qty === '0') {
		//if 0 product wont be available for purchase
		req.body.qty = 'Not Available';
    }

	Product.create(req.body, (error, createdProduct) => {
		res.redirect('/store');
	});
});

// New
app.get('/store/new', (req, res) => {
	res.render('new.ejs');
});

//Index
app.get('/store', (req, res) => {
	Product.find({}, (error, allProducts) => {
		res.render('index.ejs', {
			products: allProducts,
		});
	});
});

// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));