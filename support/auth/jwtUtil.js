const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET = '1312@#$%121&*95';

const createJWT = (user) => {
    const payload = {
        email: user.email,
        id: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix(),
    };
    return jwt.encode(payload, SECRET);
};

module.exports.sendJWT = (user, res) => {
    const token = createJWT(user);
    return res.send({ token });
};

module.exports.decodeJWT = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    return jwt.decode(token, SECRET);
};
