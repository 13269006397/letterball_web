//进行远程调用
import axios from "axios";
//包装param参数
import qs from "qs";
// 声明基础访问地址
axios.defaults.baseURL = "http://localhost:9005";
// 每次请求携带cookies信息
axios.defaults.withCredentials = true;

//声明一个调用方法
export const requestLogin = params => {
  return axios.post("/user/login", qs.stringify(params)).then(res => res.data);
};

export const setVfCode = params => {
  return axios
    .post("/user/login/findSetVFCode", qs.stringify(params))
    .then(res => res.data);
};
