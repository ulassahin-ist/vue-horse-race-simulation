<template>
  <div class="layout">
    <header>
      <HeaderControls
        @initRace="control('initRace')"
        @togglePause="control('togglePause')"
        @resetAll="control('resetAll')"
        @cancelCountdown="control('cancelCountdown')"
      />
    </header>
    <div ref="startGame" class="start-game">
      <button @click="hideStartGame">Enter</button>
    </div>

    <div class="main-page">
      <aside
        class="horse-list sidebar"
        :class="{ closed: !(store.state.horses.length > 0) }"
      >
        <HorseList />
      </aside>

      <section class="race-track">
        <RaceTrack ref="raceTrack" />
      </section>

      <aside class="race-info">
        <div
          class="race-programs sidebar"
          :class="{ closed: !(store.state.races.length > 0) }"
        >
          <RacePrograms />
        </div>
        <div
          ref="scrollWrapperResults"
          class="race-results sidebar"
          :class="{ closed: !store.state.results.length > 0 }"
        >
          <RaceResults @scrollToBottom="scrollResultsToBottom" />
        </div>
      </aside>
    </div>
  </div>
  <Audio />
</template>

<script setup>
import { ref, computed, provide } from "vue";
import { useStore } from "vuex";

import HeaderControls from "./HeaderControls.vue";
import HorseList from "./HorseList.vue";
import RaceTrack from "./RaceTrack.vue";
import RacePrograms from "./RacePrograms.vue";
import RaceResults from "./RaceResults.vue";
import Audio from "./Audio.vue";

const store = useStore();
const raceTrack = ref(null);
const scrollWrapperResults = ref(null);
const startGame = ref(null);

function hideStartGame() {
  startGame.value.classList.add("fade-out");

  setTimeout(() => {
    startGame.value.style.display = "none";
  }, 500);
}

const lapTitle = computed(() => {
  const idx = store.state.raceState.raceIndex;
  const race = store.state.races[idx];
  if (!race) return "";
  let suffix = "TH";
  if (race.id === 1) suffix = "ST";
  else if (race.id === 2) suffix = "ND";
  else if (race.id === 3) suffix = "RD";
  return `${race.id}${suffix} LAP ${race.distance}m`;
});

provide("lapTitle", lapTitle);

function scrollResultsToBottom() {
  const el = scrollWrapperResults.value;
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }
}

function control(action) {
  raceTrack.value?.[action]?.();
}
</script>
<style>
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
/* Header */
header {
  background: var(--header-bg);
  width: 100vw;
}
header .title {
  z-index: 1000;
}
/* Page Root*/
.start-game {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(34, 34, 34, 0.992);
  z-index: 999;
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
.fade-out {
  opacity: 0;
}
.main-page {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 5fr 3fr;
  gap: 10px;
  padding: 10px;
  min-height: 500px;
  min-height: 500px;
  background: #1a1b1d;
  background-image: url("@/assets/sprites/crowd.webp");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

/* Sidebars*/
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
}
.closed {
  max-height: var(--title-offset);
  overflow: hidden;
}
.race-info {
  display: grid;
  grid-template-columns: 4fr 5fr;
  grid-auto-columns: auto;
}

/* Sidebar Children Stylings */
.sidebar .title {
  font-weight: 600;
  position: sticky;
  top: 0;
  padding: 10px;
  background: linear-gradient(145deg, #d9dbdf, #a6a9ad);
  color: #1b1b1f;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 14px;
}

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
  font-weight: 600;
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

/* Race Track */
.race-track {
  flex: 1;
}
</style>
