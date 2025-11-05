<template>
  <div class="container">
    <!-- Countdown + winner shown between races -->
    <div
      v-if="countdown > 0 && !store.state.raceState.running"
      class="overlay countdown"
    >
      <div v-if="store.state.raceState.winner" class="winner-message">
        <Icon name="trophy" size="60" color="#FFFF55" /><br />
        {{ store.state.raceState.winner.name }} wins Race {{ currentRace.id }}!
      </div>
      Next race starts in {{ countdown }}...
    </div>

    <!-- Track and horses -->
    <div class="track">
      <div class="finish-line"></div>
      <div class="finish-checker"></div>

      <!-- If horses exist -->
      <div v-if="raceHorses.length > 0">
        <div v-for="(horse, index) in raceHorses" :key="horse.id" class="lane">
          <span class="lane-tag">{{ index + 1 }}</span>

          <div
            class="horse"
            :style="{
              left: horse.left + '%',
              background: `var(--${horse.color})`,
            }"
          >
            <img
              :src="horseImages[frameIndexes[index] % horseImages.length]"
              alt="horse"
              class="horse-img"
            />
            <span class="horse-name">{{ horse.name }}</span>
          </div>
        </div>
      </div>

      <!-- If no horses yet, show 10 empty lanes -->
      <div v-else>
        <div v-for="n in 10" :key="n" class="lane">
          <span class="lane-tag">{{ n }}</span>
        </div>
      </div>
    </div>

    <!-- Final summary modal shown after last race -->
    <div
      v-if="summaryWinners.length"
      class="summary-modal"
      @click.self="summaryWinners = []"
    >
      <div class="summary-box">
        <h2>Final Results</h2>
        <div
          v-for="item in summaryWinners"
          :key="item.race"
          class="summary-row"
        >
          Race {{ item.race }} → {{ item.horse.name }}
        </div>
        <button class="close-btn" @click="summaryWinners = []">Close</button>
      </div>
    </div>

    <!-- Lap label above track -->
    <div class="lap-title">
      <span style="color: transparent">_</span>
      {{ lapTitle }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, inject, onUnmounted } from "vue";
import { useStore } from "vuex";
import Icon from "./Icon.vue";

/* Sprite frames */
import horse1 from "@/assets/sprites/horses/horse1.png";
import horse2 from "@/assets/sprites/horses/horse2.png";
import horse3 from "@/assets/sprites/horses/horse3.png";
import horse4 from "@/assets/sprites/horses/horse4.png";
const horseImages = [horse1, horse2, horse3, horse4];

const store = useStore();
const lapTitle = inject("lapTitle");

/* Runtime state */
const raceHorses = ref([]);
const frameIndexes = ref([]);
const countdown = ref(0);
const summaryWinners = ref([]);

/* Testing mechanics */
const isE2E = window.__E2E__ === true;

/* Timers/animation refs */
let countdownTimer = null;
let animationFrameId = null;
let frameInterval = null;
let lastTime = null;

/* Cached race state */
const raceState = computed(() => store.state.raceState);

/* Active race */
const currentRace = computed(() => {
  const idx = raceState.value.raceIndex;
  return store.state.races[idx] || null;
});

/* Reload horses when race changes */
watch(currentRace, (race) => {
  if (race) loadRaceHorses();
});

/* Helper to mutate raceState */
function updateRaceState(payload) {
  store.commit("setRaceState", { ...raceState.value, ...payload });
}

/* Set horses to starting position */
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

  updateRaceState({ running: false, paused: false, finishedOrder: [] });
}

/* Simple sprite frame cycling */
function startHorseAnimation() {
  stopHorseAnimation();

  frameInterval = setInterval(
    () => {
      if (!raceState.value.running || raceState.value.paused) return;

      frameIndexes.value = frameIndexes.value.map(
        (frame) => (frame + 1) % horseImages.length
      );
    },
    isE2E ? 20 : 120
  );
}

function stopHorseAnimation() {
  clearInterval(frameInterval);
  frameInterval = null;
}

/* Main race animation loop */
function simulateRace(timestamp) {
  if (!raceState.value.running || raceState.value.paused) return;

  if (!lastTime) lastTime = timestamp;
  const delta = isE2E ? 300 : timestamp - lastTime;
  lastTime = timestamp;

  raceHorses.value.forEach((horse) => {
    if (horse.finished) return;

    const luck = Math.random() * 100;
    const equaller = 15 + horse.condition / 10;
    const speed = equaller * 0.4 + luck * 0.6;

    let distanceCovered = speed * 3 * (delta / 1000);

    if (Math.random() < 0.1) distanceCovered = 1.4;
    if (Math.random() < 0.01) distanceCovered = 1.7;

    horse.position += distanceCovered;
    horse.left = (horse.position / currentRace.value.distance) * 100;

    if (horse.position >= currentRace.value.distance) {
      horse.position = currentRace.value.distance;
      horse.finished = true;
      store.commit("addFinishedHorse", horse);
      store.commit("addResult", { raceId: currentRace.value.id, horse });
    }
  });

  const finishedCount = raceHorses.value.filter((h) => h.finished).length;
  const totalHorses = raceHorses.value.length;

  /* Finish last horse automatically */
  if (finishedCount >= totalHorses - 1) {
    const lastOne = raceHorses.value.find((h) => !h.finished);
    if (lastOne) {
      lastOne.position = currentRace.value.distance;
      lastOne.finished = true;
      store.commit("addFinishedHorse", lastOne);
      store.commit("addResult", {
        raceId: currentRace.value.id,
        horse: lastOne,
      });
    }
    finishRace();
    return;
  }

  animationFrameId = requestAnimationFrame(simulateRace);
}

