// gestures.js
// Utility functions to interpret MediaPipe Hands results

const FINGER_INDICES = {
  thumb:  [1, 2, 3, 4],
  index:  [5, 6, 7, 8],
  middle: [9,10,11,12],
  ring:   [13,14,15,16],
  pinky:  [17,18,19,20]
};

function isFingerUp(hand, fingerIndices) {
  const landmarks = hand.landmarks;
  if (!landmarks) return false;

  const [mcpIdx, pipIdx, , tipIdx] = fingerIndices;
  const pip = landmarks[pipIdx];
  const tip = landmarks[tipIdx];

  // y smaller = higher in image coordinates
  return tip.y < pip.y;
}

function countRaisedFingers(hand) {
  if (!hand || !hand.landmarks) return 0;

  let count = 0;
  if (isFingerUp(hand, FINGER_INDICES.index))  count++;
  if (isFingerUp(hand, FINGER_INDICES.middle)) count++;
  if (isFingerUp(hand, FINGER_INDICES.ring))   count++;
  if (isFingerUp(hand, FINGER_INDICES.pinky))  count++;

  return count;
}

function isFist(hand) {
  if (!hand || !hand.landmarks) return false;
  const lms = hand.landmarks;

  const fingers = [
    FINGER_INDICES.index,
    FINGER_INDICES.middle,
    FINGER_INDICES.ring,
    FINGER_INDICES.pinky
  ];

  return fingers.every(([mcpIdx, , , tipIdx]) => {
    const mcp = lms[mcpIdx];
    const tip = lms[tipIdx];
    return tip.y > mcp.y; // tips below MCP = curled
  });
}

function isOpenHand(hand) {
  if (!hand || !hand.landmarks) return false;
  const raised = countRaisedFingers(hand);
  return raised >= 3;
}

// index up, others mostly down
function isPointing(hand) {
  if (!hand || !hand.landmarks) return false;
  const raised = countRaisedFingers(hand);
  return raised === 1 && isFingerUp(hand, FINGER_INDICES.index);
}

function getIndexFingerTip(hand) {
  if (!hand || !hand.landmarks) return null;
  return hand.landmarks[8];
}

// optional swipe detector (not used now but kept)
class SwipeDetector {
  constructor(bufferSize = 4, threshold = 0.08) {
    this.bufferSize = bufferSize;
    this.threshold = threshold;
    this.positions = [];
  }

  update(hand) {
    if (!hand || !hand.landmarks) return null;
    const wrist = hand.landmarks[0];
    this.positions.push(wrist.x);
    if (this.positions.length > this.bufferSize) {
      this.positions.shift();
    }

    if (this.positions.length < this.bufferSize) return null;

    const start = this.positions[0];
    const end   = this.positions[this.positions.length - 1];
    const delta = start - end;

    if (delta > this.threshold) return "right-to-left";
    if (delta < -this.threshold) return "left-to-right";
    return null;
  }

  reset() {
    this.positions = [];
  }
}

window.GestureUtils = {
  countRaisedFingers,
  isFist,
  isOpenHand,
  SwipeDetector,
  isPointing,
  getIndexFingerTip
};
