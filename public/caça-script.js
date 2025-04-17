const wordsList = [
  ["insulina", "glicose", "exercicio", "dieta", "hidratacao", "medicacao", "frutas", "verduras", "caminhada", "controle"],
  ["salada", "atividade", "agua", "saudavel", "peso", "cuidado", "carboidrato", "vitamina", "insulina", "controle"],
];

let currentWords = wordsList[0];
let gridSize = 10;
let grid = [];
let foundWords = [];
let currentSelection = [];
let isDragging = false;
let seconds = 0;
let timerInterval;
const gridElement = document.getElementById('grid');
const wordListElement = document.getElementById('word-list');
const messageElement = document.getElementById('message');
const successSound = document.getElementById('success-sound');
const timeoutSound = document.getElementById('time-over-sound');

// Cores para destacar as palavras
const wordColors = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#277da1", "#9b5de5", "#f15bb5"];

// Temporizador
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    document.getElementById('time').textContent = `${min}:${sec}`;
    if (seconds >= 600) {
      clearInterval(timerInterval);
      timeoutSound.play();
      messageElement.textContent = "Tempo esgotado! Tente novamente.";
    }
  }, 1000);
}

function getRandomLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

function generateEmptyGrid() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
}

function placeWord(word) {
  word = word.toUpperCase();
  const directions = [
    [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]
  ];
  let placed = false;
  while (!placed) {
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    let canPlace = true;

    for (let i = 0; i < word.length; i++) {
      const r = row + i * dx;
      const c = col + i * dy;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || (grid[r][c] !== '' && grid[r][c] !== word[i])) {
        canPlace = false;
        break;
      }
    }

    if (canPlace) {
      for (let i = 0; i < word.length; i++) {
        const r = row + i * dx;
        const c = col + i * dy;
        grid[r][c] = word[i];
      }
      placed = true;
    }
  }
}

function fillEmptyCells() {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') grid[r][c] = getRandomLetter();
    }
  }
}

function drawGrid() {
  gridElement.innerHTML = '';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      ['mousedown', 'touchstart'].forEach(e => cell.addEventListener(e, startSelection));
      ['mouseenter', 'touchmove'].forEach(e => cell.addEventListener(e, extendSelection));
      ['mouseup', 'touchend'].forEach(e => cell.addEventListener(e, endSelection));
      gridElement.appendChild(cell);
    }
  }
}

function drawWordList() {
  wordListElement.innerHTML = 'Palavras: ' + currentWords.map((w, i) =>
    `<span id="word-${w}" style="color:${wordColors[i]}">${w}</span>`).join('');
}

function startSelection(e) {
  isDragging = true;
  currentSelection = [];
  const cell = e.target;
  selectCell(cell);
}

function extendSelection(e) {
  if (!isDragging) return;
  const cell = e.target;
  if (!currentSelection.includes(cell)) selectCell(cell);
}

function endSelection() {
  isDragging = false;
  checkSelection();
  clearSelection();
}

function selectCell(cell) {
  cell.classList.add('selected');
  currentSelection.push(cell);
}

function clearSelection() {
  currentSelection.forEach(cell => cell.classList.remove('selected'));
  currentSelection = [];
}

function checkSelection() {
  const selectedWord = currentSelection.map(c => c.textContent).join('').toLowerCase();
  const index = currentWords.indexOf(selectedWord);
  if (index !== -1 && !foundWords.includes(selectedWord)) {
    foundWords.push(selectedWord);
    currentSelection.forEach(cell => {
      cell.classList.add('found');
      cell.style.backgroundColor = wordColors[index];
    });
    successSound.play();
    document.getElementById(`word-${selectedWord}`).style.textDecoration = "line-through";
    if (foundWords.length === currentWords.length) {
      clearInterval(timerInterval);
      messageElement.textContent = `🎉 Parabéns! Você encontrou todas as palavras em ${document.getElementById('time').textContent}`;
    }
  }
}

// Botões
document.getElementById('restart-button').addEventListener('click', () => initGame(currentWords));
document.getElementById('home-button').addEventListener('click', () => window.location.href = 'index.html');
document.getElementById('next-game-button').addEventListener('click', () => {
  const newSet = wordsList[Math.floor(Math.random() * wordsList.length)];
  initGame(newSet);
});

function initGame(words) {
  currentWords = words;
  foundWords = [];
  currentSelection = [];
  seconds = 0;
  document.getElementById('time').textContent = "00:00";
  messageElement.textContent = "";
  generateEmptyGrid();
  currentWords.forEach(placeWord);
  fillEmptyCells();
  drawGrid();
  drawWordList();
  startTimer();
}

// Iniciar
initGame(currentWords);
