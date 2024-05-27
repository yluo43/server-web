<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" label-width="110px" :model="formData">
          <el-form-item label="姓名:" prop="userName">
            {{ formData.userName }}
          </el-form-item>
          <el-form-item label="工作量填报:">
            <div style="display: flex; align-items: center" v-for="(item, index) in formData.workLoad" :key="index">
              <!-- <el-form-item :prop="'workLoad.' + index + '.investTime'">
                <el-date-picker
                  style="width: 200px"
                  v-model="item.investTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item> -->
              <el-form-item :prop="'workLoad.' + index + '.workloadName'">
                <el-select v-model="item.workloadName" filterable placeholder="请选择报工类别" @change="workLoadChange(item)" clearable>
                  <el-option v-for="ele in categories" :key="ele.id" :label="ele.name" :value="ele.name" />
                </el-select>
              </el-form-item>
              <el-form-item :prop="'workLoad.' + index + '.projectName'">
                <el-select v-model="item.projectName" filterable placeholder="请选择成本项目" @change="selectChange(item)" clearable>
                  <el-option v-for="ele in costItems" :key="ele.id" :label="ele.name" :value="ele.name" />
                </el-select>
              </el-form-item>
              <el-form-item :prop="'workLoad.' + index + '.realityRate'">
                <el-input style="width: 100px" v-model.number="item.realityRate" clearable />
                %
              </el-form-item>
              <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em" @click="deleteRow(item)" />
              <!-- <i class="el-icon-delete" @click="deleteRow(item)"></i> -->
            </div>

            <el-button type="text" icon="el-icon-circle-plus-outline" style="font-size: 16px !important" @click="addRow">添加</el-button>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
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
        workLoad: []
      },
      costItems: [],
      dataList: [],
      categories: [],
      workLoad: []
    }
  },
  // computed: {
  //   pickerOptions() {
  //     return {
  //       disabledDate: (time) => {
  //         return (
  //           time.getTime() < new Date(this.workLoad[0].jobStartTime + ' 00:00:00').getTime() ||
  //           time.getTime() > new Date(this.workLoad[0].jobOverTime + ' 23:59:59').getTime()
  //         )
  //       }
  //     }
  //   }
  // },
  mounted() {
    this.getProject()
    this.getWorkloadType()
  },
  created() {},
  methods: {
    //初始化
    init(initData) {
      Object.assign(this.formData, initData)
      this.selectInfo()
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
    //根据任务id和工号查询该员工所有项目信息
    selectInfo() {
      this.$http({
        url: this.$http.adornUrl('/teamWork/viewTeamWorkList'),
        method: 'get',
        params: {
          taskId: this.formData.taskId,
          empId: this.formData.empId
        }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          // data.payload.list.forEach((item) => {
          //   item.investTime = [item.startTime, item.overTime]
          // })
          this.formData.workLoad = [...data.payload.list]
          this.workLoad = [...data.payload.list]
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    workLoadChange(params) {
      this.categories.forEach((item) => {
        if (item.name == params.workloadName) {
          params.workloadType = item.id
        }
      })
    },
    selectChange(params) {
      this.costItems.forEach((item) => {
        if (item.name == params.projectName) {
          params.projectId = item.id
          params.managerName = item.managerName
          // params.deptId = item.deptId
        }
      })
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
        deptId: this.workLoad[0].deptId,
        deptName: this.workLoad[0].deptName,
        empId: this.formData.empId,
        id: '',
        managerName: '',
        name: this.formData.userName,
        overTime: this.workLoad[0].overTime,
        planRate: '',
        workloadName: '',
        workloadType: '',
        projectId: '',
        projectName: '',
        realityRate: 0,
        //  investTime: [this.workLoad[0].jobStartTime, this.workLoad[0].jobOverTime],
        startTime: this.workLoad[0].startTime,
        taskId: this.formData.taskId,
        teamId: this.workLoad[0].teamId,
        teamManagerName: this.workLoad[0].teamManagerName,
        teamName: this.workLoad[0].teamName,
        workStatus: ''
      })
    },
    //确认
    confirm() {
      let total = 0
      this.formData.workLoad.forEach((item) => {
        total += Number(item.realityRate)
      })
      let flag = this.formData.workLoad.every((item) => {
        return item.workloadName && item.projectName && item.realityRate
      })
      if (!flag) {
        this.$message.error('报工类别、成本项目、实际投入不能为空')
        return false
      }
      if (total < 100) {
        this.$message.error('成员投入占比未满100%，请填报后再提交！')
        return false
      }
      if (total > 100) {
        this.$message.error('成员投入占比超过100%，请填报后再提交！')
        return false
      }
      this.formData.workLoad.map((item, index) => {
        //  item.startTime = item.investTime[0]
        //  item.overTime = item.investTime[1]
        item.taskId = this.formData.taskId
        this.costItems.map((ele) => {
          if (item.projectId === ele.id) {
            item.deptId = ele.deptId
          }
        })
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
</style>
