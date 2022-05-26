// Dependencies
const express = require('express');
const methodOverride = require("method-override");
const app = express();
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const Product = require('./models/products.js');
const storeController = require('./controllers/store.js')

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
app.use(express.static('style'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use('/store', storeController)

// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));