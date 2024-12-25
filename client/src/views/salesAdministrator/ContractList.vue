<template>
  <div class="contract-list">
    <!-- 页面标题 -->
    <el-page-header content="合同列表" />

    <!-- 新增合同按钮 -->
    <el-row class="tools" justify="end">
      <el-button type="primary" @click="openAddContractDialog">新增合同</el-button>
    </el-row>

    <!-- 合同表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80" align="center" />
      <el-table-column prop="customerName" label="客户名" align="center" />
      <el-table-column prop="salespersonName" label="销售人员名称" align="center" />
      <el-table-column prop="amount" label="合同总金额" align="center" />
      <el-table-column prop="status" label="合同状态" align="center" />
      <el-table-column prop="payStatus" label="支付状态" align="center" />
      <el-table-column label="操作" align="center" width="250">
        <template #default="scope">
          <template v-if="scope.row.status === '履行前'">
            <el-button
              type="success"
              size="small"
              @click="handleGenerateDelivery(scope.row.id)"
            >
              生成发货单
            </el-button>
          </template>
          <template v-else>
            <el-tag type="primary" effect="light">已有发货单</el-tag>
          </template>
          <el-button
            type="primary"
            size="small"
            @click="handleEditContract(scope.row)"
          >
            修改合同
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：新增合同 -->
    <el-dialog v-model="addContractDialogVisible" title="新增合同" width="600px">
      <el-form :model="newContract" label-width="120px">
        <el-form-item label="客户姓名">
          <el-input v-model="newContract.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="销售人员姓名">
          <el-input v-model="newContract.salespersonName" placeholder="请输入销售人员姓名" />
        </el-form-item>
        <el-form-item label="商品列表">
          <el-button type="primary" @click="addProduct">添加商品</el-button>
          <el-form v-for="(product, index) in newContract.productList" :key="index">
            <el-input v-model="product.productName" placeholder="商品名称" style="width: 200px; display: inline-block;" />
            <el-input type="number" v-model="product.quantity" placeholder="数量" style="width: 100px; display: inline-block;" />
          </el-form>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addContractDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddContract">确定</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗：修改合同 -->
    <el-dialog v-model="editContractDialogVisible" title="修改合同" width="600px">
      <el-form :model="editContract" label-width="120px">
        <el-form-item label="客户姓名">
          <el-input v-model="editContract.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="销售人员姓名">
          <el-input v-model="editContract.salespersonName" placeholder="请输入销售人员姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editContractDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEditContract">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRequest } from "vue-request";
import axios from "@/api/request";
import { AxiosRespList } from "@/model/Model8080";
import { ElMessage, ElMessageBox } from "element-plus";

// 定义 ContractVO 和 ContractUpdateDTO 接口
interface ContractVO {
  id: number;
  customerName: string;
  salespersonName: string;
  amount: string;
  status: string;
  payStatus: string;
}

interface ProductQuantity {
  productName: string;
  quantity: number;
}

interface ContractDto {
  customerName: string;
  salespersonName: string;
  productList: ProductQuantity[];
}

interface ContractUpdateDTO {
  id: number; // 合同ID
  customerName: string; // 修改后的客户姓名
  salespersonName: string; // 修改后的销售人员姓名
}

// 数据状态
const tableData = ref<ContractVO[]>([]);
const loading = ref(false);

// 新增合同弹窗状态
const addContractDialogVisible = ref(false);
const newContract = ref<ContractDto>({ customerName: "", salespersonName: "", productList: [] });

// 修改合同弹窗状态
const editContractDialogVisible = ref(false);
const editContract = ref<ContractUpdateDTO>({
  id: 0,
  customerName: "",
  salespersonName: ""
});

// 获取合同数据请求
const { run: fetchContracts } = useRequest<AxiosRespList<ContractVO>>(
  () => axios.get("/api/admin/contract/list"),
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

// 页面加载时获取数据
onMounted(() => {
  fetchContracts();
});

// 打开新增合同对话框
const openAddContractDialog = () => {
  newContract.value = { customerName: "", salespersonName: "", productList: [] };
  addContractDialogVisible.value = true;
};

// 确认新增合同
const confirmAddContract = async () => {
  if (!newContract.value.customerName || !newContract.value.salespersonName || newContract.value.productList.length === 0) {
    ElMessage.error("请填写所有信息并添加至少一个商品");
    return;
  }

  try {
    const res = await axios.post("/api/admin/contract/add", newContract.value);
    if (res.data.code === 1) {
      ElMessage.success("新增合同成功");
      addContractDialogVisible.value = false;
      fetchContracts(); // 获取最新合同数据
    } else {
      ElMessage.error("新增合同失败：" + res.data.msg);
    }
  } catch (error) {
    console.error("新增合同请求失败：", error);
    ElMessage.error("新增合同失败，请稍后重试");
  }
};

// 添加商品到商品列表
const addProduct = () => {
  newContract.value.productList.push({ productName: "", quantity: 0 });
};

// 处理生成发货单
const handleGenerateDelivery = async (contractId: number) => {
  const contract = tableData.value.find(c => c.id === contractId);
  if (!contract) {
    ElMessage.error("未找到指定合同");
    return;
  }

  if (contract.payStatus !== "已支付") {
    ElMessage.warning("支付状态为已支付才能生成发货单");
    return;
  }

  ElMessageBox.confirm("确定生成发货单吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(async () => {
    try {
      const res = await axios.post(`/api/admin/shipment/generate/${contractId}`);
      if (res.data.code === 1) {
        ElMessage.success("发货单生成成功");
        fetchContracts(); // 重新获取合同列表
      } else {
        ElMessage.error("发货单生成失败：" + res.data.msg);
      }
    } catch (error) {
      console.error("生成发货单请求失败：", error);
      ElMessage.error("发货单生成失败，请稍后重试");
    }
  })
  .catch(() => {
    ElMessage.info("已取消生成发货单");
  });
};

// 处理修改合同
const handleEditContract = (contract: ContractVO) => {
  if (contract.status !== "履行前") {
    ElMessage.warning("履行中/已完成的合同不可修改");
    return;
  }

  editContract.value = { id: contract.id, customerName: contract.customerName, salespersonName: contract.salespersonName };
  editContractDialogVisible.value = true;
};

// 确认修改合同
const confirmEditContract = async () => {
  if (!editContract.value.customerName || !editContract.value.salespersonName) {
    ElMessage.error("请填写客户和销售人员姓名");
    return;
  }

  const contractUpdate = { 
    id: editContract.value.id,
    customerName: editContract.value.customerName,
    salespersonName: editContract.value.salespersonName 
  };

  try {
    const res = await axios.post("/api/admin/contract/update", contractUpdate);
    if (res.data.code === 1) {
      ElMessage.success(res.data.data);
      editContractDialogVisible.value = false;
      fetchContracts(); // 重新获取合同列表
    } else {
      ElMessage.error(res.data.msg);
    }
  } catch (error) {
    console.error("修改合同请求出错：", error);
    ElMessage.error("修改合同失败，请稍后重试");
  }
};
</script>

<style scoped>
.contract-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.tools {
  margin-bottom: 10px;
}
</style>
