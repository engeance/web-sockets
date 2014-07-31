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
	// se connecter au serveur WebSocket
	var socket = io.connect('http://'+config.server + '/maitre');
	
	// lors de la connexion au serveur WebSocket
	socket.on('connect', function() {
		
		// on se présente comme étant le maître
		socket.emit('set role', 'master');
		
		// handler pour le lien du menu
		$('#menu a').click(function(e) {
			var url = $(this).attr('href');
			// gestion d'interface
			$('#slides div').removeClass('on');
			$(url).addClass("on");
			$('#menu a').removeClass('on');
			$('#menu a[href="' + url + '"]').addClass('on');
			
			// propager le URL de l'image à activer aux esclaves (url ici est le hash)
			socket.emit('push', {url: url});
		});
	});
});