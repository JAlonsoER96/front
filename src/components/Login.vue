<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 lg5 x14>
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Acceso al sistema</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field autofocus color="accent" label="Email" required v-model="email"></v-text-field>
          <v-text-field color="accent" label="Contraseña" type="password" v-model="password"></v-text-field>
          <v-flex class="red--text" v-if="errorM">{{errorM}}</v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-center>
            <v-btn color="primary" @click="ingresar">Ingresar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    email: "",
    password: "",
    errorM: null
  }),
  methods: {
    ingresar() {
      axios
        .post("usuario/login", { email: this.email, password: this.password })
        .then(respuesta => {
          return respuesta.data;
        })
        .then(data => {
          this.$store.dispatch("guardarToken", data.tokenReturn);
          this.$router.push({ name: "Home" });
        })
        .catch(error => {
          this.errorM = null;
          if (error.response.status == 404) {
            this.errorM =
              "No existe el usuario o las credenciales son incorrectas";
          } else {
            this.errorM = "Error en el servidor";
          }
        });
    }
  }
};
</script>