<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <div>
          <el-form ref="formData" label-width="110px" :rules="rules" :model="formData">
            <el-form-item label="姓名:" prop="empId">
              <el-select v-model="formData.empId" filterable placeholder="请选择成员" clearable>
                <el-option v-for="item in users" :key="item.empId" :label="item.name + '(' + item.empId + ')'" :value="item.empId" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="投入时间:" prop="investTime">
              <el-date-picker
                style="width: 200px"
                v-model="formData.investTime"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item> -->
            <el-form-item label="成本项目:" prop="projectId">
              <el-select v-model="formData.projectId" placeholder="请选择成本项目" filterable clearable>
                <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="报工类别:" prop="workloadType">
              <el-select v-model="formData.workloadType" placeholder="请选择报工类别" clearable>
                <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="实际投入:" prop="realityRate">
              <el-input
                oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                v-model.number="formData.realityRate"
                placeholder="请输入实际投入"
                clearable
                style="width: 200px"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="marks">
              <el-input v-model="formData.marks" placeholder="请输入备注" clearable style="width: 200px"></el-input>
            </el-form-item>
          </el-form>
        </div>
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
    var checkRealityRate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('实际投入须大于0'))
        return
      }

      if (value > 100) {
        callback(new Error('最大值为100'))
      }
      callback()
    }
    return {
      teamId: '',
      formData: {
        //姓名
        empId: '',
        //成本项目
        projectId: '',
        workloadType: '',
        //实际投入
        realityRate: '',
        investTime: [],
        marks: ''
      },
      startDate: '',
      endDate: '',
      categories: [],
      dataList: [],
      data: {},
      users: [],
      costItems: [],
      name: '',
      projectName: '',
      workloadName: '',
      managerName: '',
      rules: {
        empId: [{ required: true, message: '请选择一个成员', trigger: 'change' }],
        workloadType: [{ required: true, message: '请选择一个报工类别', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择一个成本项目', trigger: 'change' }],
        realityRate: [{ required: true, validator: checkRealityRate, trigger: 'change' }],
        investTime: [{ required: true, message: '请选择开始和结束时间', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getProject()
    this.getWorkloadType()
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.startDate).getTime() || time.getTime() > new Date(this.endDate).getTime()
        }
      }
    }
  },
  created() {},
  methods: {
    getDates(reportWorkName) {
      const datePattern = /\b(\d{4}-\d{2}-\d{2})\b/g
      let matches = [...reportWorkName.matchAll(datePattern)]
      if (matches.length >= 2) {
        this.startDate = matches[0][1] + ' 00:00:00'
        this.endDate = matches[1][1] + ' 23:59:59'
        this.formData.investTime = [this.startDate, this.endDate]
      }
    },
    //初始化数据
    init(initData, teamId) {
      this.dataList = initData.pmsWorkloadVoList
      this.data = initData
      this.teamId = teamId
      this.getTeamManager()
      this.getDates(this.data.reportWorkName)
    },
    //获取成员
    getTeamManager() {
      this.$http({
        url: this.$http.adornUrl('/teamWork/employeeListByTeamManager'),
        method: 'get',
        params: { taskId: this.dataList[0].taskId, teamId: this.teamId }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          data.payload.map((item) => {
            this.users.push({ empId: item.empId, name: item.name })
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取报工类别
    getWorkloadType() {
      this.$http({
        url: this.$http.adornUrl('/common/getWorkloadType'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.categories = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.users.forEach((item) => {
            if (item.empId === this.formData.empId) {
              this.name = item.name
            }
          })
          this.costItems.forEach((item) => {
            if (item.id === this.formData.projectId) {
              this.projectName = item.name
              this.managerName = item.managerName
            }
          })
          this.categories.forEach((item) => {
            if (item.id === this.formData.workloadType) {
              this.workloadName = item.name
            }
          })
          let data = {
            id: '',
            name: this.name,
            empId: this.formData.empId,
            teamId: this.teamId,
            taskId: this.dataList[0].taskId,
            projectId: this.formData.projectId,
            projectName: this.projectName,
            workloadType: this.formData.workloadType,
            workloadName: this.workloadName,
            realityRate: this.formData.realityRate,
            planRate: '',
            managerName: this.managerName,
            //  startTime: this.formData.investTime[0],
            //  overTime: this.formData.investTime[1],
            startTime: this.dataList[0].startTime,
            overTime: this.dataList[0].overTime,
            workStatus: '',
            deptId: this.dataList[0].deptId,
            deptName: this.dataList[0].deptName,
            teamName: this.data.teamName,
            commitTime: '',
            approveTime: '',
            isEdit: false,
            isSelect: false,
            isCategory: false,
            teamManagerName: this.data.manageName,
            marks: this.formData.marks
          }
          this.$emit('addData', data)
          this.cancelDialog()
        } else {
          return false
        }
      })
    },
    //获取成本项目
    getProject() {
      this.$http({
        url: this.$http.adornUrl('/costItems/listNoPage'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.costItems = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-input__icon {
  line-height: 20px !important;
}
.el-dialog__body {
  padding: 25px 0 2px 0;
  width: 50%;
}
::v-deep .el-form-item__content .el-input-group {
  vertical-align: middle;
}
</style>
