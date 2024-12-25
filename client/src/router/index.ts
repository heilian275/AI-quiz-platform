import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { Route, Menu } from '../model/Model8080'
import { getComponent } from './modules';

const clientRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/main.vue')
  },
  {
    path: '/:pathMatcher(.*)*',
    name: 'remaining',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: clientRoutes
})

// 每次路由跳转之前执行
// to 目标路由对象
// from 源路由对象
router.beforeEach((to, from) => {
  if (to.name === 'main' && !serverToken.value) {
    // console.log('Navigating from', from.fullPath, 'to', to.fullPath);
    return '/login'
  }
})

// 每次路由跳转之后执行, 例如统一修改页面标题
router.afterEach((to, from) => {
  document.title = to.name?.toString() || ''
})

export const serverUsername = useStorage<string>('serverUsername', '')
export const serverUserId = useStorage<number | null>('serverUserId', null);
export const serverToken = useStorage<string>('serverToken', '')
export const serverMenus = useStorage<Menu[]>('serverMenus', [])
const serverRoutes = useStorage<Route[]>('serverRoutes', [])
addServerRoutes(serverRoutes.value)

// 重置路由、菜单、token、用户名、用户Id
export function resetRoutes() {
  for (const r of clientRoutes) {
    // 参数1: 路由对象, (原始的路由对象)
    router.addRoute(r) // 替换掉同名的路由对象
  }
  serverRoutes.value = null
  serverMenus.value = null
  serverUsername.value = null
  serverUserId.value = null
  serverToken.value = null
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
    })
  }
  serverRoutes.value = routeList
}


export default router