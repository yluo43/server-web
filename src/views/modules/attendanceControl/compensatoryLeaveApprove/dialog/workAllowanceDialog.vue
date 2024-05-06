<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="dataForm" style="padding: 15px 30px 0 10px" label-width="90px" label-position="left" :rules="rules" :model="dataForm">
          <el-form-item prop="projectId">
            <template slot="label">
              补贴项目
              <el-tooltip class="item" effect="dark" content="只可补贴复审通过的加班工时!" placement="top-start">
                <i class="el-icon-info"></i>
                :
              </el-tooltip>
            </template>
            <el-table :data="tableData" ref="refsTable" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="项目名称"></el-table-column>
              <el-table-column prop="days" label="可补贴天数"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-warning-outline" style="color: #faad14"></i>
            <span>
              该员工总调休天数{{ totalDays }}天，其中已调休{{ compensatedLeaveDays }}天，已补贴{{ subsidizedDays }}天，剩余可补贴天数
              <span style="color: #70b603">{{ remainingDays }}天。</span>
            </span>
          </el-form-item>
          <el-form-item label="补贴天数:" prop="subsidyDays">
            <el-input-number v-model="dataForm.subsidyDays" :precision="1" step-strictly :step="0.5" :min="0.5"></el-input-number>
            天
            <!-- <el-input v-model="dataForm.subsidyDays" placeholder="请输入补贴天数"></el-input>
            天 -->
          </el-form-item>
          <el-form-item label="补贴金额:" prop="subsidyAmount">
            <el-input v-model="dataForm.subsidyAmount" placeholder="请输入补贴金额"></el-input>
            元
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
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
    const validateSubsidyAmount = (rule, value, callback) => {
      var reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      if (!value) {
        callback(new Error('请填写补贴金额'))
      } else if (value <= 0) {
        callback(new Error('补贴金额需大于等于0'))
      } else if (!reg.test(value)) {
        callback(new Error('补贴金额只能为整数或小数'))
      } else {
        callback()
      }
    }
    return {
      empId: '',
      auditor: '',
      //总天数
      totalDays: '',
      //已调休天数
      compensatedLeaveDays: '',
      //已补贴天数
      subsidizedDays: '',
      //剩余可调休天数
      remainingDays: '',
      checkedProject: [],
      tableData: [],
      dataForm: {
        //项目
        projectId: '',
        //补贴天数
        subsidyDays: '',
        //补贴金额
        subsidyAmount: ''
      },
      rules: {
        subsidyDays: [{ required: true, message: '请填写补贴天数', trigger: 'blur' }],
        subsidyAmount: [{ required: true, validator: validateSubsidyAmount, trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  created() {
    this.auditor = this.$store.state.user.empId
  },
  methods: {
    init(initData) {
      this.empId = initData.empId
      this.getCompensatoryLeaveInfo()
    },

    //查询调休信息
    getCompensatoryLeaveInfo() {
      this.$http({
        url: this.$http.adornUrl('/attendance/getSubsidyInfo'),
        method: 'get',
        params: { empId: this.empId }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData = data.payload.projectList
          this.totalDays = data.payload.totalDays
          this.compensatedLeaveDays = data.payload.dayoffDays
          this.subsidizedDays = data.payload.subsidyDays
          if (data.payload.lastYearOffdays < 0) {
            this.remainingDays = this.totalDays - this.compensatedLeaveDays - this.subsidizedDays + data.payload.lastYearOffdays
          } else {
            this.remainingDays = this.totalDays - this.compensatedLeaveDays - this.subsidizedDays
          }
          if (this.remainingDays < 0) {
            this.remainingDays = 0
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleSelectionChange(selection) {
      if (selection.length > 1) {
        //移除上一次选中行数据
        selection.splice(0, 1)
        //修改选中图标为未选中状态
        this.$refs.refsTable.clearSelection()
        //将当前选中行改为选中状态
        this.$refs.refsTable.toggleRowSelection(selection[0])
      }
      this.checkedProject = selection
      this.dataForm.projectId = this.checkedProject[0].id
    },
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.checkedProject.length == 0) {
          this.$message.warning(`请选择一个补贴项目`)
          return false
        }
        if (this.dataForm.subsidyDays > this.remainingDays) {
          this.$message.warning(`该成员剩余可补贴天数不足${this.dataForm.subsidyDays}天`)
          return false
        }
        if (this.checkedProject[0].days < this.dataForm.subsidyDays) {
          this.$message.warning(`该成员在${this.checkedProject[0].name}项目中可补贴天数不足${this.dataForm.subsidyDays}天`)
          return false
        }
        let data = {
          days: this.dataForm.subsidyDays,
          empId: this.empId,
          auditor: this.auditor,
          money: this.dataForm.subsidyAmount,
          projectId: this.dataForm.projectId
        }
        this.$http({
          url: this.$http.adornUrl('/attendance/addSubsidy'),
          method: 'post',
          data: data
        }).then((result) => {
          if (result.data.success) {
            this.cancelDialog()
            this.$message.success('提交成功')
            this.$emit('selectTableData')
          } else {
            this.$message.error('提交失败：' + result.data.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 200px;
}
.el-input-number {
  width: 200px;
  line-height: 26px;
}

::v-deep .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
  display: none;
}
</style>
