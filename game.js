/**
 * Gem Guardian - Roguelite Horde Defense
 * Pure Canvas 2D Top-Down Roguelite Engine
 */

// --- Audio Synthesizer (Web Audio API) ---
class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.3;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  playLaser(pitch = 600, duration = 0.12) {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playShotgun() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      whiteNoise.start();
    } catch (e) {}
  }

  playExplosion() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  playHit() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playGemHit() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  playLevelUp() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  playDash() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playNova() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }

  playPickup() {
    if (!this.ctx || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }
}

const sound = new SoundManager();

// --- Game Engine Constants & Upgrades Catalog ---
const MAP_SIZE = 2600;

const WEAPONS_DATA = {
  wand: {
    id: 'wand',
    name: 'Arcane Wand',
    icon: '🪄',
    desc: 'Rapid bolts of focused mystic energy.',
    level: 1,
    fireRate: 0.18, // seconds per shot
    bulletSpeed: 700,
    damage: 32,
    spread: 0.06,
    count: 1,
    range: 800,
    color: '#38bdf8',
    size: 5,
    pierce: 1,
    unlocked: true,
  },
  shotgun: {
    id: 'shotgun',
    name: 'Dragon Flak',
    icon: '💥',
    desc: 'Unleashes a wide cone of fiery shrapnel.',
    level: 0,
    fireRate: 0.75,
    bulletSpeed: 600,
    damage: 26,
    spread: 0.45,
    count: 6,
    range: 480,
    color: '#fb923c',
    size: 4.5,
    pierce: 1,
    unlocked: false,
  },
  plasma: {
    id: 'plasma',
    name: 'Orb of Ruin',
    icon: '🔮',
    desc: 'Heavy exploding vortex with area splash damage.',
    level: 0,
    fireRate: 1.1,
    bulletSpeed: 380,
    damage: 85,
    spread: 0.03,
    count: 1,
    range: 750,
    splashRadius: 90,
    color: '#c084fc',
    size: 10,
    pierce: 1,
    unlocked: false,
  },
  lightning: {
    id: 'lightning',
    name: 'Storm Javelin',
    icon: '⚡',
    desc: 'High velocity bolt piercing through ranks of foes.',
    level: 0,
    fireRate: 0.85,
    bulletSpeed: 1050,
    damage: 55,
    spread: 0.02,
    count: 1,
    range: 950,
    color: '#facc15',
    size: 4,
    pierce: 4,
    unlocked: false,
  }
};

const UPGRADES_POOL = [
  // Weapon Unlocks
  {
    id: 'unlock_shotgun',
    title: 'Dragon Flak Cannon',
    icon: '💥',
    rarity: 'rare',
    desc: 'Unlock Dragon Flak weapon: Fires high-damage scatter pellets.',
    condition: (g) => !g.weapons.shotgun.unlocked,
    apply: (g) => {
      g.weapons.shotgun.unlocked = true;
      g.weapons.shotgun.level = 1;
      g.activeWeaponId = 'shotgun';
      g.updateHudWeapons();
    }
  },
  {
    id: 'unlock_plasma',
    title: 'Orb of Ruin',
    icon: '🔮',
    rarity: 'epic',
    desc: 'Unlock heavy explosive magic orb causing massive blast zones.',
    condition: (g) => !g.weapons.plasma.unlocked,
    apply: (g) => {
      g.weapons.plasma.unlocked = true;
      g.weapons.plasma.level = 1;
      g.activeWeaponId = 'plasma';
      g.updateHudWeapons();
    }
  },
  {
    id: 'unlock_lightning',
    title: 'Storm Javelin',
    icon: '⚡',
    rarity: 'epic',
    desc: 'Unlock electrifying spears that pierce multiple enemies in line.',
    condition: (g) => !g.weapons.lightning.unlocked,
    apply: (g) => {
      g.weapons.lightning.unlocked = true;
      g.weapons.lightning.level = 1;
      g.activeWeaponId = 'lightning';
      g.updateHudWeapons();
    }
  },
  // Weapon Upgrades
  {
    id: 'up_wand_multishot',
    title: 'Arcane Twin Stream',
    icon: '🪄',
    rarity: 'rare',
    desc: 'Arcane Wand fires +1 additional bolt and +20% attack speed.',
    condition: (g) => g.weapons.wand.unlocked,
    apply: (g) => {
      g.weapons.wand.count += 1;
      g.weapons.wand.fireRate *= 0.85;
      g.weapons.wand.level++;
      g.updateHudWeapons();
    }
  },
  {
    id: 'up_wand_damage',
    title: 'Eldritch Infusion',
    icon: '✨',
    rarity: 'common',
    desc: 'Arcane Wand gains +35% damage and +1 Pierce.',
    condition: (g) => g.weapons.wand.unlocked,
    apply: (g) => {
      g.weapons.wand.damage = Math.round(g.weapons.wand.damage * 1.35);
      g.weapons.wand.pierce += 1;
      g.weapons.wand.level++;
      g.updateHudWeapons();
    }
  },
  {
    id: 'up_shotgun_spread',
    title: 'Cluster Volley',
    icon: '💥',
    rarity: 'rare',
    desc: 'Dragon Flak fires +3 extra pellets per blast.',
    condition: (g) => g.weapons.shotgun.unlocked,
    apply: (g) => {
      g.weapons.shotgun.count += 3;
      g.weapons.shotgun.damage = Math.round(g.weapons.shotgun.damage * 1.15);
      g.weapons.shotgun.level++;
      g.updateHudWeapons();
    }
  },
  {
    id: 'up_plasma_radius',
    title: 'Supernova Singularity',
    icon: '🔮',
    rarity: 'epic',
    desc: 'Orb of Ruin blast radius +50% and burns target grounds.',
    condition: (g) => g.weapons.plasma.unlocked,
    apply: (g) => {
      g.weapons.plasma.splashRadius = Math.round(g.weapons.plasma.splashRadius * 1.5);
      g.weapons.plasma.damage = Math.round(g.weapons.plasma.damage * 1.3);
      g.weapons.plasma.level++;
      g.updateHudWeapons();
    }
  },
  {
    id: 'up_lightning_chain',
    title: 'Chain Tempest',
    icon: '⚡',
    rarity: 'rare',
    desc: 'Storm Javelin gains +3 pierce count and +25% attack speed.',
    condition: (g) => g.weapons.lightning.unlocked,
    apply: (g) => {
      g.weapons.lightning.pierce += 3;
      g.weapons.lightning.fireRate *= 0.8;
      g.weapons.lightning.level++;
      g.updateHudWeapons();
    }
  },
  // Global Guardian & Gem Buffs
  {
    id: 'up_guardian_boots',
    title: 'Zephyr Greaves',
    icon: '👟',
    rarity: 'common',
    desc: 'Increase movement speed by +22% and Dash cooldown -25%.',
    apply: (g) => {
      g.player.baseSpeed *= 1.22;
      g.player.dashMaxCd *= 0.75;
    }
  },
  {
    id: 'up_guardian_vitality',
    title: 'Juggernaut Heart',
    icon: '❤️',
    rarity: 'common',
    desc: 'Maximum HP +40 and immediately restores full health.',
    apply: (g) => {
      g.player.maxHp += 40;
      g.player.hp = g.player.maxHp;
    }
  },
  {
    id: 'up_gem_barrier',
    title: 'Crystal Bastion Aegis',
    icon: '🛡️',
    rarity: 'rare',
    desc: 'Repairs Crystal Core by 350 HP and permanently adds +350 Max HP.',
    apply: (g) => {
      g.gem.maxHp += 350;
      g.gem.hp = Math.min(g.gem.maxHp, g.gem.hp + 350);
    }
  },
  {
    id: 'up_gem_spikes',
    title: 'Reactive Prism Shards',
    icon: '💠',
    rarity: 'rare',
    desc: 'Whenever the Core is hit, it discharges a deadly burst hitting all nearby attackers.',
    apply: (g) => {
      g.gem.hasThorns = true;
      g.gem.thornsDamage = (g.gem.thornsDamage || 30) + 35;
    }
  },
  {
    id: 'up_magnet',
    title: 'Soul Vortex Magnet',
    icon: '🧲',
    rarity: 'common',
    desc: 'Increases soul essence and drop pickup range by +90%.',
    apply: (g) => {
      g.player.pickupRadius = Math.round(g.player.pickupRadius * 1.9);
    }
  },
  {
    id: 'up_crit_strikes',
    title: 'Deadly Precision',
    icon: '🎯',
    rarity: 'rare',
    desc: 'Gain +25% Critical Strike chance dealing 2.5x critical damage.',
    apply: (g) => {
      g.player.critChance = (g.player.critChance || 0.05) + 0.25;
      g.player.critMult = 2.5;
    }
  },
  {
    id: 'up_satellite_orbs',
    title: 'Celestial Orbiters',
    icon: '🪐',
    rarity: 'legendary',
    desc: 'Conjure 2 revolving mystic orbs that shred enemies on contact.',
    apply: (g) => {
      g.player.orbitersCount = (g.player.orbitersCount || 0) + 2;
    }
  },
  {
    id: 'up_shockwave_cooldown',
    title: 'Harmonic Resonance',
    icon: '🌀',
    rarity: 'rare',
    desc: 'Core Nova cooldown -35% and repels enemies twice as far.',
    apply: (g) => {
      g.player.shockwaveMaxCd *= 0.65;
      g.player.shockwaveForce = (g.player.shockwaveForce || 400) + 300;
    }
  },
  {
    id: 'up_berserk',
    title: 'Blood Frenzy',
    icon: '🩸',
    rarity: 'legendary',
    desc: 'Every enemy defeated grants +1% fire rate for 5 seconds (stacks up to 40%).',
    apply: (g) => {
      g.player.hasFrenzy = true;
    }
  }
];

