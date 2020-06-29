<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cloud-braces</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>IaaS Planner</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
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
            <WizardVuetify></WizardVuetify>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import WizardVuetify from "./WizardVuetify.vue";
export default {
  components: {
    WizardVuetify
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null
  })
};
</script>