/* Start race */
function initRace() {
  if (!currentRace.value) return;

  cancelAnimationFrame(animationFrameId);
  loadRaceHorses();

  if (!store.state.gameInProgress) {
    store.commit("setGameInProgress", true);
  }

  updateRaceState({ running: true, paused: false, winner: null });

  lastTime = null;
  startHorseAnimation();
  animationFrameId = requestAnimationFrame(simulateRace);
}

/* Pause / resume */
function togglePause() {
  updateRaceState({ paused: !raceState.value.paused });

  if (raceState.value.paused) {
    cancelAnimationFrame(animationFrameId);
    stopHorseAnimation();
  } else {
    lastTime = null;
    startHorseAnimation();
    animationFrameId = requestAnimationFrame(simulateRace);
  }
}

/* Race conclusion */
function finishRace() {
  stopHorseAnimation();
  cancelAnimationFrame(animationFrameId);

  const winner = raceState.value.finishedOrder[0] || raceHorses.value[0];
  updateRaceState({ running: false, winner });

  const lastRace = raceState.value.raceIndex >= store.state.races.length - 1;

  if (lastRace) {
    summaryWinners.value = [...store.state.results]
      .sort((a, b) => b.id - a.id)
      .map((r) => ({
        race: r.id,
        horse: r.horses[0],
      }));

    raceHorses.value = [];

    setTimeout(
      () => {
        store.commit("setGameInProgress", false);
        store.commit("clearRuntime");
        stopHorseAnimation();
      },
      isE2E ? 50 : 2000
    );

    return;
  }

  nextTick(() => loadRaceHorses());
  startCountdown();
}

/* Delay before the next race */
function startCountdown() {
  countdown.value = 3;

  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(
    () => {
      countdown.value--;
      if (countdown.value == 1) raceHorses.value = [];
      if (countdown.value <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        store.commit("incrementRaceIndex");
        nextTick(initRace);
      }
    },
    isE2E ? 10 : 1000
  );
}

/* Stop countdown and reset */
function cancelCountdown() {
  stopHorseAnimation();
  clearInterval(countdownTimer);

  countdown.value = 0;
  countdownTimer = null;

  updateRaceState({ running: false, paused: false, winner: null });
  loadRaceHorses();
}

/* Global reset */
function resetAll() {
  stopHorseAnimation();
  cancelAnimationFrame(animationFrameId);
  clearInterval(countdownTimer);

  countdownTimer = null;
  animationFrameId = null;
  lastTime = null;
  countdown.value = 0;
  raceHorses.value = [];

  store.commit("resetAll");
}

/* Cleanup if component leaves page */
onUnmounted(() => {
  stopHorseAnimation();
  cancelAnimationFrame(animationFrameId);
  clearInterval(countdownTimer);
});

/* Called by layout when window is hidden */
function pauseForHidden() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
    countdown.value = 0;
  }

  if (raceState.value.winner) {
    updateRaceState({ winner: null });
  }

  if (raceState.value.running && !raceState.value.paused) {
    updateRaceState({ paused: true });
    cancelAnimationFrame(animationFrameId);
    stopHorseAnimation();
  }
}

/* Methods exposed to parent */
defineExpose({
  initRace,
  togglePause,
  resetAll,
  cancelCountdown,
  pauseForHidden,
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
  height: 444px;
  background: #333;
  border-radius: 8px;
  overflow: visible;
  box-sizing: border-box;
  padding-right: 90px;
  transform: perspective(1100px) rotateX(15deg);
  transform-origin: bottom center;
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
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: left 0.15s linear;
  z-index: var(--z-horse);
  color: white;
}

.horse-img {
  position: absolute;
  width: 80px;
  height: auto;
  bottom: 0;
  pointer-events: none;
  transform: translateY(-5px);
}

.horse-name {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.9),
    1px 1px 2px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1),
    1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1);
}
.lap-title {
  background: #fff;
  clip-path: polygon(10px 100%, 0 0, 100% 0, calc(100% - 5px) 100%);
  margin-bottom: 40px;
}
.finish-checker {
  position: absolute;
  top: 0;
  right: 0;
  width: 90px;
  height: 100%;
  pointer-events: none;

  background: conic-gradient(#000 25%, #fff 0 50%, #000 0 75%, #fff 0) 0 0 /
    30px 30px repeat;
  mask-image: linear-gradient(to left, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to left, black 80%, transparent);
  border-right: 4px solid rgb(172, 0, 0);
  opacity: 0.85;
}

/* Overlay message during countdown */
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: var(--z-msg-overlay);
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

.summary-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: var(--z-msg-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
}

.summary-box {
  background: #222;
  padding: 20px 30px;
  border-radius: 8px;
  color: white;
  font-size: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-box h2 {
  color: gold;
}

.summary-row {
  margin: 6px 0;
  width: 100%;
  text-align: start;
}

.close-btn {
  margin-top: 10px;
  padding: 6px 14px;
  font-size: 18px;
}
</style>
