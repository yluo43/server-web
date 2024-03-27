<template>
  <div class="right-container">
    <el-row :gutter="18" style="margin: auto">

      <!-- 右侧内容 -->
      <el-col :span="24" :xs="24" style="padding-left: 10px; padding-right: 0;">
        <div class="el-col-content">
          <!-- 路由匹配到的组件将渲染在这里 -->
          <router-view :key="this.$route.name + ($route || '')"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
</script>
<style>
.right-container {
  height: 860px;
}

.right-container .el-row {
  width: 100%;
  height: 100%;
}

.right-container .el-row .el-col {
  height: 100%;
}

.right-container .el-row .el-col div.el-col-content {
  height: 100%;
  background: #fff;
  width: 100%;
  padding: 10px;
}

</style>
