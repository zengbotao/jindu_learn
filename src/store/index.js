import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 动态引入modules下面的文件,作为module模块声明

const modulesFn = require.context('./modules', true, /\.js$/);
const regex = /.*\/(.*)\.js$/

const modules = {};
// modulesFn.keys() 可以获取到上述满足条件的文件的加载路径
// modulesFn方法 modulesFn(路径) 获取模块
// {文件的加载路径user:模块}
modulesFn.keys().forEach(filepath => {
  console.log(filepath);
  let moduleName = regex.exec(filepath);
  if (moduleName!== null) {
    moduleName = moduleName[1]
  }
  const moduleObj = modulesFn(filepath);
    modules[moduleName] = {
      namespaced: true,
      ...moduleObj.default
    }
})

const initStore = {
  state: {
    loadings:{
  
    }
  },
  mutations: {
  },
  actions: {
  },
  modules:modules
};

const tabCount = 20;
// 批量添加tab
for(let i = 1;i< tabCount;i++) {
  initStore.state.loadings['tab' +i] = false;
  initStore.mutations['settab' + i] = function({loadings},payload) {
    loadings['tab'+i] = payload
  }
}

export default new Vuex.Store(initStore)
