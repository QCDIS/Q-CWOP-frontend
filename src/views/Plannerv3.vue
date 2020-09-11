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
          :items="dropdown_font"
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

      <v-stepper-step :complete="e6 > 3" step="3">Configure algorithm input</v-stepper-step>

      <v-stepper-content step="3">
        <p>One planning algorithm was detected for your application type, configure the parameters below:</p>
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
                <v-text-field
                  label="Specify deadline for the entire workflow"
                  placeholder="50"
                  v-model="deadline"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-btn color="primary" @click="getToscaViaFiles" :disabled="deadline === ''"
        :loading="loading"
        >Generate</v-btn>
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

   
    <v-container fluid v-if="radio_button_visible">
        <h3 class="blue--text text--darken-3"> Filter on available KPI's </h3>
        <!-- <p>Filter on key performance indicators.
        </p> -->
        <v-radio-group v-model="radio_value" :mandatory="true">
        <v-radio label="Makespan" value="makespan"></v-radio>
        <v-radio label="Total costs" value="total_cost"></v-radio>
        <v-radio label="Custom" value="custom"> </v-radio>
        </v-radio-group>
        <v-row>
        <v-col class="text-left" cols="auto">
        <v-btn v-if="radio_button_visible" outlined left color="primary" @click="filterToscaTemplates">Filter</v-btn>
        </v-col>
        <v-col>
        <v-btn v-if="radio_button_visible" outlined left color="primary" @click="restart">Adjust parameters</v-btn>
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
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
            <v-card>
              <v-card-title class="subheading font-weight-bold">{{ item.id }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item>
                  <v-list-item-content>File name:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.tosca_file_name }}</v-list-item-content>
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
    dropdown_font: [
      "Regular Workflow",
      "Time-Constrained Workflow",
      "Microservices",
      "IOT",
    ],
    loader: null,
    loading:false,
    continue_button1: false,
    dialog: false,
    stepper_visible: true,
    e6: 1,
    chosen_application: "",
    workflow_file: null,
    pcp_performance_file: null,
    pcp_price_model_file: null,
    deadline: "",
    radio_button_visible: false,
    activate_data_iterator: false,
    radio_value: "",
    items_per_page: 3,
      items: [
        {
          id: '',
          tosca_file_name: '',
          total_cost: '',
          makespan: ''
        },
        {
          id: '',
          tosca_file_name: '',
          total_cost: '',
          makespan: ''
        },
        {
          id: '',
          tosca_file_name: '',
          total_cost: '',
          makespan: ''
        }
      ],
  }),
//    watch: {
//       loader () {
//         const l = this.loader
//         this[l] = !this[l]

//         setTimeout(() => (this[l] = false), 6000)

//         this.loader = null
//       },
//     },
  methods: {
    getToscaViaUrl() {
      //const path = `http://127.0.0.1:5000/tosca?git_url=${this.$store.state.workflow_url}&performance_url=${this.$store.state.performance_url}&deadline_url=${this.$store.state.deadline_url}&price_url=${this.$store.state.price_url}`;
      const path = `backend-service/tosca_url?workflow_url=${this.$store.state.workflow_url}&input_url=${this.$store.state.input_url}`;

      axios
        .get(path)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "IaaS solution.yaml");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },

    getToscaViaFiles() {
      this.loader = 'loading'
      const l = this.loader
        this[l] = !this[l]

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
            this.stepper_visible = false
            this.radio_button_visible = true
            console.log(res.data)
            console.log("Sucess");
            this[l] = false
            this.loader = null
            // this.dialog = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log("no response");
          console.error(error);
        });
    },

    filterToscaTemplates() {
       axios
      .get(`http://localhost:5001/performance_indicator/${this.radio_value}`)
      .then(response => {
        this.items = response.data
        this.activate_data_iterator = true
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
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