const jwt = require('jsonwebtoken'); 

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOjEwLCJhY2NvdW50IjoibmVsc29uIiwiaWF0IjoxNjY3ODA4OTQ4fQ.0bbWcBRJbAcRJz7ZpwwbJ67y5MoBFWCVj4KsSGJPuuM';
const payload = jwt.verify(token,'adwqemdwqke23e1wq3e51');
console.log(payload);