const multer = require('multer')
const httpStatus = require("../utils/httpStatusText");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `image-${Date.now()}.${ext}`;
        cb(null, filename)
    }
})


const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];

    if (imageType === 'image') {
        return cb(null, true);
    } else {
        return cb(appError.create('file must be an image', 400, httpStatus.FAIL), false);
    }
}


module.exports = {
    storage,
    fileFilter
}