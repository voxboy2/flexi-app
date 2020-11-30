const express = require('express');
const connectDB = require('./config/db');
// var bodyParser = require('body-parser')

const app = express();


// require .env
require('dotenv').config()


// connect Databse

connectDB();

// middlewares
app.use(express.json({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }))

// app.use(bodyParser.json())


// DEFINE routes
require('./startups/routes')(app);

app.set('view engine', 'jade');



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
