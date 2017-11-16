const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID; // 用來建構MongoDBID物件

var url = 'mongodb://140.112.28.194:27017/CSX2003_01_HW2';


// 設定預設port為 1377，若系統環境有設定port值，則以系統環境為主
app.set('port', (process.env.PORT || 1377))

// 設定靜態資料夾
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// query 功能
app.get('/query', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var response = {
        result: true,
        data: [{
                id: 0,
                name: "小米路由器",
                price: 399,
                count: 1,
                image: 'http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490332273.78529474.png?width=160&height=160'
            },
            {
                id: 1,
                name: "米家全景相機",
                price: 7995,
                count: 1,
                image: 'http://i01.appmifile.com/f/i/g/2016overseas/mijiaquanjingxiangji800.png?width=160&height=160'
            }
        ]
    }

    // TODO 作業二 - 查詢資料       
    // 請將查詢mongodb的程式碼寫在這裡，並改寫下方response，使得查詢結果能送至前端
    MongoClient.connect(url, function(err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }

        //console.log("資料庫連接成功")

        res.json(response)
    })


})

//insert功能
app.post('/insert', function(req, res) {
    var data = {
        name: req.body.name,
        price: req.body.price,
        count: req.body.count,
        image: req.body.image
    }

    // TODO 作業二 - 新增資料
    // 請將新增資料的程式碼寫在，使得將client送過來的 data 能寫入至 mongodb 中
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("資料庫連結失敗1" + err.message)
            return
        }
        console.log('資料庫連結成功1')

        db.collection("R06723016").insertOne(data, function(err, result) {
            if (err) {
                console.log("新增資料失敗1" + err.message)
                return
            }
            console.log('插入成功1')
            console.dir(result)

            var response = {
                result: true,
                data: data
            }
            res.json(response)
        })
    })
})

//update功能
app.post('/update', function(req, res) {
    var data = {
        _id: req.body._id,
        name: req.body.name,
        price: req.body.price,
    }


    var response = {
        result: true,
        data: data
    }

    MongoClient.connect(url, function(err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }

        // TODO 作業二 - 更新資料
        // 將mongoDB資料中對應的 data.id 找出來，並更新其 name 和 price 資料
        // https://docs.mongodb.com/manual/tutorial/update-documents/

        var filter = {
            _id: objectID(data._id)
        }

        var update = {
            name: data.name,
            price: data.price
        }
        db.collection('R06723016').updateMany(filter, { $set: update }, function(err, result) {
            if (err) {
                console.log('更新失敗' + err.message)
                return
            }
        })
    })
})

// delete功能
app.post('/delete', function(req, res) {
    var data = {
        _id: req.body._id,
        name: req.body.name
    }
    var response = {
        result: true,
        data: data
    }

    MongoClient.connect(url, function(err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }
        // TODO 作業二 - 刪除資料
        // 將ID 的資料 從mongodb中刪除
        // https://docs.mongodb.com/manual/tutorial/remove-documents/

        // 查詢要刪除的ID
        var filter = {
            _id: objectID(data._id)
        }
        db.collection("R06723016").deleteMany(filter, function(err, result) {
            if (err) {
                console.log("刪除失敗" + err.message)
                return
            }
        })
    })
})

// 啟動且等待連接
app.listen(app.get('port'), function() {
    console.log('Server running at http://127.0.0.1:' + app.get('port'))
})


MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log("資料庫連結失敗" + err.message)
        return
    }
    console.log('資料庫連結成功')

    var data = [{ "name": "小米手環", "price": 395, "count": 200, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1466582460.29695663.jpg?width=160&height=160" },
        { "name": "小米路由器", "price": 2295, "count": 50, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490332273.78529474.png?width=160&height=160" },
        { "name": "小米手環 光感版", "price": 495, "count": 500, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/T1a8WgBm_v1RXrhCrK.jpg?width=150&height=150" },
        { "name": "米家全景相機", "price": 7995, "count": 500, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1498468770.00134431.jpg?width=160&height=160" },
        { "name": "小米路由器Pro", "price": 2295, "count": 501, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490332273.78529474.png?width=160&height=160" },
        { "name": "小米空氣淨化器 2", "price": 3995, "count": 497, "image": "http://i01.appmifile.com/f/i/g/2016overseas/jinghuaqi222.png?width=160&height=160" },
        { "name": "小米降噪耳機 Type-C 版", "price": 1395, "count": 465, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1497337712.20968016.png?width=160&height=160" },
        { "name": "20000 小米行動電源 2", "price": 795, "count": 1452, "image": "http://i01.appmifile.com/webfile/globalimg/tw/cms/467CB73E-CCA1-0439-A105-27D0ABC0CEC4.jpg?width=160&height=160" },
        { "name": "米家 LED 智慧檯燈", "price": 995, "count": 453, "image": "http://i01.appmifile.com/f/i/g/2016overseas/taideng.png?width=160&height=160" },
        { "name": "小米行動電源 10000 高配版", "price": 795, "count": 500, "image": "http://i01.appmifile.com/webfile/globalimg/tw/cms/B877AC15-8C5B-7EB6-40EC-A0B04DF7EBC9.jpg?width=160&height=160" },
        { "name": "小米盒子", "price": 1999, "count": 501, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1478418463.57872148.png?width=160&height=160" },
        { "name": "小米音樂鬧鐘", "price": 995, "count": 497, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490581653.60053894.png?width=160&height=160" },
        { "name": "小米體重計", "price": 665, "count": 465, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1481627568.2478589.png?width=160&height=160" },
        { "name": "小米手環 2", "price": 865, "count": 1452, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1466582460.29695663.jpg?width=160&height=160" },
        { "name": "10000 小米行動電源 2", "price": 435, "count": 453, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490579894.04895525.png?width=160&height=160" },
        { "name": "小米路由器 3", "price": 765, "count": 500, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1468833175.0246448.jpg?width=160&height=160" },
        { "name": "小米行動電源 5000", "price": 265, "count": 501, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1481629237.37682048.png?width=160&height=160" },
        { "name": "小米經典商務雙肩包 黑色", "price": 495, "count": 497, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1500259861.77746.jpg?width=150&height=150" },
        { "name": "小米體重計", "price": 665, "count": 465, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490613431.17063250.png?width=150&height=150" },
        { "name": "小米手環 光感版", "price": 495, "count": 1452, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/T1a8WgBm_v1RXrhCrK.jpg?width=150&height=150" },
        { "name": "小米隨身藍牙喇叭", "price": 395, "count": 453, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490613527.213917.png?width=150&height=150" },
        { "name": "小米圈鐵耳機", "price": 495, "count": 500, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1471509537.08046417.jpg?width=150&height=150" },
        { "name": "米家空氣淨化器濾芯 除甲醛版", "price": 895, "count": 501, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490613615.96393226.png?width=150&height=150" },
        { "name": "小米圈鐵耳機 Pro", "price": 765, "count": 497, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1481628969.68637582.png?width=150&height=150" },
        { "name": "小米活塞耳機 清新版", "price": 195, "count": 465, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1482749230.29741990.jpg?width=150&height=150" },
        { "name": "小米頭戴式耳機 輕鬆版", "price": 995, "count": 1452, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1487735811.98955043.jpg?width=150&height=150" },
        { "name": "小米頭戴式耳機 升級版", "price": 2295, "count": 453, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1482054801.89658413.jpg?width=150&height=150" },
        { "name": "小米方盒子藍牙喇叭", "price": 595, "count": 500, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/T1mZL_BmDv1RXrhCrK.jpg?width=150&height=150" },
        { "name": "小米VR眼鏡 基礎版", "price": 255, "count": 501, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490614388.17751065.png?width=150&height=150" },
        { "name": "小米極簡都市雙肩包", "price": 765, "count": 497, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490613683.57445603.png?width=150&height=150" },
        { "name": "小米多功能都市休閒胸包", "price": 395, "count": 465, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1476776694.26221083.jpg?width=150&height=150" },
        { "name": "小米 4 Port USB 充電器", "price": 395, "count": 1452, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1480647847.04339769.jpg?width=150&height=150" },
        { "name": "小米 2 Port USB 充電器", "price": 245, "count": 453, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1495094802.17983411.jpg?width=150&height=150" },
        { "name": "小米自拍桿 線控版", "price": 265, "count": 500, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1475892459.8486570.jpg?width=150&height=150" },
        { "name": "小米車用充電器", "price": 265, "count": 501, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490613869.37311456.png?width=150&height=150" },
        { "name": "小米二合一傳輸線", "price": 95, "count": 497, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1491558925.3947564.png?width=150&height=150" },
        { "name": "小米 LED 隨身燈 增強版", "price": 119, "count": 465, "image": "http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/T1GeD_B4x_1RXrhCrK.jpg?width=150&height=150" },
        { "name": "小米WiFi放大器Pro 黑色", "price": 79, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1500368449.16695185!200x200.jpg" },
        { "name": "小米6 弧邊高透膜", "price": 29, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1493863398.71652587!200x200.jpg" },
        { "name": "小米淨水器（廚上式） 增強版", "price": 1499, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1497801904.81994356!200x200.jpg" },
        { "name": "小米藍牙耳機充電座", "price": 49, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1499077951.43466861!200x200.jpg" },
        { "name": "小米藍牙耳機青春版套裝", "price": 99, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1499075844.16556443!200x200.jpg" },
        { "name": "紅米note4X（4GB+64GB）智慧顯示保護套", "price": 39, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1491376442.10212059!200x200.jpg" },
        { "name": "九號平衡車 Plus 白色", "price": 3499, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1498643144.48446520!200x200.png" },
        { "name": "小米電視4 65英寸", "price": 9999, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1495074053.84174465!200x200.jpg" },
        { "name": "小米電視4 49英寸", "price": 3499, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1495073969.01063180!200x200.jpg" },
        { "name": "小米電視4 55英寸", "price": 4299, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1495074010.05677255!200x200.jpg" },
        { "name": "天然氣報警器 白色", "price": 199, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1498117750.82337890!200x200.jpg" },
        { "name": "米兔積木機器人 履帶機甲", "price": 499, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1499048837.78256911!200x200.jpg" },
        { "name": "TS偏光太陽鏡   米家定制", "price": 99, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1500282577.40987685!200x200.jpg" },
        { "name": "小米平板3 高透保護膜", "price": 19, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1492154058.31543396!200x200.jpg" },
        { "name": "小米6 標準高透貼膜", "price": 19, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1493284697.69911065!200x200.jpg" },
        { "name": "小米藍牙音訊接收器", "price": 99, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1499161620.42031583!200x200.jpg" },
        { "name": "小米Max 2  智能翻蓋支架保護套", "price": 59, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1499933945.42632851!200x200.jpg" },
        { "name": "紅米note4X（4GB+64GB）標準高透貼膜", "price": 19, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1491378700.81531711!200x200.jpg" },
        { "name": "小米MIX", "price": 3499, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1477962926.56487493!200x200.jpg" },
        { "name": "小米5s Plus", "price": 2299, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1475028837.31225999!200x200.jpg" },
        { "name": "小米Note 2", "price": 2799, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1477962623.37219050!200x200.jpg" },
        { "name": "小米圈鐵耳機 金色", "price": 89, "count": 42, "image": "http://i1.mifile.cn/a1/T1ycK_BjYv1RXrhCrK!200x200.jpg" },
        { "name": "小米圈鐵耳機 銀色", "price": 89, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1467184989.74561304!200x200.jpg" },
        { "name": "小米膠囊耳機 黑色", "price": 69, "count": 4, "image": "http://i1.mifile.cn/a1/T1SkV_BCd_1RXrhCrK!200x200.jpg" },
        { "name": "1MORE三單圈鐵耳機", "price": 599, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1464592109.19494450!200x200.jpg" },
        { "name": "小米筆記本貼紙 13.3英寸 梵古星空", "price": 64.9, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1499421324.18332827!200x200.jpg" },
        { "name": "小米筆記本貼紙 12.5英寸 梵古星空", "price": 64.9, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1499680984.1851297!200x200.jpg" },
        { "name": "小米筆記本貼紙 13.3英寸 玫瑰金", "price": 64.9, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1499421319.69868501!200x200.jpg" },
        { "name": "小米筆記本貼紙 12.5英寸 玫瑰金", "price": 64.9, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1499421473.50026651!200x200.jpg" },
        { "name": "小米5X", "price": 1499, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1501421823.86024298!200x200.jpg" },
        { "name": "小米5X", "price": 1499, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1501418815.81856794!200x200.jpg" },
        { "name": "小米Max 2", "price": 1699, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1499764829.574165!200x200.jpg" },
        { "name": "小米超大防水滑鼠墊", "price": 39, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1499236133.81824635!200x200.jpg" },
        { "name": "小米5X", "price": 1499, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1501418812.12752641!200x200.jpg" },
        { "name": "《小米》2017年7月刊", "price": 0.2, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1499324383.57596409!200x200.jpg" },
        { "name": "小米AI音箱", "price": 299, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1501057018.70015369!200x200.jpg" },
        { "name": "小米6手環套裝", "price": 2648, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1501465112.21421865!200x200.jpg" },
        { "name": "小米電視4A 32英寸", "price": 1099, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1500287084.72131750!200x200.jpg" },
        { "name": "小米5s 健康套裝", "price": 2198, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1501465263.9479337!200x200.jpg" },
        { "name": "小米MIX 淨水套裝", "price": 5398, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1501465235.49123918!200x200.jpg" },
        { "name": "紅米Note 4X 攝影套裝", "price": 1178, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1501464762.16923640!200x200.jpg" },
        { "name": "小米電視3s 65曲面+小米電視4A 32", "price": 10098, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1500536472.16427863!200x200.jpg" },
        { "name": "小米無線滑鼠 白色", "price": 69, "count": 5, "image": "http://i1.mifile.cn/a1/!200x200" },
        { "name": "小米電視4A 65語音版+小米電視4A 43", "price": 8298, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1500536429.04991294!200x200.jpg" },
        { "name": "小米路由器HD（2TB） 黑色", "price": 1699, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1500429702.18585603!200x200.jpg" },
        { "name": "小米路由器HD（8TB） 黑色", "price": 3699, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1500273073.06453889!200x200.jpg" },
        { "name": "小米MAX2 電飯煲套裝", "price": 2248, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1501465196.27637472!200x200.jpg" },
        { "name": "小米note2 機器人套裝", "price": 4448, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1501465003.45125483!200x200.jpg" },
        { "name": "小米筆記本Air 13 i7 8G 256G 2G獨顯 銀色", "price": 5999, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1499138177.54329452!200x200.jpg" },
        { "name": "小米車載充電器快充版 擴展配件", "price": 99, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1499851022.23924395!200x200.jpg" },
        { "name": "筆記本手機至尊商務套裝", "price": 8299, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1500537023.98127542!200x200.jpg" },
        { "name": "筆記本手機豪華商務套裝", "price": 6298, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1500636877.04798484!200x200.jpg" },
        { "name": "小米路由器3C 白色", "price": 99, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1470288129.01686992!200x200.jpg" },
        { "name": "積木機器人傳感套裝", "price": 558, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1494929953.81368457!200x200.jpg" },
        { "name": "米家小白智能攝像機", "price": 399, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1468806372.46368911!200x200.jpg" },
        { "name": "小米電源線收納盒", "price": 49, "count": 4, "image": "http://i1.mifile.cn/a1/T1eKdgB4xv1RXrhCrK!200x200.jpg" },
        { "name": "小米隨身藍牙音箱", "price": 69, "count": 412, "image": "http://i1.mifile.cn/a1/T1IdZgB5hv1RXrhCrK!200x200.jpg" },
        { "name": "小米無人機4K版套裝 白色", "price": 2999, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1487824962.01314237!200x200.jpg" },
        { "name": "小米無人機電池（零售版）", "price": 499, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1478788193.1661841!200x200.jpg" },
        { "name": "小米無人機保護架 橙色", "price": 39, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1478788493.83365682!200x200.jpg" },
        { "name": "小米無人機螺旋槳1080P版 白色", "price": 49, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1478788755.03197593!200x200.jpg" },
        { "name": "小米水質TDS檢測筆", "price": 39, "count": 42, "image": "http://i1.mifile.cn/a1/T19OV_BgKT1RXrhCrK!200x200.jpg" },
        { "name": "米家智能家庭禮品裝 白色", "price": 329, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1492677587.51797274!200x200.jpg" },
        { "name": "米家運動鞋(智能版) 男款", "price": 249, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1490949492.24196486!200x200.jpg" },
        { "name": "小米V領短袖T恤 男款", "price": 39, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1490698921.90768471!200x200.png" },
        { "name": "小米短袖T恤 科技藝術", "price": 39, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1490699621.54189012!200x200.png" },
        { "name": "九號護具套裝", "price": 169, "count": 5, "image": "http://i1.mifile.cn/a1/T17xL_BQLT1RXrhCrK!200x200.jpg" },
        { "name": "米家運動鞋(智能版) 女款", "price": 249, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1490949546.96088774!200x200.jpg" },
        { "name": "小米V領短袖T恤 女款", "price": 39, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1490699260.62076018!200x200.png" },
        { "name": "小米短袖T恤 米兔昆侖遊 女款", "price": 39, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1490699352.43531682!200x200.png" },
        { "name": "ZMI移動電源10000mAh", "price": 99, "count": 5, "image": "http://i1.mifile.cn/a1/T1atV_BQLT1RXrhCrK!200x200.jpg" },
        { "name": "小米短袖T恤 吃豆人", "price": 39, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1490699545.98792281!200x200.png" },
        { "name": "小米短袖T恤 撲克臉", "price": 39, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1490699512.44292156!200x200.png" },
        { "name": "小米短袖T恤 水管工米兔", "price": 39, "count": 42, "image": "http://i1.mifile.cn/a1/T1eGA_BKbv1RXrhCrK!200x200.jpg" },
        { "name": "小米短袖T恤 程式藝術", "price": 39, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1490699578.36438935!200x200.png" },
        { "name": "小米短袖T恤 米兔昆侖遊 男款", "price": 39, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1490699313.83423551!200x200.png" },
        { "name": "純色開衫衛衣 女款", "price": 89, "count": 412, "image": "http://i1.mifile.cn/a1/T1KZZ_B_dT1RXrhCrK!200x200.jpg" },
        { "name": "8H標準乳膠枕", "price": 159, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1472710764.55986027!200x200.jpg" },
        { "name": "小米VR眼鏡PLAY 黑色", "price": 39, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1476761906.31818092!200x200.jpg" },
        { "name": "防霧霾口罩", "price": 69, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1479182984.26159750!200x200.jpg" },
        { "name": "小米藍牙音箱", "price": 199, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1494830681.30266694!200x200.jpg" },
        { "name": "小米功能短袖Polo衫 男款", "price": 99, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1489482473.58444489!200x200.jpg" },
        { "name": "最生活浴巾·青春系列", "price": 99, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1479972924.07568234!200x200.jpg" },
        { "name": "最生活毛巾·青春系列", "price": 19.9, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1479972875.00224492!200x200.jpg" },
        { "name": "小米活塞耳機 清新版", "price": 29, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1482321199.12589253!200x200.jpg" },
        { "name": "小米Max 超薄膚感軟膠保護套", "price": 29, "count": 42, "image": "http://i1.mifile.cn/a1/T1leDjBsET1RXrhCrK!200x200.jpg" },
        { "name": "紅米4高配版 翻蓋保護套", "price": 15, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1478174026.59045943!200x200.jpg" },
        { "name": "紅米4標準版 翻蓋保護套", "price": 15, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1478582939.22254590!200x200.jpg" },
        { "name": "8H乳膠床墊", "price": 899, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1493030483.17561318!200x200.jpg" },
        { "name": "1MORE金澈耳機", "price": 99, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1477020337.09961854!200x200.jpg" },
        { "name": "小米V領短袖T恤 女款", "price": 39, "count": 5, "image": "http://i1.mifile.cn/a1/T1SYAvB7hv1RXrhCrK!200x200.jpg" },
        { "name": "90分旅行箱 24寸", "price": 349, "count": 4, "image": "http://i1.mifile.cn/a1/T1CDbjBgAT1RXrhCrK!200x200.jpg" },
        { "name": "90分旅行箱28寸", "price": 499, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1493873047.13332075!200x200.jpg" },
        { "name": "紅米Note3 炫彩翻頁保護套", "price": 29, "count": 42, "image": "http://i1.mifile.cn/a1/T1kDx_BbCT1RXrhCrK!200x200.jpg" },
        { "name": "90分旅行箱 20寸", "price": 299, "count": 5, "image": "http://i1.mifile.cn/a1/T1Ay_gBKKv1RXrhCrK!200x200.jpg" },
        { "name": "紅米Pro 智慧顯示保護套", "price": 29, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1469787833.63814353!200x200.jpg" },
        { "name": "紅米Note4 智慧顯示保護套", "price": 39, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1472198598.36255665!200x200.jpg" },
        { "name": "小米淨水器濾芯", "price": 69, "count": 42, "image": "http://i1.mifile.cn/a1/T1H0VjBTET1RXrhCrK!200x200.jpg" },
        { "name": "魔方控制器 白色", "price": 69, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1464579794.15833460!200x200.jpg" },
        { "name": "小米學院休閒雙肩包", "price": 79, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1497672764.01987286!200x200.jpg" },
        { "name": "90分輕戶外旅行洗漱包", "price": 39, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1469429877.97273625!200x200.jpg" },
        { "name": "TS尼龍偏光太陽鏡", "price": 199, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1492999959.43955760!200x200.jpg" },
        { "name": "小米6 矽膠保護套", "price": 49, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1493261826.22337469!200x200.jpg" },
        { "name": "小米滑鼠墊加大號", "price": 19, "count": 4, "image": "http://i1.mifile.cn/a1/T1I.bgB5_v1RXrhCrK!200x200.jpg" },
        { "name": "小米手環2腕帶", "price": 19.9, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1480563687.45673159!200x200.jpg" },
        { "name": "紅米Pro 超薄膚感軟膠保護套", "price": 9.9, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1469787920.69869416!200x200.jpg" },
        { "name": "小米5s Plus 智能翻蓋保護套", "price": 29, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1474888499.19594663!200x200.jpg" },
        { "name": "小米頭戴式耳機 輕鬆版", "price": 189, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1482301662.61336109!200x200.jpg" },
        { "name": "5000mAh小米移動電源保護套", "price": 19.9, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1469694895.01922815!200x200.jpg" },
        { "name": "紅米3標準版 炫彩翻蓋保護套", "price": 29, "count": 42, "image": "http://i1.mifile.cn/a1/T1xXxQBQKT1RXrhCrK!200x200.jpg" },
        { "name": "紅米Note 4X（3GB+32GB）高透軟膠保護套", "price": 19, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1486980879.11199962!200x200.jpg" },
        { "name": "1MORE入耳式耳機（活塞複刻版）", "price": 99, "count": 4, "image": "http://i1.mifile.cn/a1/T1T2AjBybv1RXrhCrK!200x200.jpg" },
        { "name": "紅米note4X（3GB+32GB）智慧顯示保護套", "price": 39, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1488522289.66234577!200x200.jpg" },
        { "name": "紅米4X", "price": 699, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1488333421.25446286!200x200.png" },
        { "name": "小米6", "price": 2499, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1496377125.3815759!200x200.jpg" },
        { "name": "紅米Note4", "price": 1199, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1472180573.13116282!200x200.jpg" },
        { "name": "Amazfit手環", "price": 299, "count": 412, "image": "http://i1.mifile.cn/a1/pms_1480575206.66418698!200x200.jpg" },
        { "name": "小米手機5s", "price": 1999, "count": 42, "image": "http://i1.mifile.cn/a1/pms_1494475216.30891602!200x200.jpg" },
        { "name": "Amazfit 運動手錶", "price": 799, "count": 5, "image": "http://i1.mifile.cn/a1/pms_1477389928.07792706!200x200.jpg" },
        { "name": "紅米手機4", "price": 799, "count": 4, "image": "http://i1.mifile.cn/a1/pms_1478483212.42224140!200x200.jpg" }
    ]

    db.collection("R06723016").insertMany(data, function(err, result) {
        if (err) {
            console.log("新增資料失敗" + err.message)
            return
        }
        console.log('插入成功')
        console.dir(result)

    })
})