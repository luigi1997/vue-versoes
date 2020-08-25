<template>
  <v-container px-3 ma-0 fluid>
    <v-app-bar app style="background-color: #90CAF9;" class="elevation-1 px-1">
      <div
        style="font-weight: bold; font-size: 22px; width:100%; text-align: center; position: absolute; background: none;"
      >
        <span>Atualizações</span>
      </div>
      <v-spacer />
      <v-btn
        class="elevation-2 px-2"
        style="background-color: white;"
        outlined
        onclick="history.back()"
      >
        <span class="text-none">Voltar</span>
      </v-btn>
    </v-app-bar>

    <v-card :loading="loadingVersoes">
      <div>
        <v-data-table
          :headers="headers"
          :items="clientesVersoes"
          :search="search"
          :footer-props="{itemsPerPageOptions: [10,50,100]}"
          :items-per-page="10"
          sort-by="data_distribuicao"
          :mobile-breakpoint="540"
        >
          <template v-slot:top>
            <v-card-title class="elevation-1 pt-4 pb-0">
              <v-text-field
                v-model="search"
                class="pa-0 ma-0 shine"
                placeholder="Procura"
                prepend-inner-icon="mdi-magnify"
                :disabled="loadingVersoes"
              ></v-text-field>
            </v-card-title>
          </template>
          <template v-slot:item.cliente_ID="{ item }">
            <a @click="checkCliente(item)">{{ item.cliente_ID }}</a>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </v-container>
</template>
<script>
const axios = require("axios");

export default {
  name: "Atualizacoes",
  data: () => ({
    admin: false,
    loadingVersoes: true,
    clientesVersoes: [],
    search: "",
    headers: [
      {
        text: "Nome",
        value: "cliente_nome",
      },
      {
        text: "ID",
        value: "cliente_ID",
      },
      {
        text: "Versão",
        value: "versao_nome",
      },
      {
        text: "Versão_ID",
        value: "versao_ID",
      },
      {
        text: "Data",
        value: "data_distribuicao",
      },
    ],
  }),
  created() {
    this.$vuetify.theme.dark = false;
    this.admin = localStorage.getItem("access_token") == "true";
    if (!localStorage.getItem("access_token"))
      this.$router.push({ path: "/login" });

    this.getRequest_Versoes_Clientes();
  },
  methods: {
    getRequest_Versoes_Clientes() {
      this.loadingVersoes = true;
      axios
        .get(
          process.env.VUE_APP_LOCALHOST +
            "/VersoesClientes/GetVersaoMaisRecenteParaCadaCliente"
        )
        .then((response) => {
          this.clientesVersoes = response.data;

          this.clientesVersoes.forEach((element) => {
            element.data_distribuicao = new Date(
              element.data_distribuicao
            ).toLocaleString();
          });

          this.loadingVersoes = false;
        })
        .catch((error) => {
          return error;
        });
    },
    checkCliente(item) {
      this.$router.push({ path: "/cliente/" + item.cliente_ID });
    },
  },
};
</script>

<style>
@keyframes yellowToWhite {
  from {
    background-color: gray;
  }
  to {
    background-color: white;
  }
}
.shine {
  animation-name: yellowToWhite;
  animation-duration: 1s;
}
tbody tr:nth-of-type(even) {
  background-color: rgba(0, 0, 0, 0.05);
}
.v-text-field > .v-input__control > .v-input__slot {
  margin-bottom: 0px;
}
</style>