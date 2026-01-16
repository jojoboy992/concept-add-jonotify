const lines = [
  {
    text: "Do You Need",
    lineDelay: 0
  },
  {
    text: "An app",
    lineDelay: 3000
  },
  {
    text: "That can",
    lineDelay: 4500,
    wordInterval: 400
  }
];

const container = document.getElementById("rotating-text");

/* Bounce helper */
function applyBounce(el, delay = 0) {
  el.style.transform = "translateY(28px)";
  el.style.opacity = "0";
  el.style.animation =
    "fluidBounce1 0.9s cubic-bezier(0.22, 1.1, 0.36, 1) forwards";
  el.style.animationDelay = `${delay}ms`;
}

function renderLine({ text, wordInterval = 0 }) {
  // Remove background from previous lines
  document
    .querySelectorAll(".text-line.active-bg")
    .forEach(line => line.classList.remove("active-bg"));

  const line = document.createElement("div");
  line.className = "text-line active-bg";
  container.appendChild(line);

  const words = text.split(" ");

  words.forEach((word, index) => {
    const delay = index * wordInterval;

    setTimeout(() => {
      const span = document.createElement("span");
      span.className = "text-rotate-word";
      span.textContent = word;

      applyBounce(span, 0);
      line.appendChild(span);

      // add space after word (except last)
      if (index !== words.length - 1) {
        const space = document.createElement("span");
        space.className = "text-rotate-space";
        space.innerHTML = "&nbsp;";
        line.appendChild(space);
      }
    }, delay);
  });
}


// ⏱ timeline scheduler (the magic)
lines.forEach(line => {
  setTimeout(() => {
    renderLine(line);
  }, line.lineDelay);
});
