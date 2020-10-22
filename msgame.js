window.addEventListener('load', main);
$.event.special.tap.emitTapOnTaphold = false;
"use strict";
let t = 0;
let timer = undefined;

function clearTimer(seconds){
  clearInterval(timer);
  t=seconds;
  document.querySelectorAll(".time").forEach(
    (e)=> {
      e.textContent = String(t) + " second(s)";
    });
}

let MSGame = (function(){

  // private constants
  const STATE_HIDDEN = "hidden";
  const STATE_SHOWN = "shown";
  const STATE_MARKED = "marked";

  function array2d( nrows, ncols, val) {
    const res = [];
    for( let row = 0 ; row < nrows ; row ++) {
      res[row] = [];
      for( let col = 0 ; col < ncols ; col ++)
        res[row][col] = val(row,col);
    }
    return res;
  }

  // returns random integer in range [min, max]
  function rndInt(min, max) {
    [min,max] = [Math.ceil(min), Math.floor(max)]
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  class _MSGame {
    constructor() {
      this.init(8,10,10); // easy
    }

    validCoord(row, col) {
      return row >= 0 && row < this.nrows && col >= 0 && col < this.ncols;
    }

    card_uncover(arr, i){
      let row = ~~(i/arr[0].length);
      let col = i%arr[0].length;
      this.uncover(row,col)
    }
    card_addflag(arr,i){
      // console.log("in long press")
      let row = ~~(i/arr[0].length);
      let col = i%arr[0].length;
      this.mark(row,col)
    }

    check_win(){
      let status = this.getStatus();
      if(status.nmarked === status.nmines && status.nuncovered === ((status.nrows * status.ncols) - status.nmines) ){
        document.querySelector("#overlaywin").classList.toggle("active");
        clearTimer(t);
        console.log("won")
      }
    }

    game_over(arr){
      const grid = document.querySelector(".grid");
      grid.style.gridTemplateColumns = `repeat(${arr[0].length}, 1fr)`;
      for( let i = 0 ; i < grid.children.length ; i ++) {
          const card = grid.children[i];
          const ind = Number(card.getAttribute("data-cardInd"));
          let row = ~~(i/arr[0].length);
          let col = i%arr[0].length;
          
          // console.log(arr.length, arr[0].length, ind)
          if( ind >= arr.length * arr[0].length) {
            card.style.display = "none";
          }
          else {
            // console.log(i,row,col)
            card.style.display = "block";
            if(this.arr[row][col].mine){
              card.classList.remove("flipped");
              card.classList.add("bomb");
              console.log(row,col + "in mine")
            }
          }
      } 
      
      document.querySelector("#overlaylost").classList.toggle("active");
      clearTimer(t);
    }

    prepare_dom() {
      const grid = document.querySelector(".grid");
      const nCards = 20 * 24 ; // max grid size
      for( let i = 0 ; i < nCards ; i ++) {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-cardInd", i);
        card.addEventListener("click", () => {
          this.card_uncover( this.arr, i);
          // this.card_addflag(this.arr, i)
        });
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if(!isMobile){
          card.addEventListener("contextmenu", () => {
            this.card_addflag(this.arr, i)
          });
        }
        else{
          $(card).bind("taphold", (e) => {
           e.preventDefault();
           this.card_addflag(this.arr, i)
        });
      }
        // card.addEventListener("contextmenu", () => {
        //   this.card_addflag(this.arr, i)
        // });
       
        grid.appendChild(card);
      }
    }

    render(arr){
      const grid = document.querySelector(".grid");
      grid.style.gridTemplateColumns = `repeat(${arr[0].length}, 1fr)`;
      for( let i = 0 ; i < grid.children.length ; i ++) {
        const card = grid.children[i];
        const ind = Number(card.getAttribute("data-cardInd"));
        let row = ~~(i/arr[0].length);
        let col = i%arr[0].length;
        
        // console.log(arr.length, arr[0].length, ind)
        if( ind >= arr.length * arr[0].length) {
          card.style.display = "none";
        }
        else {
          // console.log(i,row,col)
          card.style.display = "block";
        
       if(this.arr[row][col].state === STATE_HIDDEN){
        console.log("here")
        card.classList.remove("bomb");
        card.classList.remove("flag");
        card.classList.remove("zero");
        card.classList.remove("one");
        card.classList.remove("two");
        card.classList.remove("three");
        card.classList.remove("four");
        card.classList.remove("five");
        card.classList.remove("six");
        card.classList.remove("seven");
        card.classList.add("flipped");
       }
       else if(this.arr[row][col].state === STATE_MARKED){
        // console.log(this.arr[row][col].state)
        card.classList.remove("flipped");
        card.classList.add("flag");
      }
       else if(this.arr[row][col].state === STATE_SHOWN){
        card.classList.remove("flipped");
        card.classList.remove("flag");
        // console.log(this.arr[row][col].count)
          if(this.arr[row][col].mine){
            card.classList.add("bomb");
            this.game_over(this.arr);
            return;
          }
          else if(this.arr[row][col].count === 1){
            card.classList.remove("flipped");
            card.classList.add("one");
          }
          else if(this.arr[row][col].count === 0){
            card.classList.remove("flipped");
            card.classList.add("zero");
          }
          else if(this.arr[row][col].count === 2){
            card.classList.remove("flipped");
            card.classList.add("two");
          }
          else if(this.arr[row][col].count === 3){
            card.classList.remove("flipped");
            card.classList.add("three");
          }
          else if(this.arr[row][col].count === 4){
            card.classList.remove("flipped");
            card.classList.add("four");
          } 
          else if(this.arr[row][col].count === 5){
            card.classList.remove("flipped");
            card.classList.add("five");
          }
          else if(this.arr[row][col].count === 6){
            card.classList.remove("flipped");
            card.classList.add("six");
          }  
          else if(this.arr[row][col].count === 7){
            card.classList.remove("flipped");
            card.classList.add("seven");
          } 
        }
        
      
      }
    }

    document.querySelectorAll(".mine").forEach(
      (e)=> {
        e.textContent = String(this.nmines - this.nmarked)
    });
    document.querySelectorAll(".flagcount").forEach(
      (e)=> {
        e.textContent = String(this.nmarked)
    });
    this.check_win();
  }
  
  startTimer() {
    ++t;
    document.querySelectorAll(".time").forEach(
      (e)=> {
        e.textContent = String(t) + " second(s)";
      });
  }
  
    init(nrows, ncols, nmines) {
      // let t = 0
      // let timer = null
      // document.querySelector("body").addEventListener("click", () => {
      //   this.start_time(t,timer)
      // });
      // this.start_time(t,timer)
      console.log(nrows,ncols,nmines);
      this.nrows = nrows;
      this.ncols = ncols;
      this.nmines = nmines;
      this.nmarked = 0;
      this.nuncovered = 0;
      this.exploded = false;
      // this.nflags = nmines;
      // create an array
      this.arr = array2d(
        nrows, ncols,
        () => ({mine: false, state: STATE_HIDDEN, count: 0}));
      this.render(this.arr);
      clearTimer(0);
    }

    count(row,col) {
      const c = (r,c) =>
            (this.validCoord(r,c) && this.arr[r][c].mine ? 1 : 0);
      let res = 0;
      for( let dr = -1 ; dr <= 1 ; dr ++ )
        for( let dc = -1 ; dc <= 1 ; dc ++ )
          res += c(row+dr,col+dc);
      return res;
    }
    sprinkleMines(row, col) {
        // prepare a list of allowed coordinates for mine placement
      let allowed = [];
      for(let r = 0 ; r < this.nrows ; r ++ ) {
        for( let c = 0 ; c < this.ncols ; c ++ ) {
          if(Math.abs(row-r) > 2 || Math.abs(col-c) > 2)
            allowed.push([r,c]);
        }
      }
      this.nmines = Math.min(this.nmines, allowed.length);
      for( let i = 0 ; i < this.nmines ; i ++ ) {
        let j = rndInt(i, allowed.length-1);
        [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
        let [r,c] = allowed[i];
        this.arr[r][c].mine = true;
      }
      // erase any marks (in case user placed them) and update counts
      for(let r = 0 ; r < this.nrows ; r ++ ) {
        for( let c = 0 ; c < this.ncols ; c ++ ) {
          if(this.arr[r][c].state == STATE_MARKED)
            this.arr[r][c].state = STATE_HIDDEN;
          this.arr[r][c].count = this.count(r,c);
        }
      }
      let mines = []; let counts = [];
      for(let row = 0 ; row < this.nrows ; row ++ ) {
        let s = "";
        for( let col = 0 ; col < this.ncols ; col ++ ) {
          s += this.arr[row][col].mine ? "B" : ".";
        }
        s += "  |  ";
        for( let col = 0 ; col < this.ncols ; col ++ ) {
          s += this.arr[row][col].count.toString();
        }
        mines[row] = s;
      }
      console.log("Mines and counts after sprinkling:");
      console.log(mines.join("\n"), "\n");
    }
    // uncovers a cell at a given coordinate
    // this is the 'left-click' functionality
    uncover(row, col) {
      console.log("uncover", row, col);
      // if coordinates invalid, refuse this request
      if( ! this.validCoord(row,col)) return false;
      // if this is the very first move, populate the mines, but make
      // sure the current cell does not get a mine
      if( this.nuncovered === 0){
        this.sprinkleMines(row, col);
        timer= setInterval(this.startTimer, 1000)
      }  
      // if cell is not hidden, ignore this move
      if( this.arr[row][col].state !== STATE_HIDDEN) return false;
      // floodfill all 0-count cells
      const ff = (r,c) => {
        if( ! this.validCoord(r,c)) return;
        if( this.arr[r][c].state !== STATE_HIDDEN) return;
        this.arr[r][c].state = STATE_SHOWN;
        this.nuncovered ++;
        if( this.arr[r][c].count !== 0) return;
        ff(r-1,c-1);ff(r-1,c);ff(r-1,c+1);
        ff(r  ,c-1);         ;ff(r  ,c+1);
        ff(r+1,c-1);ff(r+1,c);ff(r+1,c+1);
      };
      ff(row,col);
      // have we hit a mine?
      if( this.arr[row][col].mine) {
        this.exploded = true;
        console.log("BOMB")
      }
      // console.log(this.getRendering())
      this.getRendering();
      return true;
      
    }
    // puts a flag on a cell
    // this is the 'right-click' or 'long-tap' functionality
    mark(row, col) {
      console.log("mark", row, col);
      // if coordinates invalid, refuse this request
      if( ! this.validCoord(row,col)) return false;
      // if cell already uncovered, refuse this
      console.log("marking previous state=", this.arr[row][col].state);
      if( this.arr[row][col].state === STATE_SHOWN) return false;
      // accept the move and flip the marked status
      this.nmarked += this.arr[row][col].state == STATE_MARKED ? -1 : 1;
      this.arr[row][col].state = this.arr[row][col].state == STATE_MARKED ?
        STATE_HIDDEN : STATE_MARKED;
      
      this.getRendering();
      this.check_win();
      return true;
    }
    // returns array of strings representing the rendering of the board
    //      "H" = hidden cell - no bomb
    //      "F" = hidden cell with a mark / flag
    //      "M" = uncovered mine (game should be over now)
    // '0'..'9' = number of mines in adjacent cells
    getRendering() {
      const res = [];
      for( let row = 0 ; row < this.nrows ; row ++) {
        let s = "";
        for( let col = 0 ; col < this.ncols ; col ++ ) {
          let a = this.arr[row][col];
          if( this.exploded && a.mine) s += "M";
          else if( a.state === STATE_HIDDEN) s += "H";
          else if( a.state === STATE_MARKED) s += "F";
          else if( a.mine) s += "M";
          else s += a.count.toString();
        }
        res[row] = s;
      }
      this.render(res)
      // return res;
    }
    getStatus() {
      let done = this.exploded ||
          this.nuncovered === this.nrows * this.ncols - this.nmines;
      return {
        done: done,
        exploded: this.exploded,
        nrows: this.nrows,
        ncols: this.ncols,
        nmarked: this.nmarked,
        nuncovered: this.nuncovered,
        nmines: this.nmines
      }
    }
  }
  

  return _MSGame;

})();

function main() {
  let game = new MSGame();

  document.querySelectorAll(".menuButton").forEach((button) =>{
    let mode = button.getAttribute("data-size");
    button.innerHTML = `${mode}`;
    console.log(mode);
    let nrows = 0 , ncols = 0, nmines = 0;

    if(mode === 'easy'){
      nrows = 8;
      ncols = 10;
      nmines = 10;
    }
    
    else if(mode === 'medium'){
      nrows = 14;
      ncols = 18;
      nmines = 40;
    }

    else if(mode === "hard"){     
      nrows = 20;
      ncols = 24;
      nmines = 99;
    }

    button.addEventListener("click", game.init.bind(game, nrows, ncols, nmines));
  });


  document.querySelector("#overlaywin").addEventListener("click", () => {
    document.querySelector("#overlaywin").classList.remove("active");
    clearTimer(0);
    game.init(8,10,10);
  });
  document.querySelector("#overlaylost").addEventListener("click", () => {
    document.querySelector("#overlaylost").classList.remove("active");
    clearTimer(0);
    game.init(8,10,10);
  });

  game.prepare_dom()
  game.init(8,10,10);
}


