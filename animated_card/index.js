const container = document.getElementById("card-swap");
const cards = Array.from(container.children);
const titleEl = document.getElementById("card-title");

/* Config */
const cardDistance = 60;
const verticalDistance = 70;
const skewAmount = 6;

let order = cards.map((_, i) => i);
let autoTimer = null;
let isAnimating = false;

/* Slot calculation */
function makeSlot(i, total) {
  return {
    x: i * cardDistance,
    y: -i * verticalDistance,
    z: -i * cardDistance * 1.5,
    zIndex: total - i,
  };
}

/* Place card */
function placeNow(card, slot) {
  card.style.transform = `
    translate3d(
      calc(-50% + ${slot.x}px),
      calc(-50% + ${slot.y}px),
      ${slot.z}px
    )
    skewY(${skewAmount}deg)
  `;
  card.style.zIndex = slot.zIndex;
}

/* Update header text */
function updateHeader(index) {
  const card = cards[index];
  titleEl.classList.add("fade");

  setTimeout(() => {
    // Update text
    titleEl.textContent = card.dataset.title;

    // Update font size
    if (card.dataset.fontsize) {
      titleEl.style.fontSize = card.dataset.fontsize;
    } else {
      titleEl.style.fontSize = ""; // fallback to default CSS
    }

    titleEl.classList.remove("fade");
  }, 200);
}

/* Layout */
function layout() {
  order.forEach((idx, i) => {
    placeNow(cards[idx], makeSlot(i, cards.length));
  });
  updateHeader(order[0]);
}

/* Get per-card delay */
function getCurrentDelay() {
  const frontIndex = order[0];
  const card = cards[frontIndex];
  return parseInt(card.dataset.interval, 10) || 4500;
}

/* Auto scheduler */
function scheduleNext() {
  stopAuto();
  const delay = getCurrentDelay();
  autoTimer = setTimeout(() => {
    swap();
  }, delay);
}

function stopAuto() {
  if (autoTimer) {
    clearTimeout(autoTimer);
    autoTimer = null;
  }
}

/* Swap logic */
function swap() {
  if (isAnimating || cards.length <= 1) return;

  isAnimating = true;

  const frontIndex = order[0];
  const frontCard = cards[frontIndex];

  // Start exit animation
  frontCard.classList.add("exit");

  // ---- Promote next card IMMEDIATELY ----
  // Remove front card from order
  order.shift();

  // If there is a next card, move stack immediately
  if (order.length > 0) {
    order.forEach((idx, i) => {
      placeNow(cards[idx], makeSlot(i, cards.length));
    });

    // Update header immediately
    updateHeader(order[0]);

    // 🔥 START TIMER FOR NEW FRONT CARD NOW
    scheduleNext();
  }

  // ---- Remove old card AFTER animation finishes ----
  setTimeout(() => {
    frontCard.remove();

    const realIndex = cards.indexOf(frontCard);
    if (realIndex !== -1) {
      cards.splice(realIndex, 1);
    }

    // Rebuild order to match new cards array
    order = cards.map((_, i) => i);

    isAnimating = false;
  }, 700); // must match CSS animation
}

/* Click to promote */
cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    stopAuto();
    swap();
  });
});

/* Swipe support */
let startX = null;

container.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

container.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const endX = e.changedTouches[0].clientX;
  if (Math.abs(endX - startX) > 50) {
    stopAuto();
    swap();
  }
  startX = null;
});

/* Pause on hover */
container.addEventListener("mouseenter", stopAuto);
container.addEventListener("mouseleave", scheduleNext);

/* Init */
layout();
scheduleNext(); // start timed loop
