<template>
  <Layout />
</template>

<script setup>
import Layout from "./components/Layout.vue";
</script>

<style>
:root {
  --scroll-offset: 70px;
  --header: #1c2331;
  --white-bg: #eaeaea;
  --table-bg: #ffffff;
  --table-head: #e1e1e1;

  /* Horse Colors */
  --reddish: #ff5733;
  --green: #33ff57;
  --blue: #3357ff;
  --yellow: #f1c40f;
  --purple: #9b59b6;
  --orange: #e67e22;
  --teal: #1abc9c;
  --dark-orange: #d35400;
  --emerald-green: #2ecc71;
  --sky-blue: #3498db;
  --red: #e74c3c;
  --dark-purple: #8e44ad;
  --deep-blue: #2980b9;
  --turquoise: #16a085;
  --bright-orange: #f39c12;
  --crimson: #c0392b;
  --gray: #7f8c8d;
  --silver: #bdc3c7;
  --dark-navy: #2c3e50;
  --pink: #ff69b4;
}
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
  height: 100vh;
  width: 100vw;
}
</style>
