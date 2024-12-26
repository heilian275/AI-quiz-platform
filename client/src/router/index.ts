import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { useStorage } from "@vueuse/core";
import { Route, Menu } from "../model/Model8080";
import { getComponent } from "./modules";

const clientRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/",
    redirect: "/main", // 将根路径重定向到 /main
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/NotFound.vue"), // 404 页面
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/main.vue"), // 主页面
    children: [
      {
        path: "question-list", // 子路由，对应题目列表
        name: "questionList",
        component: () => import("../views/question/QuestionList.vue"), // 题目列表组件
        meta: {
          title: "题目列表",
        },
      },
      {
        path: "add-question", // 子路由，对应添加题目
        name: "addQuestion",
        component: () => import("../views/question/AddQuestion.vue"),
        meta: {
          title: "添加题目",
        },
      },
      {
        path: "question-bank/public", // 子路由，对应题库广场
        name: "publicQuestionBank",
        component: () => import("../views/questionBank/PublicQuestionBank.vue"),
        meta: {
          title: "题库广场",
        },
      },
      {
        path: "question-bank/my", // 子路由，对应我的题库
        name: "myQuestionBank",
        component: () => import("../views/questionBank/MyQuestionBank.vue"),
        meta: {
          title: "我的题库",
        },
      },
      {
        path: "question-bank/collection", // 子路由, 对应收藏题库
        name: "collectionQuestionBank",
        component: () =>
          import("../views/questionBank/CollectionQuestionBank.vue"),
        meta: {
          title: "收藏题库",
        },
      },
      {
        path: "question-bank/ai", // 子路由，对应AI题库
        name: "aiQuestionBank",
        component: () => import("../views/questionBank/AIQuestionBank.vue"),
        meta: {
          title: "AI题库",
        },
      },
      {
        path: "question-bank/create", // 子路由，对应新建题库
        name: "createQuestionBank",
        component: () => import("../views/questionBank/CreateQuestionBank.vue"),
        meta: {
          title: "新建题库",
        },
      },
      {
        path: "learning-materials/my", // 子路由，对应我的学习资料
        name: "myLearningMaterials",
        component: () =>
          import("../views/learningMaterial/MyLearningMaterial.vue"),
        meta: {
          title: "我的学习资料",
        },
      },
      {
        path: "learning-materials/create", // 子路由，对应新建学习资料
        name: "createLearningMaterial",
        component: () =>
          import("../views/learningMaterial/CreateLearningMaterial.vue"),
        meta: {
          title: "新建学习资料",
        },
      },
      {
        path: "profile",
        name: "userProfile",
        component: () => import("../views/user/UserProfile.vue"),
        meta: {
          title: "个人中心",
        },
      },
    ],
  },
  {
    path: "/:pathMatcher(.*)*",
    name: "remaining",
    redirect: "/404", // 匹配所有未定义的路由，重定向到 404 页面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: clientRoutes,
});

// 每次路由跳转之前执行
// to 目标路由对象
// from 源路由对象
// router.beforeEach((to, from) => {
//   if (to.name === "main" && !serverToken.value) {
//     // console.log('Navigating from', from.fullPath, 'to', to.fullPath);
//     return "/login";
//   }
// });

// 每次路由跳转之后执行, 例如统一修改页面标题
router.afterEach((to, from) => {
  document.title = to.name?.toString() || "";
});

export const serverUsername = useStorage<string>("serverUsername", "");
export const serverUserId = useStorage<number | null>("serverUserId", null);
export const serverToken = useStorage<string>("serverToken", "");
export const serverMenus = useStorage<Menu[]>("serverMenus", []);
const serverRoutes = useStorage<Route[]>("serverRoutes", []);
addServerRoutes(serverRoutes.value);

// 重置路由、菜单、token、用户名、用户Id
export function resetRoutes() {
  for (const r of clientRoutes) {
    // 参数1: 路由对象, (原始的路由对象)
    router.addRoute(r); // 替换掉同名的路由对象
  }
  serverRoutes.value = null;
  serverMenus.value = null;
  serverUsername.value = null;
  serverUserId.value = null;
  serverToken.value = null;
}

// 添加服务器端路由
// export function addServerRoutes(routeList: Route[]) {
//   for(const r of routeList) {
//     // 参数1: 父路由名字
//     // 参数2: 路由对象
//     router.addRoute(r.parentRoute, {
//       path: r.path,
//       name: r.routeName,
//       component: () => import (/* @vite-ignore */ r.component) // 忽略路径检查
//     })
//   }
//   serverRoutes.value = routeList
// }

export function addServerRoutes(routeList: Route[]) {
  for (const r of routeList) {
    // 参数1: 父路由名字
    // 参数2: 路由对象
    router.addRoute(r.parentRoute, {
      path: r.path,
      name: r.routeName,
      component: getComponent(r.path), // 使用映射获得组件
    });
  }
  serverRoutes.value = routeList;
}

export default router;
