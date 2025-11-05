<template>
  <div class="layout">
    <!-- Top header that holds race controls -->
    <header>
      <HeaderControls
        @initRace="control('initRace')"
        @togglePause="control('togglePause')"
        @resetAll="control('resetAll')"
        @cancelCountdown="control('cancelCountdown')"
      />
    </header>

    <!-- First-time overlay screen. Hidden after user clicks "Enter" -->
    <div ref="startGame" class="start-game">
      <!-- Visual guide arrow pointing at controls -->
      <div class="curved-arrow"></div>

      <!-- Start button -->
      <button @click="hideStartGame">Enter</button>
    </div>

    <!-- Three-column layout: horses / track / results -->
    <div class="main-page">
      <!-- Horse list panel -->
      <aside
        class="horse-list sidebar"
        :class="{ closed: store.state.horses.length === 0 }"
      >
        <HorseList />
      </aside>

      <!-- Race track in the center -->
      <section class="race-track">
        <RaceTrack ref="raceTrack" />
      </section>

      <!-- Programs + results on the right -->
      <aside class="race-info">
        <!-- Race program table -->
        <div
          class="race-programs sidebar"
          :class="{ closed: store.state.races.length === 0 }"
        >
          <RacePrograms />
        </div>

        <!-- Race results list with smooth auto-scroll -->
        <div
          ref="scrollWrapperResults"
          class="race-results sidebar"
          :class="{ closed: store.state.results.length === 0 }"
        >
          <!-- Component emits event to force scroll -->
          <RaceResults @scrollToBottom="scrollResultsToBottom" />
        </div>
      </aside>
    </div>
  </div>

  <!-- Global audio controller -->
  <Audio ref="audio" />
</template>

<script setup>
// Vue + Store
import { onMounted, onUnmounted, ref, computed, provide } from "vue";
import { useStore } from "vuex";

// Components
import HeaderControls from "./HeaderControls.vue";
import HorseList from "./HorseList.vue";
import RaceTrack from "./RaceTrack.vue";
import RacePrograms from "./RacePrograms.vue";
import RaceResults from "./RaceResults.vue";
import Audio from "./Audio.vue";

const store = useStore();

// Local refs to child components and DOM elements
const raceTrack = ref(null);
const scrollWrapperResults = ref(null);
const startGame = ref(null);
const audio = ref(null);

// Fade-out animation for intro overlay
function hideStartGame() {
  startGame.value?.classList.add("fade-out");
  setTimeout(() => (startGame.value.style.display = "none"), 500);
}

// Text displayed above track: example → "2ND LAP 1200m"
const lapTitle = computed(() => {
  const { raceIndex } = store.state.raceState;
  const race = store.state.races[raceIndex];
  if (!race) return "";

  const suffix = ["TH", "ST", "ND", "RD"][race.id] ?? "TH";
  return `${race.id}${suffix} LAP ${race.distance}m`;
});

// Make lap title available to child components
provide("lapTitle", lapTitle);

// Auto-scroll results panel when new result arrives
function scrollResultsToBottom() {
  const el = scrollWrapperResults.value;
  el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}

// Proxy to call exposed functions inside RaceTrack
function control(action) {
  raceTrack.value?.[action]?.();
}

// Pause game + audio when tab/window loses focus
function handleVisibilityChange() {
  if (document.hidden) {
    // Pause simulation inside RaceTrack
    raceTrack.value?.pauseForHidden();

    // Stop all audio immediately
    audio.value?.pauseAllSounds();

    // Remove winner overlay if it was visible
    if (raceTrack.value?.summaryWinners?.value?.length) {
      raceTrack.value.summaryWinners.value = [];
    }
  } else {
    // When user returns, play only ambient crowd
    audio.value?.resumeAmbient();
  }
}

// Attach global visibility listeners
onMounted(() => {
  if (!window.__E2E__) {
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleVisibilityChange);
  }
});
// Cleanup listeners on destroy
onUnmounted(() => {
  if (!window.__E2E__) {
    window.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("blur", handleVisibilityChange);
  }
});
</script>

<style>
/* Main root container */
.layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: "VT323", monospace;
  letter-spacing: 1px;
  font-size: 24px;
}

/* Header bar at top */
header {
  background: var(--header-bg);
  width: 100vw;
}
header .title {
  z-index: var(--z-header-title);
}

/* Fullscreen dark overlay shown before game begins */
.start-game {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(34, 34, 34, 0.992);
  z-index: var(--z-start-overlay);
  display: flex;
  transition: opacity 0.5s ease;
}
.start-game button {
  color: #e80000;
  font-size: 70px;
  margin: auto;
  width: 180px;
  height: 180px;
}

/* Arrow pointing at controls */
.curved-arrow {
  position: fixed;
  right: 5vw;
  top: 10vw;
  width: 20vw;
  height: 20vw;
  border-right: 8px solid white;
  border-bottom: 8px solid white;
  border-radius: 0 0 20vw 0px;
}
.curved-arrow::after {
  content: "";
  position: absolute;
  top: -4.8vw;
  right: -2.8vw;
  width: 5vw;
  height: 5vw;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: white;
}
.curved-arrow::before {
  content: "(Control Buttons Are Here)";
  position: absolute;
  color: white;
  left: -110px;
  bottom: -40px;
  width: max-content;
}

/* Fade animation when overlay disappears */
.fade-out {
  opacity: 0;
}

/* Main 3-column layout */
.main-page {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 5fr 3fr;
  gap: 10px;
  padding: 10px;
  min-height: 500px;
  background: #1a1b1d;
  background-image: url("@/assets/sprites/crowd.webp");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

/* Shared sidebar styling */
.sidebar {
  position: relative;
  background: var(--table-bg);
  overflow-x: auto;
  overflow-y: auto;
  scroll-behavior: smooth;
  border: 1px solid #1a1b1d;
  height: max-content;
  max-height: calc(100vh - var(--scroll-offset));
  padding: 0;
  transition: all 0.5s linear;
  z-index: var(--z-sidebar);
}
.closed {
  max-height: var(--title-offset);
  overflow: hidden;
}

/* Right side layout: programs + results */
.race-info {
  display: grid;
  grid-template-columns: 4fr 5fr;
  grid-auto-columns: auto;
}

/* Styling for program + result tables */
.sidebar .title {
  background: linear-gradient(145deg, #d9dbdf, #a6a9ad);
  color: var(--text-black);
  font-weight: 600;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 14px;
}
/* Children table styling (shared) */
table,
td,
th {
  border: 1px solid var(--table-head);
  padding: 2px 1px;
}
th {
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(160deg, #cfd1d4, #b6b8bb);
  color: #1a1b1d;
  border-bottom: 1px solid #9b9ea1;
  text-transform: uppercase;
}
td {
  color: rgb(27, 27, 31);
}
table {
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
}
tbody {
  background: #e6e7e8;
}
tbody tr:nth-child(even) {
  background: #d8d9db;
}
.race-title {
  background: linear-gradient(145deg, #b2b4b7, #9fa1a4);
  color: #f4f4f4;
  font-weight: 500;
  text-align: center;
}

/* Middle race track area */
.race-track {
  flex: 1;
}
</style>
