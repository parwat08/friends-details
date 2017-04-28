const async = require('async');
const uuid = require('uuid');

const User = require('./../models/user');
const VerifyToken = require('./../models/verifyToken');
const MAILER = require('./mail/emailVerification');
const jwtUtil = require('./auth/jwtUtil');

module.exports = {
    signUp(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const token = uuid.v4();
        async.series([
            (cb) => {
                User.findOne({ email }, (err, user) => {
                    if (err) return cb(err);
                    if (user && !user.active) {
                        return cb({
                            message: 'Email has already been Registered BUT',
                            status: 'not verified',
                            active: false,
                        });
                    }
                    if (user && user.active) {
                        return cb({
                            message: 'Email has Already been Registered AND',
                            status: 'verified',
                            active: true,
                        });
                    }
                    const data = {
                        email,
                        password,
                    };
                    const u = new User(data);
                    u.save((er) => {
                        if (er) return cb(er);
                        return cb(null, 'user created');
                    });
                });
            },
            (cb) => {
                const data = {
                    token,
                    email,
                };
                VerifyToken.create(data, (err, info) => {
                    if (err) return cb(err);
                    return cb(null, info);
                });
            },
            (cb) => {
                const link = `${req.protocol}://${req.hostname}:${req.socket.address().port}/api/verify?token=${token}`;
                const options = {
                    to: req.body.email,
                    html: `Hello, <br>Click on the link to verify your email.<br><a href=${link}>click to verify</a>`,
                };
                MAILER.send(options, (err, info) => {
                    if (err) return cb(err);
                    return cb(null, info);
                });
            },
        ], (err, result) => {
            if (err) return res.send(err);
            return res.send(result);
        });
    },
    verifyEmail(req, res) {
        const token = req.query.token;
        async.waterfall([
            (cb) => {
                VerifyToken.findOne({ token }, (err, resp) => {
                    if (err) return cb(err);
                    if (resp) return cb(null, resp);
                    return cb('Not a Valid Token! Maybe Expired One');
                });
            },
            (resp, cb) => {
                const email = resp.email;
                User.findOne({ email }, (err, user) => {
                    if (err) return cb(err);
                    if (!user) return cb('no user');
                    user.active = true;
                    user.save((err1) => {
                        if (err1) return cb(err1);
                        return cb(null, 'account verified, go to login page');
                    });
                });
            },
        ], (err, result) => {
            if (err) return res.send(err);
            return res.send(result);
        });
    },
    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({ email }, (err, user) => {
            if (err) return res.status(500).send(err);
            if (!user) return res.status(400).send('email is not registered');
            if (!user.active) return res.send('This account is not verified! Check email to verify');
            User.comparePassword(password, user.password, (err1, match) => {
                if (err) return res.status(500).send(err1);
                if (match) return jwtUtil.sendJWT(user, res);
                return res.send('Wrong Password');
            });
        });
    },
};
