const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../controllers/profile');


// @route to get your profile
router.get('/me', auth, Profile.getMe);

// add profiles 
router.post('/', [ auth,
    [check('status', 'Status is required').not().isEmpty(),
    check('skills', 'skills is required').not().isEmpty()]
], Profile.addProfile);

// get all profiles
router.get('/', Profile.getProfiles);


//  get profile by user id
router.get('/user/:user_id', Profile.getProfileById);


// delete 
router.delete('/', auth, Profile.delete);

// put request for experience
router.put('/experience', 
[auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'Form date is required').not().isEmpty()

]], Profile.addExperience);


router.delete('/experience/:exp_id', auth, Profile.deleteExperience);


router.put('/education', 
[auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'Form date is required').not().isEmpty()
]], Profile.addEducation );


router.delete('/education/:edu_id', Profile.deleteEducation);


router.get('/github/:username', Profile.githubRepo);

module.exports = router;