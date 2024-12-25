<template>
  <div class="salesperson-list">
    <!-- 页面标题 -->
    <el-page-header content="销售人员列表" />

    <!-- 工具栏 -->
    <el-row class="tools" justify="end">
      <el-button type="primary" @click="openAddDialog">新增销售人员</el-button>
    </el-row>

    <!-- 销售人员表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80" align="center" />
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="password" label="密码" align="center" />
      <el-table-column prop="telegram" label="联系方式" align="center" />
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openEditDialog(scope.row)">
            修改信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：修改销售人员信息 -->
    <el-dialog v-model="editDialogVisible" title="修改销售人员信息" width="400px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="editForm.telegram" placeholder="请输入联系方式" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗：新增销售人员 -->
    <el-dialog v-model="addDialogVisible" title="新增销售人员" width="400px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="addForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="addForm.telegram" placeholder="请输入联系方式" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "@/api/request";
import { useRequest } from "vue-request";
import { AxiosRespList } from "@/model/Model8080";
import { ElMessage, ElMessageBox } from "element-plus";

// 定义 SaleSpersonVO 接口
interface SaleSpersonVO {
  id: number;
  name: string;
  password: string;
  telegram: string;
}

// 数据状态
const tableData = ref<SaleSpersonVO[]>([]);
const loading = ref(false); // 加载状态

// 编辑弹窗状态
const editDialogVisible = ref(false);
const editForm = ref<SaleSpersonVO>({ id: 0, name: "", password: "", telegram: "" });

// 新增弹窗状态
const addDialogVisible = ref(false);
const addForm = ref<SaleSpersonVO>({ id: 0, name: "", password: "", telegram: "" });

// 数据请求
const { run: fetchData } = useRequest<AxiosRespList<SaleSpersonVO>>(
  () => axios.get("/api/admin/salesperson/list"),
  {
    manual: true,
    onBefore: () => {
      loading.value = true; // 开始加载
    },
    onSuccess: (res) => {
      if (res.data.code === 1) {
        tableData.value = res.data.data; // 赋值表格数据
      } else {
        console.error("获取销售人员列表失败:", res.data.msg);
      }
      loading.value = false; // 确保加载状态关闭
    },
    onError: (error) => {
      console.error("请求出错:", error);
      loading.value = false; // 出错时关闭加载状态
    },
  }
);

// 打开修改弹窗
const openEditDialog = (row: SaleSpersonVO) => {
  editForm.value = { ...row }; // 复制选中行数据
  editDialogVisible.value = true;
};

// 确认修改
const confirmEdit = async () => {
  try {
    const res = await axios.post("/api/admin/salesperson/update", editForm.value);
    if (res.data.code === 1) {
      ElMessage.success("修改销售人员信息成功");
      editDialogVisible.value = false;
      fetchData(); // 重新获取销售人员数据
    } else {
      ElMessage.error("修改销售人员信息失败:" + res.data.msg);
    }
  } catch (error) {
    console.error("修改请求出错:", error);
    ElMessage.error("修改销售人员信息失败，请稍后重试");
  }
};

// 打开新增弹窗
const openAddDialog = () => {
  addForm.value = { id: 0, name: "", password: "", telegram: "" }; // 清空表单
  addDialogVisible.value = true;
};

// 确认新增
const confirmAdd = async () => {
  try {
    const res = await axios.post("/api/admin/salesperson/add", addForm.value);
    if (res.data.code === 1) {
      ElMessage.success("新增销售人员成功");
      addDialogVisible.value = false;
      fetchData(); // 重新获取销售人员数据
    } else {
      ElMessage.error("新增销售人员失败:" + res.data.msg);
    }
  } catch (error) {
    console.error("新增请求出错:", error);
    ElMessage.error("新增销售人员失败，请稍后重试");
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.salesperson-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.tools {
  margin-bottom: 10px;
}
</style>
