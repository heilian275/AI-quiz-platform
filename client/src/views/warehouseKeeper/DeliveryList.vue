<template>
  <div class="delivery-list">
    <!-- 页面标题 -->
    <el-page-header content="发货单列表" />

    <!-- 发货单表格 -->
    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80" align="center" />
      <el-table-column prop="productName" label="商品名称" align="center" />
      <el-table-column prop="quantity" label="商品数量" align="center" />
      <el-table-column prop="status" label="发货状态" align="center" />
      <el-table-column prop="trackingNumber" label="物流编号" align="center" />
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button type="success" size="small" @click="openDeliveryDialog(scope.row.id)"
            v-if="scope.row.status == '未发货'">
            发货
          </el-button>
          <el-tag v-else type="primary" effect="light" >已发货</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：发货 -->
    <el-dialog v-model="deliveryDialogVisible" title="发货" width="400px">
      <el-form :model="deliveryForm" label-width="100px">
        <el-form-item label="物流编号">
          <el-input v-model="deliveryForm.trackingNumber" placeholder="请输入物流编号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deliveryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDeliver">确定</el-button>
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
import qs from 'qs';

// 定义 DeliveryInfoVO 接口
interface DeliveryInfoVO {
  id: number; // 编号
  productName: string; // 商品名称
  quantity: number; // 商品数量
  status: string; // 发货状态
  trackingNumber: string; // 物流编号
}

// 数据状态
const tableData = ref<DeliveryInfoVO[]>([]);
const loading = ref(false);
const deliveryDialogVisible = ref(false);
const deliveryForm = ref<{ id?: number; trackingNumber: string }>({ trackingNumber: "" });

// 获取发货单数据请求
const { run: fetchDeliveryList } = useRequest<AxiosRespList<DeliveryInfoVO>>(
  () => axios.get('/api/ware/delivery/list'),
  {
    manual: true,
    onBefore: () => {
      loading.value = true;
    },
    onSuccess: (res) => {
      if (res.data.code === 1) {
        tableData.value = res.data.data; // 赋值表格数据
      } else {
        ElMessage.error("获取发货单列表失败：" + res.data.msg);
      }
      loading.value = false; // 结束加载
    },
    onError: (error) => {
      console.error("获取发货单列表出错：", error);
      ElMessage.error("获取发货单列表失败，请稍后重试");
      loading.value = false;
    }
  }
);

// 页面加载时获取发货单数据
onMounted(() => {
  fetchDeliveryList();
});

// 打开发货弹窗
const openDeliveryDialog = (id: number) => {
  deliveryForm.value.id = id; // 保存当前发货的合同ID
  deliveryDialogVisible.value = true; // 打开弹窗
};

// 确认发货
const confirmDeliver = async () => {
  const { id, trackingNumber } = deliveryForm.value;

  if (!trackingNumber) {
    ElMessage.error("请填写物流编号");
    return;
  }

  try {
    // 使用 qs 库将参数转为 x-www-form-urlencoded 格式
    const res = await axios.post(`/api/ware/deliver`,
      qs.stringify({ id, trackingNumber }), // 转换参数
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // 设置请求头
        },
      }
    );
    if (res.data.code === 1) {
      ElMessage.success(res.data.data); // 获取成功消息
      deliveryDialogVisible.value = false; // 关闭弹窗
      fetchDeliveryList(); // 重新获取发货单列表
    } else {
      ElMessage.error(res.data.msg); // 获取失败消息
    }
  } catch (error) {
    console.error("发货请求出错：", error);
    ElMessage.error("发货失败，请稍后重试");
  }
};
</script>

<style scoped>
.delivery-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
</style>
