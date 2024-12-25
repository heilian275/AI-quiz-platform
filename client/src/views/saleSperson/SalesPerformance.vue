<template>
  <div class="sales-execution">
    <el-page-header content="销售业绩查询" style="color: gray;" />
    <el-main>
      <el-form :model="dateRange" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="挑选时间范围：">
          <el-col :span="9" style="padding-right: 5px;">
            <el-date-picker v-model="dateRange[0]" type="date" placeholder="开始日期" style="width: 100%;" />
          </el-col>
          <el-col :span="1" style="text-align: center; color: black;">至</el-col>
          <el-col :span="9" style="padding-left: 5px;">
            <el-date-picker v-model="dateRange[1]" type="date" placeholder="结束日期" style="width: 100%;" />
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="onQuery" style="width: 100%;">查询</el-button>
          </el-col>
        </el-form-item>
      </el-form>

      <div v-if="salesData" class="sales-results">
        <h3 class="sales-title">
          {{ dateRange[0].toLocaleDateString() }} - {{ dateRange[1].toLocaleDateString() }}期间，您的销售业绩如下：
        </h3>
        <el-table :data="[salesData]" style="width: 100%">
          <el-table-column label="总销售额" prop="totalSales" />
          <el-table-column label="签订合同总数" prop="contractCount" />
        </el-table>
        <div class="historical-sales">您的历史销售额为：{{ salesData.historicalSales }} 元</div>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from "@/api/request"; // 导入 Axios 封装
import { useStorage } from "@vueuse/core";

interface SalesData {
  totalSales: number;
  contractCount: number;
  historicalSales: number;
}

// 获取当前销售人员 ID
const serverUserId = useStorage<number>("serverUserId", 0);

const dateRange = ref([new Date(), new Date()]); // 日期范围
const salesData = ref<SalesData | null>(null); // 销售数据

// 查询销售业绩的方法
async function onQuery() {
  try {
    const startDate = dateRange.value[0].toISOString().split('T')[0]; // '2024-12-15'
    const endDate = dateRange.value[1].toISOString().split('T')[0]; // '2024-12-20'
    const response = await axios.get(`/api/sales/performance/${serverUserId.value}?startDate=${startDate}&endDate=${endDate}`);
    salesData.value = response.data.data; // 假设后端返回的数据结构符合预期，并包含 totalSales, contractCount, historicalSales
  } catch (error) {
    console.error("获取销售业绩数据失败:", error);
  }
}
</script>

<style scoped>
.sales-execution {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.el-form-item {
  display: flex; /* 使用 flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
  max-width: 50%; /* 限制表单项的最大宽度为页面宽度的一半 */
  margin: 0 auto; /* 居中对齐 */
}

.el-date-picker {
  width: 100%; /* 确保日期选择器充满其父元素 */
}

.el-button {
  width: 100%; /* 确保按钮充满其父元素 */
}

.sales-results {
  margin-top: 20px;  /* 结果显示区的顶部间距 */
}

.sales-title {
  color: black; /* 设置标题为黑色 */
  text-align: left; /* 设置标题左对齐 */
  margin-bottom: 10px; /* 设置下边距 */
}

.historical-sales {
  color: black; /* 设置历史销售额为黑色 */
  text-align: left; /* 设置历史销售额为左对齐 */
  margin-top: 10px; /* 设置顶部间距 */
}
</style>
