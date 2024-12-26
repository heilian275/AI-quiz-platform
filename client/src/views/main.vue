<template>
  <el-container style="height: 100vh; width: 100vw">
    <!-- 导航栏 -->
    <el-header class="dark-header">
      <div class="header-container">
        <div class="header-user">
          <span>您好, {{ username }}</span>
        </div>
        <div class="header-title">AI智能刷题平台</div>
        <div class="header-user">
          <el-button type="text" class="logout-button" @click="logout">退出登录</el-button>
        </div>
      </div>
    </el-header>

    <!-- 侧边/菜单栏 -->
    <el-container>
      <el-aside class="aside-menu" width="240px">
        <el-menu router :default-active="activeMenu" active-text-color="#ffd04b" @select="handleMenuSelect">
          <template v-for="menu in serverMenus" :key="menu.id">
            <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.routePath">
              <template #title>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item v-for="child in menu.children" :key="child.id" :index="child.routePath">
                {{ child.name }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="menu.routePath || '/404'">
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

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { Menu } from "../model/Model8080"; // 确保路径正确

const router = useRouter();
const username = useStorage("serverUsername", "");
const userId = useStorage("serverUserId", "");
const serverMenus = useStorage<Menu[]>("serverMenus", []);

const activeMenu = ref<string>("");

const defaultActiveMenu = computed(() => {
  return router.currentRoute.value.path;
});


function handleMenuSelect(index: string) {
  console.log("Selected route:", index);
  activeMenu.value = index;
  router.push(index)
    .then(() => {
      console.log("Navigated to:", index);
    })
    .catch((err) => {
      console.error("Navigation error:", err);
    });
}

onMounted(() => {
    activeMenu.value = router.currentRoute.value.path;
    serverMenus.value = [
      {
        id: 1,
        name: "题目管理",
        routePath: "/main/question-management", // 父级菜单路径，用于唯一标识
        children: [
          {
            id: 11,
            name: "题目列表",
            routePath: "/main/question-list", // 实际路由
            role: "admin",
          },
          {
            id: 12,
            name: "添加题目",
            routePath: "/main/add-question", // 实际路由
            role: "admin",
          },
        ],
      },
      {
        id: 2,
        name: "题库列表",
        routePath: "/main/question-bank",  // 父级菜单路径，用于唯一标识
        children: [
          {
            id: 21,
            name: "题库广场",
            routePath: "/main/question-bank/public", // 实际路由
            role: "admin",
          },
          {
            id: 22,
            name: "我的题库",
            routePath: "/main/question-bank/my", // 实际路由
            role: "admin",
          },
          {
            id: 23,
            name: "收藏题库",
            routePath: "/main/question-bank/collection", // 实际路由
            role: "admin",
          },
          {
            id: 24,
            name: "AI题库",
            routePath: "/main/question-bank/ai", // 实际路由
            role: "admin",
          },
          {
            id: 25,
            name: "新建题库",
            routePath: "/main/question-bank/create", // 实际路由
            role: "admin",
          },
        ],
      },
      {
        id: 3,
        name: "学习资料",
        routePath: "/main/learning-materials",  // 父级菜单路径，用于唯一标识
        children: [
          {
            id: 31,
            name: "我的学习资料",
            routePath: "/main/learning-materials/my", // 实际路由
            role: "admin",
          },
          {
            id: 32,
            name: "新建学习资料",
            routePath: "/main/learning-materials/create", // 实际路由
            role: "admin",
          },
        ],
      },
      {
        id: 4,
        name: "个人中心",
         routePath: "/main/profile",// 实际路由
      }
    ];
});

function logout() {
  useStorage("serverToken", "");
  useStorage("serverUsername", "");
  useStorage("serverUserId", "");
  useStorage("serverMenus", []);
  useStorage("serverRoutes", []);
  router.push("/login");
}
</script>

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
  flex-direction: column;
}

.el-container > .el-container {
  flex: 1;
  display: flex;
  flex-direction: row;
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
  width: 240px;
  height: 100%;
  overflow-y: auto;
}

.el-menu {
  background-color: transparent;
  border-right: none;
}

.el-menu-item {
  color: #fff;
}

.el-menu-item:hover {
  background-color: rgba(255, 208, 75, 0.2);
  color: #ffd04b;
}


.el-menu-item.is-active {
  background-color: #ffd04b !important;
  color: #1f2d3d !important;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  overflow-y: auto;
  border-left: 1px solid #34495e;
}


/* 子菜单样式 */
:deep(.el-sub-menu__title) {
   /* 修改二级菜单标题的样式 */
  padding-left: 20px;
  color:#fff; /*确保子菜单标题文字颜色也是白色*/
}
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 208, 75, 0.2); /*确保hover的时候背景色是可识别的*/
  color: #ffd04b;
}


:deep(.el-menu--popup) {
    background-color: #1f2937; /* 更深的背景色，与父菜单区分 */
    border: 1px solid #34495e; /*  添加边框 */
}

:deep(.el-menu-item) {
  background-color: #1f2337; /* 更深的背景色，与父菜单区分 */
  border: 1px solid #343f5e; /*  添加边框 */
}

:deep(.el-menu--popup .el-menu-item) {
    padding-left: 30px; /*  子菜单缩进 */
    color: #fff;    /*  设置子菜单文本颜色 */
}

:deep(.el-menu--popup .el-menu-item:hover) {
    background-color: rgba(255, 208, 75, 0.3); /*  悬停颜色*/
}

:deep(.el-menu--popup .el-menu-item.is-active) {
    background-color: #ffd04b;
    color: #1f2d3d;
}

/* 修复滚动条问题 */
body {
  overflow: hidden;
}
</style>