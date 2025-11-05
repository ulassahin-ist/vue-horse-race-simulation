<template>
  <div class="container">
    <div class="title">HORSES</div>

    <!-- Shows all horses loaded from store -->
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Condition</th>
          <th>Color</th>
        </tr>
      </thead>

      <tbody>
        <!-- Displays one row per horse -->
        <tr v-for="(horse, index) in horses" :key="index">
          <td>{{ horse.name }}</td>
          <td>{{ horse.condition }}</td>

          <!-- Color preview box -->
          <td :style="{ background: `var(--${horse.color})` }">
            {{ horse.color }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Simple column layout */
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Basic table borders */
table,
td,
th {
  border: 1px solid var(--table-head);
  padding: 10px 2px;
}
</style>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

/* Pull horses directly from store */
const horses = computed(() => store.state.horses);
</script>
