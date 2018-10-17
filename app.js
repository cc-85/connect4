window.addEventListener('DOMContentLoaded', () => {
  const player1 = {
    id: 1,
    name: 'Player 1',
    color: 'Red',
    moves: []
  };
  const player2 = {
    id: 2,
    name: 'Player 2',
    color: 'Yellow',
    moves: []
  };

  let currentPlayer = player1;
  let lastPlayer = player2;
  let winnerMove;

  const playerDisplay = document.querySelector('h1');
  const nextPlayer = document.querySelector('#nextPlayer');
  const columns = document.querySelectorAll('.column');
  const audio = document.querySelector('audio');

  nextPlayer.classList.add(currentPlayer.color);

  document.addEventListener('mousemove', function(event) {
    nextPlayer.style.left = `${event.clientX}px`;
  });

  function row(id) {
    const object = {};
    for(let i = 1 ; i < 9; i++) {
      const name = `${id}${i}`;
      object[name] = 0;
    }
    return object;
  }

  const board = {
    h: {rows: row('h'), number: 1 },
    g: {rows: row('g'), number: 1 },
    f: {rows: row('f'), number: 1 },
    e: {rows: row('e'), number: 1 },
    d: {rows: row('d'), number: 1 },
    c: {rows: row('c'), number: 1 },
    b: {rows: row('b'), number: 1 },
    a: {rows: row('a'), number: 1 }
  };

  Object.keys(board).forEach(row => {
    Object.keys(board[row].rows).forEach(squ => {
      const div = document.createElement('div');
      div.classList.add('square');
      div.id = squ;
      const container = document.querySelector(`#${squ[0]}`);
      container.appendChild(div);
    });
  });

  columns.forEach(column => {
    column.addEventListener('click', handleClick);
  });

  function handleClick(event) {
    const number = board[event.target.id[0]].number;
    const location = event.target.id[0] + number;
    board[event.target.id[0]].rows[location] = currentPlayer.id;
    board[event.target.id[0]].number ++;
    currentPlayer.moves.push(location);

    animateMove(location);

    const win = checkForWin();

    // showBoardInConsole();

    if(!win) {
      if(currentPlayer.id === 1) {
        currentPlayer = player2;
        lastPlayer = player1;
      } else {
        currentPlayer = player1;
        lastPlayer = player2;
      }
      playerDisplay.innerHTML = `it's ${currentPlayer.color}'s turn`;
      nextPlayer.classList.remove(lastPlayer.color);
      nextPlayer.classList.add(currentPlayer.color);
    } else if(win) {
      setTimeout(() => {
        audio.src = 'win.mp3';
        audio.play();
        winnerMove.forEach(move => {
          const div = document.querySelector(`#${move}`);
          div.classList.add('win');
          columns.forEach(column => {
            column.removeEventListener('click', handleClick);
          });
        });
      }, 3000);
    }
  }

  function animateMove(location) {
    const finalLocationNumber = parseInt(location[1]);
    const column = location[0];
    const color = currentPlayer.color;
    let j = 8;
    for(let i = finalLocationNumber; i <= 9; i++) {
      let previousLocation;
      const tempLocation = document.querySelector(`#${column + 8}`);
      tempLocation.classList.add(color);
      setTimeout(() => {
        if(j !== 8) {
          previousLocation = document.querySelector(`#${column + (i + 1)}`);
          previousLocation.classList.remove(color);
        }
        audio.play();
        const tempLocation = document.querySelector(`#${column + i}`);
        tempLocation.classList.add(color);
      }, j * 250);
      j --;
    }
  }

  // function showBoardInConsole() {
  //   let display = '';
  //   for(let i = 1; i < 9; i++) {
  //     Object.keys(board).forEach(row => {
  //       display += board[row].rows[row + i];
  //     });
  //     display += '\n';
  //   }
  //   display = display.split('').reverse().join('-');
  //   console.log(display);
  // }

  function checkForWin() {
    if(currentPlayer.moves.length >= 4) {
      const verticalWin = checkForWinAll('v');
      const horizontalWin = checkForWinAll('h');
      const diagonalWinForwards = checkForWinAll('df');
      const diagonalWinBackwards = checkForWinAll('db');

      let win = false;
      if(verticalWin) {
        playerDisplay.innerHTML = `${currentPlayer.name} has won vertically!!!!`;
        win = true;
      }
      if(horizontalWin) {
        playerDisplay.innerHTML = `${currentPlayer.name} has won horizontally!!!!`;
        win = true;
      }
      if(diagonalWinForwards || diagonalWinBackwards) {
        playerDisplay.innerHTML = `${currentPlayer.name} has won diagonally!!!!`;
        win = true;
      }
      return win;
    }
  }

  function checkForWinAll(direction) {
    const allMoves = currentPlayer.moves;
    let win = false;
    let winnerMoveTemp = [];
    allMoves.forEach((move, index, array) => {
      winnerMoveTemp.push(move);
      let target = findTarget(move, direction);
      if(array.includes(target)) {
        winnerMoveTemp.push(target);
        target = findTarget(target, direction);
        if(array.includes(target)) {
          winnerMoveTemp.push(target);
          target = findTarget(target, direction);
          if(array.includes(target)) {
            winnerMoveTemp.push(target);
            win = true;
          }
        }
      }
      if(winnerMoveTemp.length === 4) {
        winnerMove = [...winnerMoveTemp];
      } else {
        winnerMoveTemp = [];
      }
    });

    return win;
  }

  function findTarget(move, direction) {
    let nextLetter;
    let nextNumber;
    let letters;
    if(direction !== 'db') {
      letters = Object.keys(board).sort((a, b) => a > b);
    } else {
      letters = Object.keys(board).sort((a, b) => a < b);
    }

    if(direction === 'h' || direction === 'df') {
      const nextLetterIndex = letters.indexOf(move[0]) + 1;
      nextLetter = letters[nextLetterIndex];
    } else {
      nextLetter = move[0];
    }

    if(direction === 'v' || direction === 'df') {
      nextNumber = parseInt(move[1]) + 1;
    } else {
      nextNumber = move[1];
    }
    if(direction === 'db') {
      nextNumber = parseInt(move[1]) - 1;
      const nextLetterIndex = letters.indexOf(move[0]) - 1;
      nextLetter = letters[nextLetterIndex];
    }
    const target = nextLetter + nextNumber;
    return target;
  }

});
