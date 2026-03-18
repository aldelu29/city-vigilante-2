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

  reset() {
    this.x = 200;
    this.y = 200;
    this.velX = 0;
    this.velY = 0;
    this.onGround = false;
  },

  update(platforms, keys) {
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
  },

  draw(ctx, camX) {
    const sx = this.x - camX;
    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fillRect(sx, this.y, this.width, this.height);
    ctx.restore();

    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(
      this.facing === 1 ? sx + this.width - 10 : sx,
      this.y + 10,
      10,
      10
    );
  }
};