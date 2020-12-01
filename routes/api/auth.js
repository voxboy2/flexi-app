const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');
const validate = require('../../routes/validate');
const Password = require('../../controllers/password');


// @route for get users
router.get('/', auth, Password.getUser);

// @route for get users
router.get('/users', Password.getallUsers);

// @route for login
router.post('/login', [
        check('email', 'Please include a valid email').isEmail(),
        check('password','Please is required').exists()
    ], Password.login );

// @route for forget password
router.post('/forgot-password', Password.forgotPassword);

// @route for reset password link
router.get('/reset/:token', Password.resetPasswordlink);

// @route for reset password
router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
], validate, Password.resetPassword);
















module.exports = router;