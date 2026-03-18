const World = {
  platforms: [],
  worldWidth: 3200,

  generate() {
    this.platforms = [];

    this.platforms.push({
      x: 0,
      y: 420,
      width: this.worldWidth,
      height: 20
    });

    const platCount = 24;
    let lastX = 200;

    for (let i = 0; i < platCount; i++) {
      const w = 80 + Math.random() * 160;
      const x = lastX + 120 + Math.random() * 200;
      const y = 200 + Math.random() * 180;

      this.platforms.push({ x, y, width: w, height: 16 });
      lastX = x + w;
    }
  },

  draw(ctx, camX) {
    this.platforms.forEach(p => {
      const sx = p.x - camX;
      if (sx > -p.width && sx < canvas.width + p.width) {
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#4488ff";
        ctx.fillStyle = "#0f2040";
        ctx.fillRect(sx, p.y, p.width, p.height);
        ctx.strokeStyle = "#4488ff44";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx, p.y, p.width, p.height);
        ctx.restore();
      }
    });
  }
};