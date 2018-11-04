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

   console.log('/update is called');
    var body = req.body;
    var id = body.id;
    var title = body.title;
    var detail = body.detail;
    var deadline = body.deadline;
    
    var sql = { title : title, detail : detail, deadline : deadline};
    var query = connection.query('update todo todo set ? where id = "' + id + '"', sql, function(err, rows) {
        if(err) { throw err;}
        res.redirect('/main');
    })

})

module.exports = router;