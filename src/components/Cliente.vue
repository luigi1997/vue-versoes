<template>
  <v-container fill-height>
    <v-app-bar app style="background-color: #90CAF9;" class="elevation-1 px-1">
      <div
        style="font-weight: bold; font-size: 22px; width:100%; text-align: center; position: absolute; background: none;"
      >
        <span v-if="!loadingCliente && cliente.id">{{ cliente.nome }}</span>
        <span v-if="loadingCliente || !cliente.id">Clientes</span>
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

    <v-card :loading="loadingCliente || loadingGrupos" :disabled="loadingCliente || loadingGrupos">
      <v-card-title class="elevation-1">
        <div style="font-weight: bold; font-size: 22px;">
          <span v-if="cliente.id != null">Dados do Cliente</span>
          <span v-if="cliente.id == null">Criar Cliente</span>
        </div>
        <v-spacer></v-spacer>
        <v-btn v-if="id" @click="createClienteReset()" outlined class="elevation-2 mr-2">
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
        <v-btn
          style="background-color: white; font-weight: bold; font-size: 14px;"
          class="elevation-2 px-2"
          color="black"
          outlined
          to="/grupos"
        >
          <v-icon>mdi-account-group</v-icon>
          <span class="text-none pl-1">Gerir Grupos</span>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" class="align-self-center">
              <v-text-field label="ID" v-model="cliente.id" dense disabled></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field
                label="Nome *"
                maxlength="80"
                v-model="cliente.nome"
                :rules="rules.obrigatorio"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-select
                label="Grupo"
                :items="grupos"
                item-text="nome"
                item-value="id"
                v-model="cliente.grupo"
                dense
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Versão Atual" v-model="cliente.versao_nome" disabled dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field
                label="Classe *"
                maxlength="5"
                v-model="cliente.classe"
                :rules="rules.obrigatorio"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field
                label="Terceiro *"
                maxlength="8"
                v-model="cliente.terceiro"
                :rules="rules.obrigatorio"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-checkbox label="Contrato Assistência" v-model="cliente.contrato_assistencia" dense></v-checkbox>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Morada" maxlength="80" v-model="cliente.morada" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Localidade" maxlength="50" v-model="cliente.localidade" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Código-Postal" maxlength="80" v-model="cliente.cpostal" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Email" maxlength="50" v-model="cliente.email" type="email" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Telefone" maxlength="20" v-model="cliente.telefone" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Fax" maxlength="20" v-model="cliente.fax" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="NIF" maxlength="20" v-model="cliente.nif" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field label="Observações" v-model="cliente.obs" dense></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="4" class="align-self-center">
              <v-text-field
                label="Data Criação"
                v-model="cliente.data_criacao"
                type="datetime-local"
                disabled
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-row class="justify-space-around pa-0 ma-n3">
                <v-btn
                  class="ma-3 text-none elevation-5"
                  style="font-weight: bold; font-size: 14px;"
                  @click="criar()"
                  v-if="!id"
                  :disabled="!clienteIsValid"
                  outlined
                >Criar Cliente</v-btn>
                <v-btn
                  class="ma-3 text-none elevation-5"
                  style="font-weight: bold; font-size: 14px;"
                  @click="editar()"
                  v-if="id"
                  :disabled="!clienteIsValid"
                  outlined
                >Editar</v-btn>
                <v-btn
                  class="ma-3 text-none elevation-5"
                  style="font-weight: bold; font-size: 14px;"
                  @click="eliminar()"
                  v-if="id"
                  :disabled="loadingGrupos || loadingCliente"
                  outlined
                >Eliminar</v-btn>
                <v-btn
                  class="ma-3 text-none elevation-5"
                  style="font-weight: bold; font-size: 14px;"
                  @click="getRequest_Cliente()"
                  outlined
                >Reset</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

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
  name: "Cliente",
  data: () => ({
    admin: false,
    overlay: false,
    snackbar: false,
    simNaoBtns: false,
    messageTitulo: "Erro 404...",
    messageColor: "red",
    tipo: "",
    id: "",
    loadingCliente: true,
    loadingGrupos: true,
    cliente: {},
    clientes: [],
    grupos: [],
    showDrawer: false,
    rules: {
      obrigatorio: [val => (val || "").length > 0 || "Campo obrigatório"],
      age: [val => val < 10 || `I don't believe you!`],
      animal: [val => (val || "").length > 0 || "This field is required"]
    }
  }),
  created() {
    this.$vuetify.theme.dark = false; //dark mode desativado

    this.admin = localStorage.getItem("access_token") == "true";
    if (!localStorage.getItem("access_token") || !this.admin) {
      this.$router.push({ path: "/login" });
    }

    this.id = this.$route.params.id;
    this.getRequest_Grupos();
  },
  computed: {
    clienteIsValid() {
      return (
        !this.loadingGrupos &&
        !this.loadingCliente &&
        this.cliente.nome &&
        this.cliente.classe &&
        this.cliente.terceiro
      );
    }
  },
  methods: {
    criar() {
      this.tipo = "criarCliente";
      this.messageTitulo = "Tem a certeza que pretende criar o cliente?";
      this.messageColor = "#00396c";
      this.simNaoBtns = true;
      this.snackbar = false;
      this.overlay = true;
    },
    editar() {
      this.tipo = "editarCliente";
      this.messageTitulo = "Tem a certeza que pretende editar o cliente?";
      this.messageColor = "#00396c";
      this.simNaoBtns = true;
      this.snackbar = false;
      this.overlay = true;
    },
    eliminar() {
      this.tipo = "eliminarCliente";
      this.messageTitulo = "Tem a certeza que pretende eliminar o cliente?";
      this.messageColor = "#00396c";
      this.simNaoBtns = true;
      this.snackbar = false;
      this.overlay = true;
    },
    simAction() {
      if (this.tipo == "criarCliente") {
        this.addClienteToBD();
      }
      if (this.tipo == "editarCliente") {
        this.editClienteOnBD();
      }
      if (this.tipo == "eliminarCliente") {
        this.deleteClienteFromBD();
      }

      this.messageTitulo = "Erro 404...";
      this.messageColor = "red";
      this.tipo = "";
      this.simNaoBtns = false;
      this.overlay = !this.overlay;
    },
    naoAction() {
      this.messageTitulo = "Erro 404...";
      this.messageColor = "red";
      this.tipo = "";
      this.simNaoBtns = false;
      this.overlay = !this.overlay;
    },
    getRequest_Cliente() {
      if (!this.id) {
        this.cliente = {};
        return;
      }

      this.loadingCliente = true;
      var url =
        process.env.VUE_APP_LOCALHOST +
        "/Clientes/GetClienteDados?id=" +
        this.$route.params.id;

      axios
        .get(url)
        .then(response => {
          this.cliente = response.data;

          this.loadingCliente = false;
        })
        .catch(error => {
          this.messageTitulo = "Erro ao carregar dados do cliente!";
          this.messageColor = "red";
          this.snackbar = true;
          setTimeout(() => {
            this.$router.push({ path: "/main" });
          }, 1000);
          return error;
        });
    },
    getRequest_Grupos() {
      this.loadingGrupos = true;

      var url = process.env.VUE_APP_LOCALHOST + "/Grupos/GetGrupos";

      axios
        .get(url)
        .then(response => {
          this.grupos = response.data;

          this.loadingGrupos = false;

          if (this.$route.params.id) {
            this.getRequest_Cliente();
          } else {
            this.loadingCliente = false;
          }
        })
        .catch(error => {
          this.messageTitulo = "Erro ao carregar dados dos grupos!";
          this.messageColor = "red";
          this.snackbar = true;
          return error;
        });
    },
    postCliente(cliente) {
      var url = process.env.VUE_APP_LOCALHOST + "/Clientes/PostCliente";

      delete cliente["id"];

      this.loadingCliente = true;

      axios
        .post(url, cliente)
        .then(response => {
          this.messageTitulo = "Cliente criado com sucesso!";
          this.messageColor = "green";
          this.snackbar = true;

          this.cliente = response.data;
          this.$router.replace({ path: "/cliente/" + this.cliente.id });
          this.id = this.$route.params.id;

          return response;
        })
        .catch(error => {
          this.messageTitulo = "Erro ao criar o cliente!";
          this.messageColor = "red";
          this.snackbar = true;
          return error;
        })
        .finally((this.loadingCliente = false));
    },
    putCliente(cliente) {
      var url =
        process.env.VUE_APP_LOCALHOST + "/Clientes/PutCliente?id=" + cliente.id;

      this.loadingCliente = true;

      axios
        .put(url, cliente)
        .then(response => {
          this.messageTitulo = "Cliente editado com sucesso!";
          this.messageColor = "green";
          this.snackbar = true;
          this.getRequest_Cliente();
          return response;
        })
        .catch(error => {
          this.messageTitulo = "Erro ao editar o cliente!";
          this.messageColor = "red";
          this.snackbar = true;
          return error;
        })
        .finally((this.loadingCliente = false));
    },
    addClienteToBD() {
      if (this.id) {
        return;
      }

      this.postCliente(this.cliente);
    },
    editClienteOnBD() {
      if (!this.id) {
        return;
      }

      this.putCliente(this.cliente);
    },
    deleteClienteFromBD() {
      if (!this.id) {
        return;
      }
      var url =
        process.env.VUE_APP_LOCALHOST +
        "/Clientes/DeleteCliente?id=" +
        this.cliente.id;

      axios
        .delete(url)
        .then(response => {
          this.messageTitulo = "Cliente eliminado com sucesso!";
          this.messageColor = "green";
          this.snackbar = true;
          this.loadingCliente = true;
          setTimeout(() => {
            this.$router.push({ path: "/main" });
          }, 4000);
          return response;
        })
        .catch(error => {
          this.messageTitulo = "Erro ao eliminar o cliente!";
          this.messageColor = "red";
          this.snackbar = true;
          return error;
        });
    },
    createClienteReset() {
      this.id = "";
      this.cliente = {};
      this.$router.replace({ path: "/cliente" });
    }
  }
};
</script>
