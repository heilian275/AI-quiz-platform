<template>
  <div class="Delivery-list">
    <!-- 页面标题 -->
    <el-page-header content="发货单列表"></el-page-header>

    <!-- 工具栏 -->
    <el-row class="tools" justify="end">
      <el-button type="primary" @click="refreshData">刷新数据</el-button>
    </el-row>

    <!-- 库存表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="quantity" label="商品数量" align="center"></el-table-column>
      <el-table-column prop="status" label="发货状态" align="center"></el-table-column>
      <el-table-column prop="trackingNumber" label="物流编号" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "@/api/request";
import { useRequest } from "vue-request";
import { AxiosRespList } from "@/model/Model8080";

// 定义 ProductVO 接口
interface DeliveryInfoVO {
  id: number;
  productName: string;
  quantity: number;
  status: string;
  trackingNumber: string;
}

// 表格数据
const tableData = ref<DeliveryInfoVO[]>([]);
const loading = ref(false); // 加载状态

// 使用 useRequest 获取数据
const { run: fetchData } = useRequest<AxiosRespList<DeliveryInfoVO>>(
  async () => {
    loading.value = true; // 开始加载
    return await axios.get("/api/admin/delivery/list");
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
.Delivery-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.tools {
  margin-bottom: 10px;
}
</style>
