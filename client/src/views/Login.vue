<template>
  <div class="login-page">
    <!-- 登录页面根容器 -->
    <div class="login">
      <el-form :model="dto" :rules="rules" ref="loginForm" label-width="100px">
        <h2 class="login-title">AI智能刷题平台</h2>

        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="dto.username"
            placeholder="请输入用户名"
            @keyup.enter="onLogin"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="dto.password"
            placeholder="请输入密码"
            @keyup.enter="onLogin"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="dto.role">
            <el-radio label="user">用户</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onLogin">登录</el-button>
        </el-form-item>

        <!-- 注册入口 -->
        <div class="register-entry">
          <router-link to="/register">没有账号？立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 同上，保持原有逻辑
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../api/request";
import { Menu } from "../model/Menu";
import { useRequest } from "vue-request";
import { useStorage } from "@vueuse/core";
import { LoginDto, AxiosRespMenuAndRoute } from "../model/Model8080";
import {
  addServerRoutes,
  resetRoutes,
  serverMenus,
  serverToken,
  serverUsername,
  serverUserId,
} from "../router/index";

const router = useRouter();
const dto = ref({
  username: "",
  password: "",
  role: "user",
});
const loginForm = ref();

const rules = ref({
  username: [{ required: true, message: "用户名必填", trigger: "blur" }],
  password: [{ required: true, message: "密码必填", trigger: "blur" }],
});

const { runAsync: login } = useRequest<AxiosRespMenuAndRoute, [LoginDto]>(
  (dto) => axios.post("/api/auth/login", dto),
  { manual: true }
);

async function onLogin() {
  try {
    const valid = await loginForm.value.validate();
    if (valid) {
      const loginResp = await login(dto.value);
      if (loginResp.data.code === 1) {
        resetRoutes();

        const token = loginResp.data.data.token;
        serverToken.value = token;
        serverUsername.value = parseJwt(token).username;
        serverUserId.value = parseJwt(token).userId;

        const menuResp = loginResp.data.data.menus;
        const routerResp = loginResp.data.data.routes;
        serverMenus.value = menuResp;
        addServerRoutes(routerResp);

        router.push("/main");
      }
    }
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  resetRoutes();
});

function parseJwt(token: string) {
  if (!token) {
    return "";
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}
</script>

<style scoped>
/* 登录页面的根容器样式 (居中)*/
.login-page {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 占满整个屏幕 */
  width: 100vw; /* 占满整个屏幕 */
  background-color: #4196f2;
}

/* 登录框样式 */
.login {
  width: 350px; /* 调整宽度 */
  padding: 30px; /* 增加内边距 */
  background-color: white; /* 背景色改为白色 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 更明显的阴影效果 */
  border-radius: 12px; /* 圆角 */
}

.login-title {
  color: #333;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 30px;
}

/* 小按钮的美化 */
.el-button {
  width: 100%; /* 按钮宽度占满 */
  margin-top: 10px; /* 增加与上方组件的间距 */
}

/* 单选框样式 */
.el-radio-group {
  margin: 15px 0; /* 增加上下的间距 */
}

.register-entry a {
  color: #4196f2;
  text-decoration: none;
}
.register-entry a:hover {
  text-decoration: underline;
}
</style>
