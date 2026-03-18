const Player = {
  x: 200,
  y: 200,
  width: 40,
  height: 60,
  velX: 0,
  velY: 0,
  speed: 4,
  jumpForce: -14,
  gravity: 0.6,
  onGround: false,
  facing: 1,
  color: "#ff8800",

  spritesheet: null,
  frameWidth: 120,
  frameHeight: 80,
  scale: 1.5,

  animations: {
    idle:   { row: 0, frames: 8 },
    attack: { row: 1, frames: 8 },
    hit:    { row: 2, frames: 2 },
    death:  { row: 3, frames: 8 }
  },

  currentAnim: "idle",
  currentFrame: 0,
  frameTimer: 0,
  frameInterval: 5,
  isAttacking: false,
  isDead: false,

  loadSprite() {
    this.spritesheet = new Image();
    this.spritesheet.src = "assets/sprites/Dead_anin.png";
  },

  reset() {
    this.x = 200;
    this.y = 200;
    this.velX = 0;
    this.velY = 0;
    this.onGround = false;
    this.currentAnim = "idle";
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.isAttacking = false;
    this.isDead = false;
  },

  setAnim(name) {
    if (this.currentAnim !== name) {
      this.currentAnim = name;
      this.currentFrame = 0;
      this.frameTimer = 0;
    }
  },

  updateAnim() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      const anim = this.animations[this.currentAnim];
      this.currentFrame++;

      if (this.currentFrame >= anim.frames) {
        if (this.currentAnim === "attack") {
          this.isAttacking = false;
          this.setAnim("idle");
        } else if (this.currentAnim === "death") {
          this.currentFrame = anim.frames - 1;
        } else {
          this.currentFrame = 0;
        }
      }
    }
  },

  attack() {
    if (!this.isAttacking && !this.isDead) {
      this.isAttacking = true;
      this.setAnim("attack");
    }
  },

  update(platforms, keys) {
    if (this.isDead) {
      this.updateAnim();
      return;
    }

    if (keys["ArrowLeft"] || keys["a"]) {
      this.velX = -this.speed;
      this.facing = -1;
    } else if (keys["ArrowRight"] || keys["d"]) {
      this.velX = this.speed;
      this.facing = 1;
    } else {
      this.velX *= 0.8;
    }

    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && this.onGround) {
      this.velY = this.jumpForce;
      this.onGround = false;
    }

    this.velY += this.gravity;
    this.x += this.velX;
    this.y += this.velY;

    this.onGround = false;
    platforms.forEach(p => {
      if (
        this.x + this.width > p.x &&
        this.x < p.x + p.width &&
        this.y + this.height > p.y &&
        this.y + this.height < p.y + p.height + this.velY + 10
      ) {
        this.y = p.y - this.height;
        this.velY = 0;
        this.onGround = true;
      }
    });

    if (!this.isAttacking) {
      this.setAnim("idle");
    }

    this.updateAnim();
  },

  draw(ctx, camX) {
    const sx = this.x - camX;
    const anim = this.animations[this.currentAnim];
    const frameX = this.currentFrame * this.frameWidth;
    const frameY = anim.row * this.frameHeight;
    const drawW = this.frameWidth * this.scale;
    const drawH = this.frameHeight * this.scale;
    const drawX = sx + this.width / 2 - drawW / 2;
    const drawY = this.y - (drawH - this.height) / 2;

    if (this.spritesheet && this.spritesheet.complete) {
      ctx.save();
      if (this.facing === -1) {
        ctx.translate(drawX + drawW, drawY);
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.spritesheet,
          frameX, frameY,
          this.frameWidth, this.frameHeight,
          0, 0,
          drawW, drawH
        );
      } else {
        ctx.drawImage(
          this.spritesheet,
          frameX, frameY,
          this.frameWidth, this.frameHeight,
          drawX, drawY,
          drawW, drawH
        );
      }
      ctx.restore();
    } else {
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.fillRect(sx, this.y, this.width, this.height);
      ctx.restore();
    }
  }
};