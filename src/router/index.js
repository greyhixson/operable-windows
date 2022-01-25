import Vue from 'vue';
import VueRouter from 'vue-router';
import UserView from '../views/UserView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'UserView',
    component: UserView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
