<template>
  <!-- Hidden audio elements -->
  <div style="display: none">
    <audio ref="crowd" src="./audios/crowd.mp3" loop></audio>
    <audio ref="gallop" src="./audios/gallop.mp3" loop></audio>
    <audio ref="startRace" src="./audios/start-race.mp3"></audio>
    <audio ref="applaud" src="./audios/applaud.mp3"></audio>
    <audio ref="click" src="./audios/click-button.mp3"></audio>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const crowd = ref(null);
const gallop = ref(null);
const startRace = ref(null);
const applaud = ref(null);
const click = ref(null);

function playLoop(soundRef) {
  if (!soundRef.value) return;
  if (soundRef.value.paused) {
    soundRef.value.currentTime = 0;
    soundRef.value.play().catch(() => {});
  }
}

function playOnce(soundRef) {
  if (!soundRef.value) return;

  const clone = soundRef.value.cloneNode(true);
  clone.volume = soundRef.value.volume;

  clone.onended = () => clone.remove();

  clone.currentTime = 0;
  clone.play().catch(() => {});
}

function stop(refEl) {
  if (!refEl.value) return;
  refEl.value.pause();
  refEl.value.currentTime = 0;
}

watch(
  () => store.state.raceState,
  (race) => {
    if (!race.running) {
      playLoop(crowd);
      stop(gallop);
    } else if (race.running && !race.paused) {
      stop(crowd);
      playLoop(gallop);
    } else if (race.paused) {
      gallop.value.pause();
      playLoop(crowd);
    }

    if (race.winner) {
      stop(gallop);
      playOnce(applaud);
      setTimeout(() => playLoop(crowd), 3500);
    }
  },
  { deep: true }
);

watch(
  () => store.state.raceState.running,
  (running, oldVal) => {
    if (running && !oldVal) playOnce(startRace);
  }
);

function handleButtonClick(e) {
  let el = e.target;

  while (el && el !== document.body) {
    if (el.tagName === "BUTTON") {
      playOnce(click);
      break;
    }
    el = el.parentElement;
  }
}

onMounted(() => {
  document.addEventListener("click", handleButtonClick);
  document.addEventListener(
    "click",
    () => {
      playLoop(crowd);
    },
    { once: true }
  );
});

onUnmounted(() => {
  document.removeEventListener("click", handleButtonClick);
});
</script>
