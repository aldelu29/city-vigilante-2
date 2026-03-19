const Combat = {
  attackRange: 80,
  attackDamage: 25,
  knockbackForce: 12,
  knockbackUp: -8,
  lastAttackTime: 0,
  attackCooldown: 400,

  combo: 0,
  comboTimer: 0,
  comboDuration: 180,
  score: 0,

  reset() {
    this.combo = 0;
    this.comboTimer = 0;
    this.score = 0;
  },

  update() {
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }
  },

  playerAttack() {
    const now = Date.now();
    if (now - this.lastAttackTime < this.attackCooldown) return;
    this.lastAttackTime = now;

    Player.attack();

    let hitSomething = false;

    Enemies.list.forEach(enemy => {
      if (!enemy.alive) return;

      const dx = enemy.x - Player.x;
      const dy = enemy.y - Player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.attackRange && Math.sign(dx) === Player.facing) {
        enemy.health -= this.attackDamage;
        enemy.knockbackX = Math.sign(dx) * this.knockbackForce;
        enemy.velY = this.knockbackUp;
        enemy.isAggro = true;
        hitSomething = true;

        Camera.shake(6);

        Particles.burst(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          "#ff4466",
          8
        );

        if (enemy.health <= 0) {
          enemy.alive = false;
          this.combo++;
          this.comboTimer = this.comboDuration;
          const points = 100 * Math.max(1, this.combo);
          this.score += points;

          Camera.shake(12);

          Particles.burst(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            "#ff4466",
            20
          );
        }
      }
    });
  },

  enemyAttackPlayer() {
    const now = Date.now();
    Enemies.list.forEach(enemy => {
      if (!enemy.alive) return;

      const dx = Player.x - enemy.x;
      const dy = Player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 50 && now - (enemy.lastHitTime || 0) > 800) {
        enemy.lastHitTime = now;
        Player.health -= 10;
        Player.velY = -6;
        Player.velX = -Math.sign(dx) * 6;
        Camera.shake(8);

        if (Player.health <= 0) {
          Player.health = 0;
          Player.isDead = true;
          Player.setAnim("death");
        }
      }
    });
  }
};