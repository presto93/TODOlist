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

router.post('/', function(req,res){
   // console.log('req');
   // console.log('req : ', req);

   console.log('/add is called');
    var body = req.body;
    var title = body.title;
    var detail = body.detail;
    var deadline = body.deadline;
    if (deadline == ' :00') {
        var sql = { title : title, detail : detail };
        var query = connection.query('insert into todo set ?', sql, function(err, rows) {
            if(err) { throw err;}
            var query = connection.query('update todo set priority = id where id = (select * from (select max(id)  from todo) as max_val)', sql, function(err, rows) {
                if(err) { throw err;}
                res.redirect('/main');
            })
        })
    }
    else {
        var sql = { title : title, detail : detail,  deadline : deadline};
        var query = connection.query('insert into todo set ?', sql, function(err, rows) {
            if(err) { throw err;}
            var query = connection.query('update todo set priority = id where id = (select * from (select max(id)  from todo) as max_val)', sql, function(err, rows) {
                if(err) { throw err;}
                res.redirect('/main');
            })
        })
    }

})

module.exports = router;