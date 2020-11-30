const { request } = require('express');
const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator/check');

const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')


// @route

router.post('/', [auth, [
    check('text', 'Text is required')
       .not()
       .isEmpty()
]
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }


    try{
        const user = await (await User.findById(req.user.id)).select('-password');

    const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }

    const post = await newPost.save();

    res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
});


router.get('/:id', auth, async(req,res) => {
    try{
       const post = await Post.findById(req.params.id); 

       if(!post) {
           return res.status(404).json({ msg: 'Post not found'})
       }
       res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async(req,res) => {
    try{
       const post = await Post.findById(req.params.id);

       if(!post) return res.status(404).json({ msg: 'Post not found' });


    //    check if its user
       if(post.user.toString() !== req.user.id) {
           return res.status(401).json({ msg: 'User not authorized'})
       }

       await post.remove();


       res.json({ msg: 'Post not found' });

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;