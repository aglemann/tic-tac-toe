function Game(){
	// make everything locals so they compress better	
	var grid = 3,
		size = 100,
		doc = document,
		canvas = doc.createElement('canvas'),
		context = canvas.getContext('2d'),
		math = Math,
		aler = alert,
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
	doc.body.appendChild(canvas);
	
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

	// function called for each move
	canvas.onclick = function(e){		
		var i = ~~(e.pageY / size) * grid + ~~(e.pageX / size), alpha, next, res;		
		if (!board[i]){
			draw(i, 'o');
			if (chk(0) < 0) return aler('won');
			i = grid * grid;
			while(i--){
				if (!board[i]){
					board[i] = 'x';
					res = search(1);
					board[i] = undef;
					if (alpha === undef || res > alpha){
						alpha = res;
						next = i;
					}
				}
			}
			if (alpha === undef) return aler('tie');
			draw(next);
			if (chk(0) > 0) return aler('lost')
		}		
	};

	// method to check if game won
	function chk(depth){
		for (z in combos){
			var combo = combos[z], j = x = o = grid, k;
			while(j--){
				k = combo[j];
				board[k] == 'x' && x--;
				board[k] == 'o' && o--;
			}
			if (!x) return size - depth; // x won
			if (!o) return depth - size; // o won
		}
	}

	// method to draw shape on board
	function draw(i, o){
		x = i % grid * size, y = ~~(i / grid) * size, c = size / 2, d = size / 3, e = d * 2;
		context.lineWidth = 4;
		context.bn();  
		if (o) // draw o
			context.a(x + c, y + c, d / 2, 0, math.PI * 2);
		else{ // draw x
			context.mT(x + d, y + d);
			context.lT(x + e, y + e);
			context.mT(x + d, y + e);
			context.lT(x + e, y + d);
		}
		context.sk();
		board[i] = o || 'x';
	}
	
	// simple minimax search for best move
	// http://en.wikipedia.org/wiki/Minimax
	function search(depth){
		var i = grid * grid, xo = 'x', m = 'max', alpha, res;
		if (res = chk(depth))
			alpha = res;
		else{
			if (depth % 2){
				xo = 'o'; 
				m = 'min'; 
			}
			while(i--){
				if (!board[i]){
					board[i] = xo;
					res = search(depth + 1);
					board[i] = undef;
					alpha = alpha === undef ? res : math[m](res, alpha);
				}
			}		
		}
		return alpha || 0;
	}
}