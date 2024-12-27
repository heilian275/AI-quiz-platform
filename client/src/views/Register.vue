<template>
  <div class="register-page">
    <!-- 注册页面根容器 -->
    <div class="register">
      <el-form
        :model="dto"
        :rules="rules"
        ref="registerForm"
        label-width="100px"
      >
        <h2 class="register-title">注册账号</h2>

        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="dto.username"
            placeholder="请输入用户名"
            @keyup.enter="onRegister"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="dto.password"
            placeholder="请输入密码"
            @keyup.enter="onRegister"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="dto.confirmPassword"
            placeholder="请再次输入密码"
            @keyup.enter="onRegister"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="dto.role">
            <el-radio label="user">用户</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="button-group">
          <el-button type="primary" @click="onRegister">注册</el-button>
          <el-button @click="cancelRegister" class="cancel-button"
            >返回登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "../api/request";
import { useRequest } from "vue-request";
import { LoginDto, AxiosRespObject } from "../model/Model8080";

const router = useRouter();

const dto = ref({
  username: "",
  password: "",
  confirmPassword: "",
  role: "user",
});
const registerForm = ref();

const rules = ref({
  username: [{ required: true, message: "用户名必填", trigger: "blur" }],
  password: [{ required: true, message: "密码必填", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "确认密码必填", trigger: "blur" },
    ({ getFieldValue }) => ({
      validator(_: any, value: any) {
        if (!value) return Promise.resolve();

        if (value === getFieldValue("password")) return Promise.resolve();
        return Promise.reject(new Error("两次密码不一致"));
      },
      trigger: "blur",
    }),
  ],
});

const { runAsync: register } = useRequest<AxiosRespObject<any>, [LoginDto]>(
  (dto) => axios.post("/api/auth/register", dto),
  { manual: true }
);

async function onRegister() {
  try {
    const valid = await registerForm.value.validate();
    if (valid) {
      const registerResp = await register(dto.value);
      if (registerResp.data.code === 1) {
        router.push("/login");
      }
    }
  } catch (error) {
    console.error(error);
  }
}
function cancelRegister() {
  router.push("/login");
}
</script>

<style scoped>
/* 注册页面的根容器样式 (居中)*/
.register-page {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 占满整个屏幕 */
  width: 100vw; /* 占满整个屏幕 */
  background-color: #4196f2;
}

/* 注册框样式 */
.register {
  width: 350px; /* 调整宽度 */
  padding: 30px; /* 增加内边距 */
  background-color: white; /* 背景色改为白色 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 更明显的阴影效果 */
  border-radius: 12px; /* 圆角 */
}

.register-title {
  color: #333;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 30px;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  flex-direction: column; /* 将子元素垂直排列 */
  margin-top: 10px;
}

/* 小按钮的美化 */
.el-button {
  width: 100%; /* 按钮宽度占满 */
  margin-top: 10px; /* 增加与上方组件的间距 */
  display: block;
}

/* 返回登录按钮样式 */
.cancel-button {
  margin-top: 10px; /* 增加与上方按钮的间距 */
}

/* 覆盖 Element Plus 的默认样式 */
:deep(.el-button + .el-button) {
  margin-left: 0; /* 移除左边距 */
}

/* 单选框样式 */
.el-radio-group {
  margin: 15px 0; /* 增加上下的间距 */
}
</style>
