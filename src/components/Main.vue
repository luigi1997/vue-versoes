<template>
  <v-container fluid px-3 style="height:100%;">
    <v-app-bar app style="background-color: #90CAF9;" class="elevation-1 px-1">
      <div
        style="font-weight: bold; font-size: 22px; width:100%; text-align: center; position: absolute; background: none;"
      >
        <span v-if="!loadingVersoes">Versão {{ versao.tag_name }}</span>
        <span v-if="loadingVersoes">Versões</span>
      </div>
      <v-btn
        @click="showDrawer = !showDrawer"
        class="elevation-2 px-2"
        style="background-color: white;"
        color="black"
        outlined
      >
        <v-icon>menu</v-icon>
        <span class="text-none d-none d-sm-flex">Escolha a Versão</span>
      </v-btn>
      <v-spacer />
      <v-btn
        class="elevation-2 px-2"
        style="background-color: white;"
        color="black"
        @click="logout()"
        outlined
      >
        <span class="text-none d-none d-sm-flex pr-1">Logout</span>
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="showDrawer">
      <v-toolbar class="elevation-1">
        <v-row class="align-center justify-center">
          <img @click="showDrawer = !showDrawer" src="@/assets/logo.png" alt="Olifel Logo" />
        </v-row>
      </v-toolbar>

      <v-list v-if="!loadingVersoes" shaped class="pa-0" dense>
        <v-list-item-group>
          <v-list-item
            :color="item.distribuida ? 'green' : 'black'"
            :ripple="false"
            v-for="item in versoes"
            :key="item.id"
            @click="versao = item, getRequest_Clientes_Versao(item.tag_name)"
          >
            <v-list-item-content>
              <v-list-item-title
                style="font-weight: bold; font-size: 17px;"
              >Versão {{ item.tag_name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-container pa-0 style="height: 100%;" fluid>
      <v-row style="height: 100%;">
        <v-col :xs="12" :s="6" style="max-height: 100%;">
          <v-card
            :loading="loadingVersoes"
            class="text-justify"
            style="height: 100%; overflow: auto; width: 100%;"
          >
            <v-card-title class="elevation-1 pa-2">
              <span style="font-weight: bold;">Detalhes da versão</span>
            </v-card-title>
            <v-card-text
              v-if="!loadingVersoes"
              class="px-3 pt-3"
              style="color:black; font-size: 16px;"
            >
              <div>
                <span
                  v-if="!versao.distribuida"
                  style="color:red; font-weight: bold;"
                >Ainda não foi distribuida</span>
                <span
                  v-if="versao.distribuida"
                  style="color:green; font-weight: bold;"
                >Já foi distribuida</span>
              </div>
              <div>
                <span style="font-weight: bold;" class="pr-1">Id:</span>
                <span>{{ versao.id }}</span>
              </div>
              <div>
                <span style="font-weight: bold;" class="pr-1">Tag_name:</span>
                <span>{{ versao.tag_name }}</span>
              </div>
              <div>
                <span style="font-weight: bold;" class="pr-1">Nome:</span>
                <span>{{ versao.name }}</span>
              </div>
              <div>
                <span style="font-weight: bold;" class="pr-1">Data de lançamento:</span>
                <span>
                  {{ new Date(
                  versao.published_at.split("T")[0]
                  ).toLocaleDateString() }}
                </span>
              </div>
              <div class="mt-4">
                <span class="mt-4" style="font-weight: bold;">Descrição:</span>
              </div>
              <div>
                <span style="white-space: pre-line;">{{ versao.body }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :xs="12" :s="6">
          <v-row v-if="admin" class="ma-0 d-flex justify-space-between">
            <v-select
              style="max-width:180px; font-weight: bold;"
              class="mb-2 select"
              label="Tipo de distribuição"
              v-model="tipo_distribuicao"
              v-on:change="setClientes"
              :items="tipos"
              outlined
              dense
            ></v-select>
            <v-btn
              :disabled="clientes_selecionados.length == 0 || loadingClientes"
              style="background-color: white;"
              class="elevation-3 px-2 mb-2"
              color="green accent-4"
              @click="distribuir"
              outlined
            >
              <span class="text-none pr-1">Distribuir Versão</span>
              <v-icon>mdi-cube-send</v-icon>
            </v-btn>

            <v-btn
              style="background-color: white;"
              class="elevation-3 px-2 mb-2"
              color="black"
              outlined
              to="/grupos"
            >
              <span class="text-none pr-1">Gerir Grupos</span>
              <v-icon>mdi-account-group</v-icon>
            </v-btn>
            <v-btn
              style="background-color: white;"
              class="elevation-3 px-2 mb-2"
              color="black"
              outlined
              to="/atualizacoes"
            >
              <span class="text-none pr-1">Catálogo de Atualizações</span>
              <v-icon>mdi-book-open</v-icon>
            </v-btn>
          </v-row>
          <v-card :loading="loadingClientes" style="font-size: 20px;  overflow: auto; width: 100%;">
            <div>
              <v-data-table
                v-model="clientes_selecionados"
                :headers="headers"
                :items="clientes"
                :search="search"
                :footer-props="{itemsPerPageOptions: [10,50,100]}"
                :items-per-page="10"
                sort-by="data_criacao"
                sort-desc
                show-select
                dense
                :mobile-breakpoint="550"
              >
                <template v-slot:top>
                  <v-card-title class="elevation-1 pa-3">
                    <div>
                      <span class="d-none d-sm-flex" style="font-weight: bold;">Clientes</span>
                    </div>
                    <v-text-field
                      v-model="search"
                      style="color:black;"
                      class="pa-0 px-4 ma-0 fluid"
                      placeholder="Procura"
                      prepend-inner-icon="mdi-magnify"
                      :disabled="loadingClientes"
                      hide-details
                    ></v-text-field>
                    <v-btn v-if="admin" to="/cliente" outlined class="elevation-2">
                      <v-icon>mdi-account-plus</v-icon>
                    </v-btn>
                  </v-card-title>
                </template>

                <template
                  v-slot:item.data-table-select
                  v-if="tipo_distribuicao=='Público' || !admin"
                  class="d-flex"
                ></template>

                <template v-slot:item.actions="{ item }">
                  <v-btn v-if="admin" class="elevation-0" @click="checkCliente(item)" small fab>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-overlay :value="overlay">
      <v-card :color="messageColor" class="mx-4">
        <v-card-title>
          <span style="font-weight: bold; font-size: 20px;">{{ messageTitulo }}</span>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="false"
            class="elevation-2 ml-3"
            fab
            x-small
            style="background-color: white;"
            color="black"
            outlined
            @click="overlay = false"
          >
            <v-icon>mdi-close-thick</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="simNaoBtns">
          <v-row class="ma-1 mt-4 mb-0">
            <v-spacer></v-spacer>
            <v-text-field
              v-if="horaMessage"
              dense
              class="mx-2 text-none"
              v-model="hora"
              label="Hora de Distribuição *"
              type="time"
              required
            ></v-text-field>
            <v-btn class="mx-2 text-none" outlined @click="simAction()">Sim</v-btn>
            <v-btn class="mx-2 text-none" outlined @click="naoAction()">Não</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-overlay>

    <v-snackbar
      v-model="snackbar"
      :color="messageColor"
      class="pa-3 ma-0"
      :timeout="5000"
      :right="true"
      :bottom="true"
    >
      <span style="font-weight: bold; font-size: 20px;">{{ messageTitulo }}</span>
    </v-snackbar>
  </v-container>
</template>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>

<script>
const axios = require("axios");

export default {
  name: "Versoes",
  data: () => ({
    admin: false,
    overlay: false,
    snackbar: false,
    simNaoBtns: false,
    messageTitulo: "Erro 404...",
    messageColor: "red",
    horaMessage: false,
    hora: "",
    tipo: "",
    showDrawer: true,
    loadingClientes: true,
    loadingVersoes: true,
    headers: [
      {
        text: "Nome",
        value: "nome",
      },
      {
        text: "Grupo",
        value: "grupo_nome",
      },
      {
        text: "Versão",
        value: "versao_nome",
      },
      {
        value: "actions",
        sortable: false,
      },
    ],
    versao: null,
    versoes: [],
    tipo_distribuicao: "Público",
    tipos: ["Público", "Por Cliente"],
    search: "",
    grupos: [],
    clientes: [],
    clientes_selecionados: [],
    erroDistribuir: false,
  }),
  created() {
    this.$vuetify.theme.dark = false;
    this.admin = localStorage.getItem("access_token") == "true";
    if (!localStorage.getItem("access_token")) {
      this.$router.push({ path: "/login" });
    }

    //
    this.getRequest_Versoes_GIT();
  },
  methods: {
    logout() {
      localStorage.removeItem("access_token");
      this.$router.push({ path: "/login" });
    },
    checkCliente(item) {
      this.$router.push({ path: "/cliente/" + item.id });
    },
    distribuir() {
      this.hora = "";
      this.showDrawer = false;
      if (this.clientes_selecionados.length > 0) {
        this.tipo = "distribuirVersao";
        this.messageTitulo =
          "Tem a certeza que pretende distribuir esta versão para os clientes selecionados?";
        this.horaMessage = true;
        this.messageColor = "#00396c";
        this.simNaoBtns = true;
        this.overlay = true;
      }
    },
    simAction() {
      this.horaMessage = false;
      if (this.tipo == "distribuirVersao") {
        this.overlay = false;
        this.distribuirSelecionados();
      } else {
        this.messageTitulo = "Erro 404...";
        this.messageColor = "red";
        this.tipo = "";
        this.simNaoBtns = false;
      }
      this.simNaoBtns = false;
    },
    naoAction() {
      this.messageTitulo = "Erro 404...";
      this.messageColor = "red";
      this.tipo = "";
      this.simNaoBtns = false;
      this.overlay = !this.overlay;
    },
    async postVersao(versao) {
      var url = process.env.VUE_APP_LOCALHOST + "/Versoes/PostVersao";
      versao.id = versao.id.toString();

      //
      return await axios
        .post(url, versao)
        .then((response) => {
          console.log("Ok versao criada.");
          return true;
        })
        .catch((error) => {
          console.log("Erro ao criar versao.", error);
          this.erroDistribuir = true;
          return false;
        });
    },
    async postVersaoCliente(cliente) {
      var url =
        process.env.VUE_APP_LOCALHOST +
        "/VersoesClientes/PostDistribuirVersaoCliente" +
        "?hora=" +
        this.hora;

      var versao_cliente = {
        cliente_ID: cliente.id,
        versao_ID: this.versao.id,
      };

      await axios
        .post(url, versao_cliente)
        .then((response) => {
          console.log("Versao Distribuida com sucesso.");
        })
        .catch((error) => {
          console.log("Erro ao distribuir para o cliente.", error);
          console.log(versao_cliente);
          this.erroDistribuir = true;
          return error;
        });
    },
    //distribui/atualiza na BD a versao do cliente
    async distribuirSelecionados() {
      var versao_guardada = await this.postVersao(this.versao);

      if (versao_guardada) {
        for (let i = 0; i < this.clientes_selecionados.length; i++) {
          await this.postVersaoCliente(this.clientes_selecionados[i]);
        }
        this.getRequest_Versoes_GIT();
      }

      if (!this.erroDistribuir && versao_guardada) {
        this.messageTitulo = "Versão distribuida com sucesso!";
        this.messageColor = "green";
      } else {
        console.log("Erro na distribuicao");
        this.messageTitulo = "Versão não foi distribuida!";
        this.messageColor = "red";
      }
      this.simNaoBtns = false;
      this.tipo = "";
      this.snackbar = true;
    },
    //se o tipo de distribuiçao for publico seleciona todos os clientes
    setClientes() {
      this.clientes_selecionados = [];
      if (this.tipo_distribuicao == "Público")
        this.clientes_selecionados = this.clientes;
    },
    //pedido get das versoes à BD
    getRequest_Versoes() {
      this.loadingVersoes = true;
      axios
        .get(process.env.VUE_APP_LOCALHOST + "/Versoes/GetVersoes")
        .then((response) => {
          //replace
          for (var i in response.data) {
            for (var j = 0; j < this.versoes.length; j++) {
              if (this.versoes[j].id == response.data[i].id) {
                this.versoes.splice(j, 1);
              }
            }
            response.data[i].distribuida = true;
            this.versoes.push(response.data[i]);
          }

          //sort
          this.versoes.sort(function (a, b) {
            try {
              return b.id - a.id;
            } catch (Exception) {
              return 1;
            }
          });

          this.versao = this.versoes[0];
          this.loadingVersoes = false;
          this.getRequest_Clientes_Versao(this.versao.tag_name);
        })
        .catch((error) => {
          return error;
        });
    },
    //pedido get das versoes ao git
    async getRequest_Versoes_GIT() {
      this.loadingVersoes = true;
      axios
        .get("https://api.github.com/repos/olifel/VisualGest.net/releases", {
          headers: {
            Authorization: "token e8bad18a165581ee8f1cc4e5580d90b7fd1e1f21",
          },
        })
        .then((response) => {
          this.versoes = response.data;
          this.getRequest_Versoes();
          this.versao = this.versoes[0];
        })
        .catch((error) => {
          return error;
        });
    },
    //pedido get dos clientes à BD
    getRequest_Clientes_Versao(versao_tag_name) {
      this.loadingClientes = true; //barra que mostra loading dos clientes é desligada

      var url =
        process.env.VUE_APP_LOCALHOST +
        "/Clientes/GetClientesAutorizadosParaVersao?versao_tag_name=" +
        versao_tag_name;

      //url = process.env.VUE_APP_LOCALHOST + "/Clientes/GetClientesDados";

      axios
        .get(url)
        .then((response) => {
          this.clientes = response.data;
          this.loadingClientes = false; //barra que mostra loading dos clientes é desligada

          this.setClientes();
        })
        .catch((error) => {
          this.messageTitulo = "Erro ao carregar os clientes!";
          this.messageColor = "red";
          this.snackbar = true;
          if (!error.response) {
            console.log(
              "%cErro: Internet fraca ou servidor nao esta ligado!",
              "color: red"
            );
          } else {
            console.log("%cError: Network Error", "color: red");
            console.log(error.response.data.message);
          }
        });
    },
  },
};
</script>
<style>
.select .v-text-field__details {
  display: none;
}
</style>