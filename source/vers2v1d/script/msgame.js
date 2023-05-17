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

const MINESWEEPER = {
  MSGAMEDATA: null,
  MSGAMESTATE: null,
  MSGAMEROOT: null,
  MSGAMEBOMBS: [],
  MSGAMEFLAGS: [],
  MSGAMESCORE: [],
  initialize(enums) {
    this.MSGAMEDATA = enums;
    this.MSGAMEROOT = document.body;
    this.typeUI = enums.type;
    this.sizeUI = enums.size;
    this.gridMS = enums.grid;
    this.tempMS = enums.temp;
    this.renderUI(this.typeUI);
  },
  renderUI(typeUI) {
    const ROOT = document.body;
    ROOT.classList.add('root');
    ROOT.innerHTML = '<main class="main viewmin" id="main"></main>';
    const MAIN = document.getElementById('main');
    MAIN.classList.add(`${typeUI}`);
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
};

function startMineSweeper(enums) {
  MINESWEEPER.initialize(enums);
};

document.addEventListener('DOMContentLoaded', () => {
  startMineSweeper(ENUMS.medium);
});
