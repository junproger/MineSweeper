const ENUMS = {
  mini: {
    type: 'mini',
    unit: 'vmin',
    size: 5,
    cells: 25,
    bombs: 5,
    grid: 'grid5',
    templ: {
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
    templ: {
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
    templ: {
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
    templ: {
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
  MSTIMER: null,
  MSSTATE: {
    mstimes: 0,
    msclicks: 0,
    msopens: 0,
    msroot: null,
    msdata: null,
    mstype: null,
    mssize: 0,
    mscells: 0,
    msbombs: 0,
    mstempl: null,
    arrbombs: [],
    arrflags: [],
    msmain: '',
  },
  MSGAMEBOMBS: [],
  MSGAMEFLAGS: [],
  GAMECLICKS: MSGAMECOUNT(),
  OPENEDCELLS: MSGAMECOUNT(),
  constReset() {
    this.runTimer(false);
    this.GAMECLICKS = MSGAMECOUNT();
    this.OPENEDCELLS = MSGAMECOUNT();
    this.MSGAMEBOMBS = [];
    this.MSGAMEFLAGS = [];
  },
  clearRoot(ROOT) {
    if (ROOT.childElementCount === 1) {
      return;
    }
    ROOT.firstChild.remove();
    this.clearRoot(ROOT.firstChild);
  },
  runTimer(run) {
    let seconds = 0;
    if (run) {
      this.MSTIMER = setInterval(() => {
        seconds += 1;
        this.MSSTATE.mstimes = seconds;
        const TIMES = document.querySelector('.times');
        TIMES.firstChild.textContent = `${this.MSSTATE.mstimes}`;
      }, 1000);
    } else {
      clearInterval(this.MSTIMER);
    }
  },
  initialize(enums) {
    this.constReset();
    this.runTimer(false);
    this.MSROOT = document.body;
    this.clearRoot(this.MSROOT);
    this.MSSTATE.msdata = enums;
    this.MSSTATE.mstype = enums.type;
    this.MSSTATE.mssize = enums.size;
    this.MSSTATE.mscells = enums.cells;
    this.MSSTATE.msbombs = enums.bombs;
    this.MSSTATE.mstempl = enums.templ;
    this.MSSTATE.msroot = document.body;
    this.renderUI(this.MSSTATE.mstype);
    this.renderMS(this.MSSTATE.mssize, this.MSSTATE.mstempl);
    this.addToState(this.MSROOT.innerHTML);
    this.addListeners();
  },
  addToState(INNER) {
    this.MSSTATE.msclicks = this.GAMECLICKS();
    this.MSSTATE.msopens = this.OPENEDCELLS();
    this.MSSTATE.arrbombs = [...this.MSGAMEBOMBS];
    this.MSSTATE.arrflags = [...this.MSGAMEFLAGS];
    this.MSSTATE.msmain = INNER;
    this.savetoLocalStorage();
    return this.MSSTATE;
  },
  getFromState(key) {
    const STATE = this.MSSTATE;
    if (key) return STATE[key];
    return STATE;
  },
  savetoLocalStorage() {
    localStorage.setItem('junpr#7638markMSGame', 'true');
    localStorage.setItem('junpr#7638typeMSGame', `${this.MSSTATE.mstype}`);
    localStorage.setItem('junpr#7638dataMSGame', `${JSON.stringify(this.MSSTATE.msdata)}`);
    localStorage.setItem('junpr#7638mainMSGame', `${this.MSSTATE.msmain}`);
    localStorage.setItem('junpr#7638stateMSGame', `${JSON.stringify(this.MSSTATE)}`);
  },
  loadfromLocalStorage() {
    const MARK = localStorage.getItem('junpr#7638markMSGame');
    if (MARK) {
      const TYPE = localStorage.getItem('junpr#7638typeMSGame');
      MINESWEEPER.initialize(ENUMS[TYPE]);
    } else {
      MINESWEEPER.initialize(ENUMS.small);
    }
  },
  gameInform() {
    const FLAGS = document.querySelector('.flags');
    const BOMBS = document.querySelector('.bombs');
    const SUMFLAGS = this.MSSTATE.arrflags.length;
    const LEFTBOMBS = this.MSSTATE.arrbombs.length - SUMFLAGS;
    if (LEFTBOMBS < 0) return;
    BOMBS.firstChild.textContent = `${LEFTBOMBS}`;
    FLAGS.firstChild.textContent = `${SUMFLAGS}`;
  },
  gameClicks() {
    const CLICKS = document.querySelector('.clicks');
    CLICKS.firstChild.textContent = `${this.MSSTATE.msclicks}`;
  },
  getCoordinate(CELLID) {
    const SIZEUI = this.MSSTATE.mssize;
    const ROW = Math.trunc(CELLID / SIZEUI);
    const COL = CELLID % SIZEUI;
    return [ROW, COL];
  },
  addBombs(CELLID) {
    const CELLS = this.MSSTATE.mscells;
    let BOMBS = this.MSSTATE.msbombs;
    while (BOMBS) {
      const RANDOM = Math.floor(Math.random(CELLS) * CELLS);
      if (RANDOM !== CELLID && !this.MSGAMEBOMBS.includes(RANDOM)) {
        this.MSGAMEBOMBS.push(RANDOM);
        BOMBS -= 1;
      }
    }
    // eslint-disable-next-line no-console
    console.log('ADD BOMBS ', this.MSGAMEBOMBS);
  },
  renderUI(MSTYPE) {
    const ROOT = document.body;
    ROOT.classList.add('root');
    ROOT.innerHTML = '<main class="main viewmin" id="main"></main>';
    const MAIN = document.getElementById('main');
    MAIN.classList.add(`${MSTYPE}`);
    MAIN.innerHTML = `<div class="head order1" id="head">
      <div class="headers inform" id="inform">
        <div class="flags"><span>0</span><span>🚩</span></div>
        <div class="bombs"><span>0</span><span>💣</span></div>
      </div>
      <div class="headers status" id="status">
        <span class="smile" id="smile">🙂</span>
        <span class="text" id="text">WELCOME!</span>
      </div>
      <div class="headers timing" id="timing">
        <div class="clicks"><span>0</span><span>👆</span></div>
        <div class="times"><span>0</span><span>⏳</span></div>
      </div>
    </div>
    <nav class="menu order2" id="menu">
      <div class="togglerL" id="toggler"></div>
    </nav>
    <div class="game order3" id="game"></div>
    <div class="side order4" id="side">
      <div class="field">SIZE
        <label class="label hide"><input type="radio" name="size" value="mini">x5</label>
        <label class="label"><input type="radio" name="size" value="small">x10</label>
        <label class="label"><input type="radio" name="size" value="medium">x15</label>
        <label class="label"><input type="radio" name="size" value="large">x25</label>
      </div>
    </div>`;
  },
  renderMS(MSSIZE, MSTYPE) {
    this.checkField();
    const ROWS = 'div';
    const CELL = 'div';
    const SIZE = MSSIZE;
    const GAME = document.getElementById('game');
    GAME.classList.add(`${MSTYPE.rows}`);
    for (let i = 0; i < SIZE; i += 1) {
      GAME.append(document.createElement(ROWS));
      GAME.lastChild.classList.add(`${MSTYPE.cols}`);
      for (let j = 0; j < SIZE; j += 1) {
        GAME.lastChild.append(document.createElement(CELL));
        GAME.lastChild.lastChild.classList.add('cells');
        GAME.lastChild.lastChild.setAttribute('data-id', `${i * MSSIZE + j}`);
      }
    }
  },
  checkField() {
    const CHOOSE = document.querySelectorAll('.label');
    for (let i = 0; i < CHOOSE.length; i += 1) {
      if (CHOOSE[i].firstChild.value === this.MSSTATE.mstype) {
        CHOOSE[i].firstChild.checked = true;
      }
    }
  },
  addListeners() {
    const MAIN = document.getElementById('main');
    const HEAD = document.getElementById('head');
    const GAME = document.getElementById('game');
    const SIDE = document.getElementById('side');
    MAIN.addEventListener('click', (event) => this.mainLeftHandler(event));
    MAIN.addEventListener('contextmenu', (event) => this.mainRightHandler(event));
    HEAD.addEventListener('click', (event) => this.headHandler(event));
    GAME.addEventListener('click', (event) => this.gameLeftHandler(event));
    GAME.addEventListener('contextmenu', (event) => this.gameRightHandler(event));
    SIDE.addEventListener('click', this.sideHandler);
  },
  mainLeftHandler(event) {
    event.preventDefault();
    const TARGET = event.target;
    const ROOT = document.body;
    if (TARGET.closest('#main')) {
      this.addToState(ROOT.innerHTML);
      this.gameInform();
      this.gameClicks();
    }
    if (TARGET.closest('.field')) {
      const CHECK = TARGET.closest('.label');
      CHECK.firstChild.checked = true;
      this.initialize(ENUMS[CHECK.firstChild.value]);
    }
  },
  mainRightHandler(event) {
    event.preventDefault();
    const TARGET = event.target;
    const ROOT = document.body;
    if (TARGET.closest('#game')) {
      this.addToState(ROOT.innerHTML);
      this.gameInform();
      this.gameClicks();
    }
  },
  headHandler(event) {
    const TARGET = event.target;
    if (TARGET.closest('.status')) {
      this.runTimer(false);
      this.initialize(this.MSSTATE.msdata);
    }
  },
  gameLeftHandler(event) {
    event.preventDefault();
    if (!event.target.dataset.id) return;
    if (!event.target.closest('.cells')) return;
    if (event.target.classList.contains('mark')) return;
    if (event.target.classList.contains('open')) return;
    const TARGET = event.target;
    const CELLID = +TARGET.dataset.id;
    if (this.MSSTATE.msclicks === 0) {
      // eslint-disable-next-line no-console
      console.log(`START ⭐ ON CELL ${CELLID}`);
      this.addBombs(CELLID);
      this.runTimer(true);
    }
    this.GAMECLICKS(1);
    if (this.isBomb(CELLID)) {
      // eslint-disable-next-line no-console
      console.log(`BOOM 💥 BOMB ON ${CELLID}`);
      TARGET.classList.add('open');
      TARGET.append('💥');
      this.gameOver();
    } else {
      this.openingCell(this.getCoordinate(CELLID));
    }
  },
  gameRightHandler(event) {
    event.preventDefault();
    if (!this.MSGAMEBOMBS.length) return;
    if (!event.target.dataset.id) return;
    if (!event.target.closest('.cells')) return;
    if (event.target.classList.contains('open')) return;
    const TARGET = event.target;
    const CELLID = +TARGET.dataset.id;
    const FLAGS = this.MSGAMEFLAGS;
    this.GAMECLICKS(1);
    if (!TARGET.classList.contains('mark')) {
      const SUMBOMBS = this.MSGAMEBOMBS.length;
      if ((SUMBOMBS - this.MSGAMEFLAGS.length) <= 0) return;
      TARGET.classList.add('mark');
      TARGET.append('🚩');
      FLAGS.push(CELLID);
      this.isWinner();
    } else {
      FLAGS.splice(FLAGS.indexOf(CELLID), 1);
      TARGET.classList.remove('mark');
      TARGET.firstChild.remove();
    }
  },
  gameOver() {
    this.runTimer(false);
    // eslint-disable-next-line no-console
    console.log('YOUR FLAGS ', this.MSGAMEFLAGS);
    // eslint-disable-next-line no-console
    console.log('GAME OVER❗ 🤕 YOU LOSE❗');
    const SMILE = document.getElementById('smile');
    const TEXT = document.getElementById('text');
    SMILE.firstChild.textContent = '🤕';
    TEXT.firstChild.textContent = 'YOU LOSE!';
    this.openLeftover();
  },
  gameWinner() {
    this.runTimer(false);
    // eslint-disable-next-line no-console
    console.log('YOUR FLAGS ', this.MSGAMEFLAGS);
    // eslint-disable-next-line no-console
    console.log('GAME OVER❗ 🤩 YOU WON❗');
    const SMILE = document.getElementById('smile');
    const TEXT = document.getElementById('text');
    SMILE.firstChild.textContent = '🤩';
    TEXT.firstChild.textContent = 'YOU WON!';
  },
  isWinner() {
    const CELLS = this.MSSTATE.mscells;
    const MINES = this.MSSTATE.msbombs;
    const BOMBS = this.MSGAMEBOMBS;
    const FLAGS = this.MSGAMEFLAGS;
    if ((this.OPENEDCELLS() === (CELLS - MINES))
      && BOMBS.every((elm) => FLAGS.includes(elm))) this.gameWinner();
  },
  openLeftover() {
    const GAME = document.getElementById('game');
    for (let i = 0; i < GAME.children.length; i += 1) {
      const ELEM = GAME.children[i];
      for (let j = 0; j < ELEM.children.length; j += 1) {
        const ITEM = ELEM.children[j];
        const mark = ITEM.classList.contains('mark');
        const open = ITEM.classList.contains('open');
        if (!open && !mark) {
          const ITEMID = +ITEM.dataset.id;
          const bombs = this.isBomb(ITEMID);
          if (bombs) {
            ITEM.classList.add('open');
            ITEM.append('💣');
          }
          if (!bombs) {
            const [ROW, COL] = this.getCoordinate(ITEMID);
            const NEAR = this.nearBombs(ROW, COL);
            if (NEAR) {
              ITEM.append(NEAR);
              ITEM.classList.add('open');
              this.numbColorize(ITEM, NEAR);
            } else {
              ITEM.classList.add('open');
            }
          }
        }
      }
    }
  },
  openingCell(arrowcol) {
    const [ROW, COL] = arrowcol;
    const PARENT = document.getElementById('game');
    const TARGET = PARENT.children[ROW].children[COL];
    if (TARGET.classList.contains('open')) return;
    if (TARGET.classList.contains('mark')) return;
    const NEAR = this.nearBombs(ROW, COL);
    this.OPENEDCELLS(1);
    this.isWinner();
    if (NEAR) {
      this.numbColorize(TARGET, NEAR);
      TARGET.classList.add('open');
      TARGET.append(NEAR);
      return;
    }
    if (!NEAR) {
      TARGET.classList.add('open');
      this.openNulls(ROW, COL);
    }
  },
  isBomb(CELLID) {
    return this.MSGAMEBOMBS.includes(CELLID);
  },
  isValid(NROW, NCOL) {
    let nrowtrue = false;
    let ncoltrue = false;
    const SIZEUI = this.MSSTATE.mssize - 1;
    if (NROW >= 0 && NROW <= SIZEUI) nrowtrue = true;
    if (NCOL >= 0 && NCOL <= SIZEUI) ncoltrue = true;
    return (nrowtrue && ncoltrue);
  },
  nearBombs(ROW, COL) {
    let amount = 0;
    const PARENT = document.getElementById('game');
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const NROW = ROW + i;
        const NCOL = COL + j;
        if (this.isValid(NROW, NCOL)) {
          const TARGET = PARENT.children[NROW].children[NCOL];
          const CELLID = +TARGET.dataset.id;
          if (this.isBomb(CELLID)) amount += 1;
        }
      }
    }
    return amount;
  },
  openNulls(ROW, COL) {
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const NROW = ROW + i;
        const NCOL = COL + j;
        if (this.isValid(NROW, NCOL)) {
          this.openingCell([NROW, NCOL]);
        }
      }
    }
  },
  numbColorize(TARGET, NEAR) {
    switch (NEAR) {
      case (1): {
        TARGET.classList.add('blue');
        break;
      }
      case (2): {
        TARGET.classList.add('green');
        break;
      }
      case (3): {
        TARGET.classList.add('red');
        break;
      }
      case (4): {
        TARGET.classList.add('darkblue');
        break;
      }
      case (5): {
        TARGET.classList.add('darkred');
        break;
      }
      case (6): {
        TARGET.classList.add('orange');
        break;
      }
      case (7): {
        TARGET.classList.add('black');
        break;
      }
      case (8): {
        TARGET.classList.add('grey');
        break;
      }
      default: {
        break;
      }
    }
  },

};

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('junpr#7638markMSGame')) {
    MINESWEEPER.loadfromLocalStorage();
  } else {
    MINESWEEPER.initialize(ENUMS.small);
  }
  // eslint-disable-next-line no-console
  console.log('ПРИВЕТСТВУЮ ТЕБЯ, ПРОВЕРЯЮЩИЙ!\n\rДЛЯ ОБЛЕГЧЕНИЯ ПРОВЕРКИ, ДАННЫЕ ИГРЫ В КОНСОЛИ!');
});
