// analysis.js
// Simple skin analysis using average color + contrast around face region

class SkinAnalysisModule {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lastAnalysisTime = 0;
    this.analysisInterval = 2000; // ms
  }

  analyzeIfNeeded(faceLandmarks) {
    const now = performance.now();
    if (now - this.lastAnalysisTime < this.analysisInterval) return;
    if (!faceLandmarks || faceLandmarks.length === 0) return;

    this.lastAnalysisTime = now;
    this.analyze(faceLandmarks);
  }

  analyze(faceLandmarks) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    faceLandmarks.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });

    const x = Math.floor(minX * w);
    const y = Math.floor(minY * h);
    const width = Math.max(1, Math.floor((maxX - minX) * w));
    const height = Math.max(1, Math.floor((maxY - minY) * h));

    const imgData = ctx.getImageData(x, y, width, height);
    const data = imgData.data;

    let sumR = 0, sumG = 0, sumB = 0;
    let sumGray = 0, sumGraySq = 0;
    let count = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      sumR += r;
      sumG += g;
      sumB += b;

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      sumGray += gray;
      sumGraySq += gray * gray;
    }

    const avgGray = sumGray / count;
    const variance = sumGraySq / count - avgGray * avgGray;
    const contrast = Math.sqrt(Math.max(variance, 0));

    const tone = this.classifyTone(avgGray);
    const type = this.classifyType(contrast, avgGray);
    const acne = this.estimateAcne(imgData);
    const tzone = this.estimateTZone(faceLandmarks);

    this.updateUI({ type, tone, acne, tzone });
  }

  classifyTone(avgGray) {
    if (avgGray < 80) return "Dark";
    if (avgGray < 150) return "Medium";
    return "Bright";
  }

  classifyType(contrast, avgGray) {
    if (contrast > 60 && avgGray > 80) return "Oily";
    if (contrast < 35) return "Dry";
    return "Normal / Combination";
  }

  estimateAcne(imgData) {
    const data = imgData.data;
    let redSpots = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r > 140 && r > g + 25 && r > b + 25) {
        redSpots++;
      }
    }

    const density = redSpots / (data.length / 4);

    if (density > 0.05) return "High";
    if (density > 0.02) return "Moderate";
    if (density > 0.005) return "Mild";
    return "Low / None";
  }

  estimateTZone(faceLandmarks) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    const foreheadIdx = 10;
    const leftCheekIdx = 234;
    const rightCheekIdx = 454;

    const sample = lm => {
      const x = Math.floor(lm.x * w);
      const y = Math.floor(lm.y * h);
      const s = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = s;
      return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    const f = sample(faceLandmarks[foreheadIdx]);
    const lc = sample(faceLandmarks[leftCheekIdx]);
    const rc = sample(faceLandmarks[rightCheekIdx]);

    const cheeksAvg = (lc + rc) / 2;

    if (f - cheeksAvg > 10) return "Pronounced T-zone";
    return "Balanced / Mild T-zone";
  }

  updateUI({ type, tone, acne, tzone }) {
    document.getElementById("sa-type").textContent = type;
    document.getElementById("sa-tone").textContent = tone;
    document.getElementById("sa-acne").textContent = acne;
    document.getElementById("sa-tzone").textContent = tzone;

    const recEl = document.getElementById("sa-recommendations");
    recEl.innerHTML = "";

    const recs = [];

    if (type === "Oily") {
      recs.push("Use gentle foaming cleanser twice a day.");
      recs.push("Choose non-comedogenic, oil-free moisturizer.");
      recs.push("Use salicylic acid spot treatment for acne.");
    } else if (type === "Dry") {
      recs.push("Use hydrating creamy cleanser.");
      recs.push("Apply thick moisturizer with ceramides.");
      recs.push("Avoid harsh scrubs and alcohol toners.");
    } else {
      recs.push("Use gentle cleanser and light moisturizer.");
      recs.push("Use sunscreen SPF 30+ every day.");
    }

    if (acne === "High" || acne === "Moderate") {
      recs.push("Consult dermatologist for routine if acne persists.");
    }

    recs.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      recEl.appendChild(li);
    });
  }
}

window.SkinAnalysisModule = SkinAnalysisModule;
