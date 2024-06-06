<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" label-width="110px" :rules="rules" :model="formData">
          <el-form-item label="用户姓名:" prop="name">
            {{ formData.name }}
          </el-form-item>
          <el-form-item label="驳回工作量:" prop="realityRate">{{ formData.realityRate }}%</el-form-item>
          <el-form-item label="驳回理由:" prop="rejectReason">
            <el-input type="textarea" show-word-limit minlength="5" maxlength="100" v-model="formData.rejectReason" placeholder="请输入驳回理由"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm('formData')">确定</el-button>
        </div>
      </div>
    </el-container>
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
      formData: {
        //姓名
        name: '',
        //驳回工作量
        realityRate: '',
        //驳回理由
        rejectReason: ''
      },
      rules: {
        rejectReason: [{ required: true, message: '请填写驳回理由', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    init(initData) {
      Object.assign(this.formData, initData)
      console.log(this.formData)
    },
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = { ids: this.formData.id, rejectReason: this.formData.rejectReason, status: 3 }
          this.$http({
            url: this.$http.adornUrl('/workload/updateStatus'),
            method: 'get',
            params: data
          }).then((result) => {
            if (result.data.success) {
              this.cancelDialog()
              this.$message.success('驳回成功')
              this.$emit('selectTableData')
            } else {
              this.$message.error('驳回失败：' + result.data.msg)
            }
          })
          //发起请求
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-form-item__error {
  top: 53px !important;
}
.el-dialog__body {
  padding: 25px 0 2px 0;
}
.el-date-editor.el-input {
  width: 190px;
}
.el-dialog__body {
  width: 50%;
}
</style>
