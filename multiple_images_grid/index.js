const grid = document.getElementById("grid");

/* CONFIG */
const ROWS = 2;
const COLS = 2;
const TOTAL = ROWS * COLS;

const MAX_MOVE = 300;
const AUTO_MOVE = 120;
const AUTO_SPEED = 0.001;
const EASE = 0.08;

/* Items */
const items = Array.from({ length: TOTAL }, (_, i) => `Item ${i + 1}`);

/* State */
let mouseX = window.innerWidth / 2;
let time = 0;

/* Per-row animation state */
const currentX = new Array(ROWS).fill(0);
const targetX = new Array(ROWS).fill(0);

/* Build grid */
function buildGrid() {
  grid.innerHTML = "";

  grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;

  for (let i = 0; i < TOTAL; i++) {
    const item = document.createElement("div");
    item.className = "row__item-inner";
    item.dataset.row = Math.floor(i / COLS);

    const content = document.createElement("div");
    content.className = "row__item-content";
    content.textContent = items[i];

    item.appendChild(content);
    grid.appendChild(item);
  }
}

buildGrid();

/* Mouse tracking */
window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
});

/* Animation loop */
function animate() {
  time += 16;

  for (let r = 0; r < ROWS; r++) {
    const direction = r % 2 === 0 ? 1 : -1;

    const mouseMove =
      ((mouseX / window.innerWidth) * MAX_MOVE - MAX_MOVE / 2) * direction;

    const autoMove =
      Math.sin(time * AUTO_SPEED + r) * AUTO_MOVE * direction;

    targetX[r] = mouseMove + autoMove;
    currentX[r] += (targetX[r] - currentX[r]) * EASE;
  }

  /* Apply transform per item based on its row */
  [...grid.children].forEach(item => {
    const row = +item.dataset.row;
    item.style.transform = `translateX(${currentX[row]}px)`;
  });

  requestAnimationFrame(animate);
}

animate();

/* Resize */
window.addEventListener("resize", () => {
  mouseX = window.innerWidth / 2;
});
