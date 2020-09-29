<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
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
            <v-list-item-title>Parameter optimizer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Optimizer</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container
        class="fill-height"
        fluid
      >    
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >     
          <v-row
            align="center"
            justify="center"
          >
            <v-col cols="12">
              <p>Select the workflow of your application</p>
            
              <v-file-input
                show-size
                counter
                multiple
                label="Insert workflow file in cwl format"
                accept=".cwl"
                v-model="workflow_file"
                :rules="rules_workflow"
              />
            </v-col>
            <v-col cols="12">
              <p>Select the performance models that you wish to compare</p>
              <v-file-input
                show-size
                counter
                multiple
                label="Insert price and performance models in yaml format"
                accept=".yaml, .yml"
                v-model="performance_files"
                :rules="rules"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="2">
            <v-btn
              color="primary"
              @click="comparePerformance"
              :disabled="!(valid && performance_files !== null && workflow_file !== null)"
            >
              Compare
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn
              color="primary"
              @click="restart"
              :disabled="!activate_data_iterator"
            >
              Clear
            </v-btn>
          </v-col>
        </v-row>
        <v-data-iterator
          :items="items"
          :items-per-page.sync="items_per_page"
          v-if="activate_data_iterator"
          hide-default-footer
        >
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.name"
              >
                <v-card>
                  <v-card-title class="subheading font-weight-bold">
                    {{ item.id }}
                  </v-card-title>

                  <v-divider />

                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>File name:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.name }}
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>Total costs:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.costs }}
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>Makespan:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.makespan }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-container>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; University of Amsterdam</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    performance_files: null,
    workflow_file: null,
    rules: [
      files =>
        !files ||
        !files.some(file => file.size > 2e6) ||
        "Performance file size cannot exceed 2MB",
      files =>
        !files ||
        files.length > 1 ||
        "You need to specify at least two performance files"
    ],
    rules_workflow: [files => !files ||
        !files.some(file => file.size > 2e6) ||
        "Performance file size cannot exceed 2MB"],
    valid: false,
    activate_data_iterator: false,
    items_per_page: 3,
      items: [
        {
          id: '',
          name: '',
          costs: '',
          makespan: ''
        },
        {
          id: '',
          name: '',
          costs: '',
          makespan: ''
        },
        {
          id: '',
          name: '',
          costs: '',
          makespan: ''
        }
      ],
  }),
  methods: {
    comparePerformance() {
      let formData = new FormData();
      let workflow_file = this.workflow_file[0];
      let performance_files = this.performance_files;
      formData.append("workflow_file", workflow_file);
      // formData.append("performance_files", performance_files);
      for( var i = 0; i < performance_files.length; i++ ){
          let file = performance_files[i];

          formData.append('performance_files', file);
        }

      axios
        .post("http://localhost:5001/optimizer", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          this.items = res.data
          this.activate_data_iterator = true
          console.log(res.data)
        //  this.filtered_performance_files = res.data
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
      console.log("Backend stuff");
    },
      validate () {
        return this.$refs.form.validate()
      },

      restart() {
      this.$forceUpdate();
      window.location.reload();
    }
  }
};
</script>