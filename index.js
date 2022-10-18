require('dotenv').config();
const express = require('express');
const moment = require('moment-timezone');
const session = require('express-session');
// MysqlStore 將session存入資料庫 
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/module/db_connect2');
const cors = require('cors');
const axios = require('axios');


// https://www.npmjs.com/package/express-mysql-session 
const sessionStore = new MysqlStore({ schema: { tableName: 'session2' } }, db);

//測試用
express.li = '您好';
const { join } = require('path');
// const multer = require('multer');
// const upload = multer({ dest: 'tmp_upload/' });
const upload = require(__dirname + '/module/upload_imgs');
const fs = require('fs').promises;

const app = express();

app.set('view engine', 'ejs');



const corsOptions = {
    credential: true,
    origin: function (origin, callback) {
        console.log({ origin });
        callback(null, true);
    }
}


app.use(cors(corsOptions));


app.use(session({
    saveUninitialized: false,
    resave: false, // 沒變更內容是否強制回存
    secret: 'sqkyd82dfa2mosfg',
    store: sessionStore,
    cookie: {
        maxAge: 1800_000,
    }
}));

// top-level-middleware
// use是全域使用，會自動判定型別
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use((req, res, next) => {
    res.locals.toDateString = (date) => moment(date).format('YYYY-MM-DD');
    res.locals.toDatetimeString = (date) => moment(date).format('YYYY-MM-DD  HH:mm:ss');
    res.locals.title = '歡迎來到這';
    res.locals.session = req.session;
    next();
})




//routers


// render(`放輸出的檔案`)
app.get('/', (req, res) => {
    res.render('main', { name: 'CZX' });
});



app.get('/abc', (req, res) => {
    res.send(`<h2>abc</h2>`);
});

// 可在網址列輸入get "http://localhost:3001/query-string" 範例 ?name=jack 
app.get('/query-string', (req, res) => {
    res.json(req.query);
});



//--------------------------------------------------------------

// const urlencodedParser = express.urlencoded({ extended: false });
// urlencodedParser 是個方法
// app.post('/qs-post', urlencodedParser, (req, res) => {
//     res.json(req.body);
// })

// post 第二個參數放入方法， 會編譯至body並輸出，body預設會是空值
// 在瀏覽器上輸出看不到，可用postman當作用戶端 用"post" 

//-------------------我是分隔線-----------------------------

app.post('/qs-post', (req, res) => {
    res.json(req.body);
})

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
})
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
})


app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    res.json(req.file);
    // if (req.file && req.file.originalname) {
    //     await fs.rename(req.file.path, `public/imgs/${req.file.originalname}`)
    //     res.json(req.file);
    // } else {
    //     res.json({ msg: '沒上傳檔案' });
    // }

});

app.post('/try-upload2', upload.array('photos'), async (req, res) => {
    res.json(req.files);
});

// 在params    ?是reg expression 可有可無
app.get('/my-params1/:action/:id?', upload.array('photos'), async (req, res) => {
    res.json(req.params);
});


app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.slice(3);
    u = u.split('?')[0]; //去掉 query string  split後取陣列第一個
    u = u.split('-'), join('');
    res.json({ mobile: u });
})


const admin = require(__dirname + '/routes/admin2');
app.use('/admin2', admin);


//-------------------我是分隔線-----------------------------

//next(); 會等待上方的事情處理完畢後，在執行下一個動作
const myMiddle = (req, res, next) => {
    res.locals = { ...res.locals, zx: '尼好' };
    res.locals.zxz = 'nice to meet you';
    next();
}
// 這裡的(req,res)，會將myMiddle的req,res引入進來
// myMiddle 改為陣列 [myMiddle] 可塞入多個，依照前後放置的順序來當作篩選依據
app.get('/try-middle', [myMiddle], (req, res) => {
    res.json(res.locals);
})





app.get('/json-test', (req, res) => {
    // res.send({ name: '力1', age: 30 });
    res.json({ name: '力2', age: 30 });
});

app.get('/sales', (req, res) => {
    // __dirname  回到根目錄 ，可利用./可達到一樣效果
    const sales = require(__dirname + '/data/sales');
    console.log(sales);
    // render(`放輸出的檔案`)
    res.render(`sales-json`, { sales });
})

app.get('/try-session', (req, res) => {
    req.session.my_session ||= 0; //預設值   req.session.my_session = req.session.my_session || 0 
    req.session.my_session++;
    res.json(req.session);
})


app.get('/try-date', (req, res) => {
    const now = new Date;
    const m = moment();
    //.send 預設json格式
    res.send({
        t1: now,
        t2: now.toString(),
        t3: now.toDateString(),
        t4: now.toLocaleString(),
        m: m.format('YYYY-MM-DD HH:mm:ss'),
    });
});
app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m = moment('06/10/22', 'DD/MM/YY');
    const now = new Date;
    //.send 預設json格式
    res.send({
        test: (now - m),
        m,
        m1: m.format(fm),
        m2: m.tz('Europe/London').format(fm),
        m3: m.tz('asia/taipei').format(fm),
    });
});


app.get('/try-db', async (req, res) => {
    const [rows, fileds] = await db.query("SELECT * FROM brand LIMIT 5");

    res.json(rows);

});

app.get('/try-db-add', async (req, res) => {
    const name = '+8登山杖';
    const category = 1;
    const brand = 3;
    const price = 160;
    const inventory = 5;
    const picture = '/img/1.jpg';
    const product_description = '超高級登山杖';

    const sql = "INSERT INTO `product`( `product_name`, `product_category_sid`, `brand_sid`, `product_price`, `product_inventory`, `picture`, `product_description`) VALUES(?,?,?,?,?,?,?)";
    const [result] = await db.query(sql, [name, category, brand, price, inventory, picture, product_description]);
    res.json(result);

    // const [{affectedRows,insertId}] = await db.query(sql, [name, category, brand, price, inventory, picture, product_description]);
    // res.json({affectedRows,insertId});

});

// MYSQL2 特殊用法  欄位名稱要跟SQL一模一樣
app.get('/try-db-add2', async (req, res) => {
    const product_name = '8+9登山杖';
    const product_category_sid = 1;
    const brand_sid = 3;
    const product_price = 898;
    const product_inventory = 5;
    const picture = '/img/89.jpg';
    const product_description = '8+9專用登山杖';

    const sql = "INSERT INTO `product` SET ?";
    const [result] = await db.query(sql, [{ product_name, product_category_sid, brand_sid, product_price, product_inventory, picture, product_description }]);
    res.json(result);
});


app.use('/products', require(__dirname + '/routes/product'));

app.use('/fake-login', (req, res) => {
    req.session.admin = {
        id: 88,
        account: 'Nelson',
        nickname: '會飛的熊'
    };
    res.redirect('/');
})

app.use('/logout', (req, res) => {
    delete req.session.admin;

    res.redirect('/');
})

app.get('/yt',async (req,res)=>{
    const response = await axios.get('https://www.youtube.com/');
    res.send(response.data);
})


app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));

app.use((req, res) => {
    // res.type('text/plain'); // 預設是text/html  修改成純文字
    res.status(404).render('404');
});

const port = process.env.SERVER_PORT || 3002;


app.listen(port, () => {
    console.log(`server started, port: ${port}`);
})