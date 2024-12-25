<template>
  <div class="stock-list">
    <!-- 页面标题 -->
    <el-page-header content="库存列表" />

    <!-- 工具栏 -->
    <el-row class="tools" justify="end">
      <el-button type="primary" @click="refreshData">刷新数据</el-button>
    </el-row>

    <!-- 库存表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80" align="center" />
      <el-table-column prop="name" label="商品名称" align="center" />
      <el-table-column prop="price" label="单价" align="center" />
      <el-table-column prop="currentStock" label="库存" align="center" />
      <el-table-column prop="stockThreshold" label="最低库存阈值" align="center" />
      <!-- 库存状态列 -->
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag type="danger" v-if="scope.row.currentStock < scope.row.stockThreshold">
            库存不足
          </el-tag>
          <el-tag type="success" v-else>库存正常</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "@/api/request";
import { useRequest } from "vue-request";
import { AxiosRespList } from "@/model/Model8080";

// 定义 ProductVO 接口
interface ProductVO {
  id: number;
  name: string;
  price: number;
  currentStock: number;
  stockThreshold: number;
}

// 表格数据
const tableData = ref<ProductVO[]>([]);
const loading = ref(false); // 加载状态

// 使用 useRequest 获取数据
const { run: fetchData } = useRequest<AxiosRespList<ProductVO>>(
  async () => {
    loading.value = true; // 开始加载
    return await axios.get("/api/ware/inventory/list");
  },
  {
    manual: true,
    onSuccess: (res) => {
      if (res.data.code === 1) {
        tableData.value = res.data.data; // 赋值表格数据
        loading.value = false; // 确保加载状态关闭
      } else {
        console.error("获取数据失败:", res.data.msg);
      }
    },
    onError: (error) => {
      console.error("请求出错:", error);
    },
  }
);

// 刷新数据
const refreshData = () => {
  fetchData();
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.stock-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.tools {
  margin-bottom: 10px;
}
</style>
