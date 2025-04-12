import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import Destinations from '@/views/Destinations.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/destinations',
    name: 'Destinations',
    component: Destinations,
    props: route => ({
      id: route.params.id,
    }),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
