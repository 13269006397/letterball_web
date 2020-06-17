import axios from "axios";
import { Message } from "element-ui";
import { getToken } from "./auth";
import { MessageBox } from "element-ui";
import store from "element-ui/packages/cascader-panel/src/store";
// import { config } from "@vue/test-utils";

const service = axios.create({
  baseURL: process.env.Vue_APP_BASE_API, //api的baseURL
  withCredentials: true, //跨域请求发送cookies
  timeout: 10000 //request timeout
});

// 设置 post 、put 默认content-Type
service.defaults.headers.post["Content-Type"] = "application/json";
service.defaults.headers.put["Content-Type"] = "application/json";

service.interceptors.request.use(
  config => {
    if (getToken()) {
      //让每个请求携带token [X-Token] 为自定义key 根据实际情况自行修改
      config.headers["userToken"] = getToken();
      if (config.method === "post" || config.method === "put") {
        //post get 提交时，讲对象转化为String, 为处理java后台解析问题
        config.data = JSON.stringify(config.data);
      } else if (config.method === "get") {
        //给get请求追加时间戳，解决IE GET请求缓存问题
        const symbol = config.url.indexOf("?") >= 0 ? "&" : "?";
        config.url += symbol + "_=" + Date.now() * Math.random();
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  respons => {
    const res = respons.data;
    const resultcode = respons.headers.resultcode;
    if (resultcode === "fail") {
      MessageBox.confirm(
        "你已登出，可以取消继续留在该页面，或者重新登录",
        "确定登出",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        //跳转登录页
        store.dispatch("user/resetToken").then(() => {
          location.reload(); //为了重新实例化 vue-router对象 避免BUG
        });
      });
    }
    if (resultcode === "success") {
      if (respons.data.status === 500) {
        const msg = respons.data.message;
        Message({
          message: msg || "error",
          type: "error",
          duration: 2 * 1000
        });
        return;
      }
    }
    return res;
  },
  error => {
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
