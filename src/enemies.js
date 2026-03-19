const Enemies = {
  list: [],

  spawn(platforms) {
    this.list = [];
    platforms.forEach(p => {
      if (p.width < 200) return;
      if (Math.random() > 0.6) return;

      const count = Math.floor(1 + Math.random() * 2);
      for (let i = 0; i < count; i++) {
        this.list.push({
          x: p.x + 20 + Math.random() * (p.width - 40),
          y: p.y - 48,
          width: 24,
          height: 48,
          velX: 0,
          velY: 0,
          speed: 1.2,
          gravity: 0.6,
          onGround: false,
          health: 100,
          maxHealth: 100,
          facing: 1,
          alive: true,
          knockbackX: 0,
          knockbackY: 0,
          platform: p,
          color: "#ff4466",
          aggroRange: 250,
          isAggro: false
        });
      }
    });
  },

  update(platforms) {
    this.list.forEach(enemy => {
      if (!enemy.alive) return;

      const dx = Player.x - enemy.x;
      const dy = Player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < enemy.aggroRange) {
        enemy.isAggro = true;
      }
if (enemy.isAggro) {
  if (dx > 0) {
    enemy.velX = enemy.speed;
    enemy.facing = 1;
  } else {
    enemy.velX = -enemy.speed;
    enemy.facing = -1;
  }

  const playerOnHigherPlatform = Player.onGround && (Player.y + Player.height) < enemy.y;
  const jumpCooledDown = !enemy.lastJumpTime || Date.now() - enemy.lastJumpTime > 1200;

  if (playerOnHigherPlatform && enemy.onGround && jumpCooledDown && Math.abs(dx) < 200) {
    enemy.velY = -12;
    enemy.lastJumpTime = Date.now();
  }
}

 else {
        if (enemy.x < enemy.platform.x + 20) {
          enemy.facing = 1;
        }
        if (enemy.x + enemy.width > enemy.platform.x + enemy.platform.width - 20) {
          enemy.facing = -1;
        }
        enemy.velX = enemy.facing * enemy.speed * 0.5;
      }

      if (enemy.knockbackX !== 0) {
        enemy.velX = enemy.knockbackX;
        enemy.knockbackX *= 0.8;
        if (Math.abs(enemy.knockbackX) < 0.1) enemy.knockbackX = 0;
      }

      enemy.velY += enemy.gravity;
      enemy.x += enemy.velX;
      enemy.y += enemy.velY;

      enemy.onGround = false;
      platforms.forEach(p => {
        if (
          enemy.x + enemy.width > p.x &&
          enemy.x < p.x + p.width &&
          enemy.y + enemy.height > p.y &&
          enemy.y + enemy.height < p.y + p.height + enemy.velY + 10
        ) {
          enemy.y = p.y - enemy.height;
          enemy.velY = 0;
          enemy.onGround = true;
        }
      });

      if (enemy.y > 600) {
        enemy.alive = false;
      }
    });
  },

  draw(ctx, camX) {
    this.list.forEach(enemy => {
      if (!enemy.alive) return;

      const sx = enemy.x - camX;
      if (sx < -100 || sx > canvas.width + 100) return;

      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = enemy.color;
      ctx.fillStyle = enemy.color;
      ctx.fillRect(sx, enemy.y, enemy.width, enemy.height);
      ctx.restore();

      ctx.fillStyle = "#ffffff22";
      ctx.fillRect(
        enemy.facing === 1 ? sx + enemy.width - 8 : sx,
        enemy.y + 8,
        8, 8
      );

      const barW = 40;
      const barH = 4;
      const bx = sx + enemy.width / 2 - barW / 2;
      const by = enemy.y - 10;
      ctx.fillStyle = "#333";
      ctx.fillRect(bx, by, barW, barH);
      ctx.save();
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#ff4444";
      ctx.fillStyle = "#ff4444";
      ctx.fillRect(bx, by, (enemy.health / enemy.maxHealth) * barW, barH);
      ctx.restore();

      if (enemy.isAggro) {
  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#ff4444";
  ctx.fillStyle = "#ff4444";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "center";
  ctx.fillText("!", sx + enemy.width / 2, enemy.y - 18);
  ctx.restore();
}
    });
  },

  allDefeated() {
    return this.list.every(e => !e.alive);
  }
};