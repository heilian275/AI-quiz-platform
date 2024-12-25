<template>
  <div class="purchase-list">
    <!-- 页面标题 -->
    <el-page-header content="进货单列表" />

    <!-- 进货单表格 -->
    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80" align="center" />
      <el-table-column prop="productName" label="商品名称" align="center" />
      <el-table-column prop="quantity" label="商品数量" align="center" />
      <el-table-column prop="status" label="进货状态" align="center" />
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <template v-if="scope.row.status === '未进货'">
            <el-button 
              type="success" 
              size="small" 
              @click="openPurchaseDialog(scope.row.id)"
            >
              已进货
            </el-button>
          </template>
          <template v-else>
            <el-tag  type="primary" effect="light" >已完成</el-tag>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：确认进货 -->
    <el-dialog v-model="purchaseDialogVisible" title="确认进货" width="400px">
      <el-form label-width="100px">
        <el-form-item label="确认进货吗？">
          <span>商品编号: {{ selectedPurchaseId }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="purchaseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPurchase">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRequest } from 'vue-request';
import axios from '@/api/request';
import { AxiosRespList, AxiosRespString } from "@/model/Model8080";
import { ElMessage } from 'element-plus';

// 定义 PurchaseInfoVO 接口
interface PurchaseInfoVO {
  id: number; // 编号
  productName: string; // 商品名称
  quantity: number; // 商品数量
  status: string; // 进货状态（未进货或已进货）
}

// 数据状态
const tableData = ref<PurchaseInfoVO[]>([]);
const loading = ref(false);
const purchaseDialogVisible = ref(false);
const selectedPurchaseId = ref<number | null>(null);

// 获取进货单数据请求
const { run: fetchPurchaseList } = useRequest<AxiosRespList<PurchaseInfoVO>>(
  () => axios.get('/api/ware/purchase/list'),
  {
    manual: true,
    onBefore: () => {
      loading.value = true;
    },
    onSuccess: (res) => {
      if (res.data.code === 1) {
        tableData.value = res.data.data; // 赋值表格数据
      } else {
        ElMessage.error("获取进货单列表失败：" + res.data.msg);
      }
      loading.value = false; // 结束加载
    },
    onError: (error) => {
      console.error("获取进货单列表出错：", error);
      ElMessage.error("获取进货单列表失败，请稍后重试");
      loading.value = false;
    }
  }
);

// 页面加载时获取数据
onMounted(() => {
  fetchPurchaseList();
});

// 打开确认进货弹窗
const openPurchaseDialog = (id: number) => {
  selectedPurchaseId.value = id; // 保存选择的进货单ID
  purchaseDialogVisible.value = true; // 打开弹窗
};

// 确认进货
const confirmPurchase = async () => {
  if (selectedPurchaseId.value === null) return; // 如果没有选择ID，则返回

  const purchaseInfoDTO = {
    id: selectedPurchaseId.value,
  };

  try {
    const res = await axios.post('/api/ware/purchase', purchaseInfoDTO);
    if (res.data.code === 1) {
      ElMessage.success(res.data.data); // 获取成功消息
      purchaseDialogVisible.value = false; // 关闭弹窗
      fetchPurchaseList(); // 重新获取进货单列表
    } else {
      ElMessage.error(res.data.msg); // 获取失败消息
    }
  } catch (error) {
    console.error("进货请求出错：", error);
    ElMessage.error("进货失败，请稍后重试");
  }
};
</script>

<style scoped>
.purchase-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
</style>

  