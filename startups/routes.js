const express = require('express');
const users = require('../routes/api/users');

const posts = require('../routes/api/posts');
const profile = require('../routes/api/profile');
const auth = require('../routes/api/auth');


// we pass the app refrence

module.exports = function(app) {

    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/profile', profile);
    app.use('/api/auth', auth);
    app.use('/api/posts', posts);

}