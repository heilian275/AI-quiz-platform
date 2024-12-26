// src/router/modules.ts
// 使用 import.meta.glob 自动导入 views 目录下的所有 .vue 文件
const modules = import.meta.glob("@/views/**/*.vue");
// 获取组件的函数
export function getComponent(routePath: string) {
  // 将路由路径转换为模块的键，以便查找组件
  //例如， '/main/question-list' 转换为 '/src/views/question/QuestionList.vue'
  console.log("Current Routes routePath:", routePath); // 打印路由信息
  const key = `/src/views${routePath.replace("/main", "")}.vue`;
  console.log("Current Routes key:", key); // 打印路由信息
  if (modules[key]) {
    console.log("Current Routes:", modules[key]); // 打印路由信息
    return modules[key];
  }
  console.log(modules)
  return () => import("@/views/NotFound.vue"); // 默认导入 404 组件
}

// export const modules: Record<string, () => Promise<any>> = {
//     // 销售人员动态路由映射（路径->路由组件）
//     // '/main/sales/execution': () => import('@/views/saleSperson/SalesExecution.vue'),
//     // '/main/sales/performance': () => import('@/views/saleSperson/SalesPerformance.vue'),

//     // // 销售管理员动态路由映射（路径->路由组件）
//     // '/main/admin/contracts': () => import('@/views/salesAdministrator/ContractList.vue'),
//     // '/main/admin/customers': () => import('@/views/salesAdministrator/CustomerList.vue'),
//     // '/main/admin/deliveries': () => import('@/views/salesAdministrator/AdminDeliveryList.vue'),
//     // '/main/admin/salespersons': () => import('@/views/salesAdministrator/SalesPersonList.vue'),
//     // '/main/admin/statistics': () => import('@/views/salesAdministrator/DataStatistics.vue'),

//     // // 仓库管理员动态路由映射（路径->路由组件）
//     // '/main/warehouse/deliveries': () => import('@/views/warehouseKeeper/DeliveryList.vue'),
//     // '/main/warehouse/purchases': () => import('@/views/warehouseKeeper/PurchaseList.vue'),
//     // '/main/warehouse/stocks': () => import('@/views/warehouseKeeper/StockList.vue'),
// };

// // 获取组件的函数
// export function getComponent(routePath: string) {
//     return modules[routePath] || (() => import('@/views/NotFound.vue')); // 默认导入 404 组件
// }
