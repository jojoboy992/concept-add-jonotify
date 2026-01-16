const texts = [
  "Need",
];

const container = document.getElementById("rotating-text");

let currentIndex = 0;
const rotationInterval = 2000;
const staggerDuration = 40; // ms per character
const loop = false; // 👈 turn looping off
let intervalId = null;

/* Split text into characters (supports emojis) */
function splitCharacters(text) {
  if (window.Intl && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), s => s.segment);
  }
  return Array.from(text);
}

function renderText(text) {
  const words = text.split(" ");
  let charIndex = 0;

  words.forEach((word, wIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "text-rotate-word";

    splitCharacters(word).forEach(char => {
      const charSpan = document.createElement("span");
      charSpan.className = "text-rotate-element";
      charSpan.textContent = char;
      charSpan.style.animationDelay = `${charIndex * staggerDuration}ms`;

      wordSpan.appendChild(charSpan);
      charIndex++;
    });

    container.appendChild(wordSpan);

    if (wIndex !== words.length - 1) {
      const space = document.createElement("span");
      space.className = "text-rotate-space";
      space.textContent = " ";
      container.appendChild(space);
    }
  });
}

function clearText() {
  const elements = container.querySelectorAll(".text-rotate-element");
  elements.forEach(el => el.classList.add("text-rotate-exit"));

  setTimeout(() => {
    container.innerHTML = "";
  }, 600);
}

function nextText() {
  // 🛑 Stop when we reach the last text and looping is off
  if (!loop && currentIndex === texts.length - 1) {
    clearInterval(intervalId);
    return;
  }

  clearText();

  setTimeout(() => {
    currentIndex =
      currentIndex === texts.length - 1 ? 0 : currentIndex + 1;

    renderText(texts[currentIndex]);
  }, 600);
}

/* Initial render */
renderText(texts[currentIndex]);

/* Auto rotation */
intervalId = setInterval(nextText, rotationInterval);
