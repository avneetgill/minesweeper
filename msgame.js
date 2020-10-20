// window.addEventListener('load', main);
// "use strict";

// let MSGame = (function(){

//   // private constants
//   const STATE_HIDDEN = "hidden";
//   const STATE_SHOWN = "shown";
//   const STATE_MARKED = "marked";

//   function array2d( nrows, ncols, val) {
//     const res = [];
//     for( let row = 0 ; row < nrows ; row ++) {
//       res[row] = [];
//       for( let col = 0 ; col < ncols ; col ++)
//         res[row][col] = val(row,col);
//     }
//     return res;
//   }

//   // returns random integer in range [min, max]
//   function rndInt(min, max) {
//     [min,max] = [Math.ceil(min), Math.floor(max)]
//     return min + Math.floor(Math.random() * (max - min + 1));
//   }

//   class _MSGame {
//     constructor() {
//       this.init(8,10,10); // easy
//     }

//     validCoord(row, col) {
//       return row >= 0 && row < this.nrows && col >= 0 && col < this.ncols;
//     }

//     init(nrows, ncols, nmines) {
//       this.nrows = nrows;
//       this.ncols = ncols;
//       this.nmines = nmines;
//       this.nmarked = 0;
//       this.nuncovered = 0;
//       this.exploded = false;
//       // create an array
//       this.arr = array2d(
//         nrows, ncols,
//         () => ({mine: false, state: STATE_HIDDEN, count: 0}));
//     }

