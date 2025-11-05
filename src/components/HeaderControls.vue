<template>
  <div class="container">
    <div class="title">Horse Racing</div>

    <!-- Generate horses -->
    <button
      :disabled="store.state.gameInProgress || raceState.running"
      @click="generateHorses"
      title="Generate Horses"
    >
      <Icon name="horse" size="26" color="#222" />
    </button>

    <!-- Generate races -->
    <button
      :disabled="
        store.state.gameInProgress ||
        !store.state.horses.length ||
        raceState.running
      "
      @click="generateRaces"
      title="Generate Program"
    >
      <Icon name="program" size="26" color="#222" />
    </button>

    <!-- Start / Pause / Resume -->
    <button
      :disabled="!store.state.races.length || !areHorsesSynced()"
      @click="handleRaceControl"
      title="Start / Pause / Resume"
    >
      <Icon :name="raceButtonIcon" size="26" color="#222" />
    </button>

    <!-- Full reset -->
    <button
      :disabled="!store.state.horses.length && !store.state.races.length"
      @click="emit('resetAll')"
      title="Reset All"
    >
      <Icon name="reset" size="26" color="#222" />
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Icon from "./Icon.vue";

const emit = defineEmits([
  "initRace",
  "togglePause",
  "resetAll",
  "cancelCountdown",
]);

const store = useStore();
const raceState = computed(() => store.state.raceState);

/* Button icon respects current race state */
const raceButtonIcon = computed(() => {
  const { running, paused } = raceState.value;
  if (running) return paused ? "resume" : "pause";
  return "start";
});

/* Main control logic for start / pause / resume */
function handleRaceControl() {
  const { running } = raceState.value;
  const gameInProgress = store.state.gameInProgress;
  const currentIndex = raceState.value.raceIndex;
  const totalRaces = store.state.races.length;

  const noActiveGame = !gameInProgress;
  const lastRaceFinished =
    store.state.results.length === totalRaces && totalRaces > 0;

  // If everything finished, reset result history first
  if (noActiveGame && lastRaceFinished) {
    store.commit("clearResults");
    store.commit("clearRuntime");
  }

  // Toggle pause if already running
  if (running) return emit("togglePause");

  const hasResults = store.state.results.length > 0;
  const startingFirstRace = noActiveGame && currentIndex === 0 && hasResults;

  // Start new race from beginning
  if (startingFirstRace) return emit("initRace");

  // Between races, countdown is active → skip it and move to next
  const pausedBetweenRaces = gameInProgress && !running;
  if (pausedBetweenRaces) {
    emit("cancelCountdown");
    store.commit("incrementRaceIndex");
    return setTimeout(() => emit("initRace"), 50);
  }

  // Initial run
  if (noActiveGame) emit("initRace");
}

/* Verifies that program horses match current horse list */
function areHorsesSynced() {
  const horses = store.state.horses;
  const currentRace = store.state.races[raceState.value.raceIndex];
  if (!horses.length || !currentRace) return false;

  return currentRace.horses.every((raceHorse) =>
    horses.some((h) => {
      return (
        h.id === raceHorse.id &&
        h.name === raceHorse.name &&
        h.condition === raceHorse.condition &&
        h.color === raceHorse.color
      );
    })
  );
}

function generateHorses() {
  store.dispatch("generateHorses");
}

function generateRaces() {
  store.dispatch("generateRaces");
}
</script>

<style scoped>
.container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  gap: 10px;
  padding-right: 20px;
}

.title {
  margin-right: auto;
  font-weight: bolder;
  font-size: 34px;
  letter-spacing: 2px;
  color: #e80000;
}
</style>
