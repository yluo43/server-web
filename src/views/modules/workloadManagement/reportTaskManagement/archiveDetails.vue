<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main class="main">
        <div class="top">
          <div class="header-title">
            <div>工作量统计:</div>
            <div style="margin-left: 10px">
              <el-select v-model="taskId" style="width: 278px !important" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.taskId" :label="item.reportWorkName" :value="item.taskId" />
              </el-select>
            </div>
          </div>
          <div style="padding: 20px 16px">
            <el-form ref="formData" :inline="true" label-width="70px" :label-position="labelposition" :model="formData">
              <el-form-item label="用户姓名:" prop="name">
                <el-input style="width: 200px" v-model="formData.name" placeholder="请输入用户姓名" clearable />
              </el-form-item>
              <el-form-item label="归属团队:" prop="teamIds">
                <el-select v-model="formData.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
                  <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="报工类别:" prop="workLoadIds">
                <el-select v-model="formData.workLoadIds" multiple collapse-tags placeholder="请选择报工类别" clearable>
                  <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="成本项目:" prop="costItem">
                <el-select v-model="formData.costItem" placeholder="请选择成本项目" multiple collapse-tags clearable>
                  <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <div v-if="showFlag" style="display: contents">
                <el-form-item label="工号:" prop="empId">
                  <el-input
                    style="width: 200px"
                    v-model="formData.empId"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    placeholder="请输入工号"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归属部门:" prop="deptIds">
                  <el-select v-model="formData.deptIds" placeholder="请选择归属部门" multiple collapse-tags clearable>
                    <el-option v-for="item in belongingDepartments" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="团队负责人:" prop="teamLeader">
                  <el-select v-model="formData.teamLeader" placeholder="请选择团队负责人" multiple collapse-tags clearable>
                    <el-option v-for="item in teamLeaders" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="项目经理:" prop="projectManager">
                  <el-select v-model="formData.projectManager" placeholder="请选择项目经理" multiple collapse-tags clearable>
                    <el-option v-for="item in projectManagers" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id" />
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item>
                <div style="display: inline-block; margin-right: 15px" :style="showFlag ? { 'margin-left': '10px' } : ''" @click="showFlag = !showFlag">
                  <svg-icon :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'" style="height: 1.3em; width: 1.3em; position: relative; top: 3px" />
                  <span v-if="showFlag" class="btn-font-size" style="color: #2462f9">收起</span>
                  <span v-else class="btn-font-size" style="color: #2462f9">展开</span>
                </div>
                <el-button type="primary" icon="el-icon-search" @click="selectTaskDetial" style="margin-right: 10px">查询</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="chooseResult" style="display: flex; margin: 24px 0">
          <div>
            已选中
            <span>{{ count }}</span>
            项
          </div>
          <div>
            <el-button type="text" @click="batchDownLoad">批量下载</el-button>
          </div>
        </div>
        <div class="table">
          <!-- @select="onSelect" -->
          <baseTable ref="taskDetialTable" :multi-select="true" @selectData="selectData" :table-data="taskDetial" propHeight="425px"></baseTable>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
//import baseTable from '@/views/modules/base/baseTable.vue'
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
export default {
  components: { baseTable, baseDialog },
  props: {},
  data() {
    return {
      showFlag: false,
      taskId: '',
      count: 0,
      empId: '',
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
        //报工类别
        workLoadIds: [],
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
      //报工类别
      categories: [],
      taskIds: [],
      taskDetial: {
        theads: [
          { label: '任务名称', prop: 'taskName', minWidth: '194px' },
          { label: '团队成员', prop: 'name', width: '70px' },
          { label: '工号', prop: 'empId', width: '65px' },
          { label: '归属部门', prop: 'deptName', minWidth: '95px' },
          { label: '归属团队', prop: 'teamName', minWidth: '95px' },
          { label: '开始时间', prop: 'startTime', width: '85px' },
          { label: '结束时间', prop: 'overTime', width: '85px' },
          { label: '报工类别', prop: 'workloadName', minWidth: '85px' },
          { label: '成本项目', prop: 'projectName', minWidth: '210px' },
          { label: '项目经理', prop: 'projectManagerName', width: '70px' },
          { label: '计划投入(%)', prop: 'investRate', width: '60px' },
          { label: '实际投入(%)', prop: 'realityRate', width: '60px' },
          { label: '提交时间', prop: 'commitTime', width: '137px' },
          { label: '审批时间', prop: 'approveTime', width: '137px' },
          { label: '归档时间', prop: 'updateTime', width: '138px' }
        ],
        url: '/workload/pigeonholeTaskList'
      },
      checkedData: []
    }
  },
  mounted() {
    this.empId = this.$store.state.user.empId
    this.getManager()
    this.getDept()
    this.getTeam()
    this.getTeamLeaders()
    this.getProject()
    this.getWorkloadType()
  },
  created() {},
  methods: {
    async init(initData) {
      await this.selectTaskList()
      this.taskId = initData.taskId
      this.selectTaskDetial()
    },
    async initTable() {
      await this.selectTaskList()
      this.selectTaskDetial()
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
    //统计工作量下拉框改变
    changeSelect(params) {
      this.taskId = params
      this.count = 0
      this.checkedData = []
      this.$refs.taskDetialTable.options.multipleSelection = []
      this.selectTaskDetial()
    },
    //查询工作量
    selectTaskDetial() {
      const params = {
        taskId: this.taskId,
        status: 4,
        name: this.formData.name,
        empId: this.formData.empId,
        deptIds: this.formData.deptIds.toString(),
        teamIds: this.formData.teamIds.toString(),
        workloadType: this.formData.workLoadIds.toString(),
        teamPersonIds: this.formData.teamLeader.toString(),
        projectIds: this.formData.costItem.toString(),
        managerIds: this.formData.projectManager.toString()
      }
      if (!params.taskId) {
        return
      }
      this.$refs.taskDetialTable.refresh(params)
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
        if (result.data.payload.length != 0) {
          result.data.payload.map((item) => {
            this.taskIds.push(item.taskId)
          })
          result.data.payload.splice(0, 0, {
            reportWorkName: '全部',
            taskId: this.taskIds.toString()
          })
          this.taskId = result.data.payload[0].taskId
        } else {
          result.data.payload.splice(0, 0, {
            reportWorkName: '全部',
            taskId: ''
          })
        }
        this.workLoadStatistics = [...result.data.payload]
      } else {
        this.$message.error(result.data.msg)
      }
    },
    getTeamLeaders() {
      this.$http({
        url: this.$http.adornUrl('/common/getManager?pid=3'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamLeaders = data.payload
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
    // onSelect(selection) {
    //   if (selection.length > 0) {
    //     this.count = selection.length
    //   } else {
    //     this.count = 0
    //   }
    // },
    selectData(selection) {
      this.count = selection.length
      this.checkedData = selection
    },
    //批量下载
    batchDownLoad() {
      // const list = this.$refs.taskDetialTable.getSelectRow()
      const list = this.checkedData
      if (list.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let ids = list.map((item) => item.id)
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

::v-deep .el-input__icon {
  line-height: 0;
}
.main {
  width: 100%;
  padding: 0;
  .top {
    background: white;
  }
  .header-title {
    display: flex;
    align-items: center;
    // font-size: 16px;
    // font-weight: 600;
    padding-left: 24px;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
}
</style>
