import './assets/styles/index.css';

let origBoard;
const firstPlayer = 'X';
const secondPlayer = 'O';
const button = document.querySelector('.tic__button-again');
let i = 0;
let scoreFirst = 1;
let scoreSecond = 1;

localStorage.setItem('firstPlayer', '0')
localStorage.setItem('secondPlayer', '0')

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.tic__cell');
startGame();
button.addEventListener('click', startGame);

function startGame() {
	document.querySelector('.tic__endgame').style.display = "none";
	origBoard = Array.from(Array(9).keys());

	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
  document.querySelector('.tic__score').innerText = `Счет ${localStorage.getItem('firstPlayer')} : ${localStorage.getItem('secondPlayer')}`;
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] === 'number') {
    if (i === 0 || (i % 2) === 0) {
      turn(square.target.id, firstPlayer);
    } else {
      turn(square.target.id, secondPlayer);
    }
    i++;
	}
}

function checkWin(board, player) {
	const plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player === firstPlayer ? '#42AAFF' : '#EE204D';
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player === firstPlayer ? "Первый игрок выиграл!" : "Второй игрок выиграл");
  gameWon.player === firstPlayer ? localStorage.setItem('firstPlayer', JSON.stringify(scoreFirst++)) : localStorage.setItem('secondPlayer', JSON.stringify(scoreSecond++));
}
document.querySelector('.tic__score').innerText = `Счет ${localStorage.getItem('firstPlayer')} : ${localStorage.getItem('secondPlayer')}`;

function declareWinner(who) {
	document.querySelector(".tic__endgame").style.display = "block";
	document.querySelector(".tic__endgame .tic__text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s === 'number');
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = '#DACDFF';
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Ничья!")
		return true;
	}
	return false;
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	const gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
  checkTie();
}
