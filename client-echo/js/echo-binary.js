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
window.onload = function() {
    var ws = new WebSocket('ws://echo.websocket.org');
    ws.binaryType = "arraybuffer";
	ws.onopen = function() {
		var i;
		var bytearray = new Uint8Array(4); 
		for (i=0;i<bytearray.length;++i) bytearray[i] = 2*i;
		ws.send(bytearray.buffer); 
	};
    ws.onmessage = function (event) {
		var i;
		if (event.data instanceof ArrayBuffer) {
			console.log('Réception de données binaires ArrayBuffer');
			var bytearray = new Uint8Array(event.data);  
			for (i=0;i<bytearray.length;i++) console.log(bytearray[i]); 
			console.log('Fin.');
		}
		else {
			console.log('Réception inattendue: nous voulions ArrayBuffer...');
		}
   };
}