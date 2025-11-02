<template>
  <Layout />
</template>

<script setup>
import Layout from "./components/Layout.vue";
</script>

<style>
:root {
  --horse-width: 90px;
  --scroll-offset: 96px;
  --title-offset: 57px;
  --header: #1c2331;
  --header-bg: #ffffff;
  --white-bg: #eaeaea;
  --table-bg: #ffffff;
  --table-head: #e1e1e1;
  --table-race-title: indianred;

  /* Sidebar Titles */
  --sb-title-horse: #ebff7b;
  --sb-title-program: #7bffb2;
  --sb-title-result: #ae7bff;

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
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}
/* Global Button Styling   */
button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #ffffff;
  color: rgb(27, 27, 31);
  border: 3px solid #d0d0d0;
  cursor: pointer;
  box-shadow: 4px 4px 0 #c7c7c7;
  transition: all 0.1s steps(1);
  image-rendering: pixelated;
  outline: none;
}
button:hover {
  background: #f9f9f9;
}
button:active {
  box-shadow: none;
  transform: translate(4px, 4px);
  outline: none;
}
button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
  transform: translate(4px, 4px);
}
</style>
