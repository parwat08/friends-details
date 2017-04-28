module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) return next();
    const err = new Error('Not Authenticated, Login First');
    err.status = 401;
    return next(err);
};
