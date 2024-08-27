<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" :model="formData" label-width="100px" :rules="rules">
          <el-form-item label="项目名称:" prop="projectName">
            <el-select placeholder="请选择项目名称" v-model="formData.projectName" filterable clearable>
              <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目经理:" prop="projectManager">
            <el-input disabled type="text" style="width: 200px" v-model="formData.projectManager" placeholder="请输入项目经理"></el-input>
          </el-form-item>
          <el-form-item label="项目客户" prop="customerName">
            <el-input disabled type="text" style="width: 200px" v-model="formData.customerName" placeholder="请输入项目客户"></el-input>
          </el-form-item>
          <el-form-item label="客户所属集团" prop="membershipGroup">
            <el-input disabled type="text" style="width: 200px" v-model="formData.membershipGroup" placeholder="请输入客户所属集团"></el-input>
          </el-form-item>
          <el-form-item label="项目开始时间:" prop="startTime">
            <el-date-picker style="width: 200px" v-model="formData.startTime" type="date" value-format="yyyy-MM-dd" placeholder="项目开始时间" clearable />
          </el-form-item>
          <el-form-item label="项目结束时间:" prop="endTime">
            <el-date-picker style="width: 200px" v-model="formData.endTime" type="date" value-format="yyyy-MM-dd" placeholder="项目结束时间" clearable />
          </el-form-item>
          <el-form-item label="入场时间:" prop="admissionTime">
            <el-date-picker
              style="width: 200px"
              v-model="formData.admissionTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择入场时间"
              clearable
            />
          </el-form-item>
          <el-form-item label="计划离场时间:" prop="leavingTime">
            <el-date-picker
              style="width: 200px"
              v-model="formData.leavingTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择计划离场时间"
              clearable
            />
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
  data() {
    const validateReportStartDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开始填报时间'))
        return
      }
      // if (this.formData.reportStartTime && new Date(Date.parse(this.format())) > new Date(Date.parse(this.formData.reportStartTime))) {
      //   callback(new Error('开始填报时间应大于等于当前时间'))
      //   return
      // }
      // if (
      //   this.formData.reportStartTime &&
      //   this.formData.timePeriod[1] &&
      //   new Date(Date.parse(this.formData.timePeriod[1])) > new Date(Date.parse(this.formData.reportStartTime))
      // ) {
      //   callback(new Error('开始填报时间应大于等于统计时间段截止时间'))
      //   return
      // }
      callback()
    }
    return {
      formData: {
        projectName: '',
        projectManager: '',
        customerName: '',
        membershipGroup: '',
        startTime: '',
        endTime: '',
        admissionTime: '',
        leavingTime: ''
      },
      rules: {
        projectName: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        projectManager: [{ required: true, message: '项目经理不能为空', trigger: 'blur' }],
        customerName: [{ required: true, message: '项目客户不能为空', trigger: 'blur' }],
        membershipGroup: [{ required: true, message: '客户所属集团不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '项目开始时间不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '项目结束时间不能为空', trigger: 'blur' }],
        admissionTime: [{ required: true, message: '请选择入场时间', trigger: 'change' }],
        leavingTime: [{ required: true, message: '请选择计划离场时间', trigger: 'change' }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    //初始化数据
    async init(initData) {},
    //取消
    cancelDialog() {
      this.$parent.hide()
    },

    //获取项目信息
    async getProjectInfo() {
      const { data } = await this.$http({
        url: this.$http.adornUrl(),
        method: 'get'
      })
      if (data && data.code === 200) {
      } else {
        this.$message.error(data.msg)
      }
    },
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        this.$http({
          url: this.$http.adornUrl(''),
          method: 'post',
          data: ''
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success(data.msg)
            this.cancelDialog()
            this.$emit('selectTableData')
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
::v-deep .el-input__icon {
  line-height: 20px !important;
}
</style>
