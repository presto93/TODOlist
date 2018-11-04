var express = require('express')
var router = express.Router()
var path = require('path')
var mysql = require('mysql')

// DATABASE SETTING
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'mysql',
    database: 'todo_list',
    timezone: 'utc',
    dateStrings: 'date'
});

connection.connect();

router.post('/', function (req, res) {
    // console.log('req');
    // console.log('req : ', req);

    console.log('/noti close is called');
    var body = req.body;
    var id = body.id;

    var sql = { noti: -1 };
    var query = connection.query('update todo set ? where id = "' + id + '"', sql, function (err, rows) {
        if (err) { throw err; }
        var res_data = {
            'result' : 'ok'
        }
        res.json(res_data);
    })

})

module.exports = router;