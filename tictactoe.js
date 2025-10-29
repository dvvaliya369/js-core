const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('current-player');
const messageDisplay = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');
const scoreXDisplay = document.getElementById('score-x');
const scoreODisplay = document.getElementById('score-o');
const scoreDrawDisplay = document.getElementById('score-draw');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

let scores = {
    X: 0,
    O: 0,
    draw: 0
};

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function initializeGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    resetBtn.addEventListener('click', resetGame);
    resetScoreBtn.addEventListener('click', resetScore);
    loadScores();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();
}

function updateCell(cell, index) {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerDisplay.textContent = currentPlayer;
}

function checkResult() {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameBoard[a] === '' || gameBoard[b] === '' || gameBoard[c] === '') {
            continue;
        }
        if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        announceWinner(winningCombination);
        scores[currentPlayer]++;
        updateScoreDisplay();
        saveScores();
        gameActive = false;
        return;
    }

    if (!gameBoard.includes('')) {
        announceDraw();
        scores.draw++;
        updateScoreDisplay();
        saveScores();
        gameActive = false;
        return;
    }

    changePlayer();
}

function announceWinner(winningCombination) {
    messageDisplay.textContent = `Player ${currentPlayer} Wins! 🎉`;
    messageDisplay.className = 'message winner';
    
    winningCombination.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function announceDraw() {
    messageDisplay.textContent = "It's a Draw! 🤝";
    messageDisplay.className = 'message draw';
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    currentPlayerDisplay.textContent = currentPlayer;
    messageDisplay.textContent = '';
    messageDisplay.className = 'message';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
}

function resetScore() {
    scores = {
        X: 0,
        O: 0,
        draw: 0
    };
    updateScoreDisplay();
    saveScores();
}

function updateScoreDisplay() {
    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;
    scoreDrawDisplay.textContent = scores.draw;
}

function saveScores() {
    localStorage.setItem('tictactoe-scores', JSON.stringify(scores));
}

function loadScores() {
    const savedScores = localStorage.getItem('tictactoe-scores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

initializeGame();
