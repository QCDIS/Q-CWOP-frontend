import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import WizardVuetify from '../views/WizardVuetify.vue'
import Planner from '../views/Planner.vue'
import Tosca from '../views/Tosca.vue'
import Wizard from '../components/Wizard.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/courses',
    name: 'Courses',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Courses.vue')
  },

  {
    path: '/WizardVuetify',
    name: 'WizardVuetify',
    component: WizardVuetify
  },

  {
    path: '/planner',
    name: 'Planner',
    component: Planner
  },

  {
    path: '/tosca',
    name: 'Tosca',
    component: Tosca,
  },

  {
    path: '/wizard',
    name: 'Wizard',
    component: Wizard,
  },

]

const router = new VueRouter({
  routes
})

export default router
