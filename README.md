🌿 DermaLens-AI — Touch-Free Skin Analysis & Patch Restoration

A real-time AI system that analyzes skin, simulates makeup, and reconstructs damaged skin —
without touching the screen, using only gestures.
Powered by OpenCV + MediaPipe + Computer Vision.

🚀 Overview

DermaLens-AI is a gesture-controlled dermatological system designed for hygienic and inclusive beauty try-ons.
It evaluates skin condition, applies cosmetic overlays, and intelligently restores scarred / burnt areas using a healthy-skin patch extraction algorithm.

Built for individuals who avoid physical testers due to allergies, infections, or insecurity — and for beauty spaces seeking innovation.

🧠 Features
Feature	Description
🔍 Skin Analysis	Detects tone, texture, acne, pigmentation, dark circles & surface conditions
💄 Makeup Overlay	Real-time lipstick, blush & eyeshadow rendered naturally on face
✨ Skin Patch Reconstruction	Identifies burnt/damaged skin and rebuilds it using texture-based inpainting
🖐 Gesture Control UI	Change modes, apply effects, remove makeup — no clicks, no touch
🎥 Live Computer Vision Processing	30+ FPS on standard laptop webcam
🏗 Technology Stack
Category	Tools
Computer Vision	OpenCV, MediaPipe
Programming	Python
Model Logic	Inpainting (Telea/Poisson), Face Mesh Landmark Mapping
Interface	Web-based/Local Application Output
🔬 How it Works (Pipeline)
Webcam Input → Face + Hand Detection → Landmark Mapping →
Mode Selection via Gestures → Apply Filters / Run Analysis →
Display Output in Real Time

Skin Patch Algorithm Steps

Detect face mesh landmarks

Identify affected skin using LAB-channel anomaly & contour filters

Extract nearby healthy skin as reference

Reconstruct damaged texture using OpenCV inpainting

Smooth & blend for natural appearance

🧪 Gestures
Gesture	Action
✊ Fist	Cover patch / Apply makeup / Confirm selection
🖐 Open Palm	Clear/remove applied result
👐 Both Hands	Go back / Home mode
📥 Installation
git clone https://github.com/YourName/DermaLens-AI.git
cd DermaLens-AI
pip install -r requirements.txt
python app.py   # or main.py


🌍 Use Cases

✔ Beauty stores (touch-free testers)
✔ People with burn scars / sensitive skin
✔ Dermatology preview & consultation
✔ AI-based skin wellness platforms

👩‍💻 Contributors
Name
Yashashwini M V	Developer 
S Pavithra Devi
Ananya A
• UI + Vision Pipeline
+ 2 More Developers	Gesture Logic • Inpainting System • Integration

  
⭐ Why DermaLens Matters

Because beauty shouldn't hurt.
Because confidence deserves technology.
Because touch-free is the future.
