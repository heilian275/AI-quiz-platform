<template>
  <div class="question-list">
    <div class="header-actions">
      <!-- <el-button type="primary" @click="handleAddQuestion">新增题目</el-button> -->
    </div>

    <el-table :data="questionList" style="width: 100%">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="content" label="题目内容" />
      <el-table-column prop="type" label="题目类型" width="120" />
      <el-table-column prop="answer" label="题目答案" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const questionList = ref([]);

const handleAddQuestion = () => {
  // 处理新增题目
};

const handleEdit = (row: any) => {
  // 处理编辑题目
};

const handleDelete = (row: any) => {
  // 处理删除题目
};
</script>

<style scoped>
.question-list {
  padding: 20px;
}

.header-actions {
  margin-bottom: 20px;
}
</style>
