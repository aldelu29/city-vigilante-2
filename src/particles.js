const Particles = {
  list: [],

  burst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.list.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 20 + Math.random() * 20,
        maxLife: 40,
        color,
        size: 2 + Math.random() * 3
      });
    }
  },

  update() {
    this.list = this.list.filter(p => p.life > 0);
    this.list.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life--;
    });
  },

  draw(ctx, camX) {
    this.list.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - camX, p.y, p.size, p.size);
      ctx.restore();
    });
  }
};