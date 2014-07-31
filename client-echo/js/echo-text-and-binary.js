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

jQuery(function($)  {
	var debug = false;
	var ctxSrc = null, canvasSrc = null, canvasDest = null, ctxDest = null;
	var ws;
	var imgSize = 100; // car websocket.org limite la taille, sinon mettre 300
	
	function initSockets() {
		ws = new WebSocket('ws://echo.websocket.org');
		ws.binaryType = "arraybuffer";
     	ws.onmessage = function (event) {
			if (event.data instanceof ArrayBuffer) {
				if (debug) console.log('Réception de données binaires ArrayBuffer');
				fetchImage(event.data);
			}
			else if (event.data instanceof Blob) {
				if (debug) console.log('Réception de données binaires Blob');
			}
			else {
				fetchText(event.data);
			}
      	};
	}

	function initApp() {
		canvasSrc = $('#sourceImage').get(0);
		canvasSrc.width = canvasSrc.height = imgSize;
		ctxSrc = canvasSrc.getContext('2d');
		canvasDest = $('#destinationImage').get(0);
		canvasDest.width = canvasDest.height = imgSize;
		ctxDest =  canvasDest.getContext('2d');
	}
	
function createSource() {
	var x = Math.floor(Math.random()*imgSize);
	var y = Math.floor(Math.random()*imgSize);
	var r = Math.floor(Math.random()*imgSize/6 + imgSize/15);
	ctxSrc.fillStyle = "green";
	ctxSrc.fillRect(0,0,imgSize,imgSize);
	ctxSrc.fillStyle = "red";
	ctxSrc.beginPath();
	ctxSrc.arc(x, y, r, 0, 2*Math.PI, false);
	ctxSrc.closePath();
	ctxSrc.fill();
	
	ctxDest.fillStyle = "grey";
	ctxDest.fillRect(0,0,imgSize,imgSize);
}

function sendText() {
	if (text = $('#srcText').eq(0).text()) {
		if (debug) console.log("Envoyer: "+text);
		ws.send(text);
	}
	else {
		if (debug) console.log('Boîte de texte vide');
	}
}

function fetchText(data) {
	$('#destText').text(data);
}

function sendImage() { 
	var i;
    var imagewidth = imgSize, imageheight = imgSize;
	imagedata = ctxSrc.getImageData(0, 0, imagewidth,imageheight); 
	var canvaspixelarray = imagedata.data; 
	var canvaspixellen = canvaspixelarray.length; 
	var bytearray = new Uint8Array(canvaspixellen); 
	for (i=0;i<canvaspixellen;++i) { 
		bytearray[i] = canvaspixelarray[i]; 
	} 
	ws.send(bytearray.buffer); 
}


function fetchImage(data) {
	var bytearray = new Uint8Array(data); 
	var imagewidth = canvasSrc.width;
	var imageheight = canvasSrc.height;
	var imgdata = ctxDest.getImageData(0,0,imagewidth,imageheight); 
	var imgdatalen = imgdata.data.length; 
	for(var i=0;i<bytearray.length;i++) { 
		imgdata.data[i] = bytearray[i];
	} 
	ctxDest.putImageData(imgdata,0,0);
}

$(document).ready(function(){
	initApp();
	initSockets();
     // faire des choses
	 $('#createImage').click(function(e) {
		 createSource();
	 });
	 $('#echoImage').click(function(e){
		 if (debug) console.log('Écho commencé pour une image');
		 sendImage();
	 });
	 $('#echoText').click(function(e){
		 if (debug) console.log('Écho commencé pour du texte');
		 sendText();
	 });
  });


});