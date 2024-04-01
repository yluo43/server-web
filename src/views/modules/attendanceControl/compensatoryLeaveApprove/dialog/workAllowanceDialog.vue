<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="dataForm" label-width="110px" :rules="rules" :model="dataForm">
          <el-form-item label="补贴项目:" prop="name" style="width: 70%">
            <el-table :data="tableData" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="项目列表"></el-table-column>
              <el-table-column prop="empId" label="调休天数"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item style="width: 70%">
            <i class="el-icon-warning-outline"></i>
            <span>该员工总调休天数10天，其中已调休3天，已补贴1天，剩余可调休天数6天。</span>
          </el-form-item>
          <el-form-item label="补贴天数:" prop="overtimeDuration">
            <el-input v-model="dataForm.rejectReason" placeholder="请输入补贴天数"></el-input>
            天
          </el-form-item>
          <el-form-item label="补贴金额:" prop="rejectReason">
            <el-input v-model="dataForm.rejectReason" placeholder="请输入补贴金额"></el-input>
            元
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm('dataForm')">确认</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
export default {
  components: { baseTable },
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {
      tableData: [
        {
          name: '1111',
          empId: '222'
        },
        {
          name: '1111',
          empId: '222'
        }
      ],
      dataForm: {
        //姓名
        name: '',
        //驳回加班时长
        overtimeDuration: '',
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
      Object.assign(this.dataForm, initData)
      console.log(this.dataForm)
    },
    //
    handleSelectionChange() {},
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
.el-input {
  width: 190px;
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
