// main.js

const MODES = {
  HOME: "home",
  ANALYSIS: "analysis",
  MAKEUP: "makeup",
  PATCH: "patch"
};

let currentMode = MODES.HOME;

let videoEl, canvasEl, ctx;
let faceMesh, hands, camera;

let skinAnalysisModule;
let makeupModule;
let patchModule;

let lastHands = [];
let lastFaceLandmarks = null;

window.addEventListener("DOMContentLoaded", () => {
  videoEl = document.getElementById("inputVideo");
  canvasEl = document.getElementById("outputCanvas");
  ctx = canvasEl.getContext("2d");

  resizeCanvas();

  skinAnalysisModule = new SkinAnalysisModule(canvasEl);
  makeupModule = new MakeupModule(canvasEl);
  patchModule = new PatchModule(canvasEl);

  initMediaPipe();
  initUI();
  initClock();
});

function resizeCanvas() {
  const rect = document.getElementById("video-container").getBoundingClientRect();
  canvasEl.width = rect.width;
  canvasEl.height = rect.height;
}

function initUI() {
  updateModeUI();
  window.addEventListener("resize", resizeCanvas);
}

function updateModeUI() {
  const labelEl = document.getElementById("mode-label");
  const instrEl = document.getElementById("instructions");

  const homeMenu = document.getElementById("home-menu");
  const analysisPanel = document.getElementById("analysis-panel");
  const makeupPanel = document.getElementById("makeup-panel");
  const patchPanel = document.getElementById("patch-panel");

  homeMenu.classList.add("hidden");
  analysisPanel.classList.add("hidden");
  makeupPanel.classList.add("hidden");
  patchPanel.classList.add("hidden");

  switch (currentMode) {
    case MODES.HOME:
      labelEl.textContent = "Home";
      instrEl.textContent =
        "Show 1 finger = Skin Analysis, 2 fingers = Makeup Overlay, 3 fingers = Skin Patch.";
      homeMenu.classList.remove("hidden");
      break;

    case MODES.ANALYSIS:
      labelEl.textContent = "Skin Analysis";
      instrEl.textContent =
        "Face will be scanned automatically. Show BOTH hands open to go back home.";
      analysisPanel.classList.remove("hidden");
      break;

    case MODES.MAKEUP:
      labelEl.textContent = "Makeup Overlay";
      instrEl.textContent =
        "Point to lips/cheeks. Fist = change shade. Open hand = clear. BOTH hands open = home.";
      makeupPanel.classList.remove("hidden");
      break;

    case MODES.PATCH:
      labelEl.textContent = "Skin Patch";
      instrEl.textContent =
        "Fist = cover patch. Open hand = remove. BOTH hands open = home.";
      patchPanel.classList.remove("hidden");
      break;
  }
}

// --------- MediaPipe setup ----------

function initMediaPipe() {
  faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(onFaceResults);

  hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 0,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  hands.onResults(onHandsResults);

  camera = new Camera(videoEl, {
    onFrame: async () => {
      await faceMesh.send({ image: videoEl });
      await hands.send({ image: videoEl });
      renderFrame();
    },
    width: 640,
    height: 360
  });

  camera.start();
}

function onFaceResults(results) {
  lastFaceLandmarks =
    results.multiFaceLandmarks && results.multiFaceLandmarks[0]
      ? results.multiFaceLandmarks[0]
      : null;
}

function onHandsResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length) {
    lastHands = results.multiHandLandmarks.map(lm => ({ landmarks: lm }));
  } else {
    lastHands = [];
  }
}

// ---------- Render loop ----------

function renderFrame() {
  const w = canvasEl.width;
  const h = canvasEl.height;

  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(videoEl, 0, 0, w, h);
  ctx.restore();

  handleModeLogic();

  if (currentMode === MODES.MAKEUP && lastFaceLandmarks) {
    makeupModule.draw(lastFaceLandmarks);
  }

  if (currentMode === MODES.PATCH && lastFaceLandmarks) {
    patchModule.draw(lastFaceLandmarks);
  }
}

function handleModeLogic() {
  const handsArr = lastHands || [];
  const hand = handsArr[0] || null;

  // BOTH hands open = go home
  if (currentMode !== MODES.HOME && handsArr.length >= 2) {
    const openCount = handsArr.filter(h => GestureUtils.isOpenHand(h)).length;
    if (openCount >= 2) {
      currentMode = MODES.HOME;
      patchModule.resetState();
      updateModeUI();
      return;
    }
  }

  if (!hand) {
    if (currentMode === MODES.ANALYSIS && lastFaceLandmarks) {
      skinAnalysisModule.analyzeIfNeeded(lastFaceLandmarks);
    }
    return;
  }

  const raised = GestureUtils.countRaisedFingers(hand);
  const isFist = GestureUtils.isFist(hand);
  const isOpen = GestureUtils.isOpenHand(hand);
  const isPointing = GestureUtils.isPointing(hand);

  switch (currentMode) {
    case MODES.HOME:
      if (raised === 1) {
        currentMode = MODES.ANALYSIS;
        updateModeUI();
      } else if (raised === 2) {
        currentMode = MODES.MAKEUP;
        updateModeUI();
      } else if (raised === 3) {
        currentMode = MODES.PATCH;
        updateModeUI();
      }
      break;

    case MODES.ANALYSIS:
      if (lastFaceLandmarks) {
        skinAnalysisModule.analyzeIfNeeded(lastFaceLandmarks);
      }
      break;

    case MODES.MAKEUP: {
      let pose = null;
      if (isFist) pose = "fist";
      else if (isOpen) pose = "open";

      makeupModule.handleGestures(
        lastFaceLandmarks,
        hand,
        pose,
        isPointing
      );
      break;
    }

    case MODES.PATCH: {
      let pose = null;
      if (isFist) pose = "fist";
      else if (isOpen) pose = "open";

      patchModule.handlePose(pose, lastFaceLandmarks);
      break;
    }
  }
}

// ---- Clock for left overlay ----
function initClock() {
  const clockEl = document.getElementById("home-clock");
  const dateEl = document.getElementById("home-date");
  if (!clockEl || !dateEl) return;

  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    clockEl.textContent = `${hh}:${mm}`;
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  tick();
  setInterval(tick, 30000);
}
