// client/src/router/index.ts
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  Router,
} from "vue-router";
import { useStorage } from "@vueuse/core";
import { Route, Menu } from "../model/Model8080";
import { getComponent } from "./modules";
import { validateToken } from "../utils/auth"; // 导入验证函数

const clientRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/",
    redirect: "/main",
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/NotFound.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/main.vue"),
    meta: { requiresAuth: true }, //需要授权
  },
  {
    path: "/:pathMatcher(.*)*",
    name: "remaining",
    redirect: "/404",
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes: clientRoutes,
});

// 每次路由跳转之前执行
router.beforeEach((to, from) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    const isValid = validateToken();
    if (!isValid) {
      console.log("Token is invalid, redirecting to login");
      return "/login";
    }
  }
});

// 每次路由跳转之后执行
router.afterEach((to) => {
  document.title = to.meta.title?.toString() || to.name?.toString() || "";
});

export const serverUsername = useStorage<string>("serverUsername", "");
export const serverUserId = useStorage<number | null>("serverUserId", null);
export const serverToken = useStorage<string>("serverToken", "");
export const serverMenus = useStorage<Menu[]>("serverMenus", []);

const serverRoutes = useStorage<Route[]>("serverRoutes", []);

// 添加服务器端路由
export function addServerRoutes(routeList: Route[]) {
  if (!routeList || routeList.length === 0) {
    return; // 防止初始化的路由不存在
  }
  routeList.forEach((r) => {
    router.addRoute("main", {
      path: r.path,
      name: r.routeName,
      component: getComponent(r.path), // 使用模块映射获得组件
      meta: {
        requiresAuth: true,
        title: r.routeName,
      },
    });
  });
  serverRoutes.value = routeList;
}

addServerRoutes(serverRoutes.value); // 初始化路由，防止页面刷新动态路由丢失。

// 重置路由、菜单、token、用户名、用户Id
export function resetRoutes() {
  // 先移除动态添加的路由
  serverRoutes.value &&
    serverRoutes.value.forEach((r) => {
      router.removeRoute(r.routeName);
    });

  // 重置路由
  clientRoutes.forEach((r) => {
    router.addRoute(r);
  });

  serverRoutes.value = [];
  serverMenus.value = [];
  serverUsername.value = "";
  serverUserId.value = null;
  serverToken.value = "";
}

export { router };
export default router;
