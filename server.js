// 載入 http 的模組
var http = require('http');
// 引用 File System 模組
var fs = require('fs');

// 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
var port = process.env.PORT || 1337;

var url = require('url');
var path = require('path');

var file_content;

var webPath = 'public';

var server = http.createServer(function(req, res) {
    // req 是 request 本地端請求的訊息
    // res 是 response 主機回傳到本地端的訊息

    // 解析使用者要求的路徑名稱
    let url_path = url.parse(req.url);
    console.log('path:' + url_path);
    let pathname = url_path.pathname;
    console.log('pathname:' + pathname);

    // 判斷pathname是否為預設路徑
    if (pathname === "/" || pathname === "/index.htm") {
        pathname = 'index.html';
    }

    // __dirname 是程式的路徑
    // webPath 是公開的資料夾
    // pathname 是使用者要求的路徑名稱
    var filePath = path.join(__dirname, webPath, pathname);
    console.log('filePath:' + filePath);

    var resHeader = {
        'Accept-Charset': 'utf-8',
        'Accept-Language': 'zh-TW',
        'Content-Type': 'text/html; charset=utf-8',
    }

    //  https://regex101.com/r/ork1TW/1
    //  正規表示法：  /^\/insert\/[brdtBRDT]\d{8}\/.+\/.+
    //  特別判斷新資料的指令
    if (/^\/insert\/[brdtBRDT]\d{8}\/.+\/.+/i.test(pathname)) {
        //剖析url資料
        var list = pathname.split('/');
        var action = list[1];
        var sid = list[2];
        var name = list[3];
        var dep = list[4];
        console.log(pathname);
        //將資料讀取並新增至mongoDB


        //顯示新增成功
        res.writeHead(200, resHeader);
        res.write('<h1> updata data </h1>');
        res.write('學號：' + sid + '<br>');
        res.write('姓名：' + name + '<br>');
        res.write('學系：' + dep + '<br>');
        res.end();

    }

    // 讀取檔案
    fs.readFile(filePath, 'utf8', function(err, content) {
        if (err) {
            console.log('Failed to read');
            // 若檔案讀取錯誤，回傳 404
            res.writeHead(404, resHeader);
            res.write('<h1>404. 找不到檔案!!</h1>')
            res.end();
            return;
        }
        // 將檔案內容傳給瀏覽器
        res.writeHead(200, resHeader);
        res.write(content);
        res.end();
    })
});

// 啟動並等待連接
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port);