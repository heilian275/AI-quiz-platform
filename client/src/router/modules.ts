// src/router/modules.ts
// 使用 import.meta.glob 自动导入 views 目录下的所有 .vue 文件
const modules = import.meta.glob("@/views/**/*.vue");
// 获取组件的函数
export function getComponent(routePath: string) {
  // 将路由路径转换为模块的键，以便查找组件
  //例如， '/main/question-list' 转换为 '/src/views/question/QuestionList.vue'
  console.log("Current Routes routePath:", routePath); // 打印路由信息
  let key = `/src/views${routePath.replace("/main", "")}.vue`;

  // 检查是否是二级目录，并添加二级目录
  const parts = routePath.replace("/main", "").split("/").filter(Boolean); //去掉/main和空字符
  if (parts.length > 1) {
    key = `/src/views/${parts.join("/")}.vue`;
  }
  console.log("Current Routes key:", key); // 打印路由信息
  if (modules[key]) {
    console.log("成功：Current Routes:", modules[key]); // 打印路由信息
    return modules[key];
  }
  console.log("成功：Current key:", key);
  return () => import("@/views/NotFound.vue"); // 默认导入 404 组件
}
