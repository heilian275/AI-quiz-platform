<template>
  <el-container style="height: 100vh;width: 100vw;">

    <!-- 导航栏 -->
    <el-header class="dark-header">
      <div class="header-container">
        <div class="header-user">
          <span>您好, {{ username }}</span>
        </div>
        <div class="header-title">公司销售管理系统</div>
        <div class="header-user">
          <el-button type="text" class="logout-button" @click="logout">退出登录</el-button>
        </div>
      </div>
    </el-header>

    <!-- 侧边/菜单栏 -->
    <el-container>
      <el-aside class="aside-menu" width="240px">
        <!-- 菜单 -->
        <!-- <el-menu :default-active="$route.path" active-text-color="#ffd04b">
          <template v-for="menu in serverMenus" :key="menu.id">
            <el-menu-item :index="menu.routePath">
              <router-link :to="menu.routePath || ''">{{ menu.name }}</router-link>
            </el-menu-item>
          </template>
</el-menu> -->

        <el-menu router :default-active="activeMenu" active-text-color="#ffd04b" @select="handleMenuSelect">
          <template v-for="menu in serverMenus" :key="menu.id">
            <el-menu-item :index="menu.routePath || '/404'">
              {{ menu.name }}
            </el-menu-item>
          </template>
        </el-menu>


      </el-aside>

      <!-- 主要展示区 -->
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>


    </el-container>
  </el-container>
</template>




<!----------------------------- ts代码 ----------------------------->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { Menu } from '../model/Model8080';

const router = useRouter();
const username = useStorage('serverUsername', ''); // 从缓存中获取用户名
const userId = useStorage('serverUserId', ''); // 从缓存中获取用户名
const serverMenus = useStorage<Menu[]>('serverMenus', []); // 从缓存中获取菜单

// 动态设置默认激活的菜单项
const defaultActiveMenu = computed(() => {
  // 如果 `serverMenus` 存在，则选中第一个菜单项的 `routePath`
  return serverMenus.value.length > 0 ? serverMenus.value[0].routePath : '/404';
});

// 动态设置选中的菜单项
const activeMenu = ref<string>(''); // 用于动态绑定选中的菜单

function handleMenuSelect(index: string) {
  console.log("Selected route:", index); // 调试日志
  activeMenu.value = index; // 更新选中菜单状态
  if (index) {
    router.push(index).then(() => {
      console.log("Navigated to:", index); // 调试日志
    }).catch(err => {
      console.error("Navigation error:", err); // 阻止调试
    });
  }
}

onMounted(() => {
  // 在页面加载时，主动跳转到第一个菜单项对应的路由，并设置选中状态
  if (serverMenus.value.length > 0) {
    const firstRoute = serverMenus.value[0]?.routePath || '/404'; // 确保第一个菜单路由存在
    if (router.currentRoute.value.path !== firstRoute) {
      router.push(firstRoute).then(() => {
        console.log(`Automatically navigated to: ${firstRoute}`);
        activeMenu.value = firstRoute; // 设置第一个菜单为激活状态
      }).catch(err => {
        console.error("Automatic navigation error:", err);
      });
    } else {
      activeMenu.value = router.currentRoute.value.path; // 当前路径即为激活路径
    }
  }
});


function logout() {
  // 清除缓存信息
  useStorage('serverToken', '');
  useStorage('serverUsername', '');
  useStorage('serverUserId', '');
  useStorage('serverMenus', []);
  useStorage('serverRoutes', []);

  // 跳转回登录页面
  router.push('/login');
}
</script>







<!----------------------------- css美化代码 ----------------------------->

<!-- <style scoped>
/* 全局设置 box-sizing */
* {
  box-sizing: border-box;
}

/* 容器布局样式 */
.el-container {
  width: 100%;
  /* 替换 100vw */
  height: 100%;
  display: flex;
  flex-direction: column;
}


/* 导航栏样式 */
.dark-header {
  background-color: #1f2d3d;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffd04b;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout-button {
  color: #fff;
}

/* 侧边栏样式 */
.aside-menu {
  background-color: #001529;
  color: #fff;
  height: 100%;
}

.el-menu {
  background-color: transparent;
  border-right: none;
}

.el-menu-item {
  color: #fff;
}

.el-menu-item.is-active {
  background-color: #ffd04b !important;
  color: #1f2d3d !important;
}

/* 主内容区样式 */
.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

/* 修复滚动条问题 */
body {
  overflow: hidden;
}
</style> -->



<style scoped>
/* 全局设置 box-sizing */
* {
  box-sizing: border-box;
}

/* 容器布局样式 */
.el-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 让 Header 在顶部 */
}

/* 内部布局：菜单栏 + 内容区 */
.el-container > .el-container {
  flex: 1;
  display: flex;
  flex-direction: row; /* 菜单栏和主要内容区横向排列 */
}

/* 导航栏样式 */
.dark-header {
  background-color: #1f2d3d;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffd04b;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout-button {
  color: #fff;
}

/* 侧边栏样式 */
.aside-menu {
  background-color: #001529;
  color: #fff;
  width: 240px; /* 明确菜单栏宽度 */
  height: 100%;
  overflow-y: auto; /* 如果内容超出，添加滚动条 */
}

.el-menu {
  background-color: transparent;
  border-right: none;
}

.el-menu-item {
  color: #fff; /* 默认字体颜色 */
}

/* 鼠标悬停时的样式 */
.el-menu-item:hover {
  background-color: rgba(255, 208, 75, 0.2); /* 像素化半透明的深色背景 */
  color: #ffd04b; /* 鼠标悬停时的字体颜色 */
}

.el-menu-item.is-active {
  background-color: #ffd04b !important; /* 激活状态的背景颜色 */
  color: #1f2d3d !important; /* 激活状态的字体颜色 */
}

/* 主内容区样式 */
.main-content {
  flex: 1; /* 填充剩余空间 */
  background-color: #2c3e50; /* 深色背景 */
  color: #ecf0f1; /* 浅色文字 */
  padding: 20px;
  overflow-y: auto;
  border-left: 1px solid #34495e; /* 可选：添加一个边框，与菜单栏区分 */
}

/* 修复滚动条问题 */
body {
  overflow: hidden;
}
</style>