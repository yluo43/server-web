<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="dataForm" label-width="110px" :rules="rules" :model="dataForm">
          <el-form-item label="补贴项目:" prop="subsidyProject" style="width: 70%">
            <el-table :data="tableData" highlight-current-row border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="项目列表"></el-table-column>
              <el-table-column prop="empId" label="调休天数"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item style="width: 70%">
            <i class="el-icon-warning-outline"></i>
            <span>该员工总调休天数10天，其中已调休3天，已补贴1天，剩余可调休天数6天。</span>
          </el-form-item>
          <el-form-item label="补贴天数:" prop="subsidyDays">
            <el-input v-model="dataForm.subsidyDays" placeholder="请输入补贴天数"></el-input>
            天
          </el-form-item>
          <el-form-item label="补贴金额:" prop="subsidyAmount">
            <el-input v-model="dataForm.subsidyAmount" placeholder="请输入补贴金额"></el-input>
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
      empId: '',
      //总天数
      totalDays: '',
      //已调休天数
      compensatedLeaveDays: '',
      //已补贴天数
      subsidizedDays: '',
      //剩余可调休天数
      remainingDays: '',
      checkedData: [],
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
        //项目
        subsidyProject: '',
        //补贴天数
        subsidyDays: '',
        //补贴金额
        subsidyAmount: ''
      },
      rules: {
        subsidyDays: [{ required: true, message: '请填写补贴天数', trigger: 'blur' }],
        subsidyAmount: [{ required: true, message: '请填写补贴金额', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    init(initData) {
      this.empId = initData.empId
      this.getInfo()
    },
    //查询数据信息
    getInfo() {},
    handleSelectionChange(sel) {
      this.checkedData = [...sel]

      // this.dataForm.subsidyProject = 'aa'
    },
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.checkedData.length == 0) {
          this.$message.warning(`请选择一个补贴项目`)
          return false
        }
        if (this.dataForm.subsidyDays > this.remainingDays) {
          this.$message.warning(`该成员剩余可补贴天数不足${this.dataForm.subsidyDays}天`)
          return false
        }
        this.$http({
          url: this.$http.adornUrl('/workload/updateStatus'),
          method: 'get',
          params: data
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
  width: 190px;
}
::v-deep .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
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
