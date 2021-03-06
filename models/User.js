const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String
    },

    resetPasswordToken: {
        type: String,
        required: false
    },
  
    resetPasswordExpires: {
        type: Date,
        required: false
    },

    date: {
        type: Date,
        default: Date.now
    }
});


UserSchema.pre('save',  function(next) {
    const user = this;
 
    if (!user.isModified('password')) return next();
 
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
 
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
 
            user.password = hash;
            next();
        });
    });
 });
 
 
 
 UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
 };
 
 
 
 
 UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
 };

module.exports = User = mongoose.model('user', UserSchema);