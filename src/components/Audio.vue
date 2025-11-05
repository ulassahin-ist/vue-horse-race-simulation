<template>
  <!-- Hidden audio tags loaded once, reused by JS -->
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

/* Main sound refs */
const crowd = ref(null);
const gallop = ref(null);
const startRace = ref(null);
const applaud = ref(null);
const click = ref(null);

/* Tracks cloned "one-shot" sounds */
const activeClones = [];

/* Used to prevent applause firing multiple times */
let lastWinnerId = null;

/* Starts looping a sound if not already playing */
function playLoop(soundRef) {
  if (!soundRef.value) return;
  if (soundRef.value.paused) {
    soundRef.value.currentTime = 0;
    soundRef.value.play().catch(() => {});
  }
}

/* Plays a separate clone so it can overlap itself without cutting */
function playOnce(soundRef) {
  if (!soundRef.value) return;

  const clone = soundRef.value.cloneNode(true);
  clone.volume = soundRef.value.volume;
  activeClones.push(clone);

  clone.onended = () => {
    const idx = activeClones.indexOf(clone);
    if (idx !== -1) activeClones.splice(idx, 1);
    clone.remove();
  };

  clone.currentTime = 0;
  clone.play().catch(() => {});
}

/* Stops and rewinds a sound */
function stop(refEl) {
  if (!refEl.value) return;
  refEl.value.pause();
  refEl.value.currentTime = 0;
}

/* Handles switching ambient sounds when race state changes */
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

    /* Applaud only once per race */
    if (race.winner && race.winner.id !== lastWinnerId) {
      lastWinnerId = race.winner.id;

      stop(gallop);
      playOnce(applaud);

      setTimeout(() => {
        if (!document.hidden) playLoop(crowd);
      }, 3500);
    }

    if (!race.winner) {
      lastWinnerId = null;
    }
  },
  { deep: true }
);

/* Plays start signal when race begins */
watch(
  () => store.state.raceState.running,
  (running, oldVal) => {
    if (running && !oldVal) playOnce(startRace);
  }
);

/* Plays click sound on any button in the app */
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

/* Sets correct audio paths after build and starts crowd sound after first user click */
onMounted(() => {
  const basePath = import.meta.env.BASE_URL;

  document.querySelectorAll("audio").forEach((audio) => {
    const src = audio.getAttribute("src");
    if (src && src.startsWith("./")) {
      audio.src = basePath + src.replace("./", "");
    }
  });

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

/* Hard stop for all audio and clones (used when tab goes hidden) */
function pauseAllSounds() {
  [crowd, gallop, startRace, applaud, click].forEach((s) => {
    if (s.value) {
      s.value.pause();
      s.value.currentTime = 0;
      s.value.muted = true;
    }
  });

  activeClones.forEach((clone) => {
    clone.pause();
    clone.currentTime = 0;
    clone.remove();
  });
  activeClones.length = 0;
}

/* Restores ambient sound once user returns */
function resumeAmbient() {
  crowd.value.muted = false;
  gallop.value.muted = false;
  playLoop(crowd);
}

/* Functions exposed to parent (Layout.vue) */
defineExpose({ pauseAllSounds, resumeAmbient });
</script>
