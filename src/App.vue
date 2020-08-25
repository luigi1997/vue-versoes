<template>
  <v-app style="background-color: #90CAF9; font-family: 'Segoe UI';">
    <v-content style="height: 100vh;">
      <router-view />
    </v-content>

    <v-footer app color="white-1" fluid>
      <a href="https://www.olifel.pt/" target="_blank">
        <img
          src="@/assets/logo.png"
          alt="Olifel Logo"
          style="height: 20px; vertical-align: middle;"
        />
      </a>
      <v-spacer />
      <span style="font-weight: bold; font-size: 17px;">2020</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {};
  }
};
</script>
