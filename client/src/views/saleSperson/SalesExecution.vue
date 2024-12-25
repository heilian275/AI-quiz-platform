<template>
  <div class="sales-execution">
    <!-- 页面标题 -->
    <el-page-header content="合同执行情况" />

    <!-- 表格展示 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80" align="center" />
      <el-table-column prop="customerName" label="客户名" align="center" />
      <el-table-column prop="amount" label="合同总金额" align="center" />
      <el-table-column prop="status" label="合同状态" align="center" />
      <el-table-column prop="payStatus" label="支付状态" align="center" />
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <!-- 支付状态是未支付时显示按钮 -->
          <el-button
            v-if="scope.row.payStatus === '未支付'"
            type="primary"
            size="small"
            @click="handlePay(scope.row.id)"
          >
            更改成已支付
          </el-button>
          <!-- 支付状态是已支付时显示提示文字 -->
          <el-tag type="success" v-else>已支付</el-tag>
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
import { ElMessage, ElMessageBox } from "element-plus";
import { useStorage } from "@vueuse/core";

// 定义 ContractVO 接口
interface ContractVO {
  id: number;
  customerName: string;
  salespersonName: string;
  amount: string;
  status: string;
  payStatus: string;
}

// 加载状态
const loading = ref(false);
// 表格数据
const tableData = ref<ContractVO[]>([]);

// 获取当前销售人员 ID
const serverUserId = useStorage<number>("serverUserId", 0);

// 获取合同数据请求
const { run: fetchContracts } = useRequest<AxiosRespList<ContractVO>>(
  () => axios.get(`/api/sales/contract/list/bySalesperson/${serverUserId.value}`),
  {
    manual: true,
    onBefore: () => {
      loading.value = true; // 开始加载
    },
    onSuccess: (res) => {
      if (res.data.code === 1) {
        tableData.value = res.data.data; // 赋值表格数据
      } else {
        ElMessage.error("获取合同列表失败：" + res.data.msg);
      }
      loading.value = false; // 结束加载
    },
    onError: (error) => {
      console.error("获取合同列表出错：", error);
      ElMessage.error("获取合同列表失败，请稍后重试");
      loading.value = false; // 出错时结束加载
    },
  }
);

// 已支付按钮操作
const handlePay = async (contractId: number) => {
  // 弹出确认框
  ElMessageBox.confirm("确定标记为已支付吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // 确定后发送 POST 请求
      try {
        const res = await axios.post(`/api/sales/contract/pay/${contractId}`);
        if (res.data.code === 1) {
          ElMessage.success("操作成功");
          fetchContracts(); // 重新获取数据，刷新表格
        } else {
          ElMessage.error("操作失败：" + res.data.msg);
        }
      } catch (error) {
        console.error("支付请求失败：", error);
        ElMessage.error("操作失败，请稍后重试");
      }
    })
    .catch(() => {
      ElMessage.info("已取消操作");
    });
};

// 页面加载时获取数据
onMounted(() => {
  fetchContracts();
});
</script>

<style scoped>
.sales-execution {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
</style>
