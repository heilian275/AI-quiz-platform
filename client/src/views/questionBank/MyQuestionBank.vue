<template>
  <div class="learning-material">
    <el-page-header content="我的题库"></el-page-header>

    <el-row class="tools" justify="end">
      <el-button type="primary" @click="refreshData">刷新数据</el-button>
    </el-row>

    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        prop="id"
        label="编号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="资料标题"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="资料类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleView(scope.row)"
            >查看</el-button
          >
          <el-button type="text" size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">

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
