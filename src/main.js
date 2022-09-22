/*
 * @Description: 
 * @Autor: zengbotao@myhexin.com
 * @Date: 2022-08-30 19:29:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-22 14:41:23
 */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import './assets/normalize.css';
import Axios from 'axios';
import directives from './directives';
Vue.use(directives);
import plugins from '@/plugins'
Vue.use(plugins); // 安装自己的插件
// 安装常用功能
import common from '@/common';
Vue.use(common);

import filters from '@/filters';
Vue.use(filters);

// 和代理做标识的对应, baseUrl
// Axios.defaults.baseURL = '/api'   需要直接访问public下的menus
Vue.prototype.$ajax = Axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
