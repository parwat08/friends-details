const router = require('express').Router();
const jwtUtil = require('./../support/auth/jwtUtil');
const verifyUser = require('./../support/auth/verifyUser');

const Friend = require('./../models/friend');

/* eslint-disable no-underscore-dangle */
router.route('/friends')
    .get(verifyUser, (req, res) => {
        const user = jwtUtil.decodeJWT(req);
        Friend.find({ userId: user.id }, (err, friends) => {
            if (err) return res.status(500).send(err);
            if (friends.length === 0) {
                return res.json({
                    response: [],
                    message: 'First Insert Some friends detail',
                });
            }
            return res.send(friends);
        });
    })
    .post(verifyUser, (req, res) => {
        const user = jwtUtil.decodeJWT(req);
        const data = {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            userId: user.id,
        };
        Friend.create(data, (err, friend) => {
            if (err) return res.status(500).send(err);
            return res.send(friend);
        });
    });

router.route('/friend/:id')
    .get(verifyUser, (req, res) => {
        const _id = req.params.id;
        const user = jwtUtil.decodeJWT(req);
        Friend.findOne({ _id, userId: user.id }, (e, f) => {
            if (e) return res.status(500).send(e);
            return res.send(f);
        });
    })
    .put(verifyUser, (req, res) => {
        const _id = req.params.id;
        const user = jwtUtil.decodeJWT(req);
        const data = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
        };
        if (req.body.phone) {
            data.phone = req.body.phone;
        }
        Friend.findOneAndUpdate({ _id, userId: user.id }, { $set: data }, { new: true }
            , (err, friend) => {
                if (err) return res.status(500).send(err);
                return res.send(friend);
            });
    })
    .delete(verifyUser, (req, res) => {
        const _id = req.params.id;
        const user = jwtUtil.decodeJWT(req);
        Friend.findOneAndRemove({ _id, userId: user.id }, (err, resp) => {
            if (err) return res.status(500).send(err);
            return res.json({
                message: `friend with id: ${_id} removed`,
                friend: resp,
            });
        });
    });

module.exports = router;
