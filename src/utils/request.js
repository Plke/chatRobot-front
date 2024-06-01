import axios from "axios";
import { useUserStore, useChatStore } from "@/stores";

import { ElMessage } from "element-plus";

// import router from "@/router";
const baseURL = "http://localhost:8080/";
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore();
    if (userStore.token) {
      console.log("userStore.token", userStore.token);
      config.headers.token = userStore.token;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res;
    }
    ElMessage.error(res.data.message || "服务异常");
    return Promise.reject(res.data);
  },
  (err) => {
    console.log(err.response);
    // 特殊情况 401 权限不足，token过期
    if (err.response?.status === 401) {
      const userStore = useUserStore();
      const chatStore = useChatStore();
      ElMessage.error("请先登录");
      userStore.removeUser();
      chatStore.removeChat();
    }
    ElMessage.error(err.response.message || "服务异常");
    // TODO 5. 处理401错误
    return Promise.reject(err);
  }
);

export default instance;
export { baseURL };
