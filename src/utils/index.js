import jwt from "jsonwebtoken";
import {secure} from '@/conf';
import { request,pretty } from './request';


// 解密获取用户信息
export const checkLogin = ()=>{
   const token = getToken();
   if (!token) return null;
   return jwt.decode(token,secure);

}
export const getToken = ()=>{
    return window.sessionStorage.getItem('token');
}

export function debounce(func,wait = 1000){
    let timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func,wait)
    }
}

export function downloadForTag(blobData,filename) {
        // 内存中的临时指向
        let url = window.URL.createObjectURL(blobData);
        // 创建a标签
        let tagA = document.createElement('a');
        // tag
        tagA.href = url;
        tagA.download = filename;
        // 隐藏a标签
        tagA.style.display = 'none';
        // 插入到body中
        document.body.appendChild(tagA);
        // 点击a标签
        tagA.click();
        // 释放资源 
        document.body.removeChild(tagA);
        // 释放临时url
        window.URL.revokeObjectURL(url);
}

export async function downloadFile(url,fileName) {
    try {
        var res = await request({
            url,
            responseType:'blob'
        });
         // a标签下载文件
         downloadForTag(res.data,fileName)
    } catch(e) {
        console.log('下载异常:',e);
    }
}