//     count(row,col) {
//       const c = (r,c) =>
//             (this.validCoord(r,c) && this.arr[r][c].mine ? 1 : 0);
//       let res = 0;
//       for( let dr = -1 ; dr <= 1 ; dr ++ )
//         for( let dc = -1 ; dc <= 1 ; dc ++ )
//           res += c(row+dr,col+dc);
//       return res;
//     }
//     sprinkleMines(row, col) {
//         // prepare a list of allowed coordinates for mine placement
//       let allowed = [];
//       for(let r = 0 ; r < this.nrows ; r ++ ) {
//         for( let c = 0 ; c < this.ncols ; c ++ ) {
//           if(Math.abs(row-r) > 2 || Math.abs(col-c) > 2)
//             allowed.push([r,c]);
//         }
//       }
//       this.nmines = Math.min(this.nmines, allowed.length);
//       for( let i = 0 ; i < this.nmines ; i ++ ) {
//         let j = rndInt(i, allowed.length-1);
//         [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
//         let [r,c] = allowed[i];
//         this.arr[r][c].mine = true;
//       }
//       // erase any marks (in case user placed them) and update counts
//       for(let r = 0 ; r < this.nrows ; r ++ ) {
//         for( let c = 0 ; c < this.ncols ; c ++ ) {
//           if(this.arr[r][c].state == STATE_MARKED)
//             this.arr[r][c].state = STATE_HIDDEN;
//           this.arr[r][c].count = this.count(r,c);
//         }
//       }
//       let mines = []; let counts = [];
//       for(let row = 0 ; row < this.nrows ; row ++ ) {
//         let s = "";
//         for( let col = 0 ; col < this.ncols ; col ++ ) {
//           s += this.arr[row][col].mine ? "B" : ".";
//         }
//         s += "  |  ";
//         for( let col = 0 ; col < this.ncols ; col ++ ) {
//           s += this.arr[row][col].count.toString();
//         }
//         mines[row] = s;
//       }
//       console.log("Mines and counts after sprinkling:");
//       console.log(mines.join("\n"), "\n");
//     }
//     // uncovers a cell at a given coordinate
//     // this is the 'left-click' functionality
//     uncover(row, col) {
//       console.log("uncover", row, col);
//       // if coordinates invalid, refuse this request
//       if( ! this.validCoord(row,col)) return false;
//       // if this is the very first move, populate the mines, but make
//       // sure the current cell does not get a mine
//       if( this.nuncovered === 0)
//         this.sprinkleMines(row, col);
//       // if cell is not hidden, ignore this move
//       if( this.arr[row][col].state !== STATE_HIDDEN) return false;
//       // floodfill all 0-count cells
//       const ff = (r,c) => {
//         if( ! this.validCoord(r,c)) return;
//         if( this.arr[r][c].state !== STATE_HIDDEN) return;
//         this.arr[r][c].state = STATE_SHOWN;
//         this.nuncovered ++;
//         if( this.arr[r][c].count !== 0) return;
//         ff(r-1,c-1);ff(r-1,c);ff(r-1,c+1);
//         ff(r  ,c-1);         ;ff(r  ,c+1);
//         ff(r+1,c-1);ff(r+1,c);ff(r+1,c+1);
//       };
//       ff(row,col);
//       // have we hit a mine?
//       if( this.arr[row][col].mine) {
//         this.exploded = true;
//       }
//       return true;
//     }
//     // puts a flag on a cell
//     // this is the 'right-click' or 'long-tap' functionality
//     mark(row, col) {
//       console.log("mark", row, col);
//       // if coordinates invalid, refuse this request
//       if( ! this.validCoord(row,col)) return false;
//       // if cell already uncovered, refuse this
//       console.log("marking previous state=", this.arr[row][col].state);
//       if( this.arr[row][col].state === STATE_SHOWN) return false;
//       // accept the move and flip the marked status
//       this.nmarked += this.arr[row][col].state == STATE_MARKED ? -1 : 1;
//       this.arr[row][col].state = this.arr[row][col].state == STATE_MARKED ?
//         STATE_HIDDEN : STATE_MARKED;
//       return true;
//     }
//     // function render(s) {
//     //   const grid = document.querySelector(".grid");
//     //   grid.style.gridTemplateColumns = `repeat(${s.cols}, 1fr)`;
//     //   for( let i = 0 ; i < grid.children.length ; i ++) {
//     //     const card = grid.children[i];
//     //     const ind = Number(card.getAttribute("data-cardInd"));
//     //     if( ind >= s.rows * s.cols) {
//     //       card.style.display = "none";
//     //     }
//     //     else {
//     //       card.style.display = "block";
//     //       if(s.onoff[ind])
//     //         card.classList.add("flipped");
//     //       else
//     //         card.classList.remove("flipped");
//     //     }
//     //   }
//     //   document.querySelectorAll(".moveCount").forEach(
//     //     (e)=> {
//     //       e.textContent = String(s.moves);
//     //     });
//     // }
//     // returns array of strings representing the rendering of the board
//     //      "H" = hidden cell - no bomb
//     //      "F" = hidden cell with a mark / flag
//     //      "M" = uncovered mine (game should be over now)
//     // '0'..'9' = number of mines in adjacent cells
//     getRendering() {
//       const res = [];
//       const grid = document.querySelector(".grid");
//       grid.style.gridTemplateColumns = `repeat(this.ncols, 1fr)`;
//       for( let row = 0 ; row < this.nrows ; row ++) {
//         let s = "";
//         for( let col = 0 ; col < this.ncols ; col ++ ) {
//           let a = this.arr[row][col];
//           if( this.exploded && a.mine){
//             s += "M";
//           } 
//           else if( a.state === STATE_HIDDEN) {
//             s += "H";

//           }
//           else if( a.state === STATE_MARKED){
//             s += "F";
//           } 
//           else if( a.mine) s += "M";
//           else s += a.count.toString();
//         }
//         res[row] = s;
//       }
//       return res;
//     }
//     getStatus() {
//       let done = this.exploded ||
//           this.nuncovered === this.nrows * this.ncols - this.nmines;
//       return {
//         done: done,
//         exploded: this.exploded,
//         nrows: this.nrows,
//         ncols: this.ncols,
//         nmarked: this.nmarked,
//         nuncovered: this.nuncovered,
//         nmines: this.nmines
//       }
//     }
//   }

//   return _MSGame;

// })();


// // let game = new MSGame();

