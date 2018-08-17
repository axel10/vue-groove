import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  // mode:'history',
  base:'/vcplayer',
  routes: [
    {
      path: '/',
      // name: 'home',
      component: Home,
      children:[
        {
          path: '/playList/:id',
          name: 'playList',
          component: () => import('./views/PlayListView.vue'),
        },
        {
          path: '/allPlayList',
          name: 'allPlayList',
          component: () => import('./views/AllPlayList.vue'),
        },
        {
          path: '',
          name: 'file',
          component: () => import('./views/Files.vue'),
        },
        {
          path: '/recentPlay',
          name: 'recentPlay',
          component: () => import('./views/RecentPlay.vue'),
        },
      ]
    },
    {
      path: '/playing/:light',
      name: 'playing',
      component: () => import('./views/Playing.vue'),
    },

/*    {
      path: '/test',
      name: 'test',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/!* webpackChunkName: "about" *!/ './views/Test.vue'),
    },*/
  ],
});
