<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="dataForm" label-width="110px" :model="dataForm">
          <el-form-item label="用户姓名:" prop="name">
            {{ dataForm.name }}
          </el-form-item>
          <el-form-item label="驳回加班时长:" prop="overtimeDuration">{{ dataForm.overtimeDuration }}</el-form-item>
          <el-form-item label="驳回理由:" prop="rejectReason">
            <el-input type="textarea" show-word-limit maxlength="100" v-model="dataForm.rejectReason" placeholder="请输入驳回理由"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </div>
    </el-container>
    <!-- 审批流程 -->
    <base-dialog ref="approvalProcessDialog" title="查看审批流程" :width="'800px'">
      <template>
        <approvalProcessDialog ref="approvalProcess" :cancelDialog="closeApprovalProcessDialog"></approvalProcessDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseDialog from '@/views/modules/base/baseDialog.vue'
import approvalProcessDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/approvalProcessDialog.vue'
export default {
  components: { baseDialog, approvalProcessDialog },
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {
      dataForm: {
        //姓名
        name: '',
        //驳回加班时长
        overtimeDuration: '',
        //驳回理由
        rejectReason: ''
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    init(initData) {
      Object.assign(this.dataForm, initData)
    },
    //确认
    confirm() {
      // this.$refs.approvalProcessDialog.show()
      // this.$nextTick(() => {
      //   this.$refs.approvalProcess.init({ flag: 2 })
      // })
      this.$http({
        url: this.$http.adornUrl('/workload/updateStatus'),
        method: 'get',
        params: data
      }).then((result) => {
        if (result.data.success) {
          this.cancelDialog()
          this.$message.success('驳回成功')
          this.$refs.approvalProcessDialog.show()
          this.$nextTick(() => {
            this.$refs.approvalProcess.init()
          })
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
