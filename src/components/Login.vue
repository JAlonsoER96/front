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
    password: ""
  }),
  methods: {
    ingresar() {
      axios
        .post("usuario/login", { email: this.email, password: this.password })
        .then(function(response) {
          console.log(response.data.user);
          console.log(response.data.tokenReturn);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>