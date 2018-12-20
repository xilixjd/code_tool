import Vue from 'vue'
import Router from 'vue-router'

import Tag from './views/Tag.vue'
import ComponentList from './views/ComponentList'
import History from './views/History'
import SelfComponent from './views/SelfComponent/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      // component: Home,
      redirect: '/tag'
    },
    {
      path: '/tag',
      name: 'tag',
      component: Tag,
    },
    {
      path: '/tag/:tag',
      name: 'componentList',
      component: ComponentList,
      children: [
        // {
        //   path: '/component/:component',
        //   name: 'selfComponent',
        //   component: SelfComponent,
        // }
      ]
    },
    {
      path: '/tag/:tag/component/:component',
      name: 'selfComponent',
      component: SelfComponent,
    },
    {
      path: '/history',
      name: 'history',
      component: History,
    }
  ]
})