// // game.init(8, 10, 10);
// // console.log(game.getRendering().join("\n"));
// // console.log(game.getStatus());

// // game.uncover(2,5);
// // console.log(game.getRendering().join("\n"));
// // console.log(game.getStatus());

// // game.uncover(5,5);
// // console.log(game.getRendering().join("\n"));
// // console.log(game.getStatus());

// // game.mark(4,5);
// // console.log(game.getRendering().join("\n"));
// // console.log(game.getStatus());


// // console.log("end");

// function main() {

//   let game = new MSGame();
  
//   // get browser dimensions - not used in thise code
//   let html = document.querySelector("html");
//   console.log("Your render area:", html.clientWidth, "x", html.clientHeight)
  
//   // register callbacks for buttons
//   document.querySelectorAll(".menuButton").forEach((button) =>{
//     let mode = button.getAttribute("data-size");
//     button.innerHTML = `${mode}`;
  
//     console.log(mode);
//     let nrows = 0 , ncols = 0, nmines = 0;

//     if(mode === 'easy'){
//       nrows = 8;
//       ncols = 10;
//       nmines = 10;
//     }
    
//     else if(mode === 'medium'){
//       nrows = 9;
//       ncols = 10;
//       nmines = 20;
//     }

//     else if(mode === "hard"){     
//       nrows = 10;
//       ncols = 10;
//       nmines = 30;
//     }

//     button.addEventListener("click", game.init.bind(this, nrows, ncols, nmines));
//   });
//   console.log(game.getRendering().join("\n"));
//   // console.log(game.getStatus());

//   // callback for overlay click - hide overlay and regenerate game
//   // document.querySelector("#overlay").addEventListener("click", () => {
//   //   document.querySelector("#overlay").classList.remove("active");
//   //   make_solvable(state);
//   //   render(state); 
//   // });

//   // game.init(8, 10, 10);

//   // // sound callback
//   // let soundButton = document.querySelector("#sound");
//   // soundButton.addEventListener("change", () => {
//   //   clickSound.volume = soundButton.checked ? 0 : 1;
//   // });


//   // create enough cards for largest game and register click callbacks
//   // prepare_dom( state);

//   // // simulate pressing 4x4 button to start new game
//   // button_cb(state, 4, 4);
// }
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const flagsLeft = document.querySelector('#flags-left')
  const result = document.querySelector('#result')
  let width = 10
  let bombAmount = 20
  let flags = 0
  let squares = []
  let isGameOver = false

  //create Board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount

    //get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)

    for(let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('id', i)
      square.classList.add(shuffledArray[i])
      grid.appendChild(square)
      squares.push(square)

      //normal click
      square.addEventListener('click', function(e) {
        click(square)
      })

      //cntrl and left click
      square.oncontextmenu = function(e) {
        e.preventDefault()
        addFlag(square)
      }
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
        if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
        if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
        squares[i].setAttribute('data', total)
      }
    }
  }
  createBoard()

  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag')
        square.innerHTML = ' ðŸš©'
        flags ++
        flagsLeft.innerHTML = bombAmount- flags
        checkForWin()
      } else {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags --
        flagsLeft.innerHTML = bombAmount- flags
      }
    }
  }

  //click on square actions
  function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
      gameOver(square)
    } else {
      let total = square.getAttribute('data')
      if (total !=0) {
        square.classList.add('checked')
        if (total == 1) square.classList.add('one')
        if (total == 2) square.classList.add('two')
        if (total == 3) square.classList.add('three')
        if (total == 4) square.classList.add('four')
        square.innerHTML = total
        return
      }
      checkSquare(square, currentId)
    }
    square.classList.add('checked')
  }


  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId -width)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

  //game over
  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!'
    isGameOver = true

    //show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = 'ðŸ’£'
        square.classList.remove('bomb')
        square.classList.add('checked')
      }
    })
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
  let matches = 0

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches ++
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!'
        isGameOver = true
      }
    }
  }
})