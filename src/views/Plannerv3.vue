<template>
  <v-app id="planner">
    <v-stepper v-model="e6" vertical v-if="stepper_visible">
      <v-stepper-step :complete="e6 > 1" step="1">
        Select your application type
        <small></small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-overflow-btn
          class="my-2"
          :items="application_types"
          label="Select your type of application"
          v-model="chosen_application"
        ></v-overflow-btn>
        <v-btn color="primary" @click="e6 = 2;" :disabled="chosen_application === ''">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">Select application file</v-stepper-step>

      <v-stepper-content step="2">
        <v-file-input
          multiple
          label="Insert your workflow file in cwl format"
          accept=".cwl"
          v-model="workflow_file"
        ></v-file-input>
        <v-btn color="primary" @click="e6 = 3" :disabled="workflow_file === null">Continue</v-btn>
        <v-btn text @click="e6 = 1">Previous</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">Select preferred cloud provider</v-stepper-step>

      <v-stepper-content step="3">
        <v-overflow-btn
          class="my-2"
          :items="available_cloud_providers"
          label="Select your preferred cloud provider"
          v-model="chosen_provider"
        ></v-overflow-btn>
        <v-btn
          color="primary"
          @click="e6 = 4; getAvailableVms();"
          :loading="loading"
          :disabled="chosen_provider === ''"
        >Continue</v-btn>
        <v-btn text @click="e6 = 2">Previous</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 4" step="4">Configure VM's</v-stepper-step>

      <v-stepper-content step="4">
        <v-data-table
          v-model="selected_vms"
          :headers="headers"
          :items="vms"
          item-key="id"
          show-select
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Select VM's you would like the planner to use</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-file-input
                class="mt-4"
                label="Load custom VM list"
                accept=".yml, .yaml"
                v-model="custom_vm_list"
              ></v-file-input>
              <v-divider class="mx-4" inset vertical></v-divider>
              <!-- <v-spacer></v-spacer> -->
              <v-btn class="mt-2" color="primary" @click="loadVMList" :disabled="custom_vm_list === null">Load list</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>

        <v-btn
          class="mt-4"
          color="primary"
          @click="e6 = 5;"
          :disabled="selected_vms.length == 0"
        >Continue</v-btn>
        <v-btn class="mt-4" text @click="e6 = 3">Previous</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 5" step="5">Configure parameters</v-stepper-step>
      <v-stepper-content step="5">
        <!-- <p>Two planning algorithm were detected for your application type, configure the parameters below:</p> -->
        <!-- <p> Select preffered cloud provider </p> -->
        <p> Do you want to generate a performance model? If you have your own you can skip this step.</p>
        <v-btn class="justify-start" color="green" dark @click="generatePCPInput">Generate</v-btn>
        <v-flex xs12 offset-xs8>
        <!-- <v-file-input
          multiple
          label="Insert price model"
          accept=".yaml, .yml"
          v-model="pcp_price_model_file"
        ></v-file-input> -->
        <v-btn color="primary" @click="e6 = 6">Continue</v-btn>
        <v-btn text @click="e6 = 4">Previous</v-btn>
        </v-flex>

        <v-dialog v-model="dialog_input" max-width="490">
          <v-card>
            <v-card-title class="headline">Customise</v-card-title>

            <v-card-text>We have detected 6 tasks in your workflow</v-card-text>
            <v-switch class="mx-4" v-model="text_field1" label="Select custom performance values for cheapest vm"></v-switch>
            <v-text-field
            class="mx-4"
            label="Provide 6 performance values seperated by comma"
            outlined
            :disabled="text_field1 === false"
          ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="() => {dialog_input = false; e6 = 6}">Proceed</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </v-stepper-content>

      <v-stepper-step step="6">Configure QoS demands</v-stepper-step>
      <v-stepper-content step="6">
          <v-file-input
          multiple
          label="Insert performance model"
          accept=".yaml, .yml"
          v-model="pcp_performance_file"
        ></v-file-input>
        <!-- <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  label="Specify deadline for the entire workflow"
                  placeholder="50"
                  v-model="deadline"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form> -->
        <v-btn
          color="primary"
          @click="getToscaViaFiles"
          :disabled="pcp_performance_file === null"
          :loading="loading"
        >Generate</v-btn>
        <v-btn text @click="e6 = 5">Previous</v-btn>

        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="headline">Error</v-card-title>

            <v-card-text>Didn't receive proper response from backend</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="restart">Return</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-stepper-content>
    </v-stepper>

    <v-container fluid v-if="radio_button_visible">
      <h3 class="blue--text text--darken-3">Filter on available KPI's</h3>
      <!-- <p>Filter on key performance indicators.
      </p>-->
      <v-radio-group v-model="radio_value" :mandatory="true">
        <v-radio label="Makespan" value="makespan"></v-radio>
        <v-radio label="Total costs" value="total_cost"></v-radio>
        <v-radio label="Custom" value="custom"></v-radio>
      </v-radio-group>
      <v-row>
        <v-col class="text-left" cols="auto">
          <v-btn
            v-if="radio_button_visible"
            outlined
            left
            color="primary"
            @click="filterToscaTemplates"
          >Filter</v-btn>
        </v-col>
        <v-col>
          <v-btn
            v-if="radio_button_visible"
            outlined
            left
            color="primary"
            @click="restart"
          >Adjust parameters</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-data-iterator
      :items="items"
      :items-per-page.sync="items_per_page"
      v-if="activate_data_iterator"
      hide-default-footer
    >
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.name" cols="5" sm="7" md="3" lg="4">
            <v-card>
              <v-card-title class="subheading font-weight-bold">{{ item.id }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content>File name:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    <a
                      :href="item.tosca_file_name"
                      v-text="item.tosca_file_name"
                      @click.prevent="getToscaViaUrl(item)"
                    />
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>Total costs:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.total_cost }}</v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>Makespan:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.makespan }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-app>
</template>

