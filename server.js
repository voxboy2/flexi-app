const express = require('express');
const connectDB = require('./config/db');
// var bodyParser = require('body-parser')

const app = express();


// connect Databse

connectDB();

// middlewares
app.use(express.json({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }))

// app.use(bodyParser.json())


// DEFINE routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
