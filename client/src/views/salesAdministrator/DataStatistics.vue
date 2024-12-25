<template>
  <div class="sales-statistics">
    <!-- 第一部分：时间范围选择 -->
    <el-page-header content="数据统计" style="color: gray;" />
    <el-main>
      <el-form :model="dateRange" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="挑选时间范围：" style="width: 100%;">
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

      <!-- 显示销售总额和时间段内的销售额 -->
      <div v-if="salesSummary" class="sales-summary">
        <h3 class="message">销售总额：{{ salesSummary.totalSales }} 元</h3>
        <h3 class="message">此时间段内销售额：{{ salesSummary.inPeriodSales }} 元</h3>
      </div>

      <!-- 第二部分：图表并排显示 -->
      <div class="charts-container">
        <div class="chart-container">
          <div ref="customerChart" class="chart"></div>
        </div>
        <div class="chart-container">
          <div ref="productChart" class="chart"></div>
        </div>
      </div>
    </el-main>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from "@/api/request"; // 导入 Axios 封装
import { useStorage } from "@vueuse/core";
import * as echarts from 'echarts'; // 导入 ECharts

// 定义接口
interface CustomerSales {
  customerName: string;
  sales: number;
}

interface ProductSales {
  productName: string;
  sales: number;
}

interface SalesSummary {
  totalSales: number;
  inPeriodSales: number; // 此时间段内销售额
}

// 响应数据
const dateRange = ref([new Date(), new Date()]); // 日期范围
const serverUserId = useStorage<number>("serverUserId", 0);
const salesSummary = ref<SalesSummary | null>(null); // 销售总结数据

// 查询销售业绩的方法
async function onQuery() {
  try {
    const startDate = dateRange.value[0].toISOString().split('T')[0]; // 格式化为 'YYYY-MM-DD'
    const endDate = dateRange.value[1].toISOString().split('T')[0]; // 格式化为 'YYYY-MM-DD'

    // 查询销售总额和时间段内销售额的接口调用
    const response = await axios.get(`/api/admin/sales/performance-summary?startDate=${startDate}&endDate=${endDate}`);
    salesSummary.value = response.data.data; // 获取销售总结数据

    // 重新渲染图表
    await renderCustomerChart();
    await renderProductChart();

  } catch (error) {
    console.error("获取销售数据失败:", error);
  }
}

// 渲染客户销售额图表
async function renderCustomerChart() {
  try {
    const response = await axios.get(`/api/admin/customer-sales`);
    const data: CustomerSales[] = response.data.data;

    const customerChartElement = document.querySelector('.chart-container > .chart') as HTMLElement;
    if (customerChartElement) {
      const customerChart = echarts.init(customerChartElement);
      const customerNames = data.map(item => item.customerName);
      const customerSales = data.map(item => item.sales);

      const option = {
        title: {
          text: '各客户的销售额',
          textStyle: {
            color: '#FFA500' // 设置标题颜色为橙色
          }
        },
        tooltip: {},
        xAxis: {
          data: customerNames,
        },
        yAxis: {},
        series: [{
          name: '销售额',
          type: 'bar',
          data: customerSales,
        }],
      };

      customerChart.setOption(option);
      customerChart.resize(); // 调整图表适应容器大小
    }
  } catch (error) {
    console.error("获取客户销售数据失败:", error);
  }
}

// 渲染商品销售额图表
async function renderProductChart() {
  try {
    const response = await axios.get(`/api/admin/product-sales`);
    const data: ProductSales[] = response.data.data;

    const productChartElement = document.querySelector('.chart-container:nth-of-type(2) .chart') as HTMLElement;
    if (productChartElement) {
      const productChart = echarts.init(productChartElement);
      const productNames = data.map(item => item.productName);
      const productSales = data.map(item => item.sales);

      const option = {
        title: {
          text: '各商品的销售额',
          textStyle: {
            color: '#FFA500' // 设置标题颜色为橙色
          }
        },
        tooltip: {},
        xAxis: {
          data: productNames,
        },
        yAxis: {},
        series: [{
          name: '销售额',
          type: 'bar',
          data: productSales,
        }],
      };

      productChart.setOption(option);
      productChart.resize(); // 调整图表适应容器大小
    }
  } catch (error) {
    console.error("获取商品销售数据失败:", error);
  }
}

// 页面加载时获取数据
onMounted(() => {
  renderCustomerChart();  // 页面加载时获取客户销售额
  renderProductChart();   // 页面加载时获取产品销售额
});
</script>


<style scoped>
.sales-statistics {
  padding: 20px;
  height: 840px;
  background-color: #ffffff;
  border-radius: 8px;
}

.sales-summary {
  margin-top: 20px;
}

.charts-container {
  display: flex; /* 使用flexbox布局 */
  justify-content: space-between; /* 在两个图表间留出空间 */
  margin-top: 100px; /* 上方间距 */
}

.chart-container {
  width: 48%; /* 调整宽度以确保两个图表能并排显示 */
}

.chart {
  height: 300px; /* 图表高度 */
}

.message {
  color: black;
  text-align: left;
  margin-top: 10px;
}
</style>