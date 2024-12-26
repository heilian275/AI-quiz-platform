<template>
  <div class="learning-material">
    <el-page-header content="我的学习资料"></el-page-header>

    <el-row class="tools" justify="end">
      <el-button type="primary" @click="refreshData">刷新数据</el-button>
    </el-row>

    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号" width="80" align="center"></el-table-column>
        <el-table-column prop="title" label="资料标题" align="center"></el-table-column>
        <el-table-column prop="type" label="资料类型" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
            <template #default="scope">
                <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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

interface LearningMaterial {
  id: number;
  title: string;
  type: string;
  createTime: string;
}

const tableData = ref<LearningMaterial[]>([]);
const loading = ref(false);

const { run: fetchData } = useRequest<AxiosRespList<LearningMaterial>>(
  async () => {
    loading.value = true;
    return await axios.get("/api/learning/materials"); // 假设有这个 API
  },
  {
    manual: true,
    onSuccess: (res) => {
        if(res.data.code === 1){
            tableData.value = res.data.data;
            loading.value = false;
        } else {
            console.error("获取数据失败:", res.data.msg);
        }

    },
    onError: (error) => {
      console.error("请求出错:", error);
      loading.value = false;
    },
  }
);

const refreshData = () => {
    fetchData();
};

const handleView = (row: LearningMaterial) => {
    console.log("查看资料:", row);
    // 实现查看逻辑
};

const handleEdit = (row: LearningMaterial) => {
    console.log("编辑资料:", row);
    // 实现编辑逻辑
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.learning-material {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.tools {
  margin-bottom: 10px;
}
</style>