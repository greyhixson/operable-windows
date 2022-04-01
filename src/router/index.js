import Vue from 'vue';
import VueRouter from 'vue-router';
import UserView from '../views/UserView.vue';
import SignUp from '../components/Login/SignUp.vue';
import SignIn from '../components/Login/SignIn.vue';
import Settings from '../components/Settings.vue';
import AddOrganization from '../components/AddOrganization.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'UserView',
    component: UserView,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/addorganization',
    name: 'AddOrganization',
    component: AddOrganization,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
