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
    Enemies.spawn(World.platforms);
    Combat.reset();
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
    if (e.key === "z" || e.key === "Z") Combat.playerAttack();
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
  Combat.update();
  Player.update(World.platforms, keys);
  Enemies.update(World.platforms);
  Combat.enemyAttackPlayer();
  Particles.update();

  const shake = Camera.getShakeOffset();

  ctx.save();
  ctx.translate(shake.x, shake.y);

  World.draw(ctx, Camera.x);
  Particles.draw(ctx, Camera.x);
  Enemies.draw(ctx, Camera.x);
  Player.draw(ctx, Camera.x);

  ctx.restore();

  ctx.fillStyle = "#333";
  ctx.fillRect(10, 10, 200, 14);
  ctx.save();
  ctx.shadowBlur = 6;
  ctx.shadowColor = Player.health > 30 ? "#00ffcc" : "#ff4444";
  ctx.fillStyle = Player.health > 30 ? "#00ffcc" : "#ff4444";
  ctx.fillRect(10, 10, (Player.health / Player.maxHealth) * 200, 14);
  ctx.restore();

  ctx.fillStyle = "#ffffff66";
  ctx.font = "11px monospace";
  ctx.textAlign = "left";
  ctx.fillText("HP: " + Player.health, 10, 38);
  ctx.fillText("Z to attack   Backspace to go back", 10, 54);

  ctx.fillStyle = "#ffffff44";
  ctx.font = "11px monospace";
  ctx.textAlign = "right";
  ctx.fillText("SCORE: " + Combat.score, canvas.width - 10, 24);

  if (Combat.combo > 1) {
    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#ffd700";
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold " + Math.min(28, 14 + Combat.combo * 2) + "px monospace";
    ctx.textAlign = "right";
    ctx.fillText(Combat.combo + "x COMBO", canvas.width - 10, 48);
    ctx.restore();
  }

  if (Player.isDead) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff4444";
    ctx.fillStyle = "#ff4444";
    ctx.font = "bold 32px monospace";
    ctx.textAlign = "center";
    ctx.fillText("You died.", canvas.width / 2, canvas.height / 2 - 30);
    ctx.restore();
    ctx.fillStyle = "#ffd700";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + Combat.score, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillStyle = "#ffffff55";
    ctx.font = "13px monospace";
    ctx.fillText("Backspace to go back", canvas.width / 2, canvas.height / 2 + 40);
  }
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