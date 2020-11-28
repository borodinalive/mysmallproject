import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import {sync} from 'vuex-router-sync';

import App from './App.vue';

import {createRouter} from '@client/router.js';
import {createStore} from './store/store.js';

Vue.use(VueRouter);
Vue.use(Vuex);
// API
// import {MainApi} from '@client/api/main';

class MyApp {
  constructor() {
    this.Store = createStore();
    this.Router = createRouter();

    // Синхронизирум хранилище и роутер
    sync(this.Store, this.Router);

    /**
     * @property {Vue} Vue - main vue application
     */
    this.Vue = new Vue({
      router: this.Router,
      store: this.Store,
      render: (h) => h(App),
    });

    // /** @property {Object} API main api instance */
    // this.API = new MainApi();
  }
}

export function createApp() {
  return new MyApp;
}
