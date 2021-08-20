const multer = require('multer');

const upload = (destination, type, fileSize) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
        },
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === type) {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('A extensão do arquivo é inválida'));
        }
    };

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: fileSize,
        },
    });
};

module.exports = upload;
