<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div class="header-title">
            <div>工作量统计:</div>
            <div style="margin-left: 10px; font-weight: 600">
              <el-select v-model="reportWorkName" clearable style="font-weight: 600px" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.taskId" :label="item.reportWorkName" :value="item.taskId" />
              </el-select>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div class="status">
              状态：
              <el-radio-group v-model="radio" @change="handlerRadio">
                <el-radio-button label="1">全部</el-radio-button>
                <el-radio-button label="2">待归档</el-radio-button>
                <el-radio-button label="3">被驳回</el-radio-button>
                <el-radio-button label="4">已归档</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <el-select v-model="teamIds" placeholder="请选择" multiple collapse-tags clearable @change="search">
                <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div class="row-box">
            <div>
              已选择
              <span>{{ count }}</span>
              项
            </div>
            <div v-if="this.radio == 2 || this.radio == 1">
              <el-button type="text" @click="batchArchiving">批量归档</el-button>
            </div>
          </div>
        </div>

        <div class="table">
          <div>
            <baseTable ref="workloadListTable" :multi-select="true" @select="onSelect" :table-data="workloadList" style="margin-top: 10px">
              <template v-slot:workStatus="row">
                <template v-if="row.item.workStatus == 2">
                  <span>待归档</span>
                </template>
                <template v-if="row.item.workStatus == 3">
                  <span>被驳回</span>
                </template>
                <template v-if="row.item.workStatus == 4">
                  <span>已归档</span>
                </template>
              </template>
              <!-- 操作 -->
              <template v-slot:clientType="row">
                <template>
                  <el-button :disabled="row.item.workStatus != 2" type="text" @click="goToArchived(row)">归档</el-button>
                  <el-button :disabled="row.item.workStatus != 2" type="text" @click="goToReject(row)">驳回</el-button>
                </template>
              </template>
            </baseTable>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 驳回 -->
    <base-dialog ref="rejectDialog" title="工作量驳回" :width="'500px'">
      <template>
        <rejectDialog ref="reject" :cancelDialog="closeDialog" @selectTableData="selectWorkload({ taskId: taskId })"></rejectDialog>
      </template>
    </base-dialog>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import rejectDialog from '@/views/modules/workloadManagement/reportTaskManagement/rejectDialog.vue'
export default {
  components: { baseTable, baseDialog, rejectDialog },
  props: {},
  data() {
    return {
      // 0待归档 1被驳回 2已归档
      //工作量统计
      reportWorkName: '',
      workLoadStatistics: [],
      //任务Id
      taskId: '',
      //已选择多少项
      count: 0,
      radio: '1',
      ids: [],
      teamIds: [],
      teams: [],
      empId: '1260',
      //团队选择数据
      selectData: [],
      selectTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryData: {},
      workloadList: {
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
          { label: '归档状态', prop: 'workStatus', slotName: 'workStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/workload/pigeonholeTaskList'
      }
    }
  },
  mounted() {
    this.empId = this.$store.state.user.empId
    this.getTeam()
  },
  created() {},
  methods: {
    //初始化数据
    async init(initData) {
      await this.selectTaskList()
      this.reportWorkName = initData.reportWorkName
      this.taskId = initData.taskId
      this.selectWorkload({ taskId: this.taskId })
    },
    async initTable() {
      await this.selectTaskList()
      this.selectWorkload({ taskId: this.taskId })
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
    //统计工作量下拉框改变
    changeSelect(params) {
      this.taskId = params
      this.handlerRadio()
      //this.selectWorkload({ taskId: params })
    },
    //团队下拉框值改变
    search() {
      this.handlerRadio()
      // this.selectWorkload({ taskId: this.taskId, teamIds: this.teamIds.toString() })
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
          this.reportWorkName = result.data.payload.slice(-1)[0].reportWorkName
          this.taskId = result.data.payload.slice(-1)[0].taskId
        }
      } else {
        this.$message.error(result.data.msg)
      }
    },
    //查询
    selectWorkload(params) {
      this.$refs.workloadListTable.refresh(params)
    },
    //切换ridio
    handlerRadio() {
      if (this.radio == 1) {
        this.selectWorkload({ taskId: this.taskId, teamIds: this.teamIds.toString() })
      } else {
        this.selectWorkload({ taskId: this.taskId, status: this.radio, teamIds: this.teamIds.toString() })
      }
    },
    //选中项数
    onSelect(selection) {
      if (selection.length > 0) {
        this.count = selection.length
      } else {
        this.count = 0
      }
    },
    //批量归档
    batchArchiving() {
      const rows = this.$refs.workloadListTable.getSelectRow()
      this.ids = rows.map((item) => {
        return item.id
      })
      if (this.ids.length === 0) {
        this.$message.warning('请选择一条数据！')
        return
      }
      let data = { ids: this.ids.toString(), status: 4 }
      this.$http({
        url: this.$http.adornUrl('/workload/updateStatus'),
        method: 'get',
        params: data
      }).then((result) => {
        if (result.data.code == 200 && result.data.success) {
          this.selectWorkload({ taskId: this.taskId })
          this.$message.success('归档成功')
        } else {
          this.$message.error('归档失败失败：' + result.data.msg)
        }
      })
    },
    //归档
    goToArchived(row) {
      let data = { ids: row.item.id, status: 4 }
      this.$http({
        url: this.$http.adornUrl('/workload/updateStatus'),
        method: 'get',
        params: data
      }).then((result) => {
        if (result.data.code == 200 && result.data.success) {
          this.selectWorkload({ taskId: this.taskId })
          this.$message.success('归档成功')
        } else {
          this.$message.error('归档失败失败：' + result.data.msg)
        }
      })
    },
    //驳回
    goToReject(row) {
      this.$refs.rejectDialog.show()
      this.$nextTick(() => {
        this.$refs.reject.init(row.item)
      })
    },
    //关闭驳回弹窗
    closeDialog() {
      this.$refs.rejectDialog.hide()
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
  .top {
    background: white;
    padding-left: 30px;
  }
  .header-title {
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  .status {
    padding: 20px 0;
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

.setstyle {
  min-height: 200px;
  padding: 0 !important;
  margin: 0;
  overflow: auto;
  cursor: default !important;
}
</style>
