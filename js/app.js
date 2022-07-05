const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';
const GLUE = '🍄';
const COLLECT_AUDIO = new Audio('/sound/collect-sound.wav');

var gGameInterval;
var gGlueInterval;

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;
var gCountBalls;
var isGlue;

function initGame() {
	isGlue = false;
	var elRestart = document.querySelector('.restart');
	elRestart.style.display = 'none';
	gCountBalls = 0;
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gGameInterval = setInterval(addRandomBall, 2000);
	gGlueInterval = setInterval(addGlue, 5000);
	// clearInterval(gGameInterval);
}


function buildBoard() {
	// Create the Matrix
	var board = createMat(11, 13);


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	var middleI = Math.floor(board.length / 2);
	var middleJ = Math.floor(board[0].length / 2);
	console.log('middleI', middleI);
	console.log('middleJ', middleJ);
	board[middleI][board[0].length - 1].type = FLOOR;
	board[middleI][0].type = FLOOR;
	board[0][middleJ].type = FLOOR;
	board[board.length - 1][middleJ].type = FLOOR;

	// console.log(board);
	console.table(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;

	var elH1 = document.querySelector('h1');
	elH1.innerHTML = '<h1>Collect those Balls</h1> <h4><span>0</span> balls were collected</h4>';
}

// Move the player to a specific location
function moveTo(i, j) {
	var special = false;
	if(isGlue){
		console.log('trying to move');
		return;
	}
	// console.log('i',i);
	// console.log('j',j);

	if (i === -1) {
		i = gBoard.length - 1;
		special = true;
	} else if (i === gBoard.length) {
		i = 0;
		special = true;
	} else if (j === -1) {
		j = gBoard[0].length - 1;
		special = true;
	} else if (j === gBoard[0].length) {
		j = 0;
		special = true;
	}
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || special) {

		if (targetCell.gameElement === BALL) {
			// console.log('Collecting!');
			gCountBalls++;
			COLLECT_AUDIO.play();

			var elCollected = document.querySelector('h4 span');
			// console.log('elCollected', elCollected);
			elCollected.innerText = gCountBalls;

		} else if(targetCell.gameElement === GLUE){
			isGlue = true;
			console.log('stepped on glue');
			setTimeout(() => {isGlue = false;}, 3000);
		}


		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

		if (isOver()) {
			endGame(true);
		}
	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

function addRandomBall() {
	var emptyCellsArray = emptyCells()
	// if there are no more empty cells- game over
	if (!emptyCellsArray.length) {
		endGame(false);
		return;
	}
	var cell = drawNum(emptyCellsArray);
	gBoard[cell.i][cell.j].gameElement = BALL;
	renderCell(cell, BALL_IMG);
}

function addGlue() {
	var emptyCellsArray = emptyCells()
	// if there are no more empty cells- game over
	if (!emptyCellsArray.length) {
		endGame(false);
		return;
	}
	var cell = drawNum(emptyCellsArray);
	gBoard[cell.i][cell.j].gameElement = GLUE;
	renderCell(cell, GLUE);
	setTimeout(() => { 
		gBoard[cell.i][cell.j].gameElement = null;
		renderCell(cell, '');
	}, 3000);
}

function endGame(win) {
	var str = 'game over - you ';
	str += win ? 'won' : 'lose';
	clearInterval(gGameInterval);
	clearInterval(gGlueInterval);
	console.log(str);
	var elRestart = document.querySelector('.restart');
	elRestart.style.display = 'block';
}

function isOver() {
	var cellsThatCanBeEmpty = (gBoard.length - 2) * (gBoard[0].length - 2);
	var emptyCellsCount = emptyCells().length - 3;
	// console.log('cellsThatCanBeEmpty',cellsThatCanBeEmpty);
	// console.log('emptyCellsCount',emptyCellsCount);
	return cellsThatCanBeEmpty === emptyCellsCount;
}


function emptyCells() {
	var res = [];
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			var cell = gBoard[i][j];
			if (cell.type === FLOOR && !cell.gameElement) res.push({ i: i, j: j });
		}
	}
	// console.log(res);
	return res;
}
