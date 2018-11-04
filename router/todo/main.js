var express = require('express')
var router = express.Router()
var path = require('path')
var mysql = require('mysql')

// DATABASE SETTING
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'root',
    password : 'mysql',
    database : 'todo_list',
    timezone: 'utc',
    dateStrings: 'date'
});

connection.connect();
router.get('/', function(req,res){
    console.log('main.js loaded')
    res.sendFile(path.join(__dirname + "/../../public/main.html"))
});

router.post('/', function(req, res){
    console.log('/ is called');
    console.log(req.body)
    var responseData = {};
    var query = connection.query('select id, title, detail, priority, completed, deadline, timestampdiff(MINUTE, current_timestamp(), deadline) as remaining, unix_timestamp(deadline) as unix_time'
    + ' from todo order by completed asc, priority desc, deadline asc',
    function (err, rows) {
        if (err) throw err;
        responseData.todo_data = rows;
        query = connection.query('select id from todo where noti <> -1 and deadline is not NULL order by deadline desc',
        function (err, rows) {
            if (err) throw err;
            responseData.noti = rows;

            //res.json(rows);
            console.log(responseData);
            res.json(responseData);
        })
    });

    
})

module.exports = router;