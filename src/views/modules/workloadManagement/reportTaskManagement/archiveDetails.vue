<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div style="display: flex; align-items: center; margin: 0 0 10px 30px; font-weight: 600">
            <div>工作量统计:</div>
            <div style="margin-left: 10px; font-weight: 600">
              <el-select v-model="reportWorkName" style="font-weight: 600px; width: 230px !important" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.taskId" :label="item.reportWorkName" :value="item.taskId" />
              </el-select>
            </div>
          </div>
          <div>
            <el-form ref="formData" :inline="true" label-width="110px" :label-position="labelposition" :model="formData">
              <el-form-item label="用户姓名:" prop="name">
                <el-input v-model="formData.name" placeholder="请输入用户姓名" clearable />
              </el-form-item>
              <el-form-item label="工号:" prop="empId">
                <el-input v-model="formData.empId" placeholder="请输入工号" clearable />
              </el-form-item>
              <el-form-item label="归属部门:" prop="deptIds">
                <el-select v-model="formData.deptIds" placeholder="请选择" multiple collapse-tags clearable>
                  <el-option v-for="item in belongingDepartments" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="归属团队:" prop="teamIds">
                <el-select v-model="formData.teamIds" placeholder="请选择" multiple collapse-tags clearable>
                  <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="团队负责人:" prop="teamLeader">
                <el-select v-model="formData.teamLeader" placeholder="请选择" multiple collapse-tags clearable>
                  <el-option v-for="item in teamLeaders" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="成本项目:" prop="costItem">
                <el-select v-model="formData.costItem" placeholder="请选择" multiple collapse-tags clearable>
                  <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="项目经理:" prop="projectManager">
                <el-select v-model="formData.projectManager" placeholder="请选择" multiple collapse-tags clearable>
                  <el-option v-for="item in projectManagers" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-button type="primary" icon="el-icon-search" style="margin-left: 50px" @click="selectData">查询</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
            </el-form>
          </div>
          <div class="row-box">
            <div>
              已选择
              <span>{{ count }}</span>
              项
            </div>
            <div>
              <el-button type="text" @click="batchDownLoad">批量下载</el-button>
            </div>
          </div>
        </div>
        <div class="table">
          <div>
            <baseTable ref="taskDetialTable" :multi-select="true" @select="onSelect" :table-data="taskDetial" style="margin-top: 10px"></baseTable>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
export default {
  components: { baseTable, baseDialog },
  props: {},
  data() {
    return {
      taskId: '',
      count: 0,
      empId: '1260',
      //工作量统计
      reportWorkName: '',
      workLoadStatistics: [],
      // form表单右对齐
      labelposition: 'right',
      formData: {
        //用户姓名
        name: '',
        //工号
        empId: '',
        //归属部门
        deptIds: [],
        //归属团队
        teamIds: [],
        //团队负责人
        teamLeader: [],
        //成本项目
        costItem: [],
        //项目经理
        projectManager: []
      },
      //部门
      belongingDepartments: [],
      //项目经理
      projectManagers: [],
      //团队
      teams: [],
      //团队负责人
      teamLeaders: [],
      //成本项目
      costItems: [],
      taskDetial: {
        theads: [
          { label: '团队成员', prop: 'name' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '开始时间', prop: 'startTime' },
          { label: '结束时间', prop: 'overTime' },
          { label: '成本项目', prop: 'projectName' },
          { label: '项目经理', prop: 'projectManagerName' },
          { label: '计划投入(%)', prop: 'investRate' },
          { label: '实际投入(%)', prop: 'realityRate' },
          { label: '提交时间', prop: 'commitTime' },
          { label: '审批时间', prop: 'approveTime' },
          { label: '归档时间', prop: 'updateTime' }
        ],
        url: '/workload/pigeonholeTaskList'
      }
    }
  },
  mounted() {
    this.empId = this.$store.state.user.empId
    this.getManager()
    this.getDept()
    this.getTeam()
    this.getTeamLeaders()
    this.getProject()
  },
  created() {},
  methods: {
    async init(initData) {
      await this.selectTaskList()
      this.reportWorkName = initData.reportWorkName
      this.taskId = initData.taskId
      this.selectTaskDetial({ taskId: this.taskId, status: 4 })
    },
    async initTable() {
      await this.selectTaskList()
      this.selectTaskDetial({ taskId: this.taskId, status: 4 })
    },
    //统计工作量下拉框改变
    changeSelect(params) {
      this.taskId = params
      this.selectData()
      //this.selectTaskDetial({ taskId: this.taskId, status: 4 })
    },
    //查询工作量
    selectTaskDetial(params) {
      this.$refs.taskDetialTable.refresh(params)
    },
    //输入框输入查询
    selectData() {
      let data = {
        taskId: this.taskId,
        status: 4,
        name: this.formData.name,
        empId: this.formData.empId,
        deptIds: this.formData.deptIds.toString(),
        teamIds: this.formData.teamIds.toString(),
        teamPersonIds: this.formData.teamLeader.toString(),
        projectIds: this.formData.costItem.toString(),
        managerIds: this.formData.projectManager.toString()
      }
      this.selectTaskDetial(data)
    },
    //查询任务列表
    async selectTaskList() {
      let params = { empId: this.empId }
      const result = await this.$http({
        url: this.$http.adornUrl('/workload/selectTasks'),
        method: 'get',
        params: params
      })
      if (result.data && result.data.code === 200) {
        this.workLoadStatistics = result.data.payload
        if (result.data.payload.length != 0) {
          this.reportWorkName = result.data.payload[0].reportWorkName
          this.taskId = result.data.payload[0].taskId
        }
      } else {
        this.$message.error(result.data.msg)
      }
    },

    //获取团队负责人
    getTeamLeaders() {
      this.$http({
        url: this.$http.adornUrl('/employee/selectEmployeeList'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          data.payload.forEach((data) => {
            if (
              data.empLevel == '6-' ||
              data.empLevel == '6' ||
              data.empLevel == '7' ||
              data.empLevel == '8' ||
              data.empLevel == '9' ||
              data.empLevel == '6+'
            ) {
              this.teamLeaders.push(data)
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取项目
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
    //获取项目经理
    getManager() {
      this.$http({
        url: this.$http.adornUrl('/common/getManager'),
        params: { pid: 4 },
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.projectManagers = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取部门
    getDept() {
      this.$http({
        url: this.$http.adornUrl('/common/getDept'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.belongingDepartments = data.payload.filter((item) => item.id !== 0)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取团队
    getTeam() {
      this.$http({
        url: this.$http.adornUrl('/common/getTeam'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teams = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //选中项数
    onSelect(selection) {
      if (selection.length > 0) {
        this.count = selection.length
      } else {
        this.count = 0
      }
    },
    //批量下载
    batchDownLoad() {
      const list = this.$refs.taskDetialTable.getSelectRow()
      if (list.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let ids = list.map((item) => item.id)
      console.log(ids)
      this.$http.downloadPost(this.$http.adornUrl('/workload/export'), { ids: ids }, this)
    },
    //重置
    resetForm() {
      this.$refs.formData.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
::v-deep .el-form-item__content {
  width: 190px;
}
::v-deep .el-input__icon {
  line-height: 0;
}
.main {
  .top {
    background: white;
    padding-left: 30px;
  }
  .header-title {
    font-size: 16px;
    font-weight: 600;
  }
  .row-box {
    display: flex;
    align-items: center;
    height: 40px;
    border-radius: 5px;
    margin-left: -20px;
    background-color: #e8f4ff;
    padding-left: 20px;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
}
</style>
