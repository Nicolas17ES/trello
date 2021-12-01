<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
html {
  background-image: url("./assets/lukas-blazek-EWDvHNNfUmQ-unsplash.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  
  text-align: center;
  color: rgb(95, 126, 107);
}
</style>
