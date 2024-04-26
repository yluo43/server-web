<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="dataForm" label-width="110px" :model="dataForm">
          <el-form-item label="用户姓名:" prop="userName">
            {{ dataForm.userName }}
          </el-form-item>
          <el-form-item v-if="rejectFlag == 1 || rejectFlag == 2" label="驳回加班时长:" prop="overtimeHours">{{ dataForm.overtimeHours }}</el-form-item>
          <el-form-item v-else label="驳回调休天数:" prop="days">{{ dataForm.days }}</el-form-item>
          <el-form-item label="驳回理由:" prop="rejectReason">
            <el-input type="textarea" show-word-limit maxlength="50" v-model="dataForm.rejectReason" placeholder="请输入驳回理由"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin-right: 10px" @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {
    closeDialog: {
      type: Function
    }
  },
  data() {
    return {
      // 1加班初审驳回 2加班复审驳回 3调休初审驳回 4调休复审驳回
      rejectFlag: '',
      dataForm: {
        //姓名
        userName: '',
        //驳回加班时长
        overtimeHours: '',
        //驳回调休天数
        days: '',
        //驳回理由
        rejectReason: '',
        status: ''
      },
      initData: {}
    }
  },
  mounted() {},
  created() {},
  methods: {
    init(initData, rejectFlag) {
      console.log(initData)
      this.rejectFlag = rejectFlag
      this.initData = initData
      Object.assign(this.dataForm, initData)
    },
    //确认
    confirm() {
      let url
      let params
      if (this.rejectFlag == 1) {
        url = this.$http.adornUrl('/attendance/overtimeAudit')
        params = { ids: this.dataForm.overtimeId, status: 1, reason: this.dataForm.rejectReason }
      }
      if (this.rejectFlag == 2) {
        url = this.$http.adornUrl('/attendance/overtimeAudit')
        params = { ids: this.dataForm.overtimeId, status: 3, reason: this.dataForm.rejectReason }
      }
      if (this.rejectFlag == 3) {
        url = this.$http.adornUrl('/attendance/dayoffAudit')
        params = { ids: this.dataForm.dayoffId, status: 1, reason: this.dataForm.rejectReason }
      }
      if (this.rejectFlag == 4) {
        url = this.$http.adornUrl('/attendance/dayoffAudit')
        params = { ids: this.dataForm.dayoffId, status: 3, reason: this.dataForm.rejectReason }
      }
      Object.keys(params).map((key) => {
        if (!params[key] && params[key] !== 0) {
          delete params[key]
        }
      })
      this.$http({
        url: url,
        method: 'get',
        params: params
      }).then((result) => {
        if (result.data.success) {
          this.$message.success('驳回成功')
          this.$emit('refrshTable', this.initData, this.rejectFlag)
          this.closeDialog()
        } else {
          this.$message.error('驳回失败：' + result.data.msg)
        }
      })
    },
    closeApprovalProcessDialog() {
      this.$refs.approvalProcessDialog.hide()
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
</style>
