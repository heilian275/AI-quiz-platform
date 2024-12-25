<template>
  <router-view /> <!-- 路由占位符，显示当前路由的页面内容 -->
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* 1 */
/* 全局样式，无需 scoped。该代码很重要，防止子视图左边和上边有留白 */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
}

/* 2 */
/* html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; 
}

#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

* {
  box-sizing: border-box;
} */

 /* 3 */
 /* 全局样式 */
/* html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 避免滚动条 */
/* } */

/* #app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
} */ 
</style>
