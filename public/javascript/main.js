var todo_data;
var noti_data;
var last_noti = -1;
var selected = -1;

window.onload = function () {
	conn_db();

};
window.onbeforeunload = function () {
	clearInterval(noti);
}

function get_noti_list() {
	var body = document.getElementById('noti-container');
	var table = document.createElement('table');

	var tbdy = document.createElement('tbody');
	table.id = 'noti-table';

	for (var i = 0; i < noti_data.length; i++) {
		var id = noti_data[i].id;
		var idx = -1;
		while (todo_data[++idx].id != id);
		if (todo_data[idx].remaining > 0) {
			last_noti = i;
			continue;
		}
		var tr = document.createElement('tr');
		tr.id = 'noti' + idx.toString();
		var td = document.createElement('td');
		var innerHtml = '<div id="noti-top"><div id="time"><p>' + todo_data[idx].deadline.substring(0,16) + '</p></div><div id="close" onClick="noti_close(' + idx + ')">&#x2716;</div></div><div id="noti-body"><p>' + Josa(todo_data[idx].title, '를') + ' 완료할 시간입니다!</p></div>';
		if (todo_data[idx].completed == 0) {
			innerHtml += '<div class="go-complete" id="go-complete' + idx + '"><button onClick="noti_complete(' + idx + ')">완료하기</button></div>';
		}
		td.innerHTML = innerHtml;
		tr.appendChild(td);
		tbdy.appendChild(tr);
	}
	table.appendChild(tbdy);
	body.appendChild(table);
	notification();
}

function Josa(txt, josa) {
	var code = txt.charCodeAt(txt.length - 1) - 44032;
	var cho = 19,
		jung = 21,
		jong = 28;
	var i1, i2, code1, code2;

	// 원본 문구가 없을때는 빈 문자열 반환
	if (txt.length == 0) return '';

	// 한글이 아닐때
	if (code < 0 || code > 11171) return txt;

	if (code % 28 == 0) return txt + Josa.get(josa, false);
	else return txt + Josa.get(josa, true);
}
Josa.get = function (josa, jong) {
	// jong : true면 받침있음, false면 받침없음

	if (josa == '을' || josa == '를') return (jong ? '을' : '를');
	if (josa == '이' || josa == '가') return (jong ? '이' : '가');
	if (josa == '은' || josa == '는') return (jong ? '은' : '는');
	if (josa == '와' || josa == '과') return (jong ? '와' : '과');

	// 알 수 없는 조사
	return '**';
}

function notification() {
	noti = setInterval(function () {
		var flg = false;
		var now = Math.ceil(Date.now() / 1000);
		for (; last_noti >= 0; last_noti--) {
			var id = noti_data[last_noti].id;
			var i = -1;
			while (todo_data[++i].id != id);

			if (todo_data[i].unix_time > now) {
				break;
			}

			var tr = document.createElement('tr');
			tr.id = 'noti' + i.toString();
			var td = document.createElement('td');
			var innerHtml = '<div id="noti-top"><div id="time"><p>' + todo_data[i].deadline.substring(0,16) + '</p></div><div id="close" onClick="noti_close(' + i + ')">&#x2716;</div></div><div id="noti-body"><p>' + Josa(todo_data[i].title, '를') + ' 완료할 시간입니다!</p></div>';
			if (todo_data[i].completed == 0) {
				innerHtml += '<div id="go-complete' + i + '"><button onClick="noti_complete(' + i + ')">완료하기</button></div>';
			}
			td.innerHTML = innerHtml;
			tr.appendChild(td);
			var table = document.getElementById('noti-table');
			var top = table.firstChild;
			table.insertBefore(tr, top);

		}

	}, 60000);
};



function sendAjax_noti(data) {
	var url = 'http://127.0.0.1:3000/put_noti';
	data = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
	xhr.send(data);
	location.reload();
}

function noti_close(idx) {

	var data = {
		'id': todo_data[idx].id
	};
	sendAjax_noti_close(data, idx);
}

function sendAjax_noti_close(data, idx) {
	var url = 'http://127.0.0.1:3000/put_noti_close';
	data = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
	xhr.send(data);

	$('#noti' + idx.toString()).remove();
}

function noti_complete(idx) {
	sendAjax_completed(idx);

}

