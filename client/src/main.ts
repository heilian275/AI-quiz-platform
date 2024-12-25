import { createApp } from 'vue';
import App from './App.vue'; // 改为根组件
import router from './router/index'; // 正确引入路由配置
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';

const app = createApp(App);
app.use(router); // 使用路由
app.use(ElementPlus);
app.mount('#app');
