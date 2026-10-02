import { CHARACTERS, relLabel } from '../data/characters';
import { EVENTS, pickEvent } from '../data/events';
import { TIERS, nextTier } from '../data/apartments';
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements';
import { playSfx } from '../sound';

const SAVE_KEY = 'kos-jakarta-save-v1';
const MAX_DAY = 30;
const MID_EVAL_DAY = 15;
const MID_EVAL_MIN_MONEY = 3000;

const FONT_BODY = 'Rubik, system-ui, sans-serif';
const FONT_PIXEL = '"Press Start 2P", monospace';

export function createMainScene(Phaser) {
  return class MainScene extends Phaser.Scene {
    constructor() {
      super('MainScene');
    }

    create() {
      const W = this.scale.width;
      const H = this.scale.height;

      // ===== STATE =====
      const saved = this.loadSave();
      this.state = saved || {
        money: 500,
        reputation: 0,
        peace: 50,
        day: 1,
        hasTenant: false,
        tenantCount: 0,
        tier: 'basic',
        energy: TIERS.basic.dailyEnergy,
        currentEvent: 'intro',
        eventShown: false,
        relationship: { burt: 20, pakHaji: 30, tenant1: 10, sari: 15, bagas: 15 },
        achievements: {},
      };

      // Migration
      if (!this.state.relationship) this.state.relationship = { burt: 20, pakHaji: 30, tenant1: 10, sari: 15, bagas: 15 };
      if (!this.state.relationship.sari) this.state.relationship.sari = 15;
      if (!this.state.relationship.bagas) this.state.relationship.bagas = 15;
      if (!this.state.achievements) this.state.achievements = {};
      if (!this.state.tier) this.state.tier = 'basic';
      if (this.state.tenantCount === undefined) this.state.tenantCount = this.state.hasTenant ? 1 : 0;
      if (this.state.energy === undefined) this.state.energy = TIERS[this.state.tier].dailyEnergy;

      // ============================================================
      // ===== GRADIENT BACKGROUND =====
      // ============================================================
      const bg = this.add.graphics();
      bg.fillGradientStyle(0x0a0e1a, 0x0a0e1a, 0x141b2e, 0x141b2e, 1);
      bg.fillRect(0, 0, W, H);
      this.bgLayer = bg;

      // ============================================================
      // ===== SCENE AREA =====
      // ============================================================
      const sceneX = 40;
      const sceneY = 168;
      const sceneW = W - 80;
      const sceneH = 352;

      // Wall gradient
      const wallG = this.add.graphics();
      wallG.fillGradientStyle(0x1e293b, 0x1e293b, 0x0f172a, 0x0f172a, 1);
      wallG.fillRect(sceneX, sceneY, sceneW, sceneH);
      wallG.lineStyle(3, 0x334155);
      wallG.strokeRect(sceneX, sceneY, sceneW, sceneH);

      // Floor gradient
      const floorG = this.add.graphics();
      floorG.fillGradientStyle(0x92400e, 0x92400e, 0x451a03, 0x451a03, 1);
      floorG.fillRect(sceneX, sceneY + sceneH - 100, sceneW, 100);

      // Garis parket
      for (let i = 0; i < 100; i += 12) {
        floorG.lineStyle(1, 0x78350f, 0.6);
        floorG.lineBetween(sceneX, sceneY + sceneH - 100 + i, sceneX + sceneW, sceneY + sceneH - 100 + i);
      }

      // ============================================================
      // ===== FURNITURE (dari Pixel Spaces) =====
      // ============================================================
      this.furnitureGroup = [];

      // Lampu gantung di tengah atas
      if (this.textures.exists('furniture_light1')) {
        const lamp = this.add.image(W / 2, sceneY + 10, 'furniture_light1')
          .setOrigin(0.5, 0)
          .setScale(2);
        this.furnitureGroup.push(lamp);

        // Glow effect
        const glow = this.add.circle(W / 2, sceneY + 80, 40, 0xfbbf24, 0.15);
        this.furnitureGroup.push(glow);
      }

      // Pintu di kiri
      if (this.textures.exists('furniture_door')) {
        const door = this.add.image(sceneX + 100, sceneY + sceneH - 90, 'furniture_door')
          .setOrigin(0.5, 1)
          .setScale(2.5);
        this.furnitureGroup.push(door);
      }

      // Tangga (kalau tier != basic)
      this.stairs = null;
      if (this.state.tier !== 'basic' && this.textures.exists('furniture_stairs')) {
        this.stairs = this.add.image(sceneX + sceneW - 140, sceneY + sceneH - 100, 'furniture_stairs')
          .setOrigin(1, 1)
          .setScale(2);
        this.furnitureGroup.push(this.stairs);
      }

      // ============================================================
      // ===== WINDOWS =====
      // ============================================================
      const winY = sceneY + 80;
      const winOffset = 380;

      const winG1 = this.add.graphics();
      winG1.fillGradientStyle(0x38bdf8, 0x38bdf8, 0x0284c7, 0x0284c7, 1);
      winG1.fillRoundedRect(W / 2 - winOffset - 80, winY - 60, 160, 120, 4);
      winG1.lineStyle(5, 0x1e293b);
      winG1.strokeRoundedRect(W / 2 - winOffset - 80, winY - 60, 160, 120, 4);

      const winG2 = this.add.graphics();
      winG2.fillGradientStyle(0x38bdf8, 0x38bdf8, 0x0284c7, 0x0284c7, 1);
      winG2.fillRoundedRect(W / 2 + winOffset - 80, winY - 60, 160, 120, 4);
      winG2.lineStyle(5, 0x1e293b);
      winG2.strokeRoundedRect(W / 2 + winOffset - 80, winY - 60, 160, 120, 4);

      // Window cross lines
      this.add.line(0, 0, W / 2 - winOffset, winY - 60, W / 2 - winOffset, winY + 60, 0x1e293b, 1).setLineWidth(4);
      this.add.line(0, 0, W / 2 - winOffset - 80, winY, W / 2 - winOffset + 80, winY, 0x1e293b, 1).setLineWidth(4);
      this.add.line(0, 0, W / 2 + winOffset, winY - 60, W / 2 + winOffset, winY + 60, 0x1e293b, 1).setLineWidth(4);
      this.add.line(0, 0, W / 2 + winOffset - 80, winY, W / 2 + winOffset + 80, winY, 0x1e293b, 1).setLineWidth(4);

      this.win1 = winG1;
      this.win2 = winG2;

      // ============================================================
      // ===== KARAKTER KARAKTER =====
      // ============================================================
      this.mc = this.add.image(W / 2 - 280, sceneY + sceneH - 130, CHARACTERS.mc.texture).setScale(1.6);
      this.tweens.add({
        targets: this.mc,
        y: this.mc.y - 10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Bu RT (muncul kalau event)
      this.burtSprite = this.add.image(W / 2 + 280, sceneY + sceneH - 130, CHARACTERS.burt.texture)
        .setScale(1.6)
        .setAlpha(0);
      this.tweens.add({
        targets: this.burtSprite,
        y: this.burtSprite.y - 10,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // ============================================================
      // ===== TOP BAR =====
      // ============================================================
      const topY = 24;
      const topH = 96;

      this.add.rectangle(W / 2, topY + topH / 2, W - 80, topH, 0x0f172a, 0.8)
        .setStrokeStyle(2, 0x334155);

      const cardW = (W - 80 - 48) / 3;
      const cardH = topH - 28;
      const cardY = topY + topH / 2;

      this.statMoney = this.createStatCard(40 + cardW / 2, cardY, cardW, cardH, '💰', 'UANG', 500, '#4ade80');
      this.statRep = this.createStatCard(40 + cardW + 24 + cardW / 2, cardY, cardW, cardH, '⭐', 'REPUTASI', 0, '#fbbf24');
      this.statDay = this.createStatCard(40 + (cardW + 24) * 2 + cardW / 2, cardY, cardW, cardH, '📅', 'HARI', 1, '#60a5fa');

      // ============================================================
      // ===== RELATIONSHIP BAR =====
      // ============================================================
      const relY = 132;
      const relH = 44;

      this.add.rectangle(W / 2, relY + relH / 2, W - 80, relH, 0x0f172a, 0.8)
        .setStrokeStyle(2, 0x334155);

      this.relItems = [];
      const relChars = ['burt', 'pakHaji', 'tenant1', 'sari', 'bagas'];
      const relSpacing = (W - 120) / relChars.length;

      relChars.forEach((key, i) => {
        const x = 60 + relSpacing * (i + 0.5);
        const char = CHARACTERS[key];
        const emoji = this.add.text(x - 40, relY + relH / 2, char.emoji, {
          fontSize: '22px',
        }).setOrigin(0.5);
        const val = this.add.text(x + 10, relY + relH / 2, '0', {
          fontSize: '15px',
          color: '#cbd5e1',
          fontFamily: FONT_BODY,
          fontStyle: 'bold',
        }).setOrigin(0.5);
        this.relItems.push({ key, emoji, val, baseY: relY + relH / 2, baseX: x + 10 });
      });

      // ============================================================
      // ===== ENERGY BAR =====
      // ============================================================
      const energyY = 528;
      const energyH = 44;

      this.add.rectangle(W / 2, energyY + energyH / 2, W - 80, energyH, 0x0f172a, 0.8)
        .setStrokeStyle(2, 0x334155);

      this.add.text(60, energyY + energyH / 2, '⚡ ENERGI', {
        fontSize: '13px',
        color: '#fbbf24',
        fontFamily: FONT_PIXEL,
      }).setOrigin(0, 0.5);

      this.energyDots = [];
      const dotStartX = 240;
      const dotGap = 42;

      for (let i = 0; i < 8; i++) {
        const dot = this.add.circle(dotStartX + i * dotGap, energyY + energyH / 2, 13, 0xfbbf24)
          .setStrokeStyle(3, 0x78350f);
        dot.baseScale = 1;
        this.energyDots.push(dot);
      }

      this.energyText = this.add.text(W - 60, energyY + energyH / 2, '8 / 8', {
        fontSize: '15px',
        color: '#fbbf24',
        fontFamily: FONT_BODY,
        fontStyle: 'bold',
      }).setOrigin(1, 0.5);

      // ============================================================
      // ===== LOG =====
      // ============================================================
      this.logText = this.add.text(W / 2, 592, 'Selamat datang!', {
        fontSize: '15px',
        color: '#94a3b8',
        fontFamily: FONT_BODY,
      }).setOrigin(0.5);

      // ============================================================
      // ===== ACTION BUTTONS =====
      // ============================================================
      const btnY = 660;
      const btnH = 88;
      const btnGap = 12;
      const btnPad = 40;
      const btnTotalW = W - btnPad * 2 - btnGap * 4;
      const btnW = btnTotalW / 5;
      const btnStartX = btnPad + btnW / 2;

      this.btnWork = this.createActionButton(btnStartX + (btnW + btnGap) * 0, btnY, btnW, btnH, '💼', 'Kerja', '-2⚡', () => this.doWork(), 0x4f46e5, 0x6366f1);
      this.btnChill = this.createActionButton(btnStartX + (btnW + btnGap) * 1, btnY, btnW, btnH, '☕', 'Santai', '-1⚡', () => this.doChill(), 0x4f46e5, 0x6366f1);
      this.btnAd = this.createActionButton(btnStartX + (btnW + btnGap) * 2, btnY, btnW, btnH, '📢', 'Iklan', '-2⚡', () => this.doAdvertise(), 0x4f46e5, 0x6366f1);
      this.btnUpgrade = this.createActionButton(btnStartX + (btnW + btnGap) * 3, btnY, btnW, btnH, '🏗️', 'Upgrade', 'Naik Kelas', () => this.doUpgrade(), 0x7c3aed, 0x8b5cf6);
      this.btnSleep = this.createActionButton(btnStartX + (btnW + btnGap) * 4, btnY, btnW, btnH, '😴', 'Tidur', 'Ganti Hari', () => this.doSleep(), 0xdc2626, 0xef4444);

      this.updateUI();

      if (!this.state.eventShown && this.state.currentEvent) {
        this.time.delayedCall(600, () => this.showEvent(this.state.currentEvent));
      }

      this.startAmbientParticles();
    }

    // ============================================================
    // ===== AMBIENT PARTICLES =====
    // ============================================================
    startAmbientParticles() {
      const W = this.scale.width;
      const H = this.scale.height;

      if (!this.textures.exists('dust')) {
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 1);
        g.fillCircle(2, 2, 2);
        g.generateTexture('dust', 4, 4);
        g.destroy();
      }

      this.dustEmitter = this.add.particles(0, 0, 'dust', {
        x: { min: 0, max: W },
        y: { min: 200, max: H - 100 },
        lifespan: 4000,
        speedY: { min: -8, max: -20 },
        speedX: { min: -5, max: 5 },
        scale: { start: 0.6, end: 0 },
        alpha: { start: 0.15, end: 0 },
        quantity: 1,
        frequency: 400,
        blendMode: 'ADD',
      }).setDepth(1);
    }

    coinBurst(x, y) {
      if (!this.textures.exists('coin_particle')) {
        const g = this.add.graphics();
        g.fillStyle(0xfbbf24, 1);
        g.fillCircle(6, 6, 6);
        g.lineStyle(2, 0xf59e0b);
        g.strokeCircle(6, 6, 6);
        g.generateTexture('coin_particle', 12, 12);
        g.destroy();
      }

      const emitter = this.add.particles(x, y, 'coin_particle', {
        speed: { min: 150, max: 350 },
        angle: { min: 220, max: 320 },
        gravityY: 500,
        lifespan: 900,
        scale: { start: 1, end: 0.3 },
        alpha: { start: 1, end: 0 },
        quantity: 12,
      }).setDepth(200);

      emitter.explode(12);
      this.time.delayedCall(1000, () => emitter.destroy());
    }

    confettiBurst(x, y) {
      if (!this.textures.exists('confetti')) {
        const g = this.add.graphics();
        g.fillStyle(0xffffff, 1);
        g.fillRect(0, 0, 8, 12);
        g.generateTexture('confetti', 8, 12);
        g.destroy();
      }

      const colors = [0xfbbf24, 0xf87171, 0x60a5fa, 0x4ade80, 0xa78bfa, 0xf472b6];
      colors.forEach((color) => {
        const emitter = this.add.particles(x, y, 'confetti', {
          speed: { min: 200, max: 500 },
          angle: { min: 200, max: 340 },
          gravityY: 600,
          lifespan: 2000,
          scale: { start: 1, end: 0.5 },
          rotate: { min: 0, max: 360 },
          alpha: { start: 1, end: 0 },
          quantity: 6,
          tint: color,
        }).setDepth(200);

        emitter.explode(6);
        this.time.delayedCall(2200, () => emitter.destroy());
      });
    }

    // ============================================================
    // ===== STAT CARD =====
    // ============================================================
    createStatCard(x, y, w, h, emoji, label, initialValue, color) {
      const container = this.add.container(x, y);

      const bg = this.add.rectangle(0, 0, w, h, 0x0f172a, 0.6).setStrokeStyle(1, 0x334155);

      const emojiText = this.add.text(-w / 2 + 20, 0, emoji, { fontSize: '28px' }).setOrigin(0, 0.5);
      const labelText = this.add.text(-w / 2 + 60, -16, label, {
        fontSize: '10px', color: '#94a3b8',
        fontFamily: FONT_PIXEL,
      }).setOrigin(0, 0.5);
      const valueText = this.add.text(-w / 2 + 60, 12, String(initialValue), {
        fontSize: '18px', color,
        fontFamily: FONT_BODY, fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      container.add([bg, emojiText, labelText, valueText]);
      container.valueText = valueText;
      container.displayValue = initialValue;
      return container;
    }

    animateNumber(statCard, from, to, prefix = '', suffix = '') {
      if (statCard.tween) statCard.tween.stop();
      const obj = { v: from };
      statCard.tween = this.tweens.add({
        targets: obj,
        v: to,
        duration: 600,
        ease: 'Cubic.easeOut',
        onUpdate: () => {
          statCard.valueText.setText(`${prefix}${Math.floor(obj.v)}${suffix}`);
        },
        onComplete: () => {
          statCard.displayValue = to;
        },
      });
    }

    createActionButton(x, y, w, h, emoji, label, sublabel, onClick, baseColor, hoverColor) {
      const container = this.add.container(x, y);

      const bg = this.add.rectangle(0, 0, w, h, baseColor)
        .setStrokeStyle(2, hoverColor)
        .setInteractive({ useHandCursor: true });

      const emojiText = this.add.text(0, -20, emoji, { fontSize: '26px' }).setOrigin(0.5);
      const labelText = this.add.text(0, 14, label, {
        fontSize: '14px', color: '#ffffff',
        fontFamily: FONT_BODY, fontStyle: 'bold',
      }).setOrigin(0.5);
      const subText = this.add.text(0, 32, sublabel, {
        fontSize: '10px', color: 'rgba(255,255,255,0.7)',
        fontFamily: FONT_BODY,
      }).setOrigin(0.5);

      container.add([bg, emojiText, labelText, subText]);
      container.bg = bg;
      container.baseColor = baseColor;
      container.hoverColor = hoverColor;

      bg.on('pointerover', () => {
        bg.setFillStyle(hoverColor);
        this.tweens.add({ targets: container, scale: 1.03, duration: 150 });
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(baseColor);
        this.tweens.add({ targets: container, scale: 1, duration: 150 });
      });
      bg.on('pointerdown', () => {
        bg.setFillStyle(baseColor);
        this.tweens.add({ targets: container, scale: 0.97, duration: 80, yoyo: true });
        this.cameras.main.shake(80, 0.004);
        playSfx('click');
        onClick();
      });
      bg.on('pointerup', () => bg.setFillStyle(hoverColor));

      return container;
    }

    loadSave() {
      if (typeof window === 'undefined') return null;
      try {
        const raw = window.localStorage.getItem(SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    }

    save() {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
      } catch {}
    }

    updateUI() {
      const s = this.state;
      const tier = TIERS[s.tier] || TIERS.basic;

      if (this.statMoney.displayValue !== s.money) {
        this.animateNumber(this.statMoney, this.statMoney.displayValue, s.money, 'Rp ');
      }
      this.statRep.valueText.setText(`${s.reputation}`);
      this.statDay.valueText.setText(`${s.day} / ${MAX_DAY}`);

      this.relItems.forEach(({ key, val }) => {
        const v = s.relationship[key] ?? 0;
        val.setText(`${v}`);
        if (v >= 60) val.setColor('#4ade80');
        else if (v >= 30) val.setColor('#fbbf24');
        else if (v >= 0) val.setColor('#cbd5e1');
        else val.setColor('#f87171');

        if (val._lastValue !== undefined && val._lastValue !== v) {
          val.setScale(1.3);
          this.tweens.add({ targets: val, scale: 1, duration: 300, ease: 'Back.easeOut' });
        }
        val._lastValue = v;
      });

      const maxE = tier.dailyEnergy;
      this.energyDots.forEach((dot, i) => {
        const isActive = i < s.energy;
        dot.setFillStyle(isActive ? 0xfbbf24 : 0x334155);
        dot.setAlpha(isActive ? 1 : 0.5);
      });
      this.energyText.setText(`${s.energy} / ${maxE}`);

      this.btnWork.setAlpha(s.energy >= 2 ? 1 : 0.4);
      this.btnChill.setAlpha(s.energy >= 1 ? 1 : 0.4);
      this.btnAd.setAlpha(s.energy >= 2 ? 1 : 0.4);

      // Update tangga visibility sesuai tier
      if (this.stairs) {
        this.stairs.setVisible(s.tier !== 'basic');
      }
    }

    log(msg, color = '#cbd5e1') {
      this.logText.setText(msg);
      this.logText.setColor(color);
      this.logText.setScale(1.08);
      this.tweens.add({ targets: this.logText, scale: 1, duration: 200, ease: 'Back.easeOut' });
    }

    floatingText(x, y, msg, color = '#4ade80') {
      const t = this.add.text(x, y, msg, {
        fontSize: '26px', color,
        fontFamily: FONT_BODY, fontStyle: 'bold',
        stroke: '#0f172a', strokeThickness: 4,
      }).setOrigin(0.5).setDepth(150);

      t.setScale(0.5);
      this.tweens.add({ targets: t, scale: 1.2, duration: 200, ease: 'Back.easeOut' });
      this.tweens.add({
        targets: t, y: y - 80, alpha: 0, duration: 900, delay: 200,
        ease: 'Cubic.easeOut',
        onComplete: () => t.destroy(),
      });
    }

    showAchievementToast(ach) {
      const W = this.scale.width;
      const toast = this.add.container(W / 2, 140).setDepth(300);

      const bg = this.add.rectangle(0, 0, 560, 80, 0xfbbf24, 1).setStrokeStyle(3, 0xf59e0b);
      const text = this.add.text(0, 0, `${ach.emoji}  ${ach.name.toUpperCase()}`, {
        fontSize: '13px', color: '#0f172a',
        fontFamily: FONT_PIXEL,
      }).setOrigin(0.5);

      toast.add([bg, text]);
      toast.setAlpha(0);
      toast.y = 100;
      toast.setScale(0.8);

      this.tweens.add({
        targets: toast, alpha: 1, y: 140, scale: 1,
        duration: 500, ease: 'Back.easeOut',
      });

      this.confettiBurst(W / 2, 180);

      this.tweens.add({
        targets: toast, alpha: 0, y: 100, scale: 0.9,
        duration: 400, delay: 2500,
        onComplete: () => toast.destroy(),
      });

      playSfx('achievement');
    }

    checkAndToastAchievements() {
      const newlyUnlocked = checkAchievements(this.state, this.state.achievements);
      newlyUnlocked.forEach((ach, i) => {
        this.time.delayedCall(i * 1000, () => this.showAchievementToast(ach));
      });
      if (newlyUnlocked.length > 0) this.save();
    }

    hasEnergy(cost) {
      if (this.state.energy < cost) {
        playSfx('bad');
        this.log(`⚡ Energi kurang! Butuh ${cost}, punya ${this.state.energy}.`, '#f87171');
        this.cameras.main.shake(200, 0.008);
        return false;
      }
      return true;
    }

    doWork() {
      if (!this.hasEnergy(2)) return;
      this.state.energy -= 2;
      this.state.money += 200;
      this.state.peace -= 5;
      playSfx('coin');
      this.coinBurst(640, 400);
      this.floatingText(400, 400, '+Rp 200', '#4ade80');
      this.log(`💼 Kerja. -2⚡, +Rp 200, -5😌`, '#4ade80');
      this.cameras.main.shake(120, 0.005);
      this.updateUI();
      this.save();
      this.checkAndToastAchievements();
    }

    doChill() {
      if (!this.hasEnergy(1)) return;
      this.state.energy -= 1;
      this.state.peace = Math.min(100, this.state.peace + 15);
      playSfx('dialog');
      this.floatingText(400, 400, '+15 😌', '#60a5fa');
      this.log(`☕ Santai. -1⚡, +15😌`, '#60a5fa');
      this.tweens.add({
        targets: this.cameras.main, zoom: 1.02, duration: 200, yoyo: true,
        ease: 'Sine.easeInOut',
      });
      this.updateUI();
      this.save();
    }

    doAdvertise() {
      if (!this.hasEnergy(2)) return;
      if (this.state.money < 100) {
        playSfx('bad');
        this.log('❌ Uang ga cukup buat iklan.', '#f87171');
        this.cameras.main.shake(200, 0.008);
        return;
      }
      this.state.energy -= 2;
      this.state.money -= 100;
      playSfx('click');

      const tier = TIERS[this.state.tier];
      if (this.state.tenantCount < tier.maxTenants) {
        const evtId = this.state.hasTenant ? pickEvent(this.state) : 'firstTenant';
        if (evtId) {
          this.state.currentEvent = evtId;
          this.state.eventShown = false;
          playSfx('door');
          this.time.delayedCall(400, () => this.showEvent(evtId));
        } else {
          this.log('😞 Belum ada yang minat.', '#fbbf24');
        }
      } else {
        this.log('🏠 Kos penuh! Upgrade dulu.', '#fbbf24');
      }
      this.updateUI();
      this.save();
    }

    doUpgrade() {
      const s = this.state;
      const next = nextTier(s.tier);

      if (!next) {
        playSfx('bad');
        this.log('🏰 Kos lu udah paling elit!', '#fbbf24');
        return;
      }
      if (s.money < next.upgradeCost) {
        playSfx('bad');
        this.log(`❌ Butuh Rp ${next.upgradeCost} buat upgrade.`, '#f87171');
        this.cameras.main.shake(200, 0.008);
        return;
      }

      s.money -= next.upgradeCost;
      s.tier = next.id;
      s.reputation += next.bonusReputation;

      playSfx('upgrade');
      this.cameras.main.flash(500, 255, 215, 0);
      this.cameras.main.shake(300, 0.01);
      this.coinBurst(640, 400);

      const flash = this.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.6).setDepth(300);
      this.tweens.add({
        targets: flash, alpha: 0, duration: 600,
        onComplete: () => flash.destroy(),
      });

      // Munculin tangga kalau baru upgrade dari basic
      if (this.state.tier === 'comfort' && !this.stairs && this.textures.exists('furniture_stairs')) {
        this.stairs = this.add.image(40 + (W - 80) - 140, 168 + 352 - 100, 'furniture_stairs')
          .setOrigin(1, 1)
          .setScale(2);
        this.stairs.setAlpha(0);
        this.tweens.add({ targets: this.stairs, alpha: 1, duration: 600 });
      }

      this.log(`${next.emoji} Upgrade ke ${next.name}! Sewa Rp ${next.rentPerDay}/hari.`, '#fbbf24');
      this.updateUI();
      this.save();
      this.checkAndToastAchievements();
    }

    doSleep() {
      const s = this.state;
      const tier = TIERS[s.tier];

      if (s.money < tier.dailyCost) {
        playSfx('bad');
        this.log(`❌ Ga bisa tidur! Butuh Rp ${tier.dailyCost} buat biaya hidup.`, '#f87171');
        this.cameras.main.shake(200, 0.008);
        return;
      }

      const sleepOverlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0).setDepth(400);
      this.tweens.add({
        targets: sleepOverlay, alpha: 1, duration: 500,
        onComplete: () => {
          const leftoverEnergy = s.energy;
          const bonusPeace = leftoverEnergy * 2;

          s.money -= tier.dailyCost;
          if (bonusPeace > 0) s.peace = Math.min(100, s.peace + bonusPeace);

          s.day++;
          playSfx('dayEnd');
          s.energy = tier.dailyEnergy;

          if (s.tenantCount > 0) {
            const baseIncome = tier.rentPerDay * s.tenantCount;
            const repBonus = Math.floor(s.reputation * 5);
            const income = baseIncome + repBonus;
            s.money += income;
            this.log(`😴 Hari ${s.day}. Hidup -Rp ${tier.dailyCost}, Sewa +Rp ${income}.`, '#4ade80');
            this.coinBurst(640, 400);
          } else {
            this.log(`😴 Hari ${s.day}. Hidup -Rp ${tier.dailyCost}. Belum ada penyewa.`, '#94a3b8');
          }

          this.tweens.add({
            targets: sleepOverlay, alpha: 0, duration: 500,
            onComplete: () => sleepOverlay.destroy(),
          });

          if (s.day === MID_EVAL_DAY + 1 && s.money < MID_EVAL_MIN_MONEY) {
            this.time.delayedCall(300, () => this.forceEnding('midfail'));
            return;
          } else if (s.day === MID_EVAL_DAY + 1) {
            this.log(`✅ Lolos evaluasi tengah! Uang Rp ${s.money}.`, '#4ade80');
          }

          this.time.delayedCall(800, () => {
            const evtId = pickEvent(s);
            if (evtId) {
              s.currentEvent = evtId;
              s.eventShown = false;
              this.showEvent(evtId);
            }
          });

          this.checkAndToastAchievements();

          if (s.day > MAX_DAY) {
            this.time.delayedCall(1000, () => this.goToEnding());
            return;
          }

          this.updateUI();
          this.save();
        },
      });
    }

    showEvent(eventId) {
      const evt = EVENTS[eventId];
      if (!evt) {
        this.log('⚠️ Event belum ada: ' + eventId, '#f87171');
        return;
      }

      // Munculin Bu RT kalau event-nya dari Bu RT
      if (evt.character === 'burt' && this.burtSprite) {
        this.burtSprite.setAlpha(1);
      }

      const W = this.scale.width;
      const H = this.scale.height;
      const modal = this.add.container(W / 2, H / 2).setDepth(100);

      const dim = this.add.rectangle(0, 0, W * 2, H * 2, 0x000000, 0.7);

      const modalW = 900;
      const modalH = 520;
      const bg = this.add.rectangle(0, 0, modalW, modalH, 0x0f172a, 0.98)
        .setStrokeStyle(3, 0x4f46e5);

      const char = CHARACTERS[evt.character];
      const charSprite = this.add.image(-modalW / 2 + 100, -modalH / 2 + 100, char.texture).setScale(1.1);

      const nameText = this.add.text(-modalW / 2 + 180, -modalH / 2 + 60, char.name, {
        fontSize: '14px', color: '#fbbf24',
        fontFamily: FONT_PIXEL,
      });

      const roleText = this.add.text(-modalW / 2 + 180, -modalH / 2 + 88, char.role, {
        fontSize: '13px', color: '#94a3b8',
        fontFamily: FONT_BODY,
      });

      modal.add([dim, bg, charSprite, nameText, roleText]);

      let dialogY = -modalH / 2 + 150;
      evt.dialog.forEach((line) => {
        const t = this.add.text(-modalW / 2 + 60, dialogY, `"${line}"`, {
          fontSize: '16px', color: '#e2e8f0',
          fontFamily: FONT_BODY,
          wordWrap: { width: modalW - 120 },
        });
        modal.add(t);
        dialogY += 30;
      });

      const choiceStartY = dialogY + 24;
      const choiceH = 50;
      const choiceGap = 10;
      evt.choices.forEach((choice, i) => {
        const y = choiceStartY + i * (choiceH + choiceGap) + choiceH / 2;
        const btnW = modalW - 120;

        const btn = this.add
          .rectangle(0, y, btnW, choiceH, 0x4f46e5)
          .setStrokeStyle(2, 0x6366f1)
          .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(0, y, choice.text, {
          fontSize: '15px', color: '#ffffff',
          fontFamily: FONT_BODY,
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setFillStyle(0x6366f1));
        btn.on('pointerout',  () => btn.setFillStyle(0x4f46e5));
        btn.on('pointerdown', () => {
          playSfx('dialog');
          this.applyChoice(choice);
          modal.destroy();
          if (this.burtSprite) this.burtSprite.setAlpha(0);
        });

        modal.add([btn, btnText]);
      });

      modal.setAlpha(0);
      modal.setScale(0.9);
      this.tweens.add({
        targets: modal, alpha: 1, scale: 1,
        duration: 400, ease: 'Back.easeOut',
      });

      this.state.eventShown = true;
      this.save();
    }

    applyChoice(choice) {
      const e = choice.effects || {};
      const s = this.state;

      if (e.money) {
        s.money += e.money;
        this.floatingText(640, 400,
          `${e.money > 0 ? '+' : ''}Rp ${e.money}`,
          e.money > 0 ? '#4ade80' : '#f87171');
        if (e.money > 0) this.coinBurst(640, 400);
      }
      if (e.reputation) s.reputation += e.reputation;
      if (e.peace) s.peace = Math.max(0, Math.min(100, s.peace + e.peace));

      if (e.tenant) {
        const tier = TIERS[s.tier];
        if (s.tenantCount < tier.maxTenants) {
          s.tenantCount++;
          s.hasTenant = true;
        }
      }

      if (e.upgrade) {
        const next = nextTier(s.tier);
        if (next && s.money >= next.upgradeCost) {
          s.money -= next.upgradeCost;
          s.tier = next.id;
          s.reputation += next.bonusReputation;
          this.cameras.main.flash(500, 255, 215, 0);
        }
      }

      if (e.relationship) {
        Object.entries(e.relationship).forEach(([key, delta]) => {
          s.relationship[key] = Math.max(-50, Math.min(100, (s.relationship[key] || 0) + delta));
        });
      }

      playSfx(e.money > 0 ? 'coin' : 'dialog');
      this.log(`➡️ ${choice.result}`, '#cbd5e1');

      s.currentEvent = null;
      s.eventShown = true;

      this.updateUI();
      this.save();
      this.checkAndToastAchievements();
    }

    goToEnding() {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.time.delayedCall(800, () => {
        this.scene.start('EndingScene', { state: this.state });
      });
    }

    forceEnding(reason) {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.time.delayedCall(800, () => {
        this.scene.start('EndingScene', { state: this.state, forceReason: reason });
      });
    }
  };
}