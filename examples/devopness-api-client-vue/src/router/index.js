import Vue from 'vue'

import VueRouter from 'vue-router'


import Login from '../views/Login'
import Home from '../views/Home'

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'login',
			component: Login
		},
		{
			path: '/home',
			name: 'home',
			component: Home
    }
  ]
})

export default router
