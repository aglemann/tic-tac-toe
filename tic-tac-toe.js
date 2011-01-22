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
	var grid = 3, // number of squares per row
		size = 100, // size of each square in pixels
		intelligence = 6, // intelligence of ai (higher numbers take longer)
		// make everything else locals so they compress better	
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
	// shave a few bytes using the canvas context as the scope
	// just can't use variables named f, r, c, s, a
	with(context){
		strokeStyle = '#666';
		bn(); // beginPath
		for (i = 1, h = grid - 1; i <= h * 2; i++){
			j = k = 0, l = m = grid * size;
			i <= h ? j = l = i * size // rows
			 	: k = m = i * size - h * size; // columns
			mT(j, k), lT(l, m); // moveTo, lineTo
		}
		sk(); // stroke
	}
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
			next = search(0, 1, -size, size);
			if (next === undef) return die('tie');		
			draw(next);
			if (chk(0) > 0) return die('lost')
		}		
	};

	// method to check if game won
	// uses depth to give higher values to quicker wins
	function chk(depth){
		for (z in combos){
			j = x = o = grid;
			while(j--){
				k = combos[z][j];
				board[k] > 0 && x--;
				board[k] < 0 && o--;
			}
			if (!x) return size - depth; // x won
			if (!o) return depth - size; // o won
		}
	}

	// method to draw shape on board
	function draw(i, o){
		with(context){
			x = i % grid * size, y = ~~(i / grid) * size, c = size / 2, d = size / 3, e = d * 2, lineWidth = 4;
			bn(); // beginPath
			o ? a(x + c, y + c, d / 2, 0, Math.PI * 2) // draw o
				: (mT(x + d, y + d), lT(x + e, y + e), mT(x + d, y + e), lT(x + e, y + d)); // draw x
			sk(); // stroke
			board[i] = o || 1;
		}
	}
	
	// negamax search with alpha-beta pruning
	// http://en.wikipedia.org/wiki/Negamax
	// http://en.wikipedia.org/wiki/Alpha-beta_pruning
	function search(depth, player, alpha, beta){
		var i = grid * grid, min = -size, max, value, next;
		if (value = chk(depth)) // either player won
			return value * player;
		if (intelligence > depth){ // recursion cutoff
			while(i--){
				if (!board[i]){
					board[i] = player;
					value = -search(depth + 1, -player, -beta, -alpha);
					board[i] = undef;
					if (max === undef || value > max) max = value;
					if (value > alpha) alpha = value;
					if (alpha >= beta) return alpha; // prune branch
					if (max > min){ min = max; next = i; } // best odds for next move
				}
			}		
		} 
		return depth ? max || 0 : next; // 0 is tie game
	}
}