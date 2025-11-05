<template>
  <div class="container">
    <!-- Section title -->
    <div class="title">PROGRAM</div>

    <!-- Each race block -->
    <div v-for="race in races" :key="race.id">
      <!-- Race header showing lap number + distance -->
      <div class="race-title">
        {{ race.id }}{{ ordinal(race.id) }} Lap - {{ race.distance }}m
      </div>

      <!-- Race horses table -->
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(horse, index) in race.horses" :key="horse.id">
            <!-- Horse listed in program order -->
            <td>{{ index + 1 }}</td>
            <td>{{ horse.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

<script setup>
/* Pull race list from vuex store */
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

/* All races shown in sidebar */
const races = computed(() => store.state.races);

/* Converts race number → ST / ND / RD / TH */
function ordinal(id) {
  const map = { 1: "ST", 2: "ND", 3: "RD" };
  return map[id] ?? "TH";
}
</script>
