const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const saltRounds = 10;

const user = new Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: Number,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

user.pre('save', function (next) {
    const u = this;
    if (!u.isModified('password')) return next();
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(u.password, salt, (e, hash) => {
            if (e) return next(e);

            u.password = hash;
            return next();
        });
    });
});

user.statics.comparePassword = function (enteredPassword, dbPassword, cb) {
    bcrypt.compare(enteredPassword, dbPassword, (err, matched) => {
        if (err) return cb(err);
        return cb(null, matched);
    });
};

module.exports = mongoose.model('user', user);
