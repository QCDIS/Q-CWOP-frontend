<template>
  <v-app>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        Select application
        <small>Summarize if needed</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-overflow-btn
          class="my-2"
          :items="dropdown_font"
          label="Overflow Btn"
          v-model="chosen_application"
        ></v-overflow-btn>
        <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
        <v-btn text @click="e6 = 2">Previous</v-btn>
        <v-btn color="primary" @click="e6 = 2">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">Configure analytics for this app</v-stepper-step>

      <v-stepper-content step="2">
        <v-file-input
          multiple
          label="Insert at least two performance models"
          accept=".yaml, .yml">
          </v-file-input>
        <v-btn color="primary" @click="e6 = 3" disabled="chosen_application === ''">Continue</v-btn>
        <v-btn text @click="e6 = 1">Previous</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">Select an ad format and name ad unit</v-stepper-step>

      <v-stepper-content step="3">
        <v-overflow-btn
          class="my-2"
          :items="dropdown_font"
          label="Overflow Btn"
          v-model="chosen_application"
        ></v-overflow-btn>
        <v-btn color="primary" @click="e6 = 4">Continue</v-btn>
        <v-btn text @click="e6 = 2">Previous</v-btn>
      </v-stepper-content>

      <v-stepper-step step="4">View setup instructions</v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="e6 = 3">Continue</v-btn>
        <v-btn text @click="e6 = 3">Previous</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dropdown_font: [
      "Regular Workflow",
      "Time-Constrained Workflow",
      "Microservices",
      "IOT"
    ],
    e6: 3,
    chosen_application: ""
  })
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