// --- Main Game Class ---
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Game State
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.elapsedTime = 0;

    // Camera
    this.camera = { x: 0, y: 0 };

    // Input States
    this.keys = {};
    this.mouse = { x: 0, y: 0, worldX: 0, worldY: 0, isDown: false };

    // Entities
    this.player = null;
    this.gem = null;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.pickups = [];
    this.floatingTexts = [];
    this.decorations = [];

    // Roguelite Progress & Stats
    this.wave = 1;
    this.waveState = 'spawning'; // spawning, surviving, victory
    this.waveTimer = 0;
    this.waveDuration = 35; // base wave time in seconds
    this.spawnTimer = 0;
    this.enemiesToSpawn = 0;
    this.kills = 0;
    this.essence = 0;
    this.level = 1;
    this.xp = 0;
    this.xpNeeded = 100;
    this.bossAlive = false;

    // Weapons
    this.weapons = JSON.parse(JSON.stringify(WEAPONS_DATA));
    this.activeWeaponId = 'wand';
    this.fireTimer = 0;

    this.initDecorations();
    this.initInputs();
    this.initUI();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initDecorations() {
    // Generate atmospheric runic tiles and stones across the dark arena
    this.decorations = [];
    const count = 180;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * MAP_SIZE * 0.95;
      const y = (Math.random() - 0.5) * MAP_SIZE * 0.95;
      const type = Math.random() < 0.3 ? 'rune' : Math.random() < 0.6 ? 'ruin' : 'skull';
      this.decorations.push({
        x, y,
        type,
        size: 15 + Math.random() * 25,
        rot: Math.random() * Math.PI * 2,
        color: type === 'rune' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(30, 41, 59, 0.6)'
      });
    }
  }

  initInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (['1', '2', '3', '4'].includes(e.key)) {
        this.selectWeaponBySlot(parseInt(e.key) - 1);
      }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.triggerDash();
      }
      if (e.key.toLowerCase() === 'q') {
        this.triggerShockwave();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        sound.init();
        this.mouse.isDown = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.mouse.isDown = false;
      }
    });
  }

  selectWeaponBySlot(slotIdx) {
    const unlocked = Object.values(this.weapons).filter(w => w.unlocked);
    if (unlocked[slotIdx]) {
      this.activeWeaponId = unlocked[slotIdx].id;
      this.updateHudWeapons();
    }
  }

  initUI() {
    document.getElementById('btnStartGame').addEventListener('click', () => {
      sound.init();
      document.getElementById('startScreen').classList.add('hidden');
      this.startGame();
    });

    // Options Menu
    const optionsModal = document.getElementById('optionsModal');
    document.getElementById('btnOpenOptions').addEventListener('click', () => {
      optionsModal.classList.remove('hidden');
    });

    document.getElementById('btnCloseOptions').addEventListener('click', () => {
      optionsModal.classList.add('hidden');
    });

    const volumeSlider = document.getElementById('volumeSlider');
    const volumeText = document.getElementById('volumeText');
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      sound.setVolume(val);
      volumeText.innerText = `${Math.round(val * 100)}%`;
    });

    document.getElementById('btnRestartGame').addEventListener('click', () => {
      sound.init();
      document.getElementById('gameOverScreen').classList.add('hidden');
      this.startGame();
    });

    // Dash / Nova click triggers for mobile or mouse click
    document.getElementById('dashSlot').addEventListener('click', () => this.triggerDash());
    document.getElementById('shockwaveSlot').addEventListener('click', () => this.triggerShockwave());
  }

  startGame() {
    // Reset player
    this.player = {
      x: 0,
      y: 120, // Start just south of the central gem
      radius: 20,
      baseSpeed: 230,
      speed: 230,
      hp: 120,
      maxHp: 120,
      pickupRadius: 90,
      critChance: 0.08,
      critMult: 2.0,
      // Dash
      dashCd: 0,
      dashMaxCd: 2.5,
      isDashing: false,
      dashTime: 0,
      dashDuration: 0.18,
      dashSpeed: 750,
      dashDir: { x: 0, y: 0 },
      // Nova
      shockwaveCd: 0,
      shockwaveMaxCd: 8.0,
      shockwaveForce: 450,
      // Buffs
      orbitersCount: 0,
      orbitAngle: 0,
      frenzyTimer: 0,
      frenzyStacks: 0
    };

    // Central Gem Core
    this.gem = {
      x: 0,
      y: 0,
      radius: 42,
      hp: 1000,
      maxHp: 1000,
      pulse: 0,
      hasThorns: false,
      thornsDamage: 30
    };

    this.weapons = JSON.parse(JSON.stringify(WEAPONS_DATA));
    this.activeWeaponId = 'wand';

    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.pickups = [];
    this.floatingTexts = [];

    this.wave = 1;
    this.kills = 0;
    this.essence = 0;
    this.level = 1;
    this.xp = 0;
    this.xpNeeded = 80;
    this.bossAlive = false;

    this.startWave(1);
    this.updateHudWeapons();
    this.updateHUD();

    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  startWave(waveNum) {
    this.wave = waveNum;
    this.waveState = 'spawning';
    this.waveDuration = 30 + (waveNum * 4);
    this.waveTimer = 0;
    this.enemiesToSpawn = 18 + Math.floor(waveNum * 9);
    this.spawnTimer = 0.5;

    // Boss spawn every 4 waves
    this.isBossWave = (waveNum % 4 === 0);

    const banner = document.getElementById('waveClearedModal');
    banner.classList.add('hidden');

    const bossBar = document.getElementById('bossBarContainer');
    if (this.isBossWave) {
      bossBar.classList.remove('hidden');
      document.getElementById('bossName').innerText = waveNum === 4 ? 'CRYPT LORD CZAR' : waveNum === 8 ? 'INFERNAL ARCH-DEMON' : 'DEATH KING ABADDON';
    } else {
      bossBar.classList.add('hidden');
    }

    this.showFloatingText(0, -60, `WAVE ${waveNum}`, '#fbbf24', 28, 2.0);
  }

  triggerDash() {
    if (!this.player || this.player.dashCd > 0 || this.player.isDashing) return;

    // Determine dash direction from movement keys or towards mouse
    let dx = 0, dy = 0;
    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    if (dx === 0 && dy === 0) {
      // Dash towards mouse
      dx = this.mouse.worldX - this.player.x;
      dy = this.mouse.worldY - this.player.y;
    }

    const len = Math.hypot(dx, dy);
    if (len > 0.001) {
      this.player.dashDir = { x: dx / len, y: dy / len };
      this.player.isDashing = true;
      this.player.dashTime = this.player.dashDuration;
      this.player.dashCd = this.player.dashMaxCd;
      sound.playDash();

      // Dash ghost particles
      for (let i = 0; i < 12; i++) {
        this.addParticle({
          x: this.player.x,
          y: this.player.y,
          vx: (Math.random() - 0.5) * 80,
          vy: (Math.random() - 0.5) * 80,
          color: '#38bdf8',
          radius: 4,
          life: 0.35
        });
      }
    }
  }

  triggerShockwave() {
    if (!this.player || this.player.shockwaveCd > 0) return;
    this.player.shockwaveCd = this.player.shockwaveMaxCd;
    sound.playNova();

    const range = 240;
    const force = this.player.shockwaveForce;

    // Pulse wave from player
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      this.addParticle({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(angle) * 320,
        vy: Math.sin(angle) * 320,
        color: '#a855f7',
        radius: 6,
        life: 0.4
      });
    }

    // Push enemies back and deal heavy damage
    this.enemies.forEach(e => {
      const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
      if (dist < range) {
        const nx = (e.x - this.player.x) / (dist || 1);
        const ny = (e.y - this.player.y) / (dist || 1);
        e.x += nx * force * 0.45;
        e.y += ny * force * 0.45;
        this.damageEnemy(e, 85, true);
      }
    });

    this.showFloatingText(this.player.x, this.player.y - 30, 'NOVA REPULSE!', '#c084fc', 18, 1.0);
  }

  // --- Main Game Loop ---
  gameLoop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (!this.isPaused) {
      this.update(dt);
    }
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    this.elapsedTime += dt;

    // Convert mouse to world coordinates
    this.mouse.worldX = this.mouse.x + this.camera.x - this.canvas.width / 2;
    this.mouse.worldY = this.mouse.y + this.camera.y - this.canvas.height / 2;

    this.updatePlayer(dt);
    this.updateWeapons(dt);
    this.updateOrbiters(dt);
    this.updateWave(dt);
    this.updateEnemies(dt);
    this.updateProjectiles(dt);
    this.updatePickups(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);
    this.updateCamera();
    this.updateHUD();

    // Check Core Gem Health
    if (this.gem.hp <= 0) {
      this.gameOver('The Gem Core has been shattered by the horde!');
    }
    if (this.player.hp <= 0) {
      this.gameOver('The Guardian fell in combat before the dark legion!');
    }
  }

  updatePlayer(dt) {
    const p = this.player;

    // Cooldown ticks
    if (p.dashCd > 0) p.dashCd = Math.max(0, p.dashCd - dt);
    if (p.shockwaveCd > 0) p.shockwaveCd = Math.max(0, p.shockwaveCd - dt);
    if (p.frenzyTimer > 0) {
      p.frenzyTimer -= dt;
      if (p.frenzyTimer <= 0) p.frenzyStacks = 0;
    }

    if (p.isDashing) {
      p.dashTime -= dt;
      p.x += p.dashDir.x * p.dashSpeed * dt;
      p.y += p.dashDir.y * p.dashSpeed * dt;
      if (p.dashTime <= 0) {
        p.isDashing = false;
      }
    } else {
      // Normal 8-directional movement
      let dx = 0;
      let dy = 0;
      if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
      if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
      if (this.keys['d'] || this.keys['arrowright']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      p.x += dx * p.baseSpeed * dt;
      p.y += dy * p.baseSpeed * dt;
    }

    // World Map Boundary clamping
    const halfMap = MAP_SIZE / 2 - 40;
    p.x = Math.max(-halfMap, Math.min(halfMap, p.x));
    p.y = Math.max(-halfMap, Math.min(halfMap, p.y));

    // Collision with Central Gem
    const distGem = Math.hypot(p.x - this.gem.x, p.y - this.gem.y);
    const minDist = p.radius + this.gem.radius;
    if (distGem < minDist) {
      const angle = Math.atan2(p.y - this.gem.y, p.x - this.gem.x);
      p.x = this.gem.x + Math.cos(angle) * minDist;
      p.y = this.gem.y + Math.sin(angle) * minDist;
    }

    // Core passive healing if standing adjacent to the gem
    if (distGem < this.gem.radius + 60 && p.hp < p.maxHp) {
      p.hp = Math.min(p.maxHp, p.hp + 6 * dt);
      if (Math.random() < 0.2) {
        this.addParticle({
          x: p.x + (Math.random() - 0.5) * 20,
          y: p.y - 15,
          vx: 0,
          vy: -30,
          color: '#34d399',
          radius: 2.5,
          life: 0.4
        });
      }
    }
  }

  updateWeapons(dt) {
    this.fireTimer -= dt;

    const wpn = this.weapons[this.activeWeaponId];
    if (!wpn || !wpn.unlocked) return;

    // Calculate effective fire rate taking Frenzy stack bonus into account
    let effFireRate = wpn.fireRate;
    if (this.player.hasFrenzy && this.player.frenzyStacks > 0) {
      const bonus = Math.min(0.45, this.player.frenzyStacks * 0.02);
      effFireRate *= (1 - bonus);
    }

    // Auto-fire or hold Left-Mouse Button to fire
    if (this.mouse.isDown && this.fireTimer <= 0) {
      this.fireTimer = effFireRate;
      this.shootActiveWeapon(wpn);
    }
  }

  shootActiveWeapon(wpn) {
    const angleToMouse = Math.atan2(this.mouse.worldY - this.player.y, this.mouse.worldX - this.player.x);

    // Audio cue
    if (wpn.id === 'shotgun') sound.playShotgun();
    else if (wpn.id === 'plasma') sound.playLaser(250, 0.25);
    else if (wpn.id === 'lightning') sound.playLaser(950, 0.15);
    else sound.playLaser(620, 0.1);

    const count = wpn.count || 1;
    const baseSpread = wpn.spread || 0;

    for (let i = 0; i < count; i++) {
      let finalAngle = angleToMouse;
      if (count > 1) {
        finalAngle += (Math.random() - 0.5) * baseSpread;
      }

      // Check critical hit
      const isCrit = Math.random() < this.player.critChance;
      const finalDmg = isCrit ? Math.round(wpn.damage * this.player.critMult) : wpn.damage;

      this.projectiles.push({
        x: this.player.x + Math.cos(angleToMouse) * 20,
        y: this.player.y + Math.sin(angleToMouse) * 20,
        vx: Math.cos(finalAngle) * wpn.bulletSpeed,
        vy: Math.sin(finalAngle) * wpn.bulletSpeed,
        damage: finalDmg,
        isCrit: isCrit,
        rangeLeft: wpn.range,
        pierce: wpn.pierce || 1,
        hitList: new Set(),
        radius: wpn.size || 4,
        color: wpn.color,
        type: wpn.id,
        splashRadius: wpn.splashRadius || 0,
        trail: []
      });
    }

    // Gun muzzle kick particle
    this.addParticle({
      x: this.player.x + Math.cos(angleToMouse) * 22,
      y: this.player.y + Math.sin(angleToMouse) * 22,
      vx: Math.cos(angleToMouse) * 60,
      vy: Math.sin(angleToMouse) * 60,
      color: wpn.color,
      radius: 6,
      life: 0.12
    });
  }

  updateOrbiters(dt) {
    if (!this.player.orbitersCount) return;
    this.player.orbitAngle = (this.player.orbitAngle || 0) + 3.2 * dt;
    const orbDist = 70;

    for (let i = 0; i < this.player.orbitersCount; i++) {
      const angle = this.player.orbitAngle + (i * (Math.PI * 2 / this.player.orbitersCount));
      const ox = this.player.x + Math.cos(angle) * orbDist;
      const oy = this.player.y + Math.sin(angle) * orbDist;

      // Check collision with enemies
      for (const e of this.enemies) {
        const d = Math.hypot(e.x - ox, e.y - oy);
        if (d < e.radius + 12) {
          this.damageEnemy(e, 35 * dt * 4, false);
          this.addParticle({
            x: ox, y: oy,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 50,
            color: '#f59e0b',
            radius: 3,
            life: 0.15
          });
        }
      }
    }
  }

  updateWave(dt) {
    this.waveTimer += dt;

    // Spawn logic
    if (this.waveState === 'spawning') {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0 && this.enemiesToSpawn > 0) {
        this.spawnEnemyForWave();
        this.enemiesToSpawn--;
        // Spawn interval gets tighter on later waves
        this.spawnTimer = Math.max(0.2, 1.4 - (this.wave * 0.08));
      }

      // If boss wave and haven't spawned boss yet
      if (this.isBossWave && !this.bossAlive && this.waveTimer > 3.0) {
        this.spawnBoss();
      }

      if (this.waveTimer >= this.waveDuration && this.enemiesToSpawn <= 0) {
        this.waveState = 'surviving';
      }
    } else if (this.waveState === 'surviving') {
      // Wave is finished once remaining enemies are wiped or timeout
      if (this.enemies.length === 0 && (!this.isBossWave || !this.bossAlive)) {
        this.onWaveVictory();
      }
    }
  }

  spawnEnemyForWave() {
    // Enemies spawn from edge rings around map
    const angle = Math.random() * Math.PI * 2;
    const distance = 850 + Math.random() * 200;
    const spawnX = Math.cos(angle) * distance;
    const spawnY = Math.sin(angle) * distance;

    // Determine enemy type based on wave difficulty
    // Types: Zombie (grunt), Ghoul (fast swarmer), Bone Archer (ranged), Golem (tank)
    let type = 'zombie';
    const roll = Math.random();

    if (this.wave >= 2 && roll < 0.35) {
      type = 'ghoul';
    } else if (this.wave >= 3 && roll >= 0.35 && roll < 0.6) {
      type = 'archer';
    } else if (this.wave >= 4 && roll >= 0.8) {
      type = 'golem';
    }

    this.enemies.push(this.createEnemy(type, spawnX, spawnY));
  }

  createEnemy(type, x, y) {
    const waveScale = 1 + (this.wave - 1) * 0.22;
    switch (type) {
      case 'ghoul':
        return {
          type: 'ghoul',
          x, y,
          radius: 14,
          speed: 165 + Math.random() * 30,
          hp: Math.round(38 * waveScale),
          maxHp: Math.round(38 * waveScale),
          damage: 12,
          xpVal: 15,
          color: '#ec4899',
          attackCd: 0,
          preferTarget: Math.random() < 0.5 ? 'gem' : 'player'
        };
      case 'archer':
        return {
          type: 'archer',
          x, y,
          radius: 17,
          speed: 105,
          hp: Math.round(55 * waveScale),
          maxHp: Math.round(55 * waveScale),
          damage: 18,
          xpVal: 22,
          shootCd: 1.8 + Math.random() * 0.6,
          color: '#a855f7',
          attackCd: 0,
          preferTarget: 'gem'
        };
      case 'golem':
        return {
          type: 'golem',
          x, y,
          radius: 28,
          speed: 70,
          hp: Math.round(240 * waveScale),
          maxHp: Math.round(240 * waveScale),
          damage: 35,
          xpVal: 45,
          color: '#ef4444',
          attackCd: 0,
          preferTarget: 'gem'
        };
      case 'zombie':
      default:
        return {
          type: 'zombie',
          x, y,
          radius: 18,
          speed: 110 + Math.random() * 20,
          hp: Math.round(65 * waveScale),
          maxHp: Math.round(65 * waveScale),
          damage: 16,
          xpVal: 12,
          color: '#22c55e',
          attackCd: 0,
          preferTarget: Math.random() < 0.65 ? 'gem' : 'player'
        };
    }
  }

  spawnBoss() {
    this.bossAlive = true;
    const angle = Math.random() * Math.PI * 2;
    const bx = Math.cos(angle) * 750;
    const by = Math.sin(angle) * 750;

    const bossHp = 900 + (this.wave * 450);
    const boss = {
      type: 'boss',
      x: bx,
      y: by,
      radius: 40,
      speed: 80,
      hp: bossHp,
      maxHp: bossHp,
      damage: 45,
      xpVal: 300,
      color: '#dc2626',
      shootCd: 2.2,
      attackCd: 0,
      preferTarget: 'player'
    };
    this.enemies.push(boss);
    this.showFloatingText(bx, by, 'BOSS APPROACHING!', '#ef4444', 32, 2.5);
  }

  updateEnemies(dt) {
    const gem = this.gem;
    const player = this.player;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];

      // Tick attack cooldown
      if (e.attackCd > 0) e.attackCd -= dt;

      // Select target: Central Gem or Player based on distance & bias
      const distToGem = Math.hypot(gem.x - e.x, gem.y - e.y);
      const distToPlayer = Math.hypot(player.x - e.x, player.y - e.y);

      let targetX = gem.x;
      let targetY = gem.y;
      let targetType = 'gem';

      if (e.preferTarget === 'player' || distToPlayer < 180) {
        targetX = player.x;
        targetY = player.y;
        targetType = 'player';
      }

      // Ranged enemies keep distance and shoot spells
      if (e.type === 'archer' || e.type === 'boss') {
        e.shootCd -= dt;
        if (e.shootCd <= 0) {
          e.shootCd = e.type === 'boss' ? 1.6 : 2.2;
          this.enemyShoot(e, targetX, targetY);
        }
      }

      // Move toward target
      const angle = Math.atan2(targetY - e.y, targetX - e.x);
      const dist = Math.hypot(targetX - e.x, targetY - e.y);

      // Stop moving if close enough to attack
      const stopDist = (targetType === 'gem' ? gem.radius : player.radius) + e.radius - 2;
      if (dist > stopDist) {
        e.x += Math.cos(angle) * e.speed * dt;
        e.y += Math.sin(angle) * e.speed * dt;
      }

      // Enemy vs Enemy soft separation
      for (let j = i + 1; j < this.enemies.length; j++) {
        const o = this.enemies[j];
        const sepDist = Math.hypot(o.x - e.x, o.y - e.y);
        const minSep = e.radius + o.radius;
        if (sepDist < minSep && sepDist > 0.001) {
          const push = (minSep - sepDist) * 0.45;
          const sx = (o.x - e.x) / sepDist;
          const sy = (o.y - e.y) / sepDist;
          e.x -= sx * push;
          e.y -= sy * push;
          o.x += sx * push;
          o.y += sy * push;
        }
      }

      // Attack Gem Core
      if (distToGem <= gem.radius + e.radius + 4 && e.attackCd <= 0) {
        e.attackCd = 1.0;
        this.damageGem(e.damage);
        // Gem thorns retaliation
        if (gem.hasThorns) {
          this.damageEnemy(e, gem.thornsDamage, true);
        }
      }

      // Attack Player
      if (distToPlayer <= player.radius + e.radius + 4 && e.attackCd <= 0) {
        e.attackCd = 0.9;
        this.damagePlayer(e.damage);
      }
    }
  }

  enemyShoot(e, targetX, targetY) {
    const angle = Math.atan2(targetY - e.y, targetX - e.x);
    if (e.type === 'boss') {
      // 3-way spread attack
      [-0.25, 0, 0.25].forEach(offset => {
        this.projectiles.push({
          x: e.x,
          y: e.y,
          vx: Math.cos(angle + offset) * 320,
          vy: Math.sin(angle + offset) * 320,
          damage: 25,
          radius: 7,
          color: '#ef4444',
          isEnemy: true,
          rangeLeft: 800,
          trail: []
        });
      });
    } else {
      this.projectiles.push({
        x: e.x,
        y: e.y,
        vx: Math.cos(angle) * 360,
        vy: Math.sin(angle) * 360,
        damage: 18,
        radius: 5,
        color: '#c084fc',
        isEnemy: true,
        rangeLeft: 700,
        trail: []
      });
    }
  }

  damageEnemy(e, damage, isCrit = false) {
    e.hp -= damage;
    sound.playHit();
    this.showFloatingText(e.x, e.y - 12, Math.round(damage), isCrit ? '#fbbf24' : '#ffffff', isCrit ? 18 : 13);

    // Blood / Magic splinter particle
    for (let i = 0; i < 4; i++) {
      this.addParticle({
        x: e.x,
        y: e.y,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
        color: e.color,
        radius: 3,
        life: 0.25
      });
    }

    if (e.hp <= 0) {
      this.killEnemy(e);
    }
  }

  killEnemy(e) {
    const idx = this.enemies.indexOf(e);
    if (idx === -1) return;

    this.enemies.splice(idx, 1);
    this.kills++;

    // Frenzy kill stack
    if (this.player.hasFrenzy) {
      this.player.frenzyStacks = Math.min(20, this.player.frenzyStacks + 1);
      this.player.frenzyTimer = 5.0;
    }

    if (e.type === 'boss') {
      this.bossAlive = false;
      document.getElementById('bossBarContainer').classList.add('hidden');
      sound.playExplosion();
      // Drop huge rewards
      for (let k = 0; k < 12; k++) {
        this.spawnPickup(e.x + (Math.random() - 0.5) * 50, e.y + (Math.random() - 0.5) * 50, 'xp', 25);
      }
      this.spawnPickup(e.x, e.y, 'heal', 50);
    } else {
      // Normal XP drop
      this.spawnPickup(e.x, e.y, 'xp', e.xpVal);
      // Rare heal drop
      if (Math.random() < 0.06) {
        this.spawnPickup(e.x, e.y, 'heal', 20);
      }
    }

    // Death explosion fx
    for (let i = 0; i < 12; i++) {
      this.addParticle({
        x: e.x,
        y: e.y,
        vx: (Math.random() - 0.5) * 180,
        vy: (Math.random() - 0.5) * 180,
        color: e.color,
        radius: 4,
        life: 0.4
      });
    }
  }

  damageGem(dmg) {
    this.gem.hp = Math.max(0, this.gem.hp - dmg);
    sound.playGemHit();
    this.showFloatingText(this.gem.x, this.gem.y - 25, `-${dmg}`, '#38bdf8', 16);

    // Gem flash ripples
    for (let i = 0; i < 6; i++) {
      this.addParticle({
        x: this.gem.x + (Math.random() - 0.5) * 30,
        y: this.gem.y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100,
        color: '#38bdf8',
        radius: 4,
        life: 0.3
      });
    }
  }

  damagePlayer(dmg) {
    if (this.player.isDashing) return; // Invulnerable while dashing
    this.player.hp = Math.max(0, this.player.hp - dmg);
    sound.playHit();
    this.showFloatingText(this.player.x, this.player.y - 25, `-${dmg}`, '#ef4444', 16);

    // Red screen shake or hit burst
    for (let i = 0; i < 6; i++) {
      this.addParticle({
        x: this.player.x,
        y: this.player.y,
        vx: (Math.random() - 0.5) * 90,
        vy: (Math.random() - 0.5) * 90,
        color: '#ef4444',
        radius: 3.5,
        life: 0.25
      });
    }
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const step = Math.hypot(p.vx * dt, p.vy * dt);
      p.rangeLeft -= step;

      // Trail particles
      if (Math.random() < 0.4) {
        this.addParticle({
          x: p.x,
          y: p.y,
          vx: 0,
          vy: 0,
          color: p.color,
          radius: p.radius * 0.7,
          life: 0.15
        });
      }

      // Check bullet lifetime
      if (p.rangeLeft <= 0) {
        if (p.splashRadius > 0) {
          this.triggerSplashDamage(p);
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      // Enemy Projectiles hitting Player or Gem
      if (p.isEnemy) {
        // Player hit
        if (Math.hypot(p.x - this.player.x, p.y - this.player.y) < this.player.radius + p.radius) {
          this.damagePlayer(p.damage);
          this.projectiles.splice(i, 1);
          continue;
        }
        // Gem hit
        if (Math.hypot(p.x - this.gem.x, p.y - this.gem.y) < this.gem.radius + p.radius) {
          this.damageGem(p.damage);
          this.projectiles.splice(i, 1);
          continue;
        }
      } else {
        // Friendly Projectiles hitting Enemies
        let bulletDestroyed = false;
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const e = this.enemies[j];
          if (p.hitList.has(e)) continue;

          const dist = Math.hypot(p.x - e.x, p.y - e.y);
          if (dist < e.radius + p.radius) {
            p.hitList.add(e);
            this.damageEnemy(e, p.damage, p.isCrit);
            p.pierce--;

            if (p.splashRadius > 0) {
              this.triggerSplashDamage(p);
              bulletDestroyed = true;
              break;
            }

            if (p.pierce <= 0) {
              bulletDestroyed = true;
              break;
            }
          }
        }

        if (bulletDestroyed) {
          this.projectiles.splice(i, 1);
        }
      }
    }
  }

  triggerSplashDamage(p) {
    sound.playExplosion();
    // Area damage
    this.enemies.forEach(e => {
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      if (d < p.splashRadius + e.radius) {
        const falloff = 1 - (d / (p.splashRadius + e.radius));
        const dmg = Math.round(p.damage * Math.max(0.4, falloff));
        this.damageEnemy(e, dmg, p.isCrit);
      }
    });

    // Blast Ring VFX
    for (let k = 0; k < 28; k++) {
      const angle = (k / 28) * Math.PI * 2;
      const speed = 100 + Math.random() * 120;
      this.addParticle({
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: p.color,
        radius: 5,
        life: 0.35
      });
    }
  }

  spawnPickup(x, y, type, value) {
    this.pickups.push({
      x, y,
      type, // 'xp' or 'heal'
      value,
      radius: type === 'xp' ? 8 : 11,
      color: type === 'xp' ? '#818cf8' : '#10b981',
      pulse: Math.random() * Math.PI * 2
    });
  }

  updatePickups(dt) {
    const p = this.player;
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const item = this.pickups[i];
      item.pulse += dt * 4;

      const dist = Math.hypot(p.x - item.x, p.y - item.y);

      // Vacuum magnet into player
      if (dist < p.pickupRadius) {
        const angle = Math.atan2(p.y - item.y, p.x - item.x);
        const pullSpeed = 480 * (1 - dist / p.pickupRadius) + 200;
        item.x += Math.cos(angle) * pullSpeed * dt;
        item.y += Math.sin(angle) * pullSpeed * dt;
      }

      // Collect
      if (dist < p.radius + item.radius) {
        sound.playPickup();
        if (item.type === 'xp') {
          this.addXP(item.value);
        } else if (item.type === 'heal') {
          p.hp = Math.min(p.maxHp, p.hp + item.value);
          this.showFloatingText(p.x, p.y - 20, `+${item.value} HP`, '#10b981', 16);
        }
        this.pickups.splice(i, 1);
      }
    }
  }

  addXP(amt) {
    this.xp += amt;
    this.essence += amt;
    if (this.xp >= this.xpNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.xp -= this.xpNeeded;
    this.xpNeeded = Math.round(this.xpNeeded * 1.35);
    sound.playLevelUp();
    this.showFloatingText(this.player.x, this.player.y - 40, 'LEVEL UP!', '#fbbf24', 24, 2.0);
    this.showUpgradeModal();
  }

  showUpgradeModal() {
    this.isPaused = true;
    const modal = document.getElementById('upgradeModal');
    const container = document.getElementById('upgradeCardsGrid');
    container.innerHTML = '';

    // Pick 3 random valid upgrades
    const available = UPGRADES_POOL.filter(u => !u.condition || u.condition(this));
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 3);

    choices.forEach(cardData => {
      const cardEl = document.createElement('div');
      cardEl.className = `upgrade-card rarity-${cardData.rarity}`;
      cardEl.innerHTML = `
        <div class="card-icon">${cardData.icon}</div>
        <div class="card-title">${cardData.title}</div>
        <div class="card-tag tag-${cardData.rarity}">${cardData.rarity.toUpperCase()}</div>
        <div class="card-desc">${cardData.desc}</div>
        <button class="card-btn">SELECT BLESSING</button>
      `;

      cardEl.addEventListener('click', () => {
        cardData.apply(this);
        modal.classList.add('hidden');
        this.isPaused = false;
      });

      container.appendChild(cardEl);
    });

    modal.classList.remove('hidden');
  }

  onWaveVictory() {
    // Regenerate portion of Gem health on wave clear
    const healGem = 150;
    this.gem.hp = Math.min(this.gem.maxHp, this.gem.hp + healGem);
    this.showFloatingText(this.gem.x, this.gem.y - 40, `+${healGem} CORE HEAL`, '#38bdf8', 20, 2.0);

    const banner = document.getElementById('waveClearedModal');
    banner.classList.remove('hidden');

    setTimeout(() => {
      banner.classList.add('hidden');
      this.startWave(this.wave + 1);
    }, 2800);
  }

  gameOver(reason) {
    this.isRunning = false;
    document.getElementById('gameOverReason').innerText = reason;
    document.getElementById('finalWaves').innerText = this.wave;
    document.getElementById('finalKills').innerText = this.kills;
    document.getElementById('finalEssence').innerText = this.essence;
    document.getElementById('finalLevel').innerText = this.level;
    document.getElementById('gameOverScreen').classList.remove('hidden');
  }

  // --- Particles & Floating Texts ---
  addParticle(p) {
    this.particles.push({
      x: p.x,
      y: p.y,
      vx: p.vx,
      vy: p.vy,
      color: p.color,
      radius: p.radius,
      life: p.life,
      maxLife: p.life
    });
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  showFloatingText(x, y, text, color = '#ffffff', size = 14, duration = 1.0) {
    this.floatingTexts.push({
      x, y,
      text,
      color,
      size,
      life: duration,
      maxLife: duration
    });
  }

  updateFloatingTexts(dt) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y -= 25 * dt;
      t.life -= dt;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  updateCamera() {
    // Smooth camera tracking player
    const targetX = this.player.x;
    const targetY = this.player.y;
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;
  }

  // --- HUD Updates ---
  updateHUD() {
    // Gem HP
    const gemPct = Math.max(0, (this.gem.hp / this.gem.maxHp) * 100);
    document.getElementById('gemHpBar').style.width = `${gemPct}%`;
    document.getElementById('gemHpText').innerText = `${Math.ceil(this.gem.hp)} / ${this.gem.maxHp}`;

    // Player HP
    const pPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    document.getElementById('playerHpBar').style.width = `${pPct}%`;
    document.getElementById('playerHpText').innerText = `${Math.ceil(this.player.hp)} / ${this.player.maxHp}`;

    // Wave Info
    document.getElementById('waveNumber').innerText = this.wave;
    const wavePct = Math.min(100, (this.waveTimer / this.waveDuration) * 100);
    document.getElementById('waveProgressBar').style.width = `${wavePct}%`;
    document.getElementById('waveStatus').innerText = this.waveState === 'surviving' ? 'Wipe the Remaining Monsters!' : `Spawning Horde (${this.enemies.length} active)`;

    // Stats
    document.getElementById('scoreText').innerText = this.essence;
    document.getElementById('playerLvlText').innerText = this.level;
    document.getElementById('killCountText').innerText = this.kills;
    const xpPct = Math.min(100, (this.xp / this.xpNeeded) * 100);
    document.getElementById('xpBarFill').style.width = `${xpPct}%`;

    // Ability cooldown overlays
    const dashOverlay = document.getElementById('dashCdOverlay');
    dashOverlay.style.height = `${(this.player.dashCd / this.player.dashMaxCd) * 100}%`;

    const novaOverlay = document.getElementById('shockwaveCdOverlay');
    novaOverlay.style.height = `${(this.player.shockwaveCd / this.player.shockwaveMaxCd) * 100}%`;

    // Boss bar if active
    if (this.bossAlive) {
      const boss = this.enemies.find(e => e.type === 'boss');
      if (boss) {
        const bPct = Math.max(0, (boss.hp / boss.maxHp) * 100);
        document.getElementById('bossHpBar').style.width = `${bPct}%`;
      }
    }
  }

  updateHudWeapons() {
    const container = document.getElementById('weaponSlots');
    container.innerHTML = '';
    const unlocked = Object.values(this.weapons).filter(w => w.unlocked);

    unlocked.forEach((w, idx) => {
      const card = document.createElement('div');
      card.className = `weapon-card ${w.id === this.activeWeaponId ? 'active' : ''}`;
      card.innerHTML = `
        <span class="key-badge">${idx + 1}</span>
        <span class="wpn-icon">${w.icon}</span>
        <span class="wpn-level">LV ${w.level}</span>
      `;
      card.addEventListener('click', () => {
        this.activeWeaponId = w.id;
        this.updateHudWeapons();
      });
      container.appendChild(card);
    });
  }

  // --- Rendering ---
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Center camera on screen
    ctx.translate(this.canvas.width / 2 - this.camera.x, this.canvas.height / 2 - this.camera.y);

    this.renderArena();
    this.renderGem();
    this.renderPickups();
    this.renderEnemies();
    this.renderPlayer();
    this.renderProjectiles();
    this.renderParticles();
    this.renderFloatingTexts();

    ctx.restore();
  }

  renderArena() {
    const ctx = this.ctx;
    const half = MAP_SIZE / 2;

    // Dark Stone Arena Floor
    ctx.fillStyle = '#0c0f17';
    ctx.fillRect(-half, -half, MAP_SIZE, MAP_SIZE);

    // Grid Floor Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const gridSize = 100;
    for (let x = -half; x <= half; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -half);
      ctx.lineTo(x, half);
      ctx.stroke();
    }
    for (let y = -half; y <= half; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-half, y);
      ctx.lineTo(half, y);
      ctx.stroke();
    }

    // Floor Runic Decorations
    this.decorations.forEach(dec => {
      ctx.save();
      ctx.translate(dec.x, dec.y);
      ctx.rotate(dec.rot);
      ctx.fillStyle = dec.color;

      if (dec.type === 'rune') {
        ctx.beginPath();
        ctx.arc(0, 0, dec.size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = dec.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillRect(-dec.size / 2, -dec.size / 2, dec.size, dec.size * 0.7);
      }
      ctx.restore();
    });

    // Central Mystic Sanctuary Ring around the Gem
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Outer Arena Border with warning glow
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 8;
    ctx.strokeRect(-half, -half, MAP_SIZE, MAP_SIZE);
  }

  renderGem() {
    const ctx = this.ctx;
    const gem = this.gem;
    gem.pulse += 0.04;

    // Core Radiant Glow
    const glowRadius = gem.radius + 20 + Math.sin(gem.pulse) * 8;
    const grad = ctx.createRadialGradient(gem.x, gem.y, 10, gem.x, gem.y, glowRadius);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
    grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.35)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gem.x, gem.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Crystal Diamond Shape
    ctx.save();
    ctx.translate(gem.x, gem.y);

    const s = gem.radius;
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.25);
    ctx.lineTo(s, -s * 0.2);
    ctx.lineTo(s * 0.7, s * 1.1);
    ctx.lineTo(0, s * 1.35);
    ctx.lineTo(-s * 0.7, s * 1.1);
    ctx.lineTo(-s, -s * 0.2);
    ctx.closePath();

    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Crystal facet reflections
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.25);
    ctx.lineTo(s * 0.3, 0);
    ctx.lineTo(0, s * 1.35);
    ctx.lineTo(-s * 0.3, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();

    ctx.restore();

    // Core Health Ring above gem
    const hpPct = Math.max(0, gem.hp / gem.maxHp);
    ctx.beginPath();
    ctx.arc(gem.x, gem.y, gem.radius + 14, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * hpPct));
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  renderPlayer() {
    const ctx = this.ctx;
    const p = this.player;

    ctx.save();
    ctx.translate(p.x, p.y);

    // Aim rotation toward mouse
    const aimAngle = Math.atan2(this.mouse.worldY - p.y, this.mouse.worldX - p.x);

    // Dash glow trail
    if (p.isDashing) {
      ctx.beginPath();
      ctx.arc(0, 0, p.radius + 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
    }

    // Guardian Body
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Guardian Armor Plate / Mantle
    ctx.beginPath();
    ctx.arc(0, 0, p.radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Weapon Barrel / Hands pointing at cursor
    ctx.rotate(aimAngle);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(p.radius * 0.5, -4, 16, 8);

    // Weapon glowing emitter tip
    const curWpn = this.weapons[this.activeWeaponId];
    ctx.fillStyle = curWpn ? curWpn.color : '#38bdf8';
    ctx.beginPath();
    ctx.arc(p.radius * 0.5 + 16, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Orbiting Satellite Orbs
    if (p.orbitersCount) {
      const orbDist = 70;
      for (let i = 0; i < p.orbitersCount; i++) {
        const angle = (p.orbitAngle || 0) + (i * (Math.PI * 2 / p.orbitersCount));
        const ox = p.x + Math.cos(angle) * orbDist;
        const oy = p.y + Math.sin(angle) * orbDist;

        ctx.beginPath();
        ctx.arc(ox, oy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  renderEnemies() {
    const ctx = this.ctx;

    this.enemies.forEach(e => {
      ctx.save();
      ctx.translate(e.x, e.y);

      // Enemy Body with distinctive fantasy styling
      ctx.beginPath();
      ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Enemy Facial / Monster Features
      if (e.type === 'zombie') {
        // Rotting hollow eyes
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(-5, -4, 3, 0, Math.PI * 2);
        ctx.arc(5, -4, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'ghoul') {
        // Sharp fangs & glowing eyes
        ctx.fillStyle = '#fdf2f8';
        ctx.beginPath();
        ctx.arc(-4, -3, 2.5, 0, Math.PI * 2);
        ctx.arc(4, -3, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'archer') {
        // Bone bow silhouette
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(8, 0, 10, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      } else if (e.type === 'golem') {
        // Heavy obsidian rune cracks
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-10, -8);
        ctx.lineTo(0, 0);
        ctx.lineTo(8, 12);
        ctx.stroke();
      } else if (e.type === 'boss') {
        // Demonic Horns
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.moveTo(-18, -12);
        ctx.lineTo(-28, -32);
        ctx.lineTo(-10, -22);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(18, -12);
        ctx.lineTo(28, -32);
        ctx.lineTo(10, -22);
        ctx.fill();
      }

      // Overhead Enemy HP Bar (if damaged)
      if (e.hp < e.maxHp && e.type !== 'boss') {
        const barW = e.radius * 2;
        const barH = 4;
        const hpPct = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-barW / 2, -e.radius - 10, barW, barH);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-barW / 2, -e.radius - 10, barW * hpPct, barH);
      }

      ctx.restore();
    });
  }

  renderProjectiles() {
    const ctx = this.ctx;

    this.projectiles.forEach(p => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    });
  }

  renderPickups() {
    const ctx = this.ctx;

    this.pickups.forEach(item => {
      ctx.save();
      ctx.translate(item.x, item.y);
      const floatOffset = Math.sin(item.pulse) * 4;

      ctx.beginPath();
      if (item.type === 'xp') {
        // Floating diamond soul shard
        ctx.moveTo(0, -item.radius + floatOffset);
        ctx.lineTo(item.radius * 0.7, floatOffset);
        ctx.lineTo(0, item.radius + floatOffset);
        ctx.lineTo(-item.radius * 0.7, floatOffset);
        ctx.closePath();
      } else {
        // Heart pickup
        ctx.arc(0, floatOffset, item.radius, 0, Math.PI * 2);
      }

      ctx.fillStyle = item.color;
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    });
  }

  renderParticles() {
    const ctx = this.ctx;

    this.particles.forEach(p => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });
  }

  renderFloatingTexts() {
    const ctx = this.ctx;

    this.floatingTexts.forEach(t => {
      const alpha = Math.max(0, t.life / t.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${t.size}px 'Outfit', sans-serif`;
      ctx.fillStyle = t.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
  }
}

// Instantiate game on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
