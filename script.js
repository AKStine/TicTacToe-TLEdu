const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const singleplayerBtn = document.getElementById('singleplayer-btn');
const multiplayerBtn = document.getElementById('multiplayer-btn');
const followConfirmBtn = document.getElementById('follow-confirm-btn');
const followThankyou = document.getElementById('follow-thankyou');
const settingsPanel = document.querySelector('.settings-panel');
const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('.cell');
const playerTurnDisplay = document.getElementById('player-turn');
const hintBtn = document.getElementById('hint-btn');
const resetBtn = document.getElementById('reset-btn');
const turnNotification = document.getElementById('turn-notification');
const nextPlayerText = document.getElementById('next-player-text');

let currentPlayer = 'x';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let singlePlayerMode = false;
let player1Name = '';
let player2Name = '';
let automatedUsernameCounter = 1;
let hintsRemaining = 0;
let lastMoveIndex = -1;

function generateAutomatedUsername() {
    const prefix = "UTLu-";
    const randomNumber = Math.floor(Math.random() * 100000000);
    const paddedNumber = randomNumber.toString().padStart(8, '0');
    return prefix + paddedNumber;
}

function updatePlayerNames() {
    player1Name = player1NameInput.value.trim() |
| generateAutomatedUsername();
    player2Name = player2NameInput.value.trim() |
| generateAutomatedUsername();
}

followConfirmBtn.addEventListener('click', () => {
    followConfirmBtn.disabled = true;
    followThankyou.style.display = 'block';
    hintsRemaining = 5;
    hintBtn.innerText = `Hint (${hintsRemaining})`;
    hintBtn.disabled = false;
    settingsPanel.style.display = 'none';
    gameBoard.style.display = 'grid';
    updatePlayerNames();
    startGame();
});

singleplayerBtn.addEventListener('click', () => {
    singlePlayerMode = true;
    followConfirmBtn.disabled = false;
});

multiplayerBtn.addEventListener('click', () => {
    singlePlayerMode = false;
    followConfirmBtn.disabled = false;
});

function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'x';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o', 'last-move');
    });
    updateTurnDisplay();
    lastMoveIndex = -1;
    if (singlePlayerMode && currentPlayer === 'o') {
        makeComputerMove();
    }
}

function updateTurnDisplay() {
    playerTurnDisplay.innerText = singlePlayerMode
       ? `Turn: ${currentPlayer === 'x'? player1Name : 'Computer'}`
        : `Turn: ${currentPlayer === 'x'? player1Name : player2Name}`;
}

function handleCellClick(e) {
    if (!gameActive) return;
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if (board[index] === '') {
        board[index] = currentPlayer;
        cell.innerText = currentPlayer.toUpperCase();
        cell.classList.add(currentPlayer);
        if (lastMoveIndex!== -1) {
            cells[lastMoveIndex].classList.remove('last-move');
        }
        cell.classList.add('last-move');
        lastMoveIndex = index;
        checkWin();
        switchPlayer();
        updateTurnDisplay();

        if (gameActive && singlePlayerMode && currentPlayer === 'o') {
            setTimeout(makeComputerMove, 500);
        }
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function switchPlayer() {
    currentPlayer = currentPlayer === 'x'? 'o' : 'x';
    showTurnNotification();
}

function checkWin() {
    const winningCombinations = , [3, 4, 5], [6, 7, 8], // Rows
        , [1, 4, 7], [2, 5, 8], // Columns
        , [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            playerTurnDisplay.innerText = singlePlayerMode
               ? `${board[a].toUpperCase()} wins!`
                : `${board[a].toUpperCase()} (${board[a] === 'x'? player1Name : player2Name}) wins!`;
            return;
        }
    }

    if (!board.includes('')) {
        gameActive = false;
        playerTurnDisplay.innerText = "It's a draw!";
    }
}

function makeComputerMove() {
    if (!gameActive) return;

    let bestMove;
    // Simple AI: Try to win or block, otherwise pick a random empty cell
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'o';
            if (checkWinFor('o')) {
                bestMove = i;
                board[i] = '';
                break;
            }
            board[i] = '';
        }
    }

    if (bestMove === undefined) {
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'x';
                if (checkWinFor('x')) {
                    bestMove = i;
                    board[i] = '';
                    break;
                }
                board[i] = '';
            }
        }
    }

    if (bestMove === undefined) {
        const emptyCells = board.reduce((acc, val, index) => {
            if (val === '') acc.push(index);
            return acc;
        },);
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            bestMove = emptyCells[randomIndex];
        }
    }

    if (bestMove!== undefined && board[bestMove] === '') {
        board[bestMove] = 'o';
        cells[bestMove].innerText = 'O';
        cells[bestMove].classList.add('o');
        if (lastMoveIndex!== -1) {
            cells[lastMoveIndex].classList.remove('last-move');
        }
        cells[bestMove].classList.add('last-move');
        lastMoveIndex = bestMove;
        checkWin();
        switchPlayer();
        updateTurnDisplay();
    }
}

function checkWinFor(player) {
    const winningCombinations = , [3, 4, 5], [6, 7, 8], // Rows
        , [1, 4, 7], [2, 5, 8], // Columns
        , [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

resetBtn.addEventListener('click', startGame);

hintBtn.addEventListener('click', () => {
    if (hintsRemaining > 0 && gameActive && singlePlayerMode && currentPlayer === 'x') {
        hintsRemaining--;
        hintBtn.innerText = `Hint (${hintsRemaining})`;
        // Basic hint: Find the first empty cell
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                // Briefly highlight the cell
                cells[i].classList.add('hint');
                setTimeout(() => {
                    cells[i].classList.remove('hint');
                }, 1000);
                break;
            }
        }
    }
});

function showTurnNotification() {
    const nextPlayer = currentPlayer === 'x'
       ? (singlePlayerMode? player1Name : player2Name)
        : (singlePlayerMode? 'Computer' : player1Name);
    nextPlayerText.innerText = `It's ${nextPlayer}'s turn!`;
    turnNotification.style.display = 'block';
    setTimeout(() => {
        turnNotification.style.display = 'none';
    }, 1500);
}
