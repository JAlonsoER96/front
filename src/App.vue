<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template>
          <v-list-item>
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>Inicio</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="dark darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Sistema MEVN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon small>
        <v-icon>logout</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon>apps</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-slide-y-transition mode="out-in">
            <router-view />
          </v-slide-y-transition>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app height="auto">&copy; Jose Alonso Espinares Romero {{ new Date().getFullYear() }}</v-footer>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld
  },

  data: () => ({
    //
    dialog: false,
    drawer: null
  }),

  created() {
    this.$vuetify.theme.dark = true;
  }
};
</script>
