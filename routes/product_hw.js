const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../module/db_connect2');



router.use((req, res, next) => {
    next();
});


//CRUD


router.get(['/', '/123'], async (req, res) => {
    const perpage = 10;
    // +是把字串轉換成數字
    let page = +req.query.page || 1;
    if (page < 1) {
        return res.redirect(req.baseUrl);
    }

    let                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                = req.query.search ? req.query.search.trim() : '';
    let where = `WHERE 1 `;  //記得要空格
    if (search) {
        where += `AND 
        (
            \`product_name\` LIKE ${db.escape('%' + search + '%')}
            OR 
            \`product_price\` LIKE ${db.escape('%' + search + '%')}
        )
        `;
    }



    const t_sql = `SELECT COUNT(1)  totalRows FROM product ${where}`;
    const [[{ totalRows }]] = await db.query(t_sql);

    let totalPages = 0;
    let rows = [];
    if (totalRows > 0) {
        totalPages = Math.ceil(totalRows / perpage);
        if (page > totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }
        const sql = `SELECT * FROM product ${where} ORDER BY product_sid  LIMIT ${(page - 1) * perpage},${perpage}`;
        // 只有陣列可以這樣做，解構附值
        [rows] = await db.query(sql);
    }
    res.json({ totalRows, totalPages, perpage, page, rows });
    // res.render('product/list', { totalRows, totalPages, perpage, page, rows, query: req.query });
})



module.exports = router;