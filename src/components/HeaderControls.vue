<template>
  <div class="container">
    <div class="title">Horse Racing</div>
    <button @click="generateHorses">Generate Horses</button>
    <button>Generate Program</button>
    <button>Start</button>
  </div>
</template>

<style scoped>
.container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  gap: 10px;
}
.title {
  margin-right: auto;
  font-weight: 600;
}
button {
  padding: 5px 3px;
}
</style>

<script setup>
import { useStore } from "vuex";
const store = useStore();
function generateHorses() {
  store.dispatch("generateHorses");
}
</script>
