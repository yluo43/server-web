<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-descriptions :column="1">
        <el-descriptions-item label="订单名称">{{ dataForm.orderName }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ dataForm.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ dataForm.endDate }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">{{ dataForm.orderAmount }}</el-descriptions-item>
        <el-descriptions-item label="订单人数">{{ dataForm.orderMember }}</el-descriptions-item>
        <el-descriptions-item label="订单描述">{{ dataForm.remarks }}</el-descriptions-item>
        <el-descriptions-item label="上传订单">{{ dataForm.fileName }}</el-descriptions-item>
      </el-descriptions>
      <div class="btn-group">
        <el-button plain style="margin-right: 10px" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="cancel()">确认</el-button>
      </div>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileList: [],
      dataForm: {
        projectId: null,
        orderName: '',
        startDate: '',
        endDate: '',
        orderAmount: null,
        orderMember: null,
        remarks: '',
        orderFile: '',
        fileName: ''
      }
    }
  },
  methods: {
    init(data) {
      this.dataForm = data
      this.dataForm.fileName = data.orderFilePath.match(/\/([^/]+)$/)[1]
    },
    // 取消
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped></style>
