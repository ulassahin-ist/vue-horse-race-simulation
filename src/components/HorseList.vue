<template>
  <div class="container">
    <div class="title">Horses</div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Condition</th>
          <th>Color</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(horse, index) in horses" :key="index">
          <td>{{ horse.name }}</td>
          <td>{{ horse.condition }}</td>
          <td :style="{ background: `var(--${horse.color})` }">
            {{ horse.color }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  flex: 1;
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const horses = computed(() => store.state.horses);
</script>
