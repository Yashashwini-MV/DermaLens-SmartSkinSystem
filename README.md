# 🌿 DermaLens-AI — Touch-Free Skin Analysis, Makeup Overlay & Skin Patch Restoration

A real-time AI system that analyzes skin, applies virtual makeup, and reconstructs damaged skin —  
**without touching the screen, using only gestures.**  
Powered by **OpenCV + MediaPipe + Computer Vision.**

---

## 🚀 Overview

**DermaLens-AI** is a gesture-controlled dermatological system designed for hygienic and inclusive beauty try-ons.  
It evaluates skin condition, applies cosmetic overlays, and restores scarred/burnt areas using a **healthy-skin patch extraction algorithm** with inpainting.

Built for individuals who avoid physical testers due to allergies, infection risk, or insecurity —  
and for beauty stores & clinics seeking touch-free innovation.

---

## 🧠 Features

| Feature | Description |
|--------|-------------|
| 🔍 **Skin Analysis** | Detects tone, dryness/oiliness, acne clusters, pigmentation & dark circles |
| 💄 **Makeup Overlay (Virtual Try-On)** | Natural lipstick, blush & eyeshadow mapped in real time |
| ✨ **Skin Patch Reconstruction** | Rebuilds burnt/damaged skin using seamless texture inpainting |
| 🖐 **Gesture Control UI** | Apply/remove effects & switch modes with hand gestures only |
| 🎥 **Live Computer Vision Pipeline** | Real-time rendering at 30+ FPS on a standard webcam |

---

## 🏗 Technology Stack

| Category | Tools Used |
|---------|------------|
| **Computer Vision** | OpenCV, MediaPipe (FaceMesh + Hands) |
| **Programming Language** | Python |
| **Image Repair System** | Telea + Poisson Inpainting |
| **Makeup Rendering** | Pixel recoloring + alpha feather blend |
| **UI Output** | Web/Local frame display |

---

## 🔬 How It Works

Webcam → Face + Hand Tracking
→ Landmark Mapping
→ Mode Selection (Analysis / Makeup / Patch)
→ Real-time Render Output

yaml
Copy code

---

### 🔍 Skin Analysis Engine

- Uses **468 facial landmarks**
- Reads LAB + HSV values from skin surface
- Detects **acne, pigmentation, redness, dark circles**
- Highlights **T-zone oiliness** and tone variation
- Converts raw pixels to visual skin score inference

---

### 💄 Makeup Overlay Module (Virtual Try-On)

| Layer | Method |
|-------|--------|
| Lipstick | Hue shift + saturation boost + feathered edge mask |
| Blush | Gaussian-soft cheek tint mapped through region mesh |
| Eyeshadow | Gradient overlay blended over eyelid landmarks |
| Shade Switch | Fist gesture cycles between color palettes |
| Reset | Open palm clears all applied makeup |

Makeup dynamically follows head movement — full landmark-tracked rendering.

---

### ✨ Skin Patch Reconstruction (Signature Feature)

1. Identify damaged areas using **LAB a\*-channel anomaly scoring**
2. Validate region using face mask + contour thresholds
3. Extract nearby healthy skin pixels
4. Restore region using **OpenCV inpainting algorithms**
5. Blend edges for smooth, natural healing preview

> A gentle visual preview of recovery — not concealment, but confidence.

---

## 🧪 Gesture Mapping

| Gesture | Action |
|--------|--------|
| ✊ Fist | Apply makeup / Switch shade / Trigger patch |
| 🖐 Open Palm | Clear overlays + remove patch |
| 👐 Both Hands | Return to home mode |

---

## 📥 Installation

```bash
git clone https://github.com/YourRepoName/DermaLens-AI.git
cd DermaLens-AI
pip install -r requirements.txt
python app.py   # or main.py
🌍 Use Cases
Scenario	Impact
🛍 Touch-Free Cosmetic Trials	Try lipstick/blush instantly without testers
🧑‍⚕️ Scar/Burn Patch Preview	Visual healing & confidence restoration
🧪 Dermatology Evaluation	Acne, dark circles, oil levels, tone mapping
🤖 Raspberry Pi Deployment	Lightweight, offline edge inference
✋ Contactless Interaction	Hygienic — no touching required
🎭 Personal Confidence Boost	Beauty & healing visualized safely

👩‍💻 Contributors
Name	Primary Contributions
Yashashwini M V	Gesture Recognition • Patch System • Integration
S Pavithra Devi	Makeup Rendering • Interaction Flow • UI Refinement
Ananya A	Skin Analysis Logic • LAB Evaluation • Landmark Metrics

⭐ Why DermaLens Matters
Beauty should not require courage.
Confidence should not require touch.
AI should not replace appearance — it should restore comfort.
