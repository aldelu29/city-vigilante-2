const Camera = {
  x: 0,
  smoothing: 0.08,

  update(targetX, worldWidth) {
    const target = targetX - canvas.width / 2;
    const maxX = worldWidth - canvas.width;
    this.x += (Math.max(0, Math.min(target, maxX)) - this.x) * this.smoothing;
  }
};