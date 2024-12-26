<template>
  <div class="create-learning-material">
    <el-page-header content="新建学习资料"></el-page-header>

    <el-form ref="formRef" :model="formData" label-width="100px">
        <el-form-item label="资料标题">
            <el-input v-model="formData.title" />
        </el-form-item>
      <el-form-item label="资料类型">
        <el-select v-model="formData.type" placeholder="请选择资料类型">
          <el-option label="文档" value="document"></el-option>
          <el-option label="视频" value="video"></el-option>
          <el-option label="音频" value="audio"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传资料">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/" <!-- 这里可以替换为实际的上传地址 -->
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">
              请上传不超过 50MB 的文件
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

const formData = ref({
  title: "",
  type: "",
});

const formRef = ref(null);
const fileList = ref([]);

const submitForm = () => {
    console.log("提交表单:", formData.value);
    ElMessage.success("提交成功");
    // 这里添加实际的提交逻辑
    resetForm();
};

const resetForm = () => {
    formData.value = {
        title: "",
        type: ""
    };
    fileList.value = [];
    if(formRef.value) {
        // formRef.value.resetFields();
    }
};

const handlePreview = (file:any) => {
    console.log("预览文件:", file);
    // 实现预览逻辑
}

const handleRemove = (file:any,fileList:any) => {
    console.log("移除文件:", file);
    //实现移除逻辑
};

const handleUploadSuccess = (response:any,file:any,fileList:any) => {
    console.log("文件上传成功", response,file,fileList);
    ElMessage.success("上传成功");
}

const beforeUpload = (file:any) => {
    const isLt50M = file.size / 1024 / 1024 < 50;
    if(!isLt50M){
        ElMessage.error("上传文件大小不能超过50MB");
    }
    return isLt50M;
}
</script>

<style scoped>
.create-learning-material {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.upload-demo {
  margin-top: 15px;
}
</style>