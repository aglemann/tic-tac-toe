function Game(){
	// make everything locals so they compress better	
	var grid = 3,
		size = 100,
		doc = document,
		canvas = doc.createElement('canvas'),
		context = canvas.getContext('2d'),
		math = Math,
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
	for (i = 1; i <= (grid - 1) + (grid - 1); i++){
		p1 = p2 = 0, p3 = p4 = grid * size;
		if (i <= grid - 1) p1 = p3 = i * size; // horz
		else p2 = p4 = i * size - (grid - 1) * size; // vert
		context.mT(p1, p2);
		context.lT(p3, p4);
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
		var i = ~~(e.pageY / size) * grid + ~~(e.pageX / size), v, next, res;		
		if (!board[i]){
			draw(i, 'o');
			if (chk() < 0) return alert('won!')
			i = grid * grid
			while(i--){
				if (!board[i]){
					board[i] = 'x';
					res = search(1);
					board[i] = undef;
					if (v === undef || res > v){
						v = res;
						next = i;
					}
				}
			}
			if (v === undef) return alert('tie!');
			draw(next);
			if (chk() > 0) return alert('lost!')
		}		
	};

	// method to check if game won
	function chk(depth){
		depth = depth || 0;
		for (z in combos){
			var combo = combos[z], j = x = o = grid, k;
			while(j--){
				k = combo[j];
				board[k] == 'x' && x--;
				board[k] == 'o' && o--;
			}
			if (!x) return 100 - depth;
			if (!o) return depth - 100;
		}
	}

	// method to draw shape on board
	function draw(i, o){
		x = i % grid * size;
		y = ~~(i / grid) * size;
		c = size / 2;
		d = size / 3;
		context.lineWidth = 4;
		context.bn();  
		if (o)
			context.a(x + c, y + c, d / 2, 0, math.PI * 2);
		else{
			context.mT(x + d, y + d);
			context.lT(x + d * 2, y + d * 2);
			context.mT(x + d, y + d * 2);
			context.lT(x + d * 2, y + d);
		}
		context.sk();
		board[i] = o || 'x';
	}
	
	// simple minimax search for best move
	function search(depth){
		var i = grid * grid, xo = 'x', m = 'max', v, res;
		if (res = chk(depth))
			v = res;
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
					v = v === undef ? res : math[m](res, v);
				}
			}		
		}
		return v || 0;
	}
}