const { check, validationResult } = require('express-validator');
const config = require('config');
const request = require('request');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


exports.getMe = async (req,res) => {
    
        try{
            // we bring in the name and avatar from user
            const profile = await Profile.findOne({ user: req.user.id }).populate(
                'user', ['name', 'avatar']
            );
    
            if(!profile) {
                return res.status(400).json({ msg: 'There is no profile for this user'});
            }
    
            // if there is no profile we send along the profile
            res.json(profile);
    
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    
}

exports.addProfile = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profile object
    const profileFields = {};

    // profilefields user
    profileFields.user = req.user.id;

    // we check if the data we pulled out is actually coming in before we set it

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;


    try {
    //    we search for profile by the user
       let profile = await Profile.findOne({ user:req.user.id });

       if(profile) {
         profile = await Profile.findOneAndUpdate(
             { user: req.user.id},
            //  set profile fields
             { $set: profileFields},
             { new: true }
         );

         return res.json(profile);
       }
       
    //  create profile
    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Eror')
    }

    res.send('hello');
}

exports.getProfiles = async(req,res) => {

    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}

exports.getProfileById = async(req,res) => {
    
    try{
        // we find the profile of the user by id
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar'])

        if(!profile) return res.status(400).json({ msg: 'There is no profile for this user'})

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
               return res.status(400).json({ msg: 'There is no profile for this user'})
        }
        res.status(500).send('Server Error')
    }
}

exports.delete = async(req,res) => {
    try{
        // we find the profile of the user by id and remove the user
        await Profile.findOneAndRemove({ user: req.user.id });

        // remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}

exports.addExperience = async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try{
        const profile = await Profile.findOne({ user: req.user.id })
        
        profile.experience.unshift(newExp);

        res.json(profile);

    } catch(err) {

        console.error(err.message);

        res.status(500).send('Server Error')
    }
 
}


exports.deleteExperience = async(req, res) => {
    try{
       const profile = await Profile.findOne({ user: req.user.id }) 

    //    get remove index

    // map thorugh the experience 
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    // use of splice because we want to take out one
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


exports.addEducation = async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
       school,
       degree,
       fieldofstudy,
       from,
       to,
       current,
       description
    }

    try{
        const profile = await Profile.findOne({ user: req.user.id })
        
       //  add to the profile experience
        profile.experience.unshift(newEdu);

        await profile.save();

        res.json(profile);
        

    } catch(err) {

        console.error(err.message);

        res.status(500).send('Server Error')
    }
 
}

exports.deleteEducation = auth, async(req, res) => {
    try{
       const profile = await Profile.findOne({ user: req.user.id }) 

    //    get remove index
    // map thorugh the education
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id);

    // use of splice because we want to take out one
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


exports.githubRepo = auth, async(req,res) => {
        try{
            const options = {
              uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
              sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
              method: 'GET',
              headers: { 'user-agent' : 'node.js'}
            };
    
            request(options, (error, response, body) => {
                 if(error) console.error(error);
    
                 if(response.statusCode !== 200) {
                     res.status(404).json({ msg: 'No Github profile found'})
                 }
    
                 res.json(JSON.parse(body));
    
            });
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        } 
}