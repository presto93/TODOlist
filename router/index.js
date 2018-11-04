
var express = require('express')

var app = express()

var router = express.Router()

var path = require('path')
var main = require('./todo/main');
var POST_todo = require('./todo/POST_todo');
var DELETE_todo = require('./todo/DELETE_todo');
var PUT_todo = require('./todo/PUT_todo');
var PUT_priority = require('./todo/PUT_priority');
var PUT_completed = require('./todo/PUT_completed');
var PUT_noti_close = require('./todo/PUT_noti_close');

router.use('/main', main);
router.use('/post_todo', POST_todo);
router.use('/delete_todo', DELETE_todo);
router.use('/put_todo', PUT_todo);
router.use('/put_priority', PUT_priority);
router.use('/put_completed', PUT_completed);
router.use('/put_noti_close', PUT_noti_close);

module.exports = router;

