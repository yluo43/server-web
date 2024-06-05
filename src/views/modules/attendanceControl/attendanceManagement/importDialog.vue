<template>
  <div style="height: 100%; width: 100%">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="90px">
      <el-form-item label="导入月份:" prop="month">
        <el-date-picker
          style="width: 200px"
          v-model="dataForm.month"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="请选择年月"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="导入考勤数据:" prop="uploadFile" style="margin-top: 10px">
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
          :file-list="dataForm.uploadFileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
          <div class="el-upload__text">支持扩展名：.xlsx .xlt .xls</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="submitUpload('dataForm')">确定</el-button>
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
      dataForm: {
        month: '',
        uploadFileList: []
      },
      rules: {
        month: [{ required: true, message: '请选择导入的月份', trigger: 'change' }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    //文件移除
    removeFile(file, fileList) {
      this.dataForm.uploadFileList = []
    },
    //文件变化
    handleFileChange(file, fileList) {
      this.dataForm.uploadFileList = [file]
    },
    //确认
    submitUpload(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.dataForm.uploadFileList.length == 0) {
          this.$message.error('请选择需要导入的文件！')
          return
        }
        let formData = new FormData()
        formData.append('MultipartFile', this.dataForm.uploadFileList[0].raw)
        formData.append('month', this.dataForm.month)
        this.$http({
          url: this.$http.adornUrl('/attendance/checkMonth'),
          method: 'get',
          params: { month: this.dataForm.month }
        })
          .then(({ data }) => {
            if (data.success) {
              this.importFile(formData)
            } else {
              this.$confirm('当前月份已上传，是否覆盖？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              })
                .then(() => {
                  this.importFile(formData)
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消覆盖'
                  })
                })
            }
          })
          .catch((err) => {})
      })
    },
    //文件上传
    importFile(formData) {
      this.$http({
        url: this.$http.adornUrl('/attendance/import'),
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8' // 设置请求头为multipart/form-data
        }
      }).then(({ data }) => {
        if (data.success) {
          this.$message.success('导入成功!')
          this.cancelDialog()
          this.$emit('refreshTableData')
        } else {
          this.$message.error('导入失败!')
        }
      })
    }
  }
}
</script>

<style scoped></style>
