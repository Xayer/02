<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html, body {
  padding: 0; margin: 0;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #000;
  & > div:not(#app) {
    width: 100%;
    height: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
  }
}
</style>
