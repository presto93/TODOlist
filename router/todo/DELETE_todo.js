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
    console.log('test.js loaded')
    res.sendFile(path.join(__dirname + "/../../public/main.html"))
});

router.post('/', function(req,res){
   // console.log('req');
   // console.log('req : ', req);

   console.log('delete is called');
    var body = req.body;
    var id = body.id;

    var sql = 'delete from todo where id = "' + id + '"';
    var query = connection.query('delete from todo where id = "' + id + '"', function(err, rows) {
        console.log(sql);
        if(err) { throw err;}
        var result = {
        'result' : 'ok'
        }
        res.json(result);
    })

})

module.exports = router;