import { CHARACTERS, relLabel } from '../data/characters';
import { EVENTS, pickEvent } from '../data/events';
import { TIERS, nextTier } from '../data/apartments';
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements';
import { playSfx } from '../sound';

const SAVE_KEY = 'kos-jakarta-save-v1';
const MAX_DAY = 30;
const MID_EVAL_DAY = 15;
const MID_EVAL_MIN_MONEY = 3000;

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
        energy: TIERS.basic.dailyEnergy,   // ← BARU
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

      // ===== BACKGROUND =====
      this.add.rectangle(W / 2, H / 2 - 100, W, 400, 0x334155);
      this.add.rectangle(W / 2, H - 100, W, 200, 0x78350f);

      this.add.rectangle(120, 100, 140, 100, 0x0ea5e9).setStrokeStyle(4, 0x1e293b);
      this.add.rectangle(680, 100, 140, 100, 0x0ea5e9).setStrokeStyle(4, 0x1e293b);

      // ===== KARAKTER MC =====
      this.mc = this.add.image(180, 400, CHARACTERS.mc.texture).setScale(1.2);
      this.tweens.add({
        targets: this.mc,
        y: 390,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // ===== UI =====
      this.uiText = this.add.text(20, 20, '', {
        fontSize: '16px', color: '#f1f5f9',
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      });

      this.energyText = this.add.text(20, 42, '', {
        fontSize: '14px', color: '#fbbf24',
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      });

      this.tierText = this.add.text(20, 62, '', {
        fontSize: '12px', color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
      });

      this.relText = this.add.text(20, 80, '', {
        fontSize: '11px', color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
      });

      this.dayBar = this.add.text(W - 20, 20, '', {
        fontSize: '14px', color: '#fbbf24',
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      }).setOrigin(1, 0);

      this.warningText = this.add.text(W - 20, 42, '', {
        fontSize: '11px', color: '#f87171',
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      }).setOrigin(1, 0);

      this.logText = this.add.text(W / 2, H - 20, '', {
        fontSize: '14px', color: '#cbd5e1',
        fontFamily: 'system-ui, sans-serif',
      }).setOrigin(0.5);

      // ===== BUTTONS =====
      const btnY = 540;
      const btnW = 145;
      const btnH = 50;
      const gap = 8;
      const totalW = btnW * 5 + gap * 4;
      const startX = (W - totalW) / 2 + btnW / 2;

      this.btnWork = this.createButton(startX + (btnW + gap) * 0, btnY, btnW, btnH, '💼 Kerja (-2⚡)', () => this.doWork());
      this.btnChill = this.createButton(startX + (btnW + gap) * 1, btnY, btnW, btnH, '☕ Santai (-1⚡)', () => this.doChill());
      this.btnAd = this.createButton(startX + (btnW + gap) * 2, btnY, btnW, btnH, '📢 Iklan (-2⚡)', () => this.doAdvertise());
      this.btnUpgrade = this.createButton(startX + (btnW + gap) * 3, btnY, btnW, btnH, '🏗️ Upgrade', () => this.doUpgrade());
      this.btnSleep = this.createButton(startX + (btnW + gap) * 4, btnY, btnW, btnH, '😴 Tidur', () => this.doSleep());

      this.updateUI();

      if (!this.state.eventShown && this.state.currentEvent) {
        this.time.delayedCall(600, () => this.showEvent(this.state.currentEvent));
      }
    }

    // ===== SAVE/LOAD =====
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

    // ===== UI =====
    updateUI() {
      const s = this.state;
      const tier = TIERS[s.tier] || TIERS.basic;
      this.uiText.setText(
        `💰 Rp ${s.money}   ⭐ ${s.reputation}   😌 ${s.peace}   👥 ${s.tenantCount}/${tier.maxTenants}`
      );
      this.energyText.setText(`⚡ Energi: ${s.energy} / ${tier.dailyEnergy}`);
      this.tierText.setText(`${tier.emoji} ${tier.name} · Sewa Rp ${tier.rentPerDay}/hari · Biaya hidup Rp ${tier.dailyCost}/hari`);
      this.relText.setText(
        `👩 Bu RT: ${s.relationship.burt}   🧔 Pak Haji: ${s.relationship.pakHaji}   🧑‍🎓 Dimas: ${s.relationship.tenant1}   🧑‍🍳 Sari: ${s.relationship.sari}   🧑‍💻 Bagas: ${s.relationship.bagas}`
      );
      this.dayBar.setText(`📅 Hari ${s.day} / ${MAX_DAY}`);

      // Warning deadline
      if (s.day >= MID_EVAL_DAY - 3 && s.day < MID_EVAL_DAY) {
        const daysLeft = MID_EVAL_DAY - s.day;
        this.warningText.setText(`⚠️ Evaluasi tengah dalam ${daysLeft} hari! Butuh Rp ${MID_EVAL_MIN_MONEY}.`);
      } else if (s.day < MID_EVAL_DAY) {
        this.warningText.setText(`🎯 Target Hari ${MID_EVAL_DAY}: Rp ${MID_EVAL_MIN_MONEY}`);
      } else {
        this.warningText.setText('');
      }

      // Disable tombol kalau energi kurang
      this.btnWork.setAlpha(s.energy >= 2 ? 1 : 0.4);
      this.btnChill.setAlpha(s.energy >= 1 ? 1 : 0.4);
      this.btnAd.setAlpha(s.energy >= 2 ? 1 : 0.4);
      this.btnSleep.setAlpha(s.energy > 0 ? 1 : 0.7); // tidur selalu bisa
    }

    log(msg, color = '#cbd5e1') {
      this.logText.setText(msg);
      this.logText.setColor(color);
    }

    // ===== BUTTON =====
    createButton(x, y, w, h, label, onClick) {
      const container = this.add.container(x, y);

      const bg = this.add
        .rectangle(0, 0, w, h, 0x4f46e5)
        .setStrokeStyle(2, 0x6366f1)
        .setInteractive({ useHandCursor: true });

      const text = this.add
        .text(0, 0, label, {
          fontSize: '13px', color: '#ffffff',
          fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
        })
        .setOrigin(0.5);

      container.add([bg, text]);
      container.bg = bg;
      container.label = text;

      bg.on('pointerover', () => bg.setFillStyle(0x6366f1));
      bg.on('pointerout',  () => bg.setFillStyle(0x4f46e5));
      bg.on('pointerdown', () => {
        bg.setFillStyle(0x4338ca);
        this.cameras.main.shake(80, 0.004);
        playSfx('click');
        onClick();
      });
      bg.on('pointerup', () => bg.setFillStyle(0x6366f1));

      return container;
    }

    // ===== FLOATING TEXT =====
    floatingText(x, y, msg, color = '#4ade80') {
      const t = this.add.text(x, y, msg, {
        fontSize: '20px', color,
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(50);

      this.tweens.add({
        targets: t, y: y - 60, alpha: 0, duration: 900,
        ease: 'Cubic.easeOut',
        onComplete: () => t.destroy(),
      });
    }

    // ===== ACHIEVEMENT =====
    showAchievementToast(ach) {
      const W = this.scale.width;
      const toast = this.add.container(W / 2, 130).setDepth(200);

      const bg = this.add.rectangle(0, 0, 500, 70, 0xfbbf24, 1)
        .setStrokeStyle(3, 0xf59e0b);

      const text = this.add.text(0, 0, `${ach.emoji}  Achievement: ${ach.name}`, {
        fontSize: '16px', color: '#0f172a',
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      }).setOrigin(0.5);

      toast.add([bg, text]);
      toast.setAlpha(0);
      toast.y = 100;

      this.tweens.add({ targets: toast, alpha: 1, y: 130, duration: 400 });
      this.tweens.add({
        targets: toast, alpha: 0, y: 100, duration: 400, delay: 2500,
        onComplete: () => toast.destroy(),
      });

      playSfx('levelup');
    }

    checkAndToastAchievements() {
      const newlyUnlocked = checkAchievements(this.state, this.state.achievements);
      newlyUnlocked.forEach((ach, i) => {
        this.time.delayedCall(i * 800, () => this.showAchievementToast(ach));
      });
      if (newlyUnlocked.length > 0) this.save();
    }

    // ===== HELPER: Cek energi =====
    hasEnergy(cost) {
      if (this.state.energy < cost) {
        playSfx('bad');
        this.log(`⚡ Energi kurang! Butuh ${cost}, punya ${this.state.energy}.`, '#f87171');
        return false;
      }
      return true;
    }

    // ===== ACTIONS =====
    doWork() {
      if (!this.hasEnergy(2)) return;
      this.state.energy -= 2;
      this.state.money += 200;
      this.state.peace -= 5;
      playSfx('coin');
      this.floatingText(180, 380, '+Rp 200');
      this.log(`💼 Kerja. -2⚡, +Rp 200, -5😌`, '#4ade80');
      this.updateUI();
      this.save();
      this.checkAndToastAchievements();
      this.checkAutoSleep();
    }

    doChill() {
      if (!this.hasEnergy(1)) return;
      this.state.energy -= 1;
      this.state.peace = Math.min(100, this.state.peace + 15);
      playSfx('dialog');
      this.floatingText(180, 380, '+15 😌', '#60a5fa');
      this.log(`☕ Santai. -1⚡, +15😌`, '#60a5fa');
      this.updateUI();
      this.save();
      this.checkAutoSleep();
    }

    doAdvertise() {
      if (!this.hasEnergy(2)) return;
      if (this.state.money < 100) {
        playSfx('bad');
        this.log('❌ Uang ga cukup buat iklan.', '#f87171');
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
      this.checkAutoSleep();
    }

    doUpgrade() {
      const s = this.state;
      const tier = TIERS[s.tier];
      const next = nextTier(s.tier);

      if (!next) {
        playSfx('bad');
        this.log('🏰 Kos lu udah paling elit!', '#fbbf24');
        return;
      }

      if (s.money < next.upgradeCost) {
        playSfx('bad');
        this.log(`❌ Butuh Rp ${next.upgradeCost} buat upgrade.`, '#f87171');
        return;
      }

      s.money -= next.upgradeCost;
      s.tier = next.id;
      s.reputation += next.bonusReputation;
      playSfx('levelup');
      this.cameras.main.flash(500, 255, 215, 0);
      this.log(`${next.emoji} Upgrade ke ${next.name}! Sewa Rp ${next.rentPerDay}/hari.`, '#fbbf24');
      this.updateUI();
      this.save();
      this.checkAndToastAchievements();
    }

    // ===== TIDUR (GANTI HARI) =====
    doSleep() {
      const s = this.state;
      const tier = TIERS[s.tier];

      // Cek uang cukup buat biaya hidup
      if (s.money < tier.dailyCost) {
        playSfx('bad');
        this.log(`❌ Ga bisa tidur! Butuh Rp ${tier.dailyCost} buat biaya hidup.`, '#f87171');
        return;
      }

      // Sisa energi = bonus ketenangan (tidur lebih lama = lebih tenang)
      const leftoverEnergy = s.energy;
      const bonusPeace = leftoverEnergy * 2;

      // Bayar biaya hidup
      s.money -= tier.dailyCost;

      // Sisa energi jadi bonus ketenangan
      if (bonusPeace > 0) {
        s.peace = Math.min(100, s.peace + bonusPeace);
      }

      // Ganti hari
      s.day++;
      playSfx('dayEnd');

      // Reset energi
      s.energy = tier.dailyEnergy;

      // Income dari tenant
      if (s.tenantCount > 0) {
        const baseIncome = tier.rentPerDay * s.tenantCount;
        const repBonus = Math.floor(s.reputation * 5);
        const income = baseIncome + repBonus;
        s.money += income;
        this.log(`😴 Tidur. Hari ${s.day}. Biaya hidup -Rp ${tier.dailyCost}. Sewa +Rp ${income}.`, '#4ade80');
      } else {
        this.log(`😴 Tidur. Hari ${s.day}. Biaya hidup -Rp ${tier.dailyCost}. Belum ada penyewa.`, '#94a3b8');
      }

      // ===== CEK EVALUASI TENGAH =====
      if (s.day === MID_EVAL_DAY + 1) {
        // Baru lewat evaluasi
        if (s.money < MID_EVAL_MIN_MONEY) {
          this.time.delayedCall(300, () => this.forceEnding('midfail'));
          return;
        } else {
          this.log(`✅ Lolos evaluasi tengah! Uang Rp ${s.money}.`, '#4ade80');
        }
      }

      // ===== EVENT WAJIB TIAP HARI =====
      this.time.delayedCall(400, () => {
        const evtId = pickEvent(s);
        if (evtId) {
          s.currentEvent = evtId;
          s.eventShown = false;
          this.showEvent(evtId);
        }
      });

      // Cek achievement
      this.checkAndToastAchievements();

      // Cek ending akhir
      if (s.day > MAX_DAY) {
        this.time.delayedCall(800, () => this.goToEnding());
        return;
      }

      this.updateUI();
      this.save();
    }

    // ===== AUTO SLEEP (kalau energi abis) =====
    checkAutoSleep() {
      if (this.state.energy <= 0 && !this.state.eventShown) {
        this.log('⚡ Energi abis! Lu harus tidur.', '#fbbf24');
      }
    }

    // ===== EVENT SYSTEM =====
    showEvent(eventId) {
      const evt = EVENTS[eventId];
      if (!evt) {
        this.log('⚠️ Event belum ada: ' + eventId, '#f87171');
        return;
      }

      const W = this.scale.width;
      const H = this.scale.height;
      const modal = this.add.container(W / 2, H / 2).setDepth(100);

      const bg = this.add.rectangle(0, 0, 720, 440, 0x0f172a, 0.97)
        .setStrokeStyle(3, 0x4f46e5);

      const char = CHARACTERS[evt.character];
      const charSprite = this.add.image(-270, -130, char.texture).setScale(0.9);

      const nameText = this.add.text(-200, -170, `${char.name} — ${char.role}`, {
        fontSize: '16px', color: '#fbbf24',
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      });

      modal.add([bg, charSprite, nameText]);

      let dialogY = -80;
      evt.dialog.forEach((line) => {
        const t = this.add.text(-200, dialogY, `"${line}"`, {
          fontSize: '15px', color: '#e2e8f0',
          fontFamily: 'system-ui, sans-serif',
          wordWrap: { width: 540 },
        });
        modal.add(t);
        dialogY += 28;
      });

      const choiceStartY = dialogY + 30;
      evt.choices.forEach((choice, i) => {
        const y = choiceStartY + i * 55;
        const btn = this.add
          .rectangle(0, y, 640, 45, 0x4f46e5)
          .setStrokeStyle(2, 0x6366f1)
          .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(0, y, choice.text, {
          fontSize: '15px', color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setFillStyle(0x6366f1));
        btn.on('pointerout',  () => btn.setFillStyle(0x4f46e5));
        btn.on('pointerdown', () => {
          playSfx('dialog');
          this.applyChoice(choice);
          modal.destroy();
        });

        modal.add([btn, btnText]);
      });

      modal.setAlpha(0);
      this.tweens.add({ targets: modal, alpha: 1, duration: 300 });

      this.state.eventShown = true;
      this.save();
    }

    applyChoice(choice) {
      const e = choice.effects || {};
      const s = this.state;

      if (e.money) {
        s.money += e.money;
        this.floatingText(400, 400,
          `${e.money > 0 ? '+' : ''}Rp ${e.money}`,
          e.money > 0 ? '#4ade80' : '#f87171');
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

    // ===== ENDING =====
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