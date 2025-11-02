# 🏇 Horse Racing Case

A simulated horse racing application built for the **Frontend Developer Case**.  
This project demonstrates my approach to **state management**, **component communication**, and **animation timing** using Vue 3 and Vuex.

---

## 🚀 Features
- Conditions, though effective do not predetermine the race outcomes, factors of **luck** are implemented.
- Generates **20 unique horses** with randomized names, colors, and conditions.  
- Automatically creates a **6-race program**, each with 10 randomly selected horses.  
- Displays a **live race simulation** for each round.  
- Shows **results dynamically**, updating after each horse finishes.  
- Includes **sound effects**, countdowns, and start/pause controls.
- Results bar outo-scrolls to view results easier.
- Colors are on the horse list and the horses so tracking comes with no work.  
- Designed with a **retro-inspired interface** and smooth transitions.

---

## 🧠 Technical Overview

- **Vue 3 (Composition API)**
- **Vuex** for centralized state management
- **Component-based architecture**
- **Reusable store actions & mutations**
- **Ref-based DOM control** for smooth scrolling and UI updates

---

## 🖥️ Running the Project

```bash
# Clone the repository
git clone https://github.com/ulassahin-ist/ulas-sahin-horse-race
cd ulas-sahin-horse-race

# Install dependencies
npm install

# Run the development server
npm run dev

Then open the app in your browser at
👉 http://localhost:5173


📂 Project Structure
src/
 ├─ components/
 │   ├─ HeaderControls.vue
 │   ├─ HorseList.vue
 │   ├─ RaceTrack.vue
 │   ├─ RacePrograms.vue
 │   ├─ RaceResults.vue
 │   └─ Audio.vue
 ├─ store/
 │   └─ index.js
 ├─ assets/
 └─ App.vue


💡 Notes

The project was developed within a limited timeframe, focusing on clarity, functionality, and code organization.
Given more time, I would:

Add unit and integration tests.

Improve accessibility and responsive layout.

Modularize the audio and race simulation logic further.

🙌 About This Case

It was truly a pleasure to be part of this process and to work on a case that combines logic, animation, and creativity.
I hope you enjoy reviewing the project as much as I enjoyed building it.

— Ulaş
