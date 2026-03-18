const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("tabindex", "0");
canvas.focus();

let gameData = Saves.load();
let currentScreen = "home";
let tick = 0;

function switchScreen(screen) {
  currentScreen = screen;
  if (screen === "home") UI.homeScreen.init();
}

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (currentScreen === "home") {
    UI.homeScreen.handleInput(e.key);
  } else if (currentScreen === "levelSelect") {
    UI.levelSelect.handleInput(e.key);
  } else if (currentScreen === "characterSelect") {
    UI.characterSelect.handleInput(e.key);
  } else if (e.key === "Backspace") {
    switchScreen("home");
  }
});
canvas.addEventListener("click", () => canvas.focus());

UI.homeScreen.init();

function gameLoop() {
  tick++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#05050f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  switch (currentScreen) {
    case "home":
      UI.homeScreen.draw(tick);
      break;
    case "levelSelect":
      UI.levelSelect.draw(tick);
      break;
    case "characterSelect":
      UI.characterSelect.draw(tick);
      break;
    default:
      ctx.fillStyle = "#00ffcc";
      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Screen: " + currentScreen, canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = "#ffffff55";
      ctx.font = "12px monospace";
      ctx.fillText("Press Backspace to go back", canvas.width / 2, canvas.height / 2 + 30);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();