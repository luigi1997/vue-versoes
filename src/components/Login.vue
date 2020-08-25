<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm4 md4 lg4 xl4>
        <v-form style="text-align: center;">
          <v-hover v-slot:default="{ hover }">
            <v-layout align-center justify-center>
              <v-card
                class="align-center justify-center mb-10"
                :elevation="hover ? 12 : 1"
                style="width:250px; height:250px;"
              >
                <img
                  class="elevation-1"
                  style="width:100%; height:100%;"
                  src="@/assets/visualgest.png"
                  alt="VisualGest Logo"
                />
              </v-card>
            </v-layout>
          </v-hover>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="mb-3 pa-1"
            style="background-color: white; font-weight: bold; font-size: 17px; width: 100%;"
            @keyup.enter="login()"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="mb-4 pa-1"
            style="background-color: white; font-weight: bold; font-size: 17px; width: 100%;"
            @keyup.enter="login()"
          />
          <v-btn
            :loading="loadingLogin"
            class="text-none ma-2 px-12"
            style="background-color: white; font-weight: bold; font-size: 17px;"
            color="black"
            @click="login()"
            outlined
          >Login</v-btn>
          <p style="color: red; font-size: 17px;">{{ erroLogin }}</p>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const axios = require("axios");

export default {
  name: "Login",
  data: () => ({
    erroLogin: "",
    loadingLogin: false,
    email: "",
    password: ""
  }),
  created() {
    this.$vuetify.theme.dark = false;
    if (localStorage.getItem("access_token"))
      this.$router.push({ path: "/main" });
  },
  methods: {
    login() {
      if (
        !this.email ||
        !this.password ||
        !this.email.includes("@") ||
        !this.email.includes(".")
      ) {
        this.erroLogin = "Email ou password incorretos.";
        return;
      }
      this.loadingLogin = true;

      var url =
        process.env.VUE_APP_LOCALHOST +
        "/Utilizadores/CheckUtilizador?email=" +
        this.email +
        "&password=" +
        this.password;

      axios
        .get(url)
        .then(response => {
          this.erroLogin = "";
          localStorage.setItem("access_token", response.data.toLowerCase());
          this.$router.push({ path: "/main" });
          return response;
        })
        .catch(error => {
          this.erroLogin = "Email ou password incorretos.";
          localStorage.removeItem("access_token");
          return error;
        })
        .finally(fin => {
          this.loadingLogin = false;
          return fin;
        });
    }
  }
};
</script>
