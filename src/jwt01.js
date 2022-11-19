const jwt = require('jsonwebtoken'); 


const str = jwt.sign({
    sid:10,
    account:'nelson'
},'adwqemdwqke23e1wq3e51');

console.log(str);