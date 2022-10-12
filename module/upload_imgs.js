const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
// uuid 裡面有v1、v3、v4、v5代表不同功能
// {v4 : uuidv4} 是將v4這個function 賦予給 uuidv4 (可自己取名)

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
};


const fileFilter = (req, file, cb) => {
    cb(null, !!extMap[file.mimetype])
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = extMap[file.mimetype];
        cb(null, uuidv4() + ext);
    }
})


module.exports = multer({ storage, fileFilter });