<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" label-width="110px" :model="formData">
          <el-form-item label="姓名:" prop="userName">
            {{ formData.userName }}
          </el-form-item>
          <el-form-item label="工作量:">
            <div style="display: flex; align-items: center; justify-content: center" v-for="(item, index) in formData.workLoad" :key="index">
              <el-form-item :prop="'workLoad.' + index + '.projectName'">
                <el-select v-model="item.projectName" placeholder="请选择成本项目" clearable>
                  <el-option v-for="ele in costItems" :key="ele.id" :label="ele.name" :value="ele.name" />
                </el-select>
              </el-form-item>
              <el-form-item :prop="'workLoad.' + index + '.realityRate'">
                <el-input style="width: 100px" v-model="item.realityRate" clearable />
                %
              </el-form-item>
              <i class="el-icon-delete" @click="deleteRow(item)"></i>
            </div>
            <el-button type="text" icon="el-icon-plus" @click="addRow">添加</el-button>
          </el-form-item>
          <!-- <el-row style="width: 100%" v-for="(item, index) in formData.workLoad" :key="index">
            <el-col :span="10">
              <el-form-item :prop="'workLoad.' + index + '.projectName'">
                <el-select v-model="item.projectName" placeholder="请选择成本项目" clearable>
                  <el-option v-for="ele in costItems" :key="ele.id" :label="ele.name" :value="ele.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :prop="'workLoad.' + index + '.realityRate'">
                <el-input style="width: 100px" v-model="item.realityRate" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <i class="el-icon-delete" @click="deleteRow(item)"></i>
            </el-col>
          </el-row> -->
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
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
        userName: '',
        empId: '',
        taskId: '',
        //工作量
        workLoad: [
          {
            projectName: '',
            realityRate: ''
          }
        ]
      },
      costItems: []
    }
  },
  mounted() {
    this.getProject()
  },
  created() {},
  methods: {
    //初始化
    init(initData) {
      Object.assign(this.formData, initData)
      console.log(this.formData)
    },
    //删除
    deleteRow(params) {
      var index = this.formData.workLoad.indexOf(params)
      if (index !== -1) {
        this.formData.workLoad.splice(index, 1)
      }
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
    },

    //添加一行
    addRow() {
      this.formData.workLoad.push({
        approveTime: '',
        commitTime: '',
        deptId: this.formData.workLoad[0].deptId,
        deptName: this.formData.workLoad[0].deptName,
        empId: this.formData.empId,
        id: '',
        managerName: '',
        name: this.formData.userName,
        overTime: '',
        planRate: '',
        projectId: '',
        projectName: '',
        realityRate: '',
        startTime: '',
        taskId: this.formData.taskId,
        teamId: this.formData.workLoad[0].teamId,
        teamManagerName: this.formData.workLoad[0].teamManagerName,
        teamName: this.formData.workLoad[0].teamName,
        workStatus: ''
      })
    },
    //确认
    confirm() {
      let total = 0
      this.formData.workLoad.forEach((item) => {
        total += Number(item.realityRate)
      })
      if (total !== 100) {
        this.$message.error('成员投入占比未满100%，请填报后再提交！')
        return false
      }
      this.formData.workLoad.map((item) => {
        item.taskId = this.formData.taskId
      })
      let data = {
        pmsWorkloadVoList: this.formData.workLoad,
        empId: this.formData.empId,
        taskId: this.formData.taskId
      }
      this.$http({
        url: this.$http.adornUrl('/teamWork/saveTeamWorkEmp'),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.cancelDialog()
          this.$emit('select')
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
/* .el-date-editor.el-input {
    width: 190px;
  } */

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
