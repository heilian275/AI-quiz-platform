// src/api/request.ts
import axios, { AxiosHeaders } from "axios";
import { ElMessage } from "element-plus";
import { serverToken } from "../router/index";

const _axios = axios.create({
  baseURL: "/", // 确保 baseURL 配置正确
  timeout: 5000,
});

// 请求拦截器
_axios.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders(); // 创建 AxiosHeaders 实例
    }
    if (serverToken.value) {
      (config.headers as AxiosHeaders).set("Authorization", serverToken.value);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
_axios.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      ElMessage.success({ message: response.data.message, duration: 3000 });
    }
    return response; // 显式返回 response
  },
  (error) => {
    console.error(error);
    if (error.message) {
      ElMessage.error({ message: error.message, duration: 3000 });
    }
    return Promise.reject(error);
  }
);

export default _axios;
