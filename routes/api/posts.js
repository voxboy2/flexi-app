const { request } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator/check');

const auth = require('../../middleware/auth')


// @route

router.post('/', [auth, [
    check('text', 'Text is required')
       .not()
       .isEmpty()
]
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
});


module.exports = router;