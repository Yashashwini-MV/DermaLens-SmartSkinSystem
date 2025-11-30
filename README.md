# 🌿 DermaLens-AI — Touch-Free Skin Analysis, Makeup Overlay & Skin Patch Restoration

A real-time AI system that analyzes skin, applies virtual makeup, and reconstructs damaged skin —  
**without touching the screen, using only gestures.**  
Powered by **OpenCV + MediaPipe + Computer Vision.**

---

## 🚀 Overview

**DermaLens-AI** is a gesture-controlled dermatological system designed for hygienic and inclusive beauty try-ons.  
It evaluates skin condition, applies cosmetic overlays, and restores scarred / burnt areas using a **healthy-skin patch extraction algorithm** with inpainting.

Built for individuals who avoid physical testers due to allergies, infections, or insecurity —  
and for beauty stores & clinics seeking touch-free innovation.

---

## 🧠 Features

| Feature | Description |
|--------|-------------|
| 🔍 **Skin Analysis** | Detects tone, dryness/oiliness, acne clusters, pigmentation & dark circles |
| 💄 **Makeup Overlay (Virtual Try-On)** | Natural-looking lipstick, blush & eyeshadow rendered in real time |
| ✨ **Skin Patch Reconstruction** | Identifies burnt/damaged skin & restores it using seamless texture inpainting |
| 🖐 **Gesture Control UI** | Apply, switch modes, remove effects — all hands-free, no clicks |
| 🎥 **Live Computer Vision Processing** | Runs at 30+ FPS on standard laptop webcam |

---

## 🏗 Technology Stack

| Category | Tools Used |
|---------|------------|
| **Computer Vision** | OpenCV • MediaPipe (FaceMesh + Hands) |
| **Programming Language** | Python |
| **Image Restoration** | Telea & Poisson Inpainting |
| **Makeup Rendering** | Pixel recoloring + alpha feather masks |
| **Interface Output** | Web/Local visual display (Canvas/Frame rendering) |

---

## 🔬 How It Works


---

### 🔍 Skin Analysis Engine

- Tracks **468 facial landmarks**
- Extracts LAB + HSV values across skin regions
- Detects **acne, dryness, pigmentation, under-eye darkness**
- Highlights T-zone oil distribution and tone imbalance
- Converts raw pixels → dermatological insights

---

### 💄 Makeup Overlay Module (Virtual Try-On)

| Layer | Method |
|-------|--------|
| Lipstick | Hue shift + saturation mapping + boundary feathering |
| Blush | Gaussian-soft cheek mapping using landmark region masking |
| Eyeshadow | Gradient fill across eyelid mesh + soft blend |
| Shade Switching | Fist gesture to cycle multiple color palettes |
| Reset | Open palm gesture to clear instantly |

Makeup stays aligned as you move — because masks track landmarks at video framerate.

---

### ✨ Skin Patch Reconstruction (Signature Feature)

1. Detect redness/scar using **LAB a\*-channel anomaly scoring**
2. Confirm target region using face mask landmarks
3. Sample neighbouring healthy pixels
4. Rebuild damaged surface using **OpenCV inpainting**
5. Feather edges for natural skin-matched finish

> A preview of healing — gentle, realistic, and emotionally empowering.

---

## 🧪 Gesture Mapping

| Gesture | Action |
|--------|--------|
| ✊ Fist | Apply makeup / Switch shade / Trigger patch |
| 🖐 Open Palm | Clear overlays & patch |
| 👐 Both Hands | Return to base state / Home screen |

---

## 📥 Installation

```bash
git clone https://github.com/YourRepoName/DermaLens-AI.git
cd DermaLens-AI
pip install -r requirements.txt
python app.py   # or main.py


## 🌍 Use Cases

| Scenario | Impact |
|---------|--------|
| 🛍 Touch-Free Cosmetic Shade Trials | Customers try lipstick & blush instantly without swatches or testers |
| 🧑‍⚕️ Skin Restoration Preview | Burn/Scar areas can be visualized with natural patch reconstruction |
| 🧪 Dermatological Analysis Support | Identifies acne, oiliness, pigmentation, dark circles & dryness zones |
| 🤖 Smart Beauty Interface on Raspberry Pi | Lightweight, deployable, portable & edge-processed with no cloud pairings |
| ✋ Hygiene-First Interactions | 100% gesture-controlled — zero physical contact, zero contamination risk |
| 🎭 Personal Confidence Boost | Users can preview healing, appearance improvement & makeup suitability safely |

---

## 👩‍💻 Contributors

| Name | Primary Contributions |
|------|-----------------------|
| **Yashashwini M V** | Gesture Recognition, Skin Patch Reconstruction, System Integration |
| **S Pavithra Devi** | Makeup Overlay Rendering, UI Interaction Flow, Visual Output Refinement |
| **Ananya A** | Skin Analysis Algorithms, LAB-Channel Evaluation, Landmark-Based Mapping |

---

## ⭐ Why DermaLens Matters

Beauty should never require courage.  
Confidence should never require touching a tester used by hundreds.  
AI should not enhance appearance — **it should enhance dignity.**

DermaLens stands at that intersection:
> Where skin is understood,  
> where healing is visualized,  
> and where beauty becomes safe, personal, and touch-free.

Because beauty doesn’t need contact — it needs care.  
Because scars don’t define identity — hope does.  
And because the future of beauty is **vision-driven, hygienic, and human-centric.**  
