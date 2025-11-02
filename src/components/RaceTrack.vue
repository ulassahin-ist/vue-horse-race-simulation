<template>
  <div class="container">
    <div
      v-if="countdown > 0 && !store.state.raceState.running"
      class="overlay countdown"
    >
      <div v-if="store.state.raceState.winner" class="winner-message">
        <Icon name="trophy" size="40" color="#FFFF55" /><br />
        {{ store.state.raceState.winner.name }} wins Race {{ currentRace.id }}!
      </div>
      Next race starts in {{ countdown }}...
    </div>

    <div class="track">
      <div class="finish-line"></div>
      <div class="track-inner">
        <div v-for="(horse, index) in raceHorses" :key="horse.id" class="lane">
          <span class="lane-tag">{{ index + 1 }}</span>
          <div
            class="horse"
            :style="{
              left: (horse.position / currentRace.distance) * 100 + '%',
              background: `var(--${horse.color})`,
            }"
          >
            <img
              :src="horseImages[frameIndexes[index] % horseImages.length]"
              alt="horse"
              class="horse-img"
            />
            <span class="horse-name">
              {{ horse.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="lap-title">
      <span style="color: transparent">_</span>{{ lapTitle }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, inject } from "vue";
import Icon from "./Icon.vue";
import { useStore } from "vuex";

const store = useStore();
/* horse sprites */
import horse1 from "@/assets/sprites/horses/horse1.png";
import horse2 from "@/assets/sprites/horses/horse2.png";
import horse3 from "@/assets/sprites/horses/horse3.png";
import horse4 from "@/assets/sprites/horses/horse4.png";
const horseImages = [horse1, horse2, horse3, horse4];

const lapTitle = inject("lapTitle");

/* ------------------------------------------------------------------ */
const raceHorses = ref([]);
const countdown = ref(0);
let countdownTimer = null;
let lastTime = null;
let animationFrameId = null;

const frameIndexes = ref([]);
let frameInterval = null;

/* ------------------------------------------------------------------ */
const currentRace = computed(() => {
  const idx = store.state.raceState.raceIndex;
  return store.state.races[idx] || null;
});

/* ------------------------------------------------------------------ */
watch(
  currentRace,
  (newRace) => {
    if (newRace) loadRaceHorses();
  },
  { flush: "sync" }
);

/* ------------------------------------------------------------------ */
function updateRaceState(overrides = {}) {
  store.commit("setRaceState", { ...store.state.raceState, ...overrides });
}

function loadRaceHorses() {
  if (!currentRace.value) return;

  raceHorses.value = currentRace.value.horses.map((h) => ({
    ...h,
    position: 0,
    finished: false,
  }));

  frameIndexes.value = raceHorses.value.map(() =>
    Math.floor(Math.random() * horseImages.length)
  );

  updateRaceState({
    running: false,
    paused: false,
    finishedOrder: [],
  });
}

/* ------------------------------------------------------------------ */
function startHorseAnimation() {
  stopHorseAnimation();
  frameInterval = setInterval(() => {
    const { running, paused } = store.state.raceState;
    if (!running || paused) return;

    frameIndexes.value = frameIndexes.value.map(
      (frame) => (frame + 1) % horseImages.length
    );
  }, 120);
}

function stopHorseAnimation() {
  if (frameInterval) {
    clearInterval(frameInterval);
    frameInterval = null;
  }
}

/* ------------------------------------------------------------------ */
function simulateRace(timestamp) {
  const raceState = store.state.raceState;
  if (!raceState.running || raceState.paused || !currentRace.value) return;

  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  raceHorses.value.forEach((horse) => {
    if (horse.finished) return;

    const luck = Math.random() * 100;
    const equaller = 15 + horse.condition / 10;
    const ratio = equaller * 0.4 + luck * 0.6;
    let distanceCovered = ratio * 3 * (delta / 1000);

    if (Math.random() < 0.1) distanceCovered = 1.4;
    if (Math.random() < 0.01) distanceCovered = 1.7;

    horse.position += distanceCovered;

    if (horse.position >= currentRace.value.distance) {
      horse.position = currentRace.value.distance;
      horse.finished = true;
      store.commit("addFinishedHorse", horse);
      store.commit("addResult", { raceId: currentRace.value.id, horse });
    }
  });

  const finishedCount = raceHorses.value.filter((h) => h.finished).length;
  const totalHorses = raceHorses.value.length;

  if (finishedCount >= totalHorses - 1) {
    const remainingHorse = raceHorses.value.find((h) => !h.finished);
    if (remainingHorse) {
      remainingHorse.finished = true;
      remainingHorse.position = currentRace.value.distance;
      store.commit("addFinishedHorse", remainingHorse);
      store.commit("addResult", {
        raceId: currentRace.value.id,
        horse: remainingHorse,
      });
    }

    finishRace();
    return;
  }

  animationFrameId = requestAnimationFrame(simulateRace);
}

/* ------------------------------------------------------------------ */
function initRace() {
  if (!currentRace.value) return;

  cancelAnimationFrame(animationFrameId);
  loadRaceHorses();

  if (!store.state.gameInProgress) {
    store.commit("setGameInProgress", true);
  }

  updateRaceState({
    running: true,
    paused: false,
    winner: null,
    finishedOrder: [],
  });

  lastTime = null;
  startHorseAnimation();
  animationFrameId = requestAnimationFrame(simulateRace);
}

function togglePause() {
  const paused = !store.state.raceState.paused;
  updateRaceState({ paused });

  if (paused) {
    cancelAnimationFrame(animationFrameId);
    stopHorseAnimation();
  } else {
    lastTime = null;
    startHorseAnimation();
    animationFrameId = requestAnimationFrame(simulateRace);
  }
}
/* ------------------------------------------------------------------ */
function finishRace() {
  stopHorseAnimation();

  const winner = store.state.raceState.finishedOrder[0] || raceHorses.value[0];
  updateRaceState({
    running: false,
    winner,
  });

  cancelAnimationFrame(animationFrameId);

  const { raceIndex } = store.state.raceState;
  const totalRaces = store.state.races.length;

  if (raceIndex >= totalRaces - 1) {
    setTimeout(() => {
      store.commit("setGameInProgress", false);
      store.commit("clearRuntime");
      stopHorseAnimation();
      cancelAnimationFrame(animationFrameId);
    }, 2000);
    return;
  }

  startCountdown();
}

function startCountdown() {
  countdown.value = 3;
  nextTick(() => loadRaceHorses());

  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      store.commit("incrementRaceIndex");
      nextTick(() => initRace());
    }
  }, 1000);
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
function cancelCountdown() {
  stopHorseAnimation();
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  countdown.value = 0;

  updateRaceState({
    running: false,
    paused: false,
    winner: null,
  });

  loadRaceHorses();
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
function resetAll() {
  stopHorseAnimation();
  cancelAnimationFrame(animationFrameId);
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  animationFrameId = null;
  lastTime = null;
  countdown.value = 0;
  raceHorses.value = [];
  store.commit("resetAll");
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
defineExpose({
  initRace,
  togglePause,
  resetAll,
  cancelCountdown,
});
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.track {
  margin-top: auto;
  position: relative;
  width: 100%;
  height: 464px;
  background: #333;
  border-radius: 8px;
  overflow-x: hidden;
  overflow-y: visible;
  -webkit-mask-image: linear-gradient(black, black);
  clip-path: inset(0 round 8px);
}
.track-inner {
  position: relative;
  overflow: visible;
}

.lane {
  position: relative;
  height: 40px;
  margin: 4px 0;
  background: rgba(255, 255, 255, 0.05);
}
.lane-tag {
  position: absolute;
  left: 15px;
  color: #fff;
  font-size: 20px;
}
.horse {
  position: absolute;
  top: 10px;
  width: 90px;
  height: 15px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: left 0.15s linear;
  z-index: 5;
  color: white;
}

.horse-img {
  position: absolute;
  width: 80px;
  height: auto;
  bottom: 0;
  opacity: 0.9;
  pointer-events: none;
  transform: translateY(-5px);
}

.horse-name {
  z-index: 3;
  font-weight: bold;
  text-shadow: 1px 1px 2px black;
}
.lap-title {
  background: #fff;
  clip-path: polygon(10px 100%, 0 0, 100% 0, calc(100% - 5px) 100%);
  margin-bottom: 40px;
}
.finish-line {
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 95%;
  background: rgb(172, 0, 0);
}
/* Message overlay  */
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.65);
  padding: 15px 25px;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  pointer-events: none;
}
.winner-message {
  font-weight: bold;
  font-size: 36px;
  color: gold;
  margin-top: 10px;
  text-shadow: 1px 1px 2px black;
}
</style>
