const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../module/db_connect2');
const upload = require(__dirname + '/../module/upload_imgs');



router.use((req, res, next) => {
    if (req.session.admin && req.session.admin.account) {
        next();
    } else {
        res.status(403).send('無權訪問');
    }

});

function getDelQs(req, res) {

}



//CRUD

async function getListData(req, res) {
    const perpage = 10;
    // +是把字串轉換成數字
    let page = +req.query.page || 1;
    if (page < 1) {
        return res.redirect(req.baseUrl);
    }

    let search = req.query.search ? req.query.search.trim() : '';
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
    // res.json({ totalRows, totalPages, perpage, page, rows });
    return { totalRows, totalPages, perpage, page, rows, search, query: req.query };
}


//新增資料
router.get('/add', async (req, res) => {
    res.locals.title = '新增資料 |' + res.locals.title;
    res.render('product/add');

});

router.post('/add', upload.none(), async (req, res) => {
    // res.json(req.body);
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, // 除錯用
    };

    const sql = 'INSERT INTO `product`( `product_name`, `product_category_sid`, `brand_sid`, `product_price`, `product_inventory`, `picture`, `product_description`) VALUES (?,?,?,?,?,?,?)'

    const [result] = await db.query(sql, [
        req.body.product_name,
        req.body.product_category_sid,
        req.body.brand_sid,
        req.body.product_price,
        req.body.product_inventory,
        req.body.picture,
        req.body.product_description,
    ]);

    if (result.affectedRows) output.success = true;
    res.json(output);
});

// 編輯資料
router.get('/edit/:sid', async (req, res) => {
    const sql = "SELECT * FROM product WHERE product_sid=?"
    const [rows] = await db.query(sql, [req.params.sid]);
    if (!rows || !rows.length) {
        res.redirect(req.baseUrl);
    }
    // res.json(rows[0]);
    res.render('product/edit', rows[0]);
});

router.put('/edit/:sid', async (req, res) => {
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, // 除錯用
    };

    const sql = 'UPDATE `product` SET `product_name`=?,`product_category_sid`=?,`brand_sid`=?,`product_price`=?,`product_inventory`=?,`picture`=?,`product_description`=? WHERE `product_sid`=?'

    const [result] = await db.query(sql, [
        req.body.product_name,
        req.body.product_category_sid,
        req.body.brand_sid,
        req.body.product_price,
        req.body.product_inventory,
        req.body.picture,
        req.body.product_description,
        req.params.sid
    ]);

    if (result.changedRows) output.success = true;
    res.json(output);

});

//刪除資料

router.post('/del', async (req, res) => {
    const obj = req.body;

    // for (let i = 1; i <= Object.keys(obj).length; i++) {
    //     const sql = `DELETE FROM 'product' WHERE product_sid=?`;
    //     const [result] = await db.query(sql, req.body.);
    // }

    // const sql = `DELETE FROM 'product' WHERE product_sid=?`;
    // const [result] = await db.query(sql,req.params.sid);
    const www = Object.keys(obj);
    console.log(www);
    let r;
    for (el of www) {
        // console.log(el);
        const [result] = await db.query(`DELETE FROM product WHERE product_sid=${el}`);
        console.log(result);
        // let kk = r.result;
        r += JSON.stringify(result);
    };

    // res.redirect(req.baseUrl);


    res.json(r);
    // res.json({ success: !!result.affectedRows });


})





router.get(['/', '/list'], async (req, res) => {
    const data = await getListData(req, res);

    res.render('product/list', data);
})
router.get(['/api', '/api/list'], async (req, res) => {

    res.json(await getListData(req, res));

})



module.exports = router;