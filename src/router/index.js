import Vue from 'vue'
import Router from 'vue-router'

const CesiumViewer = r => require.ensure([], () => r(require('@/components/CesiumViewer')), 'CesiumViewer')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CesiumViewer',
      component: CesiumViewer
    },
    {
      path: '/CesiumViewer',
      name: 'CesiumViewer',
      component: CesiumViewer
    }
  ]
})
