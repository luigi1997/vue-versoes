<template>
  <v-container fill-height>
    <v-app-bar app style="background-color: #90CAF9;" class="elevation-1 mx-1">
      <div
        style="font-weight: bold; font-size: 22px; width:100%; text-align: center; position: absolute; background: none;"
      >
        <span v-if="grupo.id != null">Grupo {{ grupo.nome }}</span>
        <span v-if="grupo.id == null">Grupos</span>
      </div>
      <v-btn
        class="elevation-2 px-2"
        style="background-color: white; font-weight: bold; font-size: 14px;"
        @click="showDrawer = !showDrawer"
        outlined
      >
        <v-icon>menu</v-icon>
        <span class="text-none pl-1 d-none d-sm-flex">Escolher Grupo</span>
      </v-btn>
      <v-spacer />
      <v-btn
        class="elevation-2 px-2"
        style="background-color: white; font-weight: bold; font-size: 14px;"
        outlined
        onclick="history.back()"
      >
        <span class="text-none">Voltar</span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="showDrawer">
      <v-toolbar class="elevation-1">
        <v-row class="align-center justify-center">
          <img @click="showDrawer = !showDrawer" src="@/assets/logo.png" alt="Olifel Logo" />
        </v-row>
      </v-toolbar>

      <v-list shaped class="pa-0" dense>
        <v-list-item-group>
          <v-list-item :ripple="false" v-for="item in grupos" :key="item.id" @click="grupo = item">
            <v-list-item-content>
              <v-list-item-title
                class="pa-1"
                style="font-weight: bold; font-size: 17px;"
              >Grupo {{ item.nome }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-container>
      <v-row>
        <v-col>
          <v-card :loading="loadingGrupos">
            <v-card-title class="elevation-1">
              <div style="font-weight: bold; font-size: 22px;">
                <span v-if="grupo.id != null">Dados do Grupo</span>
                <span v-if="grupo.id == null">Criar Grupo</span>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                v-if="grupo.id != null"
                @click="clearDados()"
                outlined
                class="elevation-2 mr-2"
              >
                <v-icon>mdi-account-multiple-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="align-self-center">
                    <v-text-field dense v-model="grupo.id" label="ID" required disabled></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="align-self-center">
                    <v-text-field dense v-model="grupo.nome" :disabled="loadingGrupos" label="Nome"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="align-self-center">
                    <v-text-field
                      dense
                      v-model="grupo.hora_distribuicao"
                      :disabled="loadingGrupos"
                      label="Hora de Distribuição"
                      type="time"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-row v-if="grupo.id != 0" class="justify-space-around">
                      <v-btn
                        class="ma-3 text-none elevation-5"
                        style="font-weight: bold; font-size: 14px;"
                        v-if="grupo.id == null"
                        :disabled="loadingGrupos || grupo.id == 0 || grupo.id != null || !grupo.nome || !grupo.hora_distribuicao"
                        @click="criar()"
                        outlined
                      >Criar Grupo</v-btn>
                      <v-btn
                        class="ma-3 text-none elevation-5"
                        style="font-weight: bold; font-size: 14px;"
                        v-if="grupo.id != null"
                        :disabled="loadingGrupos || !grupo.id || !grupo.nome || !grupo.hora_distribuicao"
                        @click="editar()"
                        outlined
                      >Editar</v-btn>
                      <v-btn
                        class="ma-3 text-none elevation-5"
                        style="font-weight: bold; font-size: 14px;"
                        v-if="grupo.id != null"
                        :disabled="loadingGrupos || !grupo.id"
                        @click="eliminar()"
                        outlined
                      >Eliminar</v-btn>
                      <v-btn
                        class="ma-3 text-none elevation-5"
                        style="font-weight: bold; font-size: 14px;"
                        @click="getRequest_Grupos()"
                        outlined
                      >Reset</v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-overlay white :value="overlay">
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

<script>
const axios = require("axios");

export default {
  name: "Grupos",
  data: () => ({
    admin: false,
    overlay: false,
    snackbar: false,
    simNaoBtns: false,
    messageTitulo: "Erro 404...",
    messageColor: "red",
    tipo: "",
    showDrawer: true,
    loadingGrupos: true,
    grupos: [],
    grupo: {}
  }),
  created() {
    this.$vuetify.theme.dark = false;
    this.admin = localStorage.getItem("access_token") == "true";
    if (!localStorage.getItem("access_token") || !this.admin) {
      this.$router.push({ path: "/login" });
    }
    this.getRequest_Grupos();
  },
  methods: {
    criar() {
      this.tipo = "criarGrupo";
      this.messageTitulo = "Tem a certeza que pretende criar o grupo?";
      this.messageColor = "#00396c";
      this.simNaoBtns = true;
      this.snackbar = false;
      this.overlay = true;
    },
    editar() {
      this.tipo = "editarGrupo";
      this.messageTitulo = "Tem a certeza que pretende editar o grupo?";
      this.messageColor = "#00396c";
      this.simNaoBtns = true;
      this.snackbar = false;
      this.overlay = true;
    },
    eliminar() {
      this.tipo = "eliminarGrupo";
      this.messageTitulo = "Tem a certeza que pretende eliminar o grupo?";
      this.messageColor = "#00396c";
      this.simNaoBtns = true;
      this.snackbar = false;
      this.overlay = true;
    },
    simAction() {
      this.overlay = false;
      if (this.tipo == "criarGrupo") {
        this.addGrupoToDB();
      } else if (this.tipo == "editarGrupo") {
        this.editGrupoOnDB();
      } else if (this.tipo == "eliminarGrupo") {
        this.deleteGrupoFromDB();
      } else {
        this.messageTitulo = "Erro 404...";
        this.messageColor = "red";
        this.tipo = "";
        this.simNaoBtns = false;
        this.snackbar = false;
        this.overlay = true;
      }
      this.simNaoBtns = false;
    },
    naoAction() {
      this.overlay = false;

      this.messageTitulo = "Erro 404...";
      this.messageColor = "red";
      this.tipo = "";
      this.simNaoBtns = false;
    },
    getRequest_Grupos() {
      this.loadingGrupos = true;
      axios
        .get(process.env.VUE_APP_LOCALHOST + "/Grupos/GetGrupos")
        .then(response => {
          this.grupos = response.data;

          this.grupo = this.grupos[this.grupos.length - 1];

          this.loadingGrupos = false;
        })
        .catch(error => {
          this.messageTitulo = "Erro ao carregar os grupos!";
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
          return error;
        });
    },
    addGrupoToDB() {
      if (this.checkInputs(this.grupo)) {
        var url = process.env.VUE_APP_LOCALHOST + "/Grupos/PostGrupo";

        this.loadingGrupos = true;

        axios
          .post(url, this.grupo)
          .then(response => {
            this.messageTitulo = "Grupo criado com sucesso!";
            this.messageColor = "green";
            this.snackbar = true;

            this.getRequest_Grupos();

            return response;
          })
          .catch(error => {
            this.messageTitulo = "Erro ao criar o grupo!";
            this.messageColor = "red";
            this.snackbar = true;
            return error;
          })
          .finally((this.loadingGrupos = false));
      }
    },
    editGrupoOnDB() {
      if (!this.grupo.id) {
        return;
      }
      var url =
        process.env.VUE_APP_LOCALHOST + "/Grupos/PutGrupo?id=" + this.grupo.id;

      this.loadingGrupos = true;

      if (this.checkInputs(this.grupo)) {
        axios
          .put(url, this.grupo)
          .then(response => {
            this.messageTitulo = "Grupo editado com sucesso!";
            this.messageColor = "green";
            this.snackbar = true;
            this.getRequest_Grupos();
            return response;
          })
          .catch(error => {
            this.messageTitulo = "Erro ao editar o grupo!";
            this.messageColor = "red";
            this.snackbarv = true;
            return error;
          })
          .finally((this.loadingGrupos = false));
      }
    },
    deleteGrupoFromDB() {
      if (!this.grupo.id) {
        return;
      }
      var url =
        process.env.VUE_APP_LOCALHOST +
        "/Grupos/DeleteGrupo?id=" +
        this.grupo.id;

      this.loadingGrupos = true;

      axios
        .delete(url)
        .then(response => {
          this.messageTitulo = "Grupo eliminado com sucesso!";
          this.messageColor = "green";
          this.snackbar = true;

          this.getRequest_Grupos();

          this.grupo = {};

          return response;
        })
        .catch(error => {
          this.messageTitulo =
            "Erro ao eliminar o grupo! O grupo pode estar associado a um cliente!";
          this.messageColor = "red";
          this.snackbar = true;
          return error;
        })
        .finally((this.loadingGrupos = false));
    },
    clearDados() {
      this.grupo = {};
    },
    checkInputs(grupo) {
      var return_value = true;

      if (!grupo) {
        return_value = false;
        console.log("%cGrupo não pode ser null.", "red");
      }

      if (grupo.nome) {
        //ok
      } else {
        return_value = false;
        this.messageTitulo = "Nome do grupo é um parametro obrigatório!";
        this.messageColor = "red";
        this.snackbar = false;
        this.overlay = true;
      }

      if (grupo.hora_distribuicao) {
        //ok
      } else {
        return_value = false;
        this.messageTitulo = "Hora de distribuição é um parametro obrigatório!";
        this.messageColor = "red";
        this.snackbar = false;
        this.overlay = true;
      }

      return return_value;
    }
  }
};
</script>

<style>
.v-toolbar__content {
  padding: 0px;
}
</style>
