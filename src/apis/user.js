import { request,pretty } from '@/utils/request' 


export const doLogin = (user)=>{
    return pretty(request.post("/user/login", {
        account: user.username,
        password: user.pass
    }));
}
export const logout = ()=>{
    return pretty(request.post('/user/logout'));
}
/**
 * 创建用户
 * @param {*} param0 
 */
export const createUser =({username,password,permission})=>{
    return pretty(request.post('/permission/createUser',{
        account:username,
        password,
        role_id:permission
    }));
}