<template>
  <!-- <v-app> -->
  <!-- <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar> -->
  <!-- <v-content> -->
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-8 is-offset-2">
          <horizontal-stepper
            :steps="demoSteps"
            @completed-step="completeStep"
            @active-step="isStepActive"
            @stepper-finished="checkInput"
          />
        </div>
      </div>
      <b-modal
        id="bv-modal-finish"
        hide-footer
      >
        <template v-slot:modal-title>
          Iaas Planner
        </template>
        <div class="d-block text-center">
          <p>Your solution has been downloaded</p>
        </div>
        <b-button
          class="mt-3"
          block
          @click="restart"
        >
          Close
        </b-button>
      </b-modal>
    </div>
  </section>
  <!-- </v-content> -->
  <!-- </v-app> -->
</template>

<script>
import HorizontalStepper from 'vue-stepper';
import axios from 'axios';
import StepOne from '../components/StepOne.vue';
import StepTwo from '../components/StepTwo.vue';
import StepThree from '../components/StepThree.vue';
export default {
    components: {
        HorizontalStepper
    },
    data(){
        return {
            demoSteps: [
                {
                    icon: 'inbox',
                    name: 'first',
                    title: 'Workflow',
                    subtitle: 'Specify workflow',
                    component: StepOne,
                    completed: false

                },
                {
                    icon: 'input',
                    name: 'second',
                    title: 'Planning input',
                    subtitle: 'Specify input files',
                    component: StepTwo,
                    completed: false
                },

                {
                    icon: 'cloud_download',
                    name: 'third',
                    title: 'Planning completed',
                    subtitle: 'IaaS generated',
                    component: StepThree,
                    completed: true
                }
            ]
        }
    },
    methods: {
        // Executed when @completed-step event is triggered
         /* eslint no-unused-vars: ["error", { "args": "none" }] */
        completeStep(payload) {
            this.demoSteps.forEach((step) => {
                if (step.name === payload.name) {
                    step.completed = true;
                }
            })
        },
        // Executed when @active-step event is triggered
        isStepActive(payload) {
            this.demoSteps.forEach((step) => {
                if (step.name === payload.name) {
                    if(step.completed === true) {
                        step.completed = false;
                    }
                }
            })
        },

        checkInput() {
        if(this.$store.state.workflow_file != null && this.$store.state.input_file != null){
            this.getToscaViaFiles();
        }
          else if(this.$store.state.workflow_file != "" && this.$store.state.input_file != ""){
              this.getToscaViaUrl();
          }

          else{
            console.log("There is something wrong with the input, go back to start of wizard")
            this.restart()
          }
        },
        // Executed when @stepper-finished event is triggered
        getToscaViaUrl() {
            //const path = `http://127.0.0.1:5000/tosca?git_url=${this.$store.state.workflow_url}&performance_url=${this.$store.state.performance_url}&deadline_url=${this.$store.state.deadline_url}&price_url=${this.$store.state.price_url}`;
            const path = `backend-service/tosca_url?workflow_url=${this.$store.state.workflow_url}&input_url=${this.$store.state.input_url}`

            axios.get(path)
                .then((res) => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'IaaS solution.yaml');
                    document.body.appendChild(link);
                    link.click();
                    this.$bvModal.show('bv-modal-finish');
                })
                .catch((error) => {
                // eslint-disable-next-line
                console.error(error); 
                });
            },

         getToscaViaFiles() {
          
          let workflow_file = this.$store.state.workflow_file;
          let input_file = this.$store.state.input_file;
          let formData = new FormData();
          formData.append('workflow_file', workflow_file);
          formData.append('input_file', input_file)

          axios.post('backend-service/upload',
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
              })
                .then((res) => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'IaaS solution.yaml');
                    document.body.appendChild(link);
                    link.click();
                    this.$bvModal.show('bv-modal-finish');
                    console.log('Sucess')
                })
                .catch((error) => {
                // eslint-disable-next-line
                console.error(error); 
                });
         },

          //    axios.post('http://127.0.0.1:5000/upload',
          //     formData,
          //     {
          //       headers: {
          //           'Content-Type': 'multipart/form-data'
          //       }
          //     }
          //   ).then(function(){
          //     console.log('SUCCESS!!');
          //   })
          //   .catch(function(){
          //     console.log('FAILURE!!');
          //   });
          // }
          // ,

        restart(){
            this.$forceUpdate()
            window.location.reload()


        },

        alert(payload) {
            const path = `backend-service/tosca?git_url=${this.$store.state.workflow_url}&performance_url=${this.$store.state.performance_url}&deadline_url=${this.$store.state.deadline_url}&price_url=${this.$store.state.price_url}`;
            alert(path)
        }
    }
}
</script>