<style scoped>
h3 {
  text-align: left;
}
p {
  text-align: left;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<script>
import axios from "axios";

export default {
  data: () => ({
    application_types: [
      "Regular Workflow",
      "Time-Constrained Workflow",
      "Microservices",
      "IOT",
    ],
    available_cloud_providers: ["Azure", "Amazon", "Google Cloud"],
    loader: null,
    loading: false,
    continue_button1: false,
    dialog: false,
    dialog_input: true,
    stepper_visible: true,
    e6: 4,
    chosen_application: "",
    chosen_provider: "",
    custom_vm_list: null,
    workflow_file: null,
    switch1: false,
    text_field1: false,
    pcp_performance_file: null,
    pcp_price_model_file: null,
    deadline: "",
    radio_button_visible: false,
    activate_data_iterator: false,
    radio_value: "",
    items_per_page: 2,
    items: [
      {
        id: "",
        tosca_file_name: "",
        total_cost: "",
        makespan: "",
      },
      {
        id: "",
        tosca_file_name: "",
        total_cost: "",
        makespan: "",
      },
    ],
    vms: [
      {
        id: "1",
        num_cpus: "2",
        mem_size: "100MB",
        disk_size: "200MB",
      },
      {
        id: "2",
        num_cpus: "4",
        mem_size: "200MB",
        disk_size: "400MB",
      }
    ],
    selected_vms: [],
    headers: [
      {
        text: "id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "num_cpus", value: "num_cpus" },
      { text: "mem_size", value: "mem_size" },
      { text: "disk_size", value: "disk_size" },
    ],
  }),
  //  watch: {
  //     chosen_provider () {
  //       const l = this.loader
  //       this[l] = !this[l]

  //       setTimeout(() => (this[l] = false), 6000)

  //       this.loader = null
  //     },
  //   },
  methods: {
    generatePCPInput() {
      let formData = new FormData();
      let workflow_file = this.workflow_file[0];
      formData.append("workflow_file", workflow_file);
      const json = JSON.stringify(this.selected_vms)
      const blob = new Blob([json], {
        type: 'application/json'
      })
      formData.append("selected_vms", blob)

      console.log("sending api request");
      axios
        .post("http://localhost:5001/generate", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "pcp_input_template.yaml");
          document.body.appendChild(link);
          link.click();
          console.log("Sucess");
          this.dialog_input = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log("no response");
          console.error(error);
          this.dialog = true;
        });

    },
    getAvailableVms() {
      axios
        .get(`http://localhost:5001/get_vms/${this.chosen_provider}`)
        .then((response) => {
          this.vms = response.data;
          // this.activate_data_iterator = true;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getToscaViaUrl({ tosca_file_name }) {
      //const path = `http://127.0.0.1:5000/tosca?git_url=${this.$store.state.workflow_url}&performance_url=${this.$store.state.performance_url}&deadline_url=${this.$store.state.deadline_url}&price_url=${this.$store.state.price_url}`;
      const path = `http://localhost:5001/uploads/${tosca_file_name}`;

      axios
        .get(path)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${tosca_file_name}.yaml`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },

    getToscaViaFiles() {
      this.loader = "loading";
      const l = this.loader;
      this[l] = !this[l];

      let formData = new FormData();
      let workflow_file = this.workflow_file[0];
      let pcp_performance_file = this.pcp_performance_file[0];
      formData.append("workflow_file", workflow_file);
      formData.append("input_file", pcp_performance_file);
      console.log("sending api request");
      axios
        .post("http://localhost:5001/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          this.stepper_visible = false;
          this.radio_button_visible = true;
          console.log(res.data);
          console.log("Sucess");
          this[l] = false;
          this.loader = null;
          // this.dialog = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log("no response");
          console.error(error);
          this.dialog = true;
        });
    },

    filterToscaTemplates() {
      axios
        .get(`http://localhost:5001/performance_indicator/${this.radio_value}`)
        .then((response) => {
          this.items = response.data;
          this.activate_data_iterator = true;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    loadVMList() {
      // this.loader = "loading";
      // const l = this.loader;
      // this[l] = !this[l];

      let formData = new FormData();
      let vm_list_file = this.custom_vm_list;
      formData.append("file", vm_list_file);
      console.log("sending api request");
      axios
        .post("http://localhost:5001/load_vm_list", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          console.log("Sucess");
          this.vms = res.data
          // this[l] = false;
          // this.loader = null;
          // this.dialog = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log("no response");
          console.error(error);
          this.dialog = true;
        });
    },

    restart() {
      this.$forceUpdate();
      window.location.reload();
    },

    checkVersion() {
      console.log("We have the latest version");
    },
  },
  // data: () => ({
  //   e6: 1,
  //   workflow_file: null,
  //   application_list: [
  //     "Regular Workflow",
  //     "Time-Constrained Workflow",
  //     "Microservices",
  //     "IOT"
  //   ],
  //   chosen_application: ''
  // })
};
</script>