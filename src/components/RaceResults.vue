<template>
  <div class="container">
    <div class="title">RESULTS</div>

    <!-- One block per finished race -->
    <div v-for="race in results" :key="race.id" class="result-block">
      <div class="race-title">
        {{ race.id }}{{ ordinal(race.id) }} Lap – {{ raceDistance(race.id) }}m
      </div>

      <!-- Finishing order -->
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          <!-- Horse order is already sorted by result -->
          <tr v-for="(horse, i) in race.horses" :key="horse.id">
            <td>{{ i + 1 }}</td>
            <td>{{ horse.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick, defineEmits } from "vue";
import { useStore } from "vuex";

const store = useStore();

/* Current results list */
const results = computed(() => store.state.results);

const props = defineProps({
  scrollRef: Object,
});

/* Used to auto-scroll when a new result arrives */
const emit = defineEmits(["scrollToBottom"]);

/* Converts race number → ST / ND / RD / TH */
function ordinal(id) {
  const map = { 1: "ST", 2: "ND", 3: "RD" };
  return map[id] ?? "TH";
}

/* Pulls race distance using race index */
function raceDistance(id) {
  return store.state.races[id - 1]?.distance || "?";
}

/* When results update, scroll list to the bottom */
watch(
  results,
  async () => {
    await nextTick();
    emit("scrollToBottom");
  },
  { deep: true }
);
</script>

<style scoped>
/* Matches layout of other components */
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
