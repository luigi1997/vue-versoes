import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Main from './components/Main.vue'
import Cliente from './components/Cliente.vue'
import Grupos from './components/Grupos.vue'
import Atualizacoes from './components/Atualizacoes.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login-blank',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/cliente/:id',
      name: 'cliente',
      component: Cliente
    },
    {
      path: '/cliente',
      name: 'cliente-blank',
      component: Cliente
    },
    {
      path: '/grupos',
      name: 'grupos',
      component: Grupos
    },
    {
      path: '/atualizacoes',
      name: 'atualizacoes',
      component: Atualizacoes
    }
  ]
})