// makeup.js
// Lipstick + blush with natural nude / pastel shades and gesture control.

class MakeupModule {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.lipstickOn = false;
    this.blushOn = false;

    // Shades (your 3 + 3 more)
    this.shades = [
      { r: 180, g: 76,  b: 67  }, // soft red
      { r: 225, g:170,  b:150 }, // peach nude
      { r: 190, g:115,  b:120 }, // dusty rose
      { r: 205, g:135,  b:125 }, // warm rose nude
      { r: 198, g:110,  b: 90 }, // soft terracotta
      { r: 220, g:150,  b:170 }  // pinky mauve
    ];

    this.shadeIndex = 0;
    this.lastPose = null;
  }

  handleGestures(faceLandmarks, hand, poseHand, isPointing) {
    if (!faceLandmarks || !hand || !hand.landmarks) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const handLm = hand.landmarks;

    if (poseHand === "fist" && this.lastPose !== "fist") {
      this.nextShade();
    }

    if (poseHand === "open") {
      this.lipstickOn = false;
      this.blushOn = false;
    }

    if (isPointing) {
      const tip = handLm[8];
      const fx = tip.x * w;
      const fy = tip.y * h;

      const lipRef = faceLandmarks[61];
      const leftCheekRef = faceLandmarks[234];
      const rightCheekRef = faceLandmarks[454];

      const dist = (lm, x, y) => {
        const lx = lm.x * w;
        const ly = lm.y * h;
        return Math.hypot(lx - x, ly - y);
      };

      const lipDist = dist(lipRef, fx, fy);
      const cheekDist = Math.min(
        dist(leftCheekRef, fx, fy),
        dist(rightCheekRef, fx, fy)
      );

      const base = Math.min(w, h);
      const LIP_R   = 0.07 * base;
      const CHEEK_R = 0.09 * base;

      if (lipDist < LIP_R) {
        this.lipstickOn = true;
      } else if (cheekDist < CHEEK_R) {
        this.blushOn = true;
      }
    }

    this.lastPose = poseHand;
  }

  nextShade() {
    this.shadeIndex = (this.shadeIndex + 1) % this.shades.length;
  }

  draw(faceLandmarks) {
    if (!faceLandmarks) return;
    if (this.lipstickOn) this.drawLips(faceLandmarks);
    if (this.blushOn)    this.drawBlush(faceLandmarks);
  }

  drawLips(lm) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const s = this.shades[this.shadeIndex];

    const lipIndices = [
      61,185,40,39,37,0,267,269,270,409,291,375,321,405,314,17,84,181,91,146
    ];

    ctx.save();
    ctx.filter = "blur(1.3px)";
    ctx.beginPath();

    let first = true;
    lipIndices.forEach(idx => {
      const p = lm[idx];
      const x = p.x * w;
      const y = p.y * h;
      if (first) {
        ctx.moveTo(x, y);
        first = false;
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fillStyle = `rgba(${s.r}, ${s.g}, ${s.b}, 0.55)`;
    ctx.fill();
    ctx.restore();
  }

  drawBlush(lm) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const s = this.shades[this.shadeIndex];

    const cheekIds = [234, 454];
    const maxR = 0.075 * Math.min(w, h);

    cheekIds.forEach(id => {
      const p = lm[id];
      const x = p.x * w;
      const y = p.y * h;

      const g = ctx.createRadialGradient(x, y, maxR * 0.2, x, y, maxR);
      const baseColor = `rgba(${s.r}, ${s.g}, ${s.b},`;

      g.addColorStop(0, `${baseColor}0.30)`);
      g.addColorStop(1, `${baseColor}0.00)`);

      ctx.save();
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, maxR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

window.MakeupModule = MakeupModule;
