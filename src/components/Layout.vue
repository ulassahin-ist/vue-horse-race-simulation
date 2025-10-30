<template>
  <div class="layout">
    <!-- Controls -->
    <header>
      <HeaderControls />
    </header>
    <!-- Page -->
    <div class="main-page">
      <aside
        class="horse-list sidebar"
        :class="{ invisible: !(store.state.horses.length > 0) }"
      >
        <HorseList />
      </aside>
      <section class="race-track">
        <RaceTrack />
      </section>
      <aside class="race-info">
        <div class="race-programs sidebar">
          <RacePrograms />
        </div>
        <div class="race-results sidebar">
          <RaceResults />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import HeaderControls from "./HeaderControls.vue";
import HorseList from "./HorseList.vue";
import RaceTrack from "./RaceTrack.vue";
import RacePrograms from "./RacePrograms.vue";
import RaceResults from "./RaceResults.vue";
import { useStore } from "vuex";
const store = useStore();
</script>

<style>
.invisible {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.layout {
  height: 100vh;
  width: 100vw;
  font-family: "Poppins", sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
}
/* Header */
header {
  background: red;
  width: 100vw;
}
/* Page Root*/
.main-page {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
  gap: 10px;
  padding: 10px;
  background: green;
}
/* Sidebars and Tables */
.sidebar {
  position: relative;
  background: var(--table-bg);
  overflow: auto;
  height: calc(100vh - var(--scroll-offset));
  padding: 0;
  padding-left: 1px;
  padding-right: 1px;
}
.sidebar .title {
  font-weight: 600;
  border: 1px solid black;
  position: sticky;
  top: 0;
}

table,
td,
th {
  border: 1px solid var(--table-head);
  padding: 5px 3px;
}
th {
  font-weight: 600;
  letter-spacing: 1px;
  background: var(--table-head);
}

table {
  border-collapse: collapse;
  font-size: 10px;
}

.race-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
