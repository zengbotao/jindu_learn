import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { whiteUrlList } from '@/conf'
import { checkLogin, } from '@/utils'
import store from '@/store'
import Axios from 'axios'
import { pretty } from '@/utils/request';
import Layout from '@/layouts/Layout';
Vue.use(VueRouter)

// 处理路由跳转的异常提示: 功能上没有问题的, 要么换3.0版本, 要么catch一下不处理不报错
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

const constantRotes = [
  {
    path: '/',
    redirect:'/home',
    name: 'Home',
    meta:{
      title:'首页'
    },
    component: Layout,
    children:[
      {
        path:'/home',
        component:Home
      }
    ]
  },
  {
    path:'/404',
    name:'NotFound',
    component:()=> import('../views/404.vue')
  },
  {
    path:'/401',
    name:'Reject',
    component:()=> import('../views/401.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },

  // 常规操作是这里加入,处理404
  // {
  //   path:'*',
  //   redirect:{ name:'NotFound'}
  // },
  // 异步路由 会被前面的* 优先匹配所无法匹配到
  // {
  //   ...
  // }



]

const router = new VueRouter({
  routes: constantRotes
})

function asyncRoutesHandler(routes) {
  return routes.map(r => {
    if (r.component === 'Layout') {
      r.component = Layout;
    } else {
      const filePath = r.component;
      r.component = () => import(`../views/${filePath}.vue`)
    }
    if (r.children) {
      r.children = asyncRoutesHandler(r.children);
    }
    return r;
  })


}
async function loadMenus(next, to) {
  let [res, err] = await pretty(Axios.get('/menus.json', {
    responseType: 'json'
  }));
  if (err) {
    throw new Error('加载动态菜单出错' + err.message);
  }
  let asyncRoutes = asyncRoutesHandler(res.data);

  // router.addRoutes(asyncRoutes); // 这个方法废弃了
  // 最后一个是404的重定向
  asyncRoutes.push({
    path:'*',
    redirect:{ name:'NotFound'}
  })


  asyncRoutes.forEach(r => {
    router.addRoute(r);
  })


  // 保存用户菜单 => 生成左侧动态菜单栏
  store.commit('user/changeUserMenus', res.data); // 不需要存储组件函数,基本的一些描述字符串即可
  next({ ...to, replace: true }); // 替换当前访问的路径,不会有多余上一页的箭头

}



router.beforeEach((to, from, next) => {

  // 1. login/register 需要验证吗?  => 白名单  放行
  if (whiteUrlList.includes(to.path)) {
    return next();
  }
  let userInfo = checkLogin();
  if (userInfo) {
    // 判断是否是刷新  vuex东西就没了

    // vuex内用户数据是否存在
    if (!store.getters['user/getUserInfo']) {
      store.commit('user/changeUserInfo', {
        username: userInfo.account
      });
      store.commit('user/changeIsLogin', true);
    }

    // 刷新导致路由没有了 动态菜单
    if (!store.getters['user/getUserMenus']) {
      // 没有路由给你看, 加载路由
      return loadMenus(next, to)
    } else {

      // 保存当前的to作为tag缓存
      if (to.name)
      store.commit('user/addTag',{
        title:to?.meta?.title,
        compName:to.name, //loan-approve-first
      })

      return next(); // 有菜单
    }


    // 2. 非白名单 =>  2.1 是否登录 => 如果登录了 => 2.2token中解码获取\
    // 2.3 登录了, 角色菜单有没有????(动态路由)

  } else {
    // 3. 如果没有登录 => 去login登录    http://localhost:8080/list?id=1
    next('/login?redirect=' + to.path);
  }
})



export default router
