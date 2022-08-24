

import { Loading, Message, Notification } from 'element-ui';
import Axios from 'axios';
import router from '../router';
import store from '../store'
export const request = Axios.create({
    baseURL: "/api"
});



// 实例也可以做拦截器的处理
// 原本是实例request.interceptors, 但是由于menus的特殊性,不能近拦截器,处理603
// 所以, 选择使用全局拦截器.. 实际开发, 不会有这个问题  menus 和其他接口在一起的
request.interceptors.request.use(
    config => {

        if (config.loadingTag)
            store.commit(`set${config.loadingTag}`, true);

        const token = window.sessionStorage.getItem("token");
        // 全局loading
        // loadingInstance = Loading.service({ fullscreen: true });

        if (token) {
            // 挂载到请求头中
            config.headers.token = token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
request.interceptors.response.use(
    response => {

        if (response.config.loadingTag)
            store.commit(`set${response.config.loadingTag}`, false);


        // 保存token
        // loadingInstance.close();
        const token = response?.data?.data?.token;
        if (token) {
            window.sessionStorage.setItem("token", token);
        }
        // 603 代表token失效, 处理跳转到权限不足页面
        if (response?.data?.code === 20000) {
            // 由于历史遗留问题, 后端响应的结构不能一次性做到统一,兼容处理一下
            if (typeof response?.data?.data === 'string')
                Message.success(response?.data?.data);
            if ( typeof response?.data?.data?.info === 'string') 
                Message.success(response?.data?.data?.info);
            return response;
        } else if (response?.data?.code === 603) { // token失效
            Notification.error({
                title: '错误',
                message: 'token失效,请重新登录'
            });
            // 替换到401页面
            router.replace('/401');
        } else {
            Notification.error({
                title: '错误',
                message: '响应错误'
            });
        }

        return response;
    },
    err => {
        // 针对200以上的状态码的处理, 也可以做错误日志收集
        Message.error(err.Message);
        return Promise.reject(err);


    }
);

export const pretty = function (promise) {
    return promise.then(data => [data, undefined])
        .catch(err => [undefined, err]);
}