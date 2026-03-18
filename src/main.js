const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameData = Saves.load();
let currentScreen = "home";
let tick = 0;

const keys = {};

function switchScreen(screen) {
  currentScreen = screen;
  if (screen === "home") UI.homeScreen.init();
  if (screen === "game") {
    World.generate();
    Player.reset();
    Player.loadSprite();
  }
}

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  keys[e.key] = true;
  if (currentScreen === "home") {
    UI.homeScreen.handleInput(e.key);
  } else if (currentScreen === "levelSelect") {
    UI.levelSelect.handleInput(e.key);
  } else if (currentScreen === "characterSelect") {
    UI.characterSelect.handleInput(e.key);
  } else if (currentScreen === "game") {
    if (e.key === "Backspace") switchScreen("home");
  } else if (e.key === "Backspace") {
    switchScreen("home");
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

UI.homeScreen.init();

function drawGameBackground() {
  ctx.fillStyle = "#05050f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  tick++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (currentScreen) {
    case "home":
      UI.homeScreen.draw(tick);
      break;

    case "levelSelect":
      ctx.fillStyle = "#05050f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      UI.levelSelect.draw(tick);
      break;

    case "characterSelect":
      ctx.fillStyle = "#05050f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      UI.characterSelect.draw(tick);
      break;

    case "game":
      drawGameBackground();
      Camera.update(Player.x, World.worldWidth);
      Player.update(World.platforms, keys);
      World.draw(ctx, Camera.x);
      Player.draw(ctx, Camera.x);

      ctx.fillStyle = "#ffffff44";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("Backspace to go back", 10, 20);
      break;

    default:
      ctx.fillStyle = "#05050f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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