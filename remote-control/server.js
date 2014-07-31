/*
Copyright (c) 2014, Benoit Dubuc <benoit.dubuc@espacecourbe.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
var config = require('./config.js');
var io = require('socket.io');
var connect = require('connect');
var app = connect().use(connect.static('public')).listen(config.port, config.ipaddr);
var poll = io.listen(app);
var nconnected = 0;
var current = "";
var masterOnDuty = false; // nous n'en voulons qu'un seul

poll.of('/maitre').authorization(function (handshake, callback) {
	if (!masterOnDuty) {
	 	// besoin d`un booléen mais peut être utilisé pour identifier le client...
		masterOnDuty = new Buffer(handshake.address.address + handshake.address.port + handshake.headers.host["user-agent"], 'base64').toString();
		callback(null, true);
	}
	else callback(null,false);
}).on('connection', function(socket) {
	socket.on('disconnect', function() {
		// quoi faire ?
		masterOnDuty = false;
		socket.emit('déconnecté');
	});
	socket.on("push", function(data) {
		current = data.url;
		poll.sockets.emit("pull", current);
	});
});

poll.sockets.on('connection', function(socket) {
	socket.on('set role', function(data) {
		if (data === 'slave') {
			console.log('Un slave arrive.');
			nconnected++;
			poll.sockets.emit('connected-count',nconnected);
		}
		if (current) socket.emit('pull', current);
		socket.set("role",data);
	});

	socket.on('disconnect', function() {
		socket.get('role', function(data) {
			if (data === 'slave') {
			}
		});
		console.log('Un slave quitte.');
		nconnected--;
		poll.sockets.emit('connected-count',nconnected);
	});
});
