<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" label-width="110px" :rules="rules" :model="formData">
          <el-form-item label="姓名:">
            <span>{{ formData.name }}</span>
          </el-form-item>
          <el-form-item label="驳回工作量:">
            <span>{{ formData.realityRate }}</span>
          </el-form-item>
          <el-form-item label="驳回理由:" prop="rejectReason">
            <el-input
              v-model="formData.rejectReason"
              placeholder="请输入问题描述"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              minlength="5"
              maxlength="512"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin: 0 10px" @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        realityRate: '',
        // planRate: '',
        rejectReason: '',
        operateType: ''
      },
      rules: {
        rejectReason: [{ required: true, message: '请填写驳回理由', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(initData) {
      Object.assign(this.formData, initData)
    },
    // 取消
    cancel() {
      this.$parent.hide()
    },
    //确认
    confirm() {
      this.$refs.formData.validate((valid) => {
        if (!valid) {
          return false
        }
        // 发起请求
        this.$http({
          url: this.$http.adornUrl('/projectWork/projectWorkOperate'),
          method: 'post',
          data: {
            ids: [this.formData.id],
            operateType: this.formData.operateType,
            rejectReason: this.formData.rejectReason
          }
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success('驳回成功')
            this.$emit('refreshDataList')
            this.cancel()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.el-dialog__body {
  padding: 25px 0 2px 0;
}

.el-date-editor.el-input {
  width: 190px;
}

.el-dialog__body {
  width: 50%;
}

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
