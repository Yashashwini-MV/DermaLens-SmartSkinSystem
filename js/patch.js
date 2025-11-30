// patch.js
// Inpainting-style skin patch:
// - Detect very red "scar/burn" pixels
// - Replace them with the average color of nearby healthy skin
// - Compute once when fist is shown, so it doesn't shake

class PatchModule {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.patchEnabled = false;
    this.patchedImage = null; // ImageData with patch applied
    this.needsCompute = false;
  }

  // pose is "fist" (apply), "open" (clear). "both-open" handled in main.
  handlePose(pose /*, faceLandmarks */) {
    if (pose === "fist") {
      // Only trigger ONCE when we start patching
      if (!this.patchEnabled) {
        this.patchEnabled = true;
        this.needsCompute = true; // recompute patch on next draw
      }
    } else if (pose === "open") {
      // Remove patch & go back to live feed
      this.patchEnabled = false;
      this.patchedImage = null;
      this.needsCompute = false;
    }
  }

  draw(/* faceLandmarks */) {
    if (!this.patchEnabled) return;

    const ctx = this.ctx;
    const canvas = this.canvas;
    const w = canvas.width;
    const h = canvas.height;

    // First time after fist → compute patched image from the current frame
    if (this.needsCompute) {
      this.needsCompute = false;
      try {
        const frame = ctx.getImageData(0, 0, w, h);
        const patched = this.computePatch(frame, w, h);
        if (patched) {
          this.patchedImage = patched;
        } else {
          this.patchedImage = null;
          this.patchEnabled = false; // nothing to do
        }
      } catch (e) {
        console.error("Patch compute failed:", e);
        this.patchedImage = null;
        this.patchEnabled = false;
      }
    }

    if (this.patchedImage) {
      // Draw the already-computed patched frame each time: no jitter.
      ctx.putImageData(this.patchedImage, 0, 0);
    }
  }

  // ----- Core patch logic -----
  // frame: ImageData, returns new ImageData or null
  computePatch(frame, w, h) {
    const src = frame.data;
    const totalPixels = w * h;

    // 1) Build a simple "scar" mask based on redness
    // redness = R - max(G,B)
    const scarMask = new Uint8Array(totalPixels); // 1 = scar, 0 = normal

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r = src[idx];
      const g = src[idx + 1];
      const b = src[idx + 2];

      const redness = r - Math.max(g, b);

      // Tuned for strong red marks (your demo stripe)
      if (redness > 38 && r > 70) {
        scarMask[i] = 1;
      }
    }

    // If almost nothing is marked as scar, bail out
    let scarCount = 0;
    for (let i = 0; i < totalPixels; i++) {
      if (scarMask[i]) scarCount++;
    }
    if (scarCount < 80) {
      // no obvious scar region
      return null;
    }

    // 2) Clean up mask: remove isolated noise (simple majority filter)
    const cleaned = new Uint8Array(totalPixels);
    const w1 = w - 1;
    const h1 = h - 1;

    for (let y = 1; y < h1; y++) {
      for (let x = 1; x < w1; x++) {
        let count = 0;
        for (let yy = -1; yy <= 1; yy++) {
          for (let xx = -1; xx <= 1; xx++) {
            const nx = x + xx;
            const ny = y + yy;
            const ni = ny * w + nx;
            if (scarMask[ni]) count++;
          }
        }
        const i = y * w + x;
        cleaned[i] = count >= 4 ? 1 : 0;
      }
    }

    // 3) Create patched image, starting from original frame
    const out = new Uint8ClampedArray(src);

    // Slightly larger neighborhood → smoother, more “skin” feel
    const R = 7;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!cleaned[i]) continue; // not scar → leave as is

        let sumR = 0, sumG = 0, sumB = 0, cnt = 0;

        // Sample nearby NON-scar pixels
        for (let yy = -R; yy <= R; yy++) {
          const ny = y + yy;
          if (ny < 0 || ny >= h) continue;
          for (let xx = -R; xx <= R; xx++) {
            const nx = x + xx;
            if (nx < 0 || nx >= w) continue;

            const j = ny * w + nx;
            if (cleaned[j]) continue; // skip scar pixels

            const idx2 = j * 4;
            sumR += src[idx2];
            sumG += src[idx2 + 1];
            sumB += src[idx2 + 2];
            cnt++;
          }
        }

        if (cnt === 0) continue; // fail-safe

        const idx = i * 4;
        const newR = sumR / cnt;
        const newG = sumG / cnt;
        const newB = sumB / cnt;

        // Stronger replacement so it looks more like clean skin
        const alpha = 0.95; // 95% healthy skin, 5% original

        const oldR = src[idx];
        const oldG = src[idx + 1];
        const oldB = src[idx + 2];

        out[idx]     = oldR * (1 - alpha) + newR * alpha;
        out[idx + 1] = oldG * (1 - alpha) + newG * alpha;
        out[idx + 2] = oldB * (1 - alpha) + newB * alpha;
      }
    }

    return new ImageData(out, w, h);
  }

  resetState() {
    this.patchEnabled = false;
    this.patchedImage = null;
    this.needsCompute = false;
  }
}

window.PatchModule = PatchModule;
