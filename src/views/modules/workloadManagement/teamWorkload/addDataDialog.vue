<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" label-width="110px" :rules="rules" :model="formData">
          <el-form-item label="姓名:" prop="empId">
            <el-select v-model="formData.empId" placeholder="请选择成员" clearable>
              <el-option v-for="item in users" :key="item.empId" :label="item.name" :value="item.empId" />
            </el-select>
          </el-form-item>
          <el-form-item label="成本项目:" prop="projectId">
            <el-select v-model="formData.projectId" placeholder="请选择成本项目" clearable>
              <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="实际投入:" prop="realityRate" style="margin-top: 10px">
            <el-input
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              v-model.number="formData.realityRate"
              placeholder="请输入"
              clearable
              style="width: 192px"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm('formData')">确认</el-button>
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
        //实际投入
        realityRate: ''
      },
      dataList: [],
      data: {},
      users: [],
      costItems: [],
      name: '',
      projectName: '',
      managerName: '',
      rules: {
        empId: [{ required: true, message: '请选择一个成员', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择一个成本项目', trigger: 'change' }],
        realityRate: [{ required: true, validator: checkRealityRate, trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getProject()
  },
  created() {},
  methods: {
    //初始化数据
    init(initData, teamId) {
      this.dataList = initData.pmsWorkloadVoList
      this.data = initData
      this.teamId = teamId
      this.getTeamManager()
      // let newArrId = []
      // initData.pmsWorkloadVoList.map((item) => {
      //   if (newArrId.indexOf(item.empId) === -1) {
      //     newArrId.push(item.empId)
      //     this.users.push({ empId: item.empId, name: item.name })
      //   }
      // })
    },
    //获取成员

    getTeamManager() {
      this.$http({
        url: this.$http.adornUrl('/teamWork/employeeListByTeamManager'),
        method: 'get',
        params: { teamId: this.teamId, taskId: this.dataList[0].taskId }
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
          //发起请求
          let data = {
            id: '',
            name: this.name,
            empId: this.formData.empId,
            teamId: this.teamId,
            taskId: this.dataList[0].taskId,
            projectId: this.formData.projectId,
            projectName: this.projectName,
            realityRate: this.formData.realityRate,
            planRate: '',
            managerName: this.managerName,
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
            teamManagerName: this.data.manageName
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
.el-dialog__body {
  padding: 25px 0 2px 0;
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
