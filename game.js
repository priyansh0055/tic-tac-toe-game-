const cells = document.querySelectorAll('.cell');
const board = document.getElementById('board');
const turnText = document.getElementById('turn-text');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const playerXScoreCard = document.querySelector('.player-x');
const playerOScoreCard = document.querySelector('.player-o');
const resetBtn = document.getElementById('reset-btn');
const modalResetBtn = document.getElementById('modal-reset-btn');
const winnerModal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

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

// Initialize Game
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    resetBtn.addEventListener('click', resetBoard);
    modalResetBtn.addEventListener('click', () => {
        winnerModal.classList.add('hidden');
        resetBoard();
    });
    updateTurnIndicator();
}

function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[cellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkWin();
}

function updateTurnIndicator() {
    board.className = 'game-board glass-panel';
    board.classList.add(`board-${currentPlayer.toLowerCase()}-turn`);
    
    turnText.textContent = `Player ${currentPlayer}'s Turn`;
    turnText.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
    
    if (currentPlayer === 'X') {
        playerXScoreCard.classList.add('active');
        playerOScoreCard.classList.remove('active');
    } else {
        playerOScoreCard.classList.add('active');
        playerXScoreCard.classList.remove('active');
    }
}

function checkWin() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        handleWin(winningCells);
        return;
    }

    if (!gameState.includes('')) {
        handleDraw();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
}

function handleWin(winningCells) {
    gameActive = false;
    
    // Add glow to winning cells
    winningCells.forEach(index => {
        cells[index].classList.add(`win-glow-${currentPlayer.toLowerCase()}`);
    });

    // Update score
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElement.textContent = scoreX;
        winnerMessage.style.background = 'linear-gradient(135deg, #60a5fa, #3b82f6)';
    } else {
        scoreO++;
        scoreOElement.textContent = scoreO;
        winnerMessage.style.background = 'linear-gradient(135deg, #a78bfa, #8b5cf6)';
    }
    
    winnerMessage.style.webkitBackgroundClip = 'text';

    // Show modal after slight delay for cell animation
    setTimeout(() => {
        winnerMessage.textContent = `Player ${currentPlayer} Wins! 🎉`;
        winnerModal.classList.remove('hidden');
        createConfetti();
    }, 600);
}

function handleDraw() {
    gameActive = false;
    setTimeout(() => {
        winnerMessage.textContent = "It's a Draw! 🤝";
        winnerMessage.style.background = 'var(--text-primary)';
        winnerMessage.style.webkitBackgroundClip = 'text';
        winnerModal.classList.remove('hidden');
    }, 400);
}

function resetBoard() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'; // Reset all classes
    });
    
    updateTurnIndicator();
    
    // Remove existing confetti
    const existingConfetti = document.querySelector('.celebration');
    if (existingConfetti) {
        existingConfetti.remove();
    }
}

// Very simple confetti effect for celebration
function createConfetti() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);

    const colors = ['#3b82f6', '#8b5cf6', '#60a5fa', '#a78bfa', '#f8fafc'];
    
    for (let i = 0; i < 70; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 8 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.opacity = Math.random() + 0.5;
        
        // Random falling animation
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;
        
        confetti.animate([
            { transform: `translate3d(0,0,0) rotate(0deg)`, opacity: 1 },
            { transform: `translate3d(${Math.random() * 300 - 150}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(.37,0,.63,1)',
            fill: 'forwards'
        });
        
        celebration.appendChild(confetti);
    }
    
    // Cleanup celebrations automatically
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.remove();
        }
    }, 5000);
}

// Start game
initGame();
