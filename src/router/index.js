import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Plannerv2 from '../views/Plannerv2.vue'
import Optimizer from '../views/Optimizer.vue'
import Plannerv1 from '../views/Plannerv1.vue'

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
    path: '/planner',
    name: 'Plannerv2',
    component: Plannerv2
  },

  {
    path: '/optimizer',
    name: 'Optimizer',
    component: Optimizer
  },

  {
    path: '/planner-old',
    name: 'Plannerv1',
    component: Plannerv1
  },

]

const router = new VueRouter({
  routes
})

export default router
