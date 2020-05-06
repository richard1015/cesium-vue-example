import Vue from "vue";
import VueRouter from "vue-router";

const CesiumViewer = r => require.ensure([], () => r(require('@/components/CesiumViewer')), 'CesiumViewer')

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "CesiumViewer",
    component: CesiumViewer,
  },
  {
    path: "/CesiumViewer",
    name: "CesiumViewer",
    component: CesiumViewer,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
