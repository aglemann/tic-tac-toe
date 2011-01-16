/*!
 * TicTacToe
 * Simple minimax-derivative tic-tac-toe game in about 1K of Javascript
 * https://github.com/aglemann/tic-tac-toe
 *
 * Copyright 2010, Aeron Glemann (http://electricprism.com/aeron)
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
function Game(el){
	// make everything locals so they compress better	
	var grid = 3,
		size = 100,
		doc = document,
		body = doc.body,
		canvas = doc.createElement('canvas'),
		context = canvas.getContext('2d'),
		die = alert,
		combos = [],
		board = [],
		undef;
	
	// make shortcuts for canvas ops
	// http://marijnhaverbeke.nl/js1k/
	for (i in context)
		context[i[0] + (i[4] || '')] = context[i];
		
	// build the playing area	
	canvas.height = canvas.width = grid * size;
	context.strokeStyle = '#666';
	context.bn();	
	for (i = 1, g = grid - 1; i <= g * 2; i++){
		a = b = 0, c = d = grid * size;
		if (i <= g) a = c = i * size; // horz
		else b = d = i * size - g * size; // vert
		context.mT(a, b);
		context.lT(c, d);
	}
	context.sk();	
	(el || body).appendChild(canvas);
	
	// calculate all winning combos
	for (i = 0, c = [], d = []; i < grid; i++){
		for (j = 0, a = [], b = []; j < grid; j++){
			a.push(i * grid + j);
			b.push(j * grid + i);
		}
		combos.push(a, b);
		c.push(i * grid + i);
		d.push((grid - i - 1) * grid + i);
	}
	combos.push(c, d);

	// method called for each move
	canvas.onclick = function(e){
		var rect = canvas.getBoundingClientRect(), 
			move = ~~((e.pageY - rect.top + body.scrollTop) / size) * grid + ~~((e.pageX - rect.left + body.scrollLeft) / size), 
			next;		
		if (!board[move]){
			draw(move, -1); // o = -1, x = 1
			if (chk(0) < 0) return die('won');
			next = search(0, 1);
			if (next === undef) return die('tie');		
			draw(next);
			if (chk(0) > 0) return die('lost')
		}		
	};

	// method to check if game won
	// uses depth to give higher values to quicker wins
	function chk(depth){
		for (z in combos){
			var combo = combos[z], j = x = o = grid;
			while(j--){
				k = combo[j];
				board[k] == 1 && x--;
				board[k] == -1 && o--;
			}
			if (!x) return size - depth; // x won
			if (!o) return depth - size; // o won
		}
	}

	// method to draw shape on board
	function draw(i, o){
		a = i % grid * size, b = ~~(i / grid) * size, c = size / 2, d = size / 3, e = d * 2;
		context.lineWidth = 4;
		context.bn();  
		if (o) // draw o
			context.a(a + c, b + c, d / 2, 0, Math.PI * 2);
		else{ // draw x
			context.mT(a + d, b + d);
			context.lT(a + e, b + e);
			context.mT(a + d, b + e);
			context.lT(a + e, b + d);
		}
		context.sk();
		board[i] = o || 1;
	}
	
	// negamax search
	// http://en.wikipedia.org/wiki/Negamax
	function search(depth, player){
		var i = grid * grid, max, beta, value, next;
		if (value = chk(depth)) // either player won
			return value * player;			
		while(i--){
			if (!board[i]){
				board[i] = player;
				value = -search(depth + 1, -player);
				board[i] = undef;
				if (max === undef || value > max)
					max = value;
				if (beta === undef || max > beta){
					beta = max;
					next = i;
				}
			}
		}		
		return depth ? max || 0 : next; // 0 is tie game
	}
}