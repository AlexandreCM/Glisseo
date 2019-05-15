// telechargement des fichiers PDF

const mime = require('mime-types');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/pdf');
    },
    filename: function (req, file, cb) {
        var extension = "." + mime.extension(file.mimetype);
        file.fieldname = file.originalname.replace(new RegExp(extension, 'gi'), '');
        cb(null, file.fieldname + extension);
    }
});

module.exports = multer({ storage: storage });