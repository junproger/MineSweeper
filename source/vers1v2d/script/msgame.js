const ENUMS = {
  mini: {
    type: 'mini',
    unit: 'vmin',
    size: 5,
    cells: 25,
    bombs: 5,
    grid: 'grid5',
    temp: {
      rows: 'rows5',
      cols: 'cols5',
    },
  },
  small: {
    type: 'small',
    unit: 'vmin',
    size: 10,
    cells: 100,
    bombs: 10,
    grid: 'grid10',
    temp: {
      rows: 'rows10',
      cols: 'cols10',
    },
  },
  medium: {
    type: 'medium',
    unit: 'vmin',
    size: 15,
    cells: 225,
    bombs: 30,
    grid: 'grid15',
    temp: {
      rows: 'rows15',
      cols: 'cols15',
    },
  },
  large: {
    type: 'large',
    unit: 'vmin',
    size: 25,
    cells: 625,
    bombs: 100,
    grid: 'grid25',
    temp: {
      rows: 'rows25',
      cols: 'cols25',
    },
  },
};

const MSGAMECOUNT = () => {
  let count = 0;
  return (num = 0) => {
    count += num;
    return count;
  };
};

const MINESWEEPER = {
  MSGAMEDATA: null,
  MSGAMESTATE: null,
  MSGAMEROOT: null,
  MSGAMEBOMBS: [],
  MSGAMEFLAGS: [],
  MSGAMESCORE: [],
  GAMECLICKS: MSGAMECOUNT(),
  CELLSOPEN: MSGAMECOUNT(),
  initialize(enums) {
    this.MSGAMEDATA = enums;
    this.MSGAMEROOT = document.body;
    this.TYPEUI = enums.type;
    this.SIZEUI = enums.size;
    this.GRIDMS = enums.grid;
    this.TEMPMS = enums.temp;
    this.renderUI(this.TYPEUI);
    this.renderMS(this.SIZEUI, this.TEMPMS);
    this.addListeners();
  },
  addToState() {
    this.MSGAMESTATE = document.getElementById('main');
    return this.MSGAMESTATE;
  },
  getFromState() {
    const STATE = this.MSGAMESTATE;
    return STATE;
  },
  getCoordinate(CELLID, SIZEUI) {
    const ROW = Math.trunc(CELLID / SIZEUI);
    const COL = CELLID % SIZEUI;
    console.log('CELL ', [ROW, COL], 'ID ', CELLID);
    return [ROW, COL];
  },
  addBombs(CELLID) {
    const CELLS = this.MSGAMEDATA.cells;
    let BOMBS = this.MSGAMEDATA.bombs;
    while (BOMBS) {
      const RANDOM = Math.floor(Math.random(CELLS) * CELLS);
      if (RANDOM !== CELLID && !this.MSGAMEBOMBS.includes(RANDOM)) {
        this.MSGAMEBOMBS.push(RANDOM);
        BOMBS -= 1;
      }
    }
    console.log('ADD BOMBS ', this.MSGAMEBOMBS);
  },
  isBomb(CELLID) {
    return this.MSGAMEBOMBS.includes(CELLID);
  },
  renderUI(TYPEUI) {
    const ROOT = document.body;
    ROOT.classList.add('root');
    ROOT.innerHTML = '<main class="main viewmin" id="main"></main>';
    const MAIN = document.getElementById('main');
    MAIN.classList.add(`${TYPEUI}`);
    MAIN.innerHTML = `<div class="head order1" id="head">
      <div class="headers inform" id="inform"></div>
      <div class="headers status" id="status">
        <span class="smile" id="smile">🙂</span>
        <span class="text" id="text">Welcome!</span>
      </div>
      <div class="headers timing" id="timing"></div>
    </div>
    <nav class="menu order2" id="menu">
      <div class="togglerL" id="toggler"></div>
    </nav>
    <div class="game order3" id="game"></div>
    <div class="side order4" id="side"></div>`;
  },
  renderMS(SIZEUI, TEMPMS) {
    const ROWS = 'div';
    const CELL = 'div';
    const SIZE = SIZEUI;
    const GAME = document.getElementById('game');
    GAME.classList.add(`${TEMPMS.rows}`);
    for (let i = 0; i < SIZE; i += 1) {
      GAME.append(document.createElement(ROWS));
      GAME.lastChild.classList.add(`${TEMPMS.cols}`);
      for (let j = 0; j < SIZE; j += 1) {
        GAME.lastChild.append(document.createElement(CELL));
        GAME.lastChild.lastChild.classList.add('cells');
        GAME.lastChild.lastChild.setAttribute('data-id', `${i * SIZEUI + j}`);
      }
    }
  },
  addListeners() {
    const MAIN = document.getElementById('main');
    const HEAD = document.getElementById('head');
    const MENU = document.getElementById('menu');
    const GAME = document.getElementById('game');
    const SIDE = document.getElementById('side');
    MAIN.addEventListener('click', (event) => this.mainLeftHandler(event));
    MAIN.addEventListener('contextmenu', (event) => this.mainRightHandler(event));
    HEAD.addEventListener('click', this.headHandler);
    MENU.addEventListener('click', (event) => this.menuHandler(event, HEAD, MENU, GAME, SIDE));
    GAME.addEventListener('click', (event) => this.gameLeftHandler(event));
    GAME.addEventListener('contextmenu', this.gameRightHandler);
    SIDE.addEventListener('click', this.sideHandler);
  },
  mainLeftHandler(event) {
    event.preventDefault();
    const TARGET = event.target;
    if (TARGET.closest('#main')) {
      this.addToState();
    }
    const CELLID = +TARGET.dataset.id;
    if (!TARGET.closest('.cells')) return;
    this.getCoordinate(CELLID, this.MSGAMEDATA.size);
  },
  mainRightHandler(event) {
    event.preventDefault();
    const TARGET = event.target;
    if (TARGET.closest('#game')) {
      this.addToState();
    }
    const CELLID = +TARGET.dataset.id;
    if (!TARGET.closest('.cells')) return;
    this.getCoordinate(CELLID, this.MSGAMEDATA.size);
  },
  menuHandler(event, HEAD, MENU, GAME, SIDE) {
    if (event.target.id === 'toggler') {
      if (event.target.classList.contains('togglerL')) {
        event.target.classList.remove('togglerL');
        event.target.classList.add('togglerR');
        HEAD.classList.remove('order1');
        MENU.classList.remove('order2');
        GAME.classList.remove('order3');
        SIDE.classList.remove('order4');
        MENU.classList.add('order1');
        HEAD.classList.add('order2');
        SIDE.classList.add('order3');
        GAME.classList.add('order4');
      } else {
        event.target.classList.remove('togglerR');
        event.target.classList.add('togglerL');
        MENU.classList.remove('order1');
        HEAD.classList.remove('order2');
        SIDE.classList.remove('order3');
        GAME.classList.remove('order4');
        HEAD.classList.add('order1');
        MENU.classList.add('order2');
        GAME.classList.add('order3');
        SIDE.classList.add('order4');
      }
    }
  },
  gameLeftHandler(event) {
    if (!event.target.dataset.id) return;
    if (!event.target.closest('.cells')) return;
    if (event.target.classList.contains('mark')) return;
    if (event.target.classList.contains('open')) return;
    const TARGET = event.target;
    const CELLID = +TARGET.dataset.id;
    if (this.GAMECLICKS() === 0) {
      console.log(`START ON ${CELLID}`);
      this.addBombs(CELLID);
    }
    console.log('CLICK ', this.GAMECLICKS(1));
    if (this.isBomb(CELLID)) {
      TARGET.classList.add('open');
      TARGET.append('💥');
      // TODO this.gameOver(CELLID);
    } else {
      // TODO this.cellOpen(CELLID);
    }
  },

};

function startMineSweeper(enums) {
  MINESWEEPER.initialize(enums);
};

document.addEventListener('DOMContentLoaded', () => {
  startMineSweeper(ENUMS.small);
});
