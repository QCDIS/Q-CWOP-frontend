<template>
  <v-app id="planner">
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        Select application type
        <small></small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-overflow-btn
          class="my-2"
          :items="dropdown_font"
          label="Select your type of application"
          v-model="chosen_application"
        ></v-overflow-btn>
        <v-btn color="primary" @click="e6 = 2" :disabled="chosen_application === ''">Continue</v-btn>
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

      <v-stepper-step :complete="e6 > 3" step="3">Configure algorithm input</v-stepper-step>

      <v-stepper-content step="3">
         <p > One planning algorithm was detected for your application type, configure the parameters below: </p>
        <v-file-input
          multiple
          label="Insert performance model"
          accept=".yaml, yml"
          v-model="pcp_performance_file"
        ></v-file-input>
        <v-file-input
          multiple
          label="Insert price model"
          accept=".yaml, yml"
          v-model="pcp_price_model_file"
        ></v-file-input>
        <v-btn color="primary" @click="e6 = 4" :disabled="pcp_performance_file === null">Continue</v-btn>
        <v-btn text @click="e6 = 2">Previous</v-btn>
      </v-stepper-content>

      <v-stepper-step step="4">Configure QoS demands</v-stepper-step>
      <v-stepper-content step="4">

        <v-form>
          <v-container>
            <v-row>

              <v-col cols="12" sm="6" md="3">

                <v-text-field label="Specify deadline for the entire workflow" placeholder="50" v-model="deadline"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-btn color="primary" @click="getToscaViaFiles" :disabled="deadline === ''">Generate</v-btn>
        <v-btn text @click="e6 = 3">Previous</v-btn>
        
        
        
        
        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="headline">Found solution</v-card-title>

            <v-card-text>Your IaaS solution has sucessfully been downloaded</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>


              <v-btn color="green darken-1" text @click="restart">Return</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-stepper-content>
    </v-stepper>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    dropdown_font: [
      "Regular Workflow",
      "Time-Constrained Workflow",
      "Microservices",
      "IOT"
    ],
    continue_button1: false,
    dialog: false,
    e6: 1,
    chosen_application: "",
    workflow_file: null,
    pcp_performance_file: null,
    pcp_price_model_file: null,
    deadline: ""
  }),
  methods: {
    getToscaViaUrl() {
      //const path = `http://127.0.0.1:5000/tosca?git_url=${this.$store.state.workflow_url}&performance_url=${this.$store.state.performance_url}&deadline_url=${this.$store.state.deadline_url}&price_url=${this.$store.state.price_url}`;
      const path = `http://10.0.96.163:3000/tosca_url?workflow_url=${this.$store.state.workflow_url}&input_url=${this.$store.state.input_url}`;

      axios
        .get(path)
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "IaaS solution.yaml");
          document.body.appendChild(link);
          link.click();
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    },

    getToscaViaFiles() {
      let formData = new FormData();
      let workflow_file = this.workflow_file[0];
      let pcp_performance_file = this.pcp_performance_file[0];
      formData.append("workflow_file", workflow_file);
      formData.append("input_file", pcp_performance_file);

      axios
        .post("http://10.0.96.163:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "IaaS solution.yaml");
          document.body.appendChild(link);
          link.click();
          console.log("Sucess");
          this.dialog = true;
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    },

    restart() {
      this.$forceUpdate();
      window.location.reload();
    }
  }
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