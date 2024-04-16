<template>
  <div style="height: 100%; width: 100%">
    <el-form>
      <el-form-item label="导入考勤数据:" prop="name">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          ref="uploadFile"
          :limit="1"
          :multiple="false"
          :accept="'.xls,.xlt,.xlsx'"
          :auto-upload="false"
          :on-remove="removeFile"
          :on-change="handleFileChange"
          :file-list="uploadFileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
          <div class="el-upload__text">支持扩展名：.xlsx .xlt .xls</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="submitUpload">确认</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {
      uploadFileList: []
    }
  },
  mounted() {},
  created() {},
  methods: {
    //文件移除
    removeFile(file, fileList) {
      this.uploadFileList = []
    },
    //文件变化
    handleFileChange(file, fileList) {
      this.uploadFileList = [file]
    },
    //确认
    submitUpload() {
      if (this.uploadFileList.length == 0) {
        this.$message.warning('请选择需要导入的文件！')
        return
      }
      let formData = new FormData()
      formData.set('uploadFile', this.uploadFileList[0].raw)
      this.$http({
        url: this.$http.adornUrl('/attendance/import'),
        method: 'post',
        data: formData
        // headers: {
        //   'Content-Type': 'multipart/form-data; charset=utf-8' // 设置请求头为multipart/form-data
        // }
      }).then(({ data }) => {
        if (data.success) {
          this.$message.success(data.msg)
          this.cancelDialog()
          this.$emit('refreshTableData')
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.btn-group {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid lightgray;
  margin-top: 20px;
}
</style>
