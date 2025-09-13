const boardEl = document.getElementById('board');
const statusEl = document.getElementById('turnText');
const msgEl = document.getElementById('message');
const xQueueDisplay = document.getElementById('xQueueDisplay');
const oQueueDisplay = document.getElementById('oQueueDisplay');
const resetBtn = document.getElementById('resetBtn');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let xQueue = [];
let oQueue = [];
let gameOver = false;
let fadeTimeout = null;

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function createBoard(){
  boardEl.innerHTML = '';
  for(let i=0;i<9;i++){
    const c = document.createElement('div');
    c.className = 'cell';
    c.dataset.index = i;
    c.addEventListener('click', onCellClick);
    boardEl.appendChild(c);
  }
}

function drawSymbol(el, player){
  el.innerHTML = '';
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox","0 0 100 100");
  if(player==='X'){
    const line1 = document.createElementNS("http://www.w3.org/2000/svg","line");
    line1.setAttribute("x1","25"); line1.setAttribute("y1","25");
    line1.setAttribute("x2","75"); line1.setAttribute("y2","75");
    line1.setAttribute("class","x-line");

    const line2 = document.createElementNS("http://www.w3.org/2000/svg","line");
    line2.setAttribute("x1","75"); line2.setAttribute("y1","25");
    line2.setAttribute("x2","25"); line2.setAttribute("y2","75");
    line2.setAttribute("class","x-line");

    svg.appendChild(line1); svg.appendChild(line2);
  } else if(player==='O'){
    const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circle.setAttribute("cx","50"); circle.setAttribute("cy","50");
    circle.setAttribute("r","25");
    circle.setAttribute("class","o-circle");
    svg.appendChild(circle);
  }
  el.appendChild(svg);
}

function updateDisplay(){
  for(let i=0;i<9;i++){
    const el = boardEl.children[i];
    el.innerHTML = '';
    el.classList.remove('oldest','fading');
    if(board[i]){
      drawSymbol(el, board[i]);
    }
    if(gameOver) el.classList.add('disabled'); else el.classList.remove('disabled');
  }
  if(xQueue.length>0){
    const idx = xQueue[0];
    if(board[idx]==='X') boardEl.children[idx].classList.add('oldest');
  }
  if(oQueue.length>0){
    const idx = oQueue[0];
    if(board[idx]==='O') boardEl.children[idx].classList.add('oldest');
  }
  statusEl.textContent = currentPlayer;
  xQueueDisplay.textContent = xQueue.length ? xQueue.join(' → ') : '—';
  oQueueDisplay.textContent = oQueue.length ? oQueue.join(' → ') : '—';
}

function checkWin(player){
  return wins.some(combo => combo.every(i => board[i]===player));
}

function onCellClick(e){
  if(gameOver) return;
  const idx = Number(e.currentTarget.dataset.index);
  if(board[idx] !== null) {
    msgEl.textContent = 'そのマスは既に置かれています。';
    setTimeout(()=> msgEl.textContent = '',1000);
    return;
  }
  placePiece(idx, currentPlayer);
  if(checkWin(currentPlayer)){
    msgEl.style.color = '#158000';
    msgEl.textContent = currentPlayer + ' の勝ち！';
    gameOver = true;
    updateDisplay();
    return;
  }
  if(board.every(cell => cell !== null)){
    msgEl.style.color = '#444';
    msgEl.textContent = '引き分け';
    gameOver = true;
    updateDisplay();
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateDisplay();
  showFadingNext();
}

function placePiece(index, player){
  board[index] = player;
  const q = player === 'X' ? xQueue : oQueue;
  q.push(index);
  if(q.length > 3){
    const removedIndex = q.shift();
    if(board[removedIndex] === player){
      board[removedIndex] = null;
    }
  }
  updateDisplay();
}

function showFadingNext(){
  if(fadeTimeout) clearTimeout(fadeTimeout);
  fadeTimeout = setTimeout(()=>{
    let q = currentPlayer==='X' ? xQueue : oQueue;
    if(q.length===3){
      const idx = q[0];
      boardEl.children[idx].classList.add('fading');
    }
  },500);
}

resetBtn.addEventListener('click', ()=>{
  board = Array(9).fill(null);
  currentPlayer = 'X';
  xQueue = [];
  oQueue = [];
  gameOver = false;
  msgEl.textContent = '';
  msgEl.style.color = '#b00';
  if(fadeTimeout) clearTimeout(fadeTimeout);
  updateDisplay();
});

createBoard();
updateDisplay();