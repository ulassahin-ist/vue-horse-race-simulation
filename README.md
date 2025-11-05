# 🏇 Horse Racing Simulator (Vue 3 + Vite)

An interactive horse racing simulator built with **Vue 3**, **Vite**, and **Vuex**, featuring animated races, randomized programs, real-time results, and now full **Playwright E2E testing**.

✅ Generate horses  
✅ Build race programs  
✅ Watch races with animation & sounds  
✅ Pause / resume / restart  
✅ Final winners modal  
✅ Fully automated tests for reliability

---

## ✅ Features

- Generate **40 unique horses** (name, condition, color)
- Randomized race programs with different distances
- Real-time horse animation using `requestAnimationFrame`
- Pause / resume / stop races
- Final results summary modal
- Vuex-powered global game state
- Responsive UI and pixel-style horse sprites
- Sound effects (crowd, gallop, cheering, clicks)
- Auto scrolls results as they come
- Auto-pause when user switches tabs or browser is hidden
- **E2E Tests using Playwright** (full race cycles, modal, pause/resume)

---

## 🧩 Tech Stack

| Area             | Technology Used                                  |
| ---------------- | ------------------------------------------------ |
| Framework        | Vue 3 (Composition API)                          |
| Build Tool       | Vite                                             |
| State Management | Vuex                                             |
| Animation Engine | `requestAnimationFrame` + interval-based sprites |
| Testing          | Playwright (E2E) + Vitest (unit)                 |
| Styling          | Custom CSS + CSS variables                       |

---

## 📁 Project Structure (simplified)

```
src/
├─ components/
│  ├─ Layout.vue
│  ├─ RaceTrack.vue
│  ├─ RacePrograms.vue
│  ├─ RaceResults.vue
│  ├─ HeaderControls.vue
│  └─ Audio.vue
│
├─ store/
│  └─ index.js
│
├─ assets/
│  └─ sprites/, icons/, audio/
│
├─ App.vue
└─ main.js
```

---

## 🚀 How the Racing Works

### ✅ 1) Generate horses

- 40 random horses
- Each has **color**, **name**, **condition**, and sprite animation

### ✅ 2) Create race program

- Multiple races
- Each selects 10 random horses
- Distance varies (1200–2200m)

### ✅ 3) Run race

- `requestAnimationFrame` updates horse movement
- Speed is a mix of condition & randomness
- When a horse finishes → pushed to Vuex results

### ✅ 4) After all races

- Final **summary modal** appears
- Shows winners of each lap

---

## 🧪 End-to-End Testing (Playwright)

This app includes full E2E coverage:

- ✅ Full race simulation works
- ✅ Pause/resume works
- ✅ Cannot start race before program is generated
- ✅ Final summary modal shows 6 winners

### ✅ Test Mode (Important!)

`main.js` adds:

```js
if (window.__E2E__) {
  console.log("Running in E2E mode");
}
window.__store__ = store;
```

This exposes the store so Playwright can safely inspect it.

### ✅ Running E2E tests

```bash
npm run test:e2e
```

Playwright will:

- Generate horses
- Generate program
- Start all races
- Verify modal and winners
- Confirm pause/resume
- Confirm user cannot start race early

---

## 🧪 Unit Tests (Vitest)

`vite.config.js` test section:

```js
test: {
  include: ["tests/unit/**/*.spec.js"],
  environment: "jsdom",
  globals: true,
  threads: false,
  pool: "forks",
}
```

Run:

```bash
npm run test
```

---

## 🎮 Running Locally

```bash
npm install
npm run dev
```

Then open:  
`http://localhost:5173`

---

## ❓ Why Vuex?

- Race logic, countdowns, horses, and UI overlays update live
- No prop drilling
- Components react automatically to state change

---

## 🎧 Why Clone Audio Nodes?

Multiple sounds must overlap:

✅ applause + gallop + UI click  
Normal `<audio>` cannot play multiple instances — cloned nodes solve it.

---

## 💤 Handling Lost Browser Focus

When tab is hidden or minimized:

- Race auto-pauses
- Sounds stop
- Winner overlay hides

Prevents race from finishing while the user can’t see it.

---

## ✅ Included Playwright Tests

| Test File                              | What It Verifies                               |
| -------------------------------------- | ---------------------------------------------- |
| `race-flow.spec.js`                    | Full race cycle until final summary modal      |
| `race-pause-resume.spec.js`            | Horses stop moving when paused, continue after |
| `race-no-start-before-program.spec.js` | Start blocked until program generated          |
| `race-summary-modal.spec.js`           | Final modal shows 6 winners                    |

---

## ✅ Status: Fully working ✅

✔ Smooth animation  
✔ Sounds  
✔ Restartable race program  
✔ Final modal  
✔ **All tests passing**

Enjoy the races 🏇🔥  
Pull requests and improvements are welcome!
