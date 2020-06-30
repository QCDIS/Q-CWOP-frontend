<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-cloud-braces</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>IaaS Planner</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/planner-old">
          <v-list-item-action>
            <v-icon>mdi-file-cloud</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Performance optimizer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Planner</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <Plannerv2></Plannerv2>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; University of Amsterdam</span>
    </v-footer>
  </v-app>
</template>

<script>
import Plannerv2 from "./Plannerv2.vue";
export default {
  components: {
    Plannerv2
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null
  })
};
</script>