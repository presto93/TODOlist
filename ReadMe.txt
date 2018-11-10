https://nodejs.org/ko/download/
에서 node.js 설치

$ npm init
$ npm install express
$ npm install body-parser
$ npm install mysql
패키지 설치

node app.js
서버 실행

server/main
으로 접속

참고자료
[JS] 한글 조사붙이기 https://taegon.kim/archives/24


Table DDL

CREATE TABLE `todo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `detail` varchar(512) DEFAULT NULL,
  `priority` double NOT NULL DEFAULT '0',
  `completed` tinyint(4) NOT NULL DEFAULT '0',
  `deadline` datetime DEFAULT NULL,
  `noti` int(11) NOT NULL DEFAULT '0' COMMENT '0 : unnotificated\nn : notificated\n-1 : deleted',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8