function conn_db() {
	var inputdata = 1;
	sendAjax_select('http://127.0.0.1:3000/main', inputdata);

	function sendAjax_select(url, data) {
		var data = {
			'data': 1
		};
		data = JSON.stringify(data);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', url);
		xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
		xhr.send(data);
		xhr.addEventListener('load', function () {
			var res = JSON.parse(xhr.responseText);
			todo_data = res.todo_data;
			noti_data = res.noti;
			tableCreate();
			get_noti_list();
		});
	}
}

function formatting_time(remaining) {
	if (remaining == null) return '';
	var sign;
	if (remaining > 0) {
		sign = '+';
	} else {
		sign = '-';
		remaining *= -1;
	}
	var min = (remaining % 60).toString() + 'm';
	remaining = Math.floor(remaining / 60);
	if (remaining == 0) {
		return sign + min;
	} else {
		var hour = (remaining % 24).toString() + 'h';
		remaining = Math.floor(remaining / 24);
		if (remaining == 0) {
			return sign + hour + min;
		} else {
			return sign + remaining + 'd' + hour + min;
		}
	}

}

function tableCreate() {

	var body = document.getElementById('content');
	var table = document.createElement('table');
	table.id = 'data-table';
	//tbl.setAttribute('border', '1');
	var thead = document.createElement('thead');

	var th_title = document.createElement('th');
	th_title.appendChild(document.createTextNode('title'));
	var th_detail = document.createElement('th');
	th_detail.appendChild(document.createTextNode('detail'));
	var th_remaining = document.createElement('th');

	th_remaining.appendChild(document.createTextNode('remaining'));
	var th_completed = document.createElement('th');
	th_completed.appendChild(document.createTextNode('complete'));

	thead.appendChild(th_title);
	thead.appendChild(th_detail);
	thead.appendChild(th_remaining);
	thead.appendChild(th_completed);

	table.appendChild(thead);

	var tbdy = document.createElement('tbody');
	for (var i = 0; i < todo_data.length; i++) {
		var tr = document.createElement('tr');
		tr.id = i.toString();
		tr.className = 'table-row';
		var td_title = document.createElement('td');
		td_title.className = 'table-cell';
		td_title.appendChild(document.createTextNode(todo_data[i].title));
		var td_detail = document.createElement('td');
		td_detail.className = 'table-cell';
		td_detail.appendChild(document.createTextNode(todo_data[i].detail));
		var td_remaining = document.createElement('td');
		td_remaining.className = 'table-cell';
		td_remaining.appendChild(document.createTextNode(formatting_time(todo_data[i].remaining)));
		var td_completed = document.createElement('td');
		td_completed.className = 'table-cell';
		var c_btn = document.createElement('button');
		c_btn.style.width = '50px';
		c_btn.style.height = '25px';
		c_btn.value = i.toString();
		if (todo_data[i].completed == 0) {
			c_btn.innerHTML = '완료';
		} else {
			c_btn.innerHTML = '취소';
		}
		c_btn.addEventListener("click", function () {
			if (this.innerHTML === '완료') {
				this.innerHTML = '취소';
			} else {
				this.innerHTML = '완료';
			}
			sendAjax_completed(this.value);
		});
		//todo_data[i].completed
		td_completed.appendChild(c_btn);

		tr.appendChild(td_title);
		tr.appendChild(td_detail);
		tr.appendChild(td_remaining);
		tr.appendChild(td_completed);
		tbdy.appendChild(tr);
	}
	table.appendChild(tbdy);
	body.appendChild(table);
}

function sendAjax_completed(idx) {
	var url = 'http://127.0.0.1:3000/put_completed';
	var data = {
		'id': todo_data[idx].id,
		'completed': 1 - todo_data[idx].completed
	};
	data = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
	xhr.send(data);
	location.reload();
}


$(document).bind("contextmenu", function (event) {

	$("div#menu-container").remove();


	selected = window.event.target.parentNode.id;
	var element_class = window.event.target.className;
	if (element_class != 'table-cell') return;
	event.preventDefault();
	$("<div id='menu-container'><div class='subnemu delete-menu' onclick='delete_click()'>삭제</div><div class='subnemu modify-menu' onclick='modify_click()'>수정</div><div class='subnemu priority-up' onclick='p_up_click()'>위</div><div class='subnemu priority-down' onclick='p_down_click()'>아래</div></div>").appendTo("body").css({
		top: event.pageY + "px",
		left: event.pageX + "px"
	});
}).bind("click", function (event) {
	$("div#menu-container").remove();
});

