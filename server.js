//引用node.js 內建的http 模組
const http = require('http')

//建立一個 HttpServer
//req 從client發出的，res 從伺服器發出給client
var server = http.createServer(function(req, res) {
    var resHeader = {
        'Accept-Charset': 'utf-8',
        'Accept-Language': 'zh-TW',
        'Content-Type': 'text/html; charset=utf-8'
    }
    res.writeHead(200, resHeader)
    res.write('<h1>Hello</h1>', 'utf8')
    res.write('<p>這是node.js建立的</p>', 'utf8')
    res.end()
});

//將Server 執行，開啟特定port 1234
server.listen(1234);
console.log('Server running at http://127.0.0.1:1234');