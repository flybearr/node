require('dotenv').config();
const express = require('express');
// const multer = require('multer');
// const upload = multer({ dest: 'tmp_upload/' });
const upload = require(__dirname + '/module/upload_imgs');

const fs = require('fs').promises;

const app = express();

// app.use(express.static('public'));


app.set('view engine', 'ejs');



// top-level-middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//routers

app.get('/', (req, res) => {
    res.render('main', { name: 'CZX' });
});
// render(`放輸出的檔案`)



app.get('/abc', (req, res) => {
    res.send(`<h2>abc</h2>`);
});

app.get('/query-string', (req, res) => {
    res.json(req.query);
});
// 可在網址列輸入get "http://localhost:3001/query-string" 範例 ?name=jack 


//--------------------------------------------------------------

// const urlencodedParser = express.urlencoded({ extended: false });
// urlencodedParser 是個方法
// app.post('/qs-post', urlencodedParser, (req, res) => {
//     res.json(req.body);
// })

// post 第二個參數放入方法， 會編譯至body並輸出，body預設會是空值
// 在瀏覽器上輸出看不到，可用postman當作用戶端 用"post" 

//--------------------------------------------------------------

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

app.get('/json-test', (req, res) => {
    // res.send({ name: '力1', age: 30 });
    res.json({ name: '力2', age: 30 });
});

app.get('/sales', (req, res) => {
    const sales = require(__dirname + '/data/sales');
    // __dirname  回到根目錄 ，可利用./可達到一樣效果
    console.log(sales);
    res.render(`sales-json`, { sales });
})
// render(`放輸出的檔案`)

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