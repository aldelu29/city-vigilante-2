const Camera = {
  x: 0,
  smoothing: 0.08,
  shakeAmount: 0,
  shakeDecay: 0.85,

  update(targetX, worldWidth) {
    const target = targetX - canvas.width / 2;
    const maxX = worldWidth - canvas.width;
    this.x += (Math.max(0, Math.min(target, maxX)) - this.x) * this.smoothing;
  },

  shake(amount) {
    this.shakeAmount = amount;
  },

  getShakeOffset() {
    if (this.shakeAmount < 0.1) {
      this.shakeAmount = 0;
      return { x: 0, y: 0 };
    }
    const x = (Math.random() - 0.5) * this.shakeAmount;
    const y = (Math.random() - 0.5) * this.shakeAmount;
    this.shakeAmount *= this.shakeDecay;
    return { x, y };
  }
};