const Saves = {

  defaultData: {
    unlockedZones: [1],
    unlockedCharacters: ["Dead"],
    bestScores: {},
    leaderboard: [],
    settings: {
      masterVolume: 0.8,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      screenShake: true,
      particles: true
    },
    totalRuns: 0,
    bestZoneReached: 1
  },

  save(data) {
    localStorage.setItem("cityVigilante", JSON.stringify(data));
  },

  load() {
    const saved = localStorage.getItem("cityVigilante");
    if (saved) {
      return JSON.parse(saved);
    }
    return JSON.parse(JSON.stringify(this.defaultData));
  },

  unlockZone(data, zoneNumber) {
    if (!data.unlockedZones.includes(zoneNumber)) {
      data.unlockedZones.push(zoneNumber);
      this.save(data);
    }
  },

  unlockCharacter(data, characterName) {
    if (!data.unlockedCharacters.includes(characterName)) {
      data.unlockedCharacters.push(characterName);
      this.save(data);
    }
  },

  saveBestScore(data, zoneNumber, score) {
    if (!data.bestScores[zoneNumber] || score > data.bestScores[zoneNumber]) {
      data.bestScores[zoneNumber] = score;
      this.save(data);
    }
  },

  addToLeaderboard(data, entry) {
    data.leaderboard.push(entry);
    data.leaderboard.sort((a, b) => b.score - a.score);
    data.leaderboard = data.leaderboard.slice(0, 5);
    this.save(data);
  },

  reset() {
    localStorage.removeItem("cityVigilante");
    return JSON.parse(JSON.stringify(this.defaultData));
  }

};