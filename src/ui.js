const UI = {

  homeScreen: {
    selectedIndex: 0,
    menuItems: ["Play", "Level Select", "Settings", "Extras"],
    raindrops: [],

    init() {
      this.raindrops = [];
      for (let i = 0; i < 120; i++) {
        this.raindrops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 4 + Math.random() * 6,
          length: 10 + Math.random() * 20,
          opacity: 0.1 + Math.random() * 0.3
        });
      }
    },

    updateRain() {
      this.raindrops.forEach(drop => {
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });
    },

    drawRain() {
      this.raindrops.forEach(drop => {
        ctx.save();
        ctx.globalAlpha = drop.opacity;
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.length);
        ctx.stroke();
        ctx.restore();
      });
    },

    drawSkyline() {
      const buildings = [
        { x: 0,   w: 60,  h: 180 },
        { x: 65,  w: 45,  h: 220 },
        { x: 115, w: 80,  h: 160 },
        { x: 200, w: 50,  h: 250 },
        { x: 255, w: 70,  h: 190 },
        { x: 330, w: 55,  h: 280 },
        { x: 390, w: 90,  h: 200 },
        { x: 485, w: 60,  h: 240 },
        { x: 550, w: 75,  h: 170 },
        { x: 630, w: 50,  h: 210 },
        { x: 685, w: 80,  h: 190 },
        { x: 740, w: 60,  h: 260 }
      ];

      buildings.forEach(b => {
        ctx.fillStyle = "#0a0a18";
        ctx.fillRect(b.x, canvas.height - b.h, b.w, b.h);
        for (let wy = canvas.height - b.h + 10; wy < canvas.height - 10; wy += 18) {
          for (let wx = b.x + 6; wx < b.x + b.w - 6; wx += 12) {
            const lit = Math.sin(Date.now() * 0.001 + wx + wy) > 0.98 ? false : true;
            if (lit && Math.random() > 0.5) {
              ctx.fillStyle = `rgba(255, 220, 100, ${0.2 + Math.random() * 0.3})`;
              ctx.fillRect(wx, wy, 5, 7);
            }
          }
        }
      });
    },

    drawTitle(tick) {
      const flicker = Math.sin(tick * 0.05) > 0.92;
      ctx.save();
      ctx.shadowBlur = flicker ? 4 : 30;
      ctx.shadowColor = "#00ffcc";
      ctx.fillStyle = flicker ? "#00aa88" : "#00ffcc";
      ctx.font = "bold 52px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CITY", canvas.width / 2, 160);
      ctx.fillText("VIGILANTE", canvas.width / 2, 220);
      ctx.restore();
      ctx.fillStyle = "#ffffff33";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("A NEON CITY ROGUELIKE", canvas.width / 2, 245);
    },

    drawMenu(tick) {
      this.menuItems.forEach((item, i) => {
        const x = canvas.width / 2;
        const y = 300 + i * 44;
        const selected = i === this.selectedIndex;
        if (selected) {
          ctx.save();
          ctx.shadowBlur = 16;
          ctx.shadowColor = "#00ffcc";
          ctx.fillStyle = "#00ffcc";
          ctx.font = "bold 18px monospace";
          ctx.textAlign = "center";
          ctx.fillText("> " + item + " <", x, y);
          ctx.restore();
        } else {
          ctx.fillStyle = "#ffffff55";
          ctx.font = "16px monospace";
          ctx.textAlign = "center";
          ctx.fillText(item, x, y);
        }
      });
    },

    handleInput(key) {
      if (key === "ArrowUp") {
        this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
      }
      if (key === "ArrowDown") {
        this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
      }
      if (key === "Enter") {
        const selected = this.menuItems[this.selectedIndex];
        if (selected === "Play")          switchScreen("characterSelect");
        if (selected === "Level Select")  switchScreen("levelSelect");
        if (selected === "Settings")      switchScreen("settings");
        if (selected === "Extras")        switchScreen("extras");
      }
    },

    draw(tick) {
      this.updateRain();
      this.drawSkyline();
      this.drawRain();
      this.drawTitle(tick);
      this.drawMenu(tick);
      ctx.fillStyle = "#ffffff22";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Arrow keys to navigate   Enter to select", canvas.width / 2, canvas.height - 20);
    }
  },

  levelSelect: {
    selectedZone: 1,

    zones: [
      { number: 1,  name: "Rooftops",      theme: "rooftop",      boss: false },
      { number: 2,  name: "Rooftops II",   theme: "rooftop",      boss: false },
      { number: 3,  name: "The Streets",   theme: "street",       boss: false },
      { number: 4,  name: "Back Alleys",   theme: "street",       boss: false },
      { number: 5,  name: "Crime Boss",    theme: "boss",         boss: true  },
      { number: 6,  name: "Subway",        theme: "subway",       boss: false },
      { number: 7,  name: "Underground",   theme: "subway",       boss: false },
      { number: 8,  name: "The Sewers",    theme: "sewer",        boss: false },
      { number: 9,  name: "Deep Sewers",   theme: "sewer",        boss: false },
      { number: 10, name: "Construction",  theme: "construction", boss: false },
      { number: 11, name: "Scaffolding",   theme: "construction", boss: false },
      { number: 12, name: "Crime HQ",      theme: "boss",         boss: true  }
    ],

    themeColors: {
      rooftop:      "#00ffcc",
      street:       "#4488ff",
      boss:         "#ff4400",
      subway:       "#aa44ff",
      sewer:        "#44ff88",
      construction: "#ffaa00"
    },

    handleInput(key) {
      if (key === "ArrowRight") {
        if (this.selectedZone < 12) this.selectedZone++;
      }
      if (key === "ArrowLeft") {
        if (this.selectedZone > 1) this.selectedZone--;
      }
      if (key === "ArrowDown") {
        if (this.selectedZone + 4 <= 12) this.selectedZone += 4;
      }
      if (key === "ArrowUp") {
        if (this.selectedZone - 4 >= 1) this.selectedZone -= 4;
      }
      if (key === "Enter") {
        if (gameData.unlockedZones.includes(this.selectedZone)) {
          switchScreen("characterSelect");
        }
      }
      if (key === "Backspace") {
        switchScreen("home");
      }
    },

    draw(tick) {
      const unlocked = gameData.unlockedZones;

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "center";
      ctx.fillText("SELECT ZONE", canvas.width / 2, 50);

      ctx.fillStyle = "#ffffff33";
      ctx.font = "11px monospace";
      ctx.fillText("Arrow keys to browse   Enter to select   Backspace to go back", canvas.width / 2, 70);

      const cols   = 4;
      const cardW  = 160;
      const cardH  = 80;
      const gapX   = 20;
      const gapY   = 20;
      const startX = (canvas.width - (cols * cardW + (cols - 1) * gapX)) / 2;
      const startY = 90;

      this.zones.forEach((zone, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardW + gapX);
        const y = startY + row * (cardH + gapY);

        const isUnlocked = unlocked.includes(zone.number);
        const isSelected = this.selectedZone === zone.number;
        const color      = this.themeColors[zone.theme];

        ctx.fillStyle = isUnlocked ? "#0a0a1a" : "#050508";
        ctx.fillRect(x, y, cardW, cardH);

        if (isSelected) {
          ctx.save();
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, cardW, cardH);
          ctx.restore();
        } else {
          ctx.strokeStyle = isUnlocked ? color + "55" : "#ffffff11";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cardW, cardH);
        }

        if (isUnlocked) {
          ctx.save();
          ctx.shadowBlur = isSelected ? 12 : 4;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "left";
          ctx.fillText("ZONE " + zone.number, x + 10, y + 20);
          ctx.restore();

          ctx.fillStyle = isSelected ? "#ffffff" : "#ffffff99";
          ctx.font = "12px monospace";
          ctx.textAlign = "left";
          ctx.fillText(zone.name, x + 10, y + 38);

          if (zone.boss) {
            ctx.fillStyle = "#ff440033";
            ctx.fillRect(x + 10, y + 48, 50, 16);
            ctx.fillStyle = "#ff4400";
            ctx.font = "9px monospace";
            ctx.textAlign = "left";
            ctx.fillText("BOSS", x + 18, y + 60);
          }

          const best = gameData.bestScores[zone.number];
          if (best) {
            ctx.fillStyle = "#ffffff44";
            ctx.font = "9px monospace";
            ctx.textAlign = "right";
            ctx.fillText("BEST: " + best, x + cardW - 8, y + cardH - 8);
          }

        } else {
          ctx.fillStyle = "#ffffff22";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText("ZONE " + zone.number, x + cardW / 2, y + 30);
          ctx.fillStyle = "#ffffff11";
          ctx.font = "20px monospace";
          ctx.textAlign = "center";
          ctx.fillText("?", x + cardW / 2, y + 58);
        }
      });

      const selected   = this.zones[this.selectedZone - 1];
      const isUnlocked = unlocked.includes(this.selectedZone);
      const color      = this.themeColors[selected.theme];

      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(40, 390, canvas.width - 80, 70);
      ctx.strokeStyle = color + "44";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(40, 390, canvas.width - 80, 70);

      if (isUnlocked) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "left";
        ctx.fillText("ZONE " + selected.number + " — " + selected.name.toUpperCase(), 60, 415);
        ctx.restore();
        ctx.fillStyle = "#ffffff66";
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Theme: " + selected.theme + "   " + (selected.boss ? "BOSS FIGHT" : "Standard zone"), 60, 435);
        ctx.fillStyle = "#ffffff33";
        ctx.fillText("Press Enter to play", 60, 452);
      } else {
        ctx.fillStyle = "#ffffff33";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Complete previous zones to unlock", canvas.width / 2, 430);
      }
    }
  },

  characterSelect: {
    selectedIndex: 0,

    characters: [
      {
        name: "Dead",
        subtitle: "The Grim Reaper",
        color: "#ff8800",
        locked: false,
        stats: { speed: 3, power: 5, weight: 3, range: 4 },
        ability: {
          name: "Scythe Sweep",
          description: "Swings scythe in a wide arc, launching all nearby enemies airborne"
        },
        unlockRequirement: null
      },
      {
        name: "Titan",
        subtitle: "The Heavy Brawler",
        color: "#cc66ff",
        locked: true,
        stats: { speed: 2, power: 8, weight: 9, range: 2 },
        ability: {
          name: "Ground Slam",
          description: "Smashes the floor sending a shockwave that launches nearby enemies"
        },
        unlockRequirement: "Reach zone 3"
      },
      {
        name: "Viper",
        subtitle: "The Ranged Striker",
        color: "#44ff88",
        locked: true,
        stats: { speed: 5, power: 3, weight: 3, range: 8 },
        ability: {
          name: "Shuriken Burst",
          description: "Fires three projectiles in a spread, staggering any enemy hit"
        },
        unlockRequirement: "Reach zone 6"
      },
      {
        name: "Blaze",
        subtitle: "The Aggressive Rusher",
        color: "#ff4444",
        locked: true,
        stats: { speed: 8, power: 6, weight: 4, range: 3 },
        ability: {
          name: "Flaming Charge",
          description: "Rockets forward dealing heavy damage to everything in the path"
        },
        unlockRequirement: "Reach zone 9"
      }
    ],

    drawStatBar(label, value, x, y, color) {
      ctx.fillStyle = "#ffffff44";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(label, x, y);
      ctx.fillStyle = "#ffffff11";
      ctx.fillRect(x + 55, y - 9, 80, 8);
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.fillRect(x + 55, y - 9, (value / 10) * 80, 8);
      ctx.restore();
    },

    drawCharacterCard(char, x, y, w, h, isSelected, tick) {
      const isUnlocked = !char.locked || gameData.unlockedCharacters.includes(char.name);

      ctx.fillStyle = isSelected ? "#0d0d20" : "#080810";
      ctx.fillRect(x, y, w, h);

      if (isSelected) {
        ctx.save();
        ctx.shadowBlur = 24;
        ctx.shadowColor = char.color;
        ctx.strokeStyle = char.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
      } else {
        ctx.strokeStyle = isUnlocked ? char.color + "33" : "#ffffff11";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, w, h);
      }

      if (isUnlocked) {
        ctx.save();
        ctx.shadowBlur = isSelected ? 16 : 6;
        ctx.shadowColor = char.color;
        ctx.fillStyle = char.color;
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText(char.name.toUpperCase(), x + w / 2, y + 28);
        ctx.restore();

        ctx.fillStyle = "#ffffff55";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(char.subtitle, x + w / 2, y + 44);

        const spriteSize = 48;
        const sx = x + w / 2 - spriteSize / 2;
        const sy = y + 54;
        ctx.fillStyle = char.color + "11";
        ctx.fillRect(sx, sy, spriteSize, spriteSize);
        ctx.strokeStyle = char.color + "44";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sx, sy, spriteSize, spriteSize);
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = char.color;
        ctx.fillStyle = char.color;
        ctx.font = "28px monospace";
        ctx.textAlign = "center";
        ctx.fillText("✦", x + w / 2, sy + 34);
        ctx.restore();

        this.drawStatBar("SPD", char.stats.speed,  x + 10, y + 122, char.color);
        this.drawStatBar("POW", char.stats.power,  x + 10, y + 138, char.color);
        this.drawStatBar("WGT", char.stats.weight, x + 10, y + 154, char.color);
        this.drawStatBar("RNG", char.stats.range,  x + 10, y + 170, char.color);

      } else {
        ctx.fillStyle = "#ffffff22";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillText(char.name.toUpperCase(), x + w / 2, y + 28);
        ctx.fillStyle = "#ffffff11";
        ctx.font = "32px monospace";
        ctx.textAlign = "center";
        ctx.fillText("?", x + w / 2, y + 100);
        ctx.fillStyle = "#ffffff22";
        ctx.font = "9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(char.unlockRequirement, x + w / 2, y + 160);
      }
    },

    draw(tick) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px monospace";
      ctx.textAlign = "center";
      ctx.fillText("SELECT CHARACTER", canvas.width / 2, 40);

      ctx.fillStyle = "#ffffff33";
      ctx.font = "11px monospace";
      ctx.fillText("Arrow keys to browse   Enter to confirm   Backspace to go back", canvas.width / 2, 62);

      const cardW  = 160;
      const cardH  = 200;
      const gap    = 20;
      const totalW = 4 * cardW + 3 * gap;
      const startX = (canvas.width - totalW) / 2;
      const startY = 80;

      this.characters.forEach((char, i) => {
        const x = startX + i * (cardW + gap);
        this.drawCharacterCard(char, x, startY, cardW, cardH, i === this.selectedIndex, tick);
      });

      const selected   = this.characters[this.selectedIndex];
      const isUnlocked = !selected.locked || gameData.unlockedCharacters.includes(selected.name);

      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(40, 310, canvas.width - 80, 80);
      ctx.strokeStyle = isUnlocked ? selected.color + "44" : "#ffffff11";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(40, 310, canvas.width - 80, 80);

      if (isUnlocked) {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = selected.color;
        ctx.fillStyle = selected.color;
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "left";
        ctx.fillText("ABILITY — " + selected.ability.name.toUpperCase(), 60, 335);
        ctx.restore();
        ctx.fillStyle = "#ffffff77";
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(selected.ability.description, 60, 355);
        ctx.fillStyle = "#ffffff33";
        ctx.font = "11px monospace";
        ctx.fillText("Press Enter to play as " + selected.name, 60, 378);
      } else {
        ctx.fillStyle = "#ffffff33";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(selected.unlockRequirement + " to unlock " + selected.name, canvas.width / 2, 355);
      }
    },

    handleInput(key) {
      if (key === "ArrowLeft") {
        this.selectedIndex = (this.selectedIndex - 1 + this.characters.length) % this.characters.length;
      }
      if (key === "ArrowRight") {
        this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
      }
      if (key === "Enter") {
        const selected   = this.characters[this.selectedIndex];
        const isUnlocked = !selected.locked || gameData.unlockedCharacters.includes(selected.name);
        if (isUnlocked) {
          gameData.selectedCharacter = selected.name;
          switchScreen("game");
        }
      }
      if (key === "Backspace") {
        switchScreen("home");
      }
    }
  }

};