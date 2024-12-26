// src/router/modules.ts
export const modules: Record<string, () => Promise<any>> = {
    // 销售人员动态路由映射（路径->路由组件）
    // '/main/sales/execution': () => import('@/views/saleSperson/SalesExecution.vue'),
    // '/main/sales/performance': () => import('@/views/saleSperson/SalesPerformance.vue'),

    // // 销售管理员动态路由映射（路径->路由组件）
    // '/main/admin/contracts': () => import('@/views/salesAdministrator/ContractList.vue'),
    // '/main/admin/customers': () => import('@/views/salesAdministrator/CustomerList.vue'),
    // '/main/admin/deliveries': () => import('@/views/salesAdministrator/AdminDeliveryList.vue'),
    // '/main/admin/salespersons': () => import('@/views/salesAdministrator/SalesPersonList.vue'),
    // '/main/admin/statistics': () => import('@/views/salesAdministrator/DataStatistics.vue'),

    // // 仓库管理员动态路由映射（路径->路由组件）
    // '/main/warehouse/deliveries': () => import('@/views/warehouseKeeper/DeliveryList.vue'),
    // '/main/warehouse/purchases': () => import('@/views/warehouseKeeper/PurchaseList.vue'),
    // '/main/warehouse/stocks': () => import('@/views/warehouseKeeper/StockList.vue'),
};

// 获取组件的函数
export function getComponent(routePath: string) {
    return modules[routePath] || (() => import('@/views/NotFound.vue')); // 默认导入 404 组件
}