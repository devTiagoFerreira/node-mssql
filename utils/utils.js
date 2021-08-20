const fs = require('fs');

exports.fileRemove = (path) => {
    fs.unlinkSync(path);
};