function delete_click() {
	var data = {
		'id': todo_data[selected].id
	};
	data = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://127.0.0.1:3000/delete_todo');
	xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
	xhr.send(data);
	$('#' + selected.toString()).remove();
}

function modify_click() {
	$("#mod-form").remove();
	if (todo_data[selected].deadline == null) {
		var mod_from = '<tr id="mod-form"><td colspan="4" onclick="mod_form_clicked()"><form><div><table><tr><td><input type="text" name="title" placeholder="title" required maxlength="45" value="' + todo_data[selected].title + '" size="45"></td><td><input type="date" name="date"></td><td><input type="time" name="time"></td></tr><tr><td colspan="3"><textarea type="text" name="detail" placeholder="detail" required maxlength="512" cols="100" rows="5">' + todo_data[selected].detail + '</textarea></td></tr></table></div><div id="button-holder"><button class="mod-button" onclick="mod_clicked()">mod</button></div></form></td></tr>';
	}
	//<textarea type="text" name="detail" placeholder='detail' required maxlength="512" cols="100" rows="5"></textarea>
	else {
	var date = todo_data[selected].deadline.substring(0, 10);
	var time = todo_data[selected].deadline.substring(11, 16);
	var mod_from = '<tr id="mod-form"><td colspan="4" onclick="mod_form_clicked()"><form><div><table><tr><td><input type="text" name="title" placeholder="title" required maxlength="45" value="' + todo_data[selected].title + '" size="45"></td><td><input type="date" name="date" value="' + date + '"></td><td><input type="time" name="time" value="' + time + '"></td></tr><tr><td colspan="3"><textarea type="text" name="detail" placeholder="detail" required maxlength="512" cols="100" rows="5">' + todo_data[selected].detail + '</textarea></td></tr></table></div><div id="button-holder"><button class="mod-button" onclick="mod_clicked()">mod</button></div></form></td></tr>';
	}
	$('#' + selected).after(mod_from);
}

function mod_form_clicked() {
	$("#mod-form").remove();
}

function p_up_click() {
	if (selected == 0) return;
	var priority;
	if (selected == 1) {
		priority = todo_data[0].priority + 1.0;
	} else {
		priority = (todo_data[selected - 1].priority * 1 + todo_data[selected - 2].priority * 1) / 2;
	}
	sendAjax_priority(selected, priority);
}

function p_down_click() {
	var last = todo_data.length - 1;

	if (selected == last) {
		return;
	}
	var priority;
	if (selected == last - 1) {
		priority = todo_data[last].priority - 1.0;
	} else {
		priority = (todo_data[selected * 1 + 1].priority + todo_data[selected * 1 + 2].priority) / 2;
	}
	sendAjax_priority(selected, priority);
}

function sendAjax_priority(idx, priority) {
	var url = 'http://127.0.0.1:3000/put_priority';
	var data = {
		'id': todo_data[idx].id,
		'priority': priority
	};
	data = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
	xhr.send(data);
	location.reload();
}


function mod_clicked() {
	var id = todo_data[selected].id;
	var title = document.forms[0].elements[0].value;
	var detail = document.forms[0].elements[3].value;
	var deadline = document.forms[0].elements[1].value + ' ' + document.forms[0].elements[2].value + ':00';
	sendAjax_put('http://127.0.0.1:3000/put_todo', id, title, detail, deadline);
}

function sendAjax_put(url, id, title, detail, deadline) {
	var data = {
		'id': id,
		'title': title,
		'detail': detail,
		'deadline': deadline
	};
	data = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
	xhr.send(data);
	location.reload();
}

function add_clicked() {
	var title = document.forms[0].elements[0].value;
	var detail = document.forms[0].elements[3].value;
	var deadline = document.forms[0].elements[1].value + ' ' + document.forms[0].elements[2].value + ':00';
	sendAjax_post('http://127.0.0.1:3000/post_todo', title, detail, deadline);
}

function sendAjax_post(url, title, detail, deadline) {
	var data = {
		'title': title,
		'detail': detail,
		'deadline': deadline
	};
	data = JSON.stringify(data);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', "application/json"); //서버로 json형태로 보낸다는걸 나타내주기위해
	xhr.send(data);
	location.reload();
}