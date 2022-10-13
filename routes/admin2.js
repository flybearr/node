const express = require('express');
const router = express.Router();

console.log(express.li);
router.get('/bbb/:action?/:id?', (req, res) => {
    const { params, url, baseUrl, originalUrl } = req;
    res.json({ params, url, baseUrl, originalUrl });
});



module.exports = router;
