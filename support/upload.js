const multer = require('multer');
const path = require('path');

const saveTo = path.join(__dirname, './../public/images/profiles');

const storage = multer.diskStorage({
    destination(req, files, cb) {
        cb(null, saveTo);
    },
    filename(req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') return cb(new Error('only support for jpg, jpeg and png images'));
        const ext = file.originalname.split('.');
        return cb(null, `${file.fieldname}-${Date.now()}.${ext[1]}`);
    },
});

module.exports = multer({ storage });
