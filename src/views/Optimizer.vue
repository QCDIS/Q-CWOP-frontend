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
        <v-list-item to="/optimizer">
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
      <v-toolbar-title>Optimizer</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
              <p> Select the performance models that you wish to compare </p>
                  <v-file-input 
                  show-size 
                  counter 
                  multiple 
                  label="Insert performance models"
                  accept=".yaml, .yml"
                  v-model="performance_files"
                  :rules="rules"></v-file-input>

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
export default {
  components: {
  },
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    performance_files: null,
    rules: [files => !files || !files.some(file => file.size > 2e6) || 'Performance file size cannot exceed 2MB',
            files => !files || files.length > 1 || 'You need to specify at least two performance files'
            
        ]
  })
};
</script>