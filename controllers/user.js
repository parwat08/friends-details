const router = require('express').Router();
const async = require('async');
const upload = require('./../support/upload');
const jwtUtil = require('./../support/auth/jwtUtil');
const verifyUser = require('./../support/auth/verifyUser');

const User = require('./../models/user');
const Friend = require('./../models/friend');

router.post('/image', verifyUser, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No Image Submitted');
    const name = req.file.filename;
    const path = `${req.protocol}://${req.hostname}:${req.socket.address().port}/images/profiles/${name}`;
    return res.send(path);
});

router.route('/profile')
    .get(verifyUser, (req, res) => {
        const user = jwtUtil.decodeJWT(req);
        const email = user.email;
        User.findOne({ email }, { password: 0, _id: 0, __v: 0 }, (err, d) => {
            if (err) return res.status(500).send(err);
            return res.send(d);
        });
    })
    .put(verifyUser, (req, res) => {
        const user = jwtUtil.decodeJWT(req);
        const data = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            image: req.body.image,
        };
        User.findOneAndUpdate({ email: user.email }, { $set: data }, { new: true }, (e, u) => {
            if (e) return res.status(500).send(e);
            return res.send(u);
        });
    })
    .delete((req, res) => {
        const user = jwtUtil.decodeJWT(req);
        async.parallel([
            (cb) => {
                User.findOneAndRemove({ email: user.email }, (err, u) => {
                    if (err) return cb(err);
                    return cb(null, {
                        message: `user with email ${user.email} removed`,
                        user: u,
                    });
                });
            },
            (cb) => {
                Friend.remove({ userId: user.id }, (err, f) => {
                    if (err) return cb(err);
                    return cb(null, f);
                });
            },
        ], (err, result) => {
            if (err) return res.status(500).send(err);
            return res.send(result);
        });
    });

module.exports = router;
