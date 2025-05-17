const gridElement = document.getElementById("grid");
const ROWS = 10;
const COLS = 10;
let grid = [];

let mode = "wall"; // Default interaction mode
let startCell = null;
let endCell = null;

const modeButtons = {
  setStart: document.getElementById("setStart"),
  setEnd: document.getElementById("setEnd"),
  addWall: document.getElementById("addWall"),
  reset: document.getElementById("reset"),
  findPath: document.getElementById("findPath"),
};

// Create grid
function createGrid() {
  grid = [];
  gridElement.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    let rowArr = [];
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => handleCellClick(cell));
      gridElement.appendChild(cell);
      rowArr.push(cell);
    }
    grid.push(rowArr);
  }
}

function handleCellClick(cell) {
  if (mode === "start") {
    if (startCell) startCell.classList.remove("start");
    cell.classList.remove("wall", "end");
    cell.classList.add("start");
    startCell = cell;
  } else if (mode === "end") {
    if (endCell) endCell.classList.remove("end");
    cell.classList.remove("wall", "start");
    cell.classList.add("end");
    endCell = cell;
  } else if (mode === "wall") {
    if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
      cell.classList.toggle("wall");
    }
  }
}

// Pathfinding algorithm (A* algorithm)
function runPathfinding() {
    const openSet = [startCell];
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
  
    for (let row of grid) {
      for (let cell of row) {
        gScore.set(cell, Infinity);
        fScore.set(cell, Infinity);
      }
    }
  
    gScore.set(startCell, 0);
    fScore.set(startCell, heuristic(startCell, endCell));
  
    function reconstructPath(current) {
      const path = [];
      while (cameFrom.has(current)) {
        path.push(current);
        current = cameFrom.get(current);
      }
      return path.reverse();
    }
  
    function step() {
      if (openSet.length === 0) {
        alert("No path found.");
        return;
      }
  
      // Get the cell in openSet with the lowest fScore
      openSet.sort((a, b) => fScore.get(a) - fScore.get(b));
      const current = openSet.shift();
  
      if (current !== startCell && current !== endCell) {
        current.classList.add("visited");
      }
  
      if (current === endCell) {
        const path = reconstructPath(current);
        animatePath(path);
        return;
      }
  
      const neighbors = getNeighbors(current);
      for (let neighbor of neighbors) {
        const tentativeG = gScore.get(current) + 1; // All edges cost 1
  
        if (tentativeG < gScore.get(neighbor)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeG);
          fScore.set(neighbor, tentativeG + heuristic(neighbor, endCell));
  
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
  
      setTimeout(step, 30); // Animate with delay
    }
  
    step(); // Start the algorithm
  }
  
  function animatePath(path) {
    let i = 0;
    function animate() {
      if (i >= path.length) return;
      const cell = path[i];
      if (cell !== startCell && cell !== endCell) {
        cell.classList.remove("visited");
        cell.classList.add("path");
      }
      i++;
      setTimeout(animate, 50);
    }
    animate();
  }
  

// Handle mode switching
modeButtons.setStart.addEventListener("click", () => mode = "start");
modeButtons.setEnd.addEventListener("click", () => mode = "end");
modeButtons.addWall.addEventListener("click", () => mode = "wall");

modeButtons.reset.addEventListener("click", () => {
  createGrid();
  startCell = null;
  endCell = null;
});

// Placeholder for pathfinding
modeButtons.findPath.addEventListener("click", () => {
  if (!startCell || !endCell) {
    alert("Please set both a start and end point.");
    return;
  }
  runPathfinding();
});

function getCellPosition(cell) {
    return {
      row: parseInt(cell.dataset.row),
      col: parseInt(cell.dataset.col)
    };
  }
  
  function getNeighbors(cell) {
    const { row, col } = getCellPosition(cell);
    const deltas = [
      [0, 1], [1, 0], [0, -1], [-1, 0], // 4 directions
    ];
  
    const neighbors = [];
  
    for (let [dx, dy] of deltas) {
      const newRow = row + dx;
      const newCol = col + dy;
  
      if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
        const neighbor = grid[newRow][newCol];
        if (!neighbor.classList.contains("wall")) {
          neighbors.push(neighbor);
        }
      }
    }
  
    return neighbors;
  }
  
  function heuristic(a, b) {
    const posA = getCellPosition(a);
    const posB = getCellPosition(b);
    return Math.abs(posA.row - posB.row) + Math.abs(posA.col - posB.col); // Manhattan distance
  }
  

// Call initially to draw the grid
createGrid();
