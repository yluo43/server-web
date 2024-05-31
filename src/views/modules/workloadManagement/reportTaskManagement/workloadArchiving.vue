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
            <div style="margin-right: 24px">
              <el-select v-model="teamIds" placeholder="请选择团队" multiple collapse-tags filterable clearable @change="selectWorkload">
                <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="chooseResult" style="display: flex; margin: 24px 0">
          <div>
            已选中
            <span>{{ count }}</span>
            项
          </div>
          <div v-if="this.radio == 2 || this.radio == 1">
            <el-button type="text" @click="batchArchiving">批量归档</el-button>
          </div>
        </div>
        <div class="table">
          <!-- @select="onSelect" -->
          <baseTable ref="workloadListTable" :multi-select="true" @selectData="selectData" :table-data="workloadList" propHeight="425px">
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
      </el-main>
    </el-container>
    <!-- 驳回 -->
    <base-dialog ref="rejectDialog" title="工作量驳回" :width="'500px'">
      <template>
        <rejectDialog ref="reject" :cancelDialog="closeDialog" @selectTableData="selectWorkload()"></rejectDialog>
      </template>
    </base-dialog>
  </div>
</template>
<script>
//import baseTable from '@/views/modules/base/baseTable.vue'
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
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
      radio: 1,
      ids: [],
      teamIds: [],
      teams: [],
      empId: '1260',
      taskIds: [],
      status: '',
      //选中的数据
      checkedData: [],
      workloadList: {
        theads: [
          { label: '任务名称', prop: 'taskName', minWidth: '194px' },
          { label: '团队成员', prop: 'name', width: '70px' },
          { label: '工号', prop: 'empId', width: '65px' },
          { label: '归属部门', prop: 'deptName', minWidth: '95px' },
          { label: '归属团队', prop: 'teamName', minWidth: '95px' },
          { label: '开始时间', prop: 'startTime', width: '85px' },
          { label: '结束时间', prop: 'overTime', width: '85px' },
          { label: '报工类别', prop: 'workloadName', minWidth: '85px' },
          { label: '成本项目', prop: 'projectName', width: '210px' },
          { label: '项目经理', prop: 'projectManagerName', width: '70px' },
          { label: '计划投入(%)', prop: 'investRate', width: '60px' },
          { label: '实际投入(%)', prop: 'realityRate', width: '60px' },
          { label: '提交时间', prop: 'commitTime', width: '137px' },
          { label: '审批时间', prop: 'approveTime', width: '137px' },
          { label: '归档状态', prop: 'workStatus', slotName: 'workStatus', width: '70px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px', fixed: 'right' }
        ],
        url: '/workload/pigeonholeTaskList'
      }
    }
  },
  mounted() {
    this.getTeam()
  },
  created() {
    this.empId = this.$store.state.user.empId
  },
  methods: {
    //初始化数据
    async init(initData) {
      await this.selectTaskList()
      this.taskId = initData.taskId
      this.selectWorkload()
    },
    async initTable() {
      await this.selectTaskList()
      this.selectWorkload()
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
      this.count = 0
      this.checkedData = []
      this.$refs.workloadListTable.options.multipleSelection = []
      this.selectWorkload()
    },
    async selectTaskList() {
      let params = { empId: this.empId, status: 3, curPage: 1, pageSize: 500 }
      const result = await this.$http({
        url: this.$http.adornUrl('/workload/selectReportPage'),
        method: 'get',
        params: params
      })
      if (result.data && result.data.code === 200) {
        this.workLoadStatistics = result.data.payload.list
        if (result.data.payload.list.length != 0) {
          result.data.payload.list.map((item) => {
            this.taskIds.push(item.taskId)
          })
          result.data.payload.list.splice(0, 0, {
            reportWorkName: '全部',
            taskId: this.taskIds.toString()
          })
          this.taskId = result.data.payload.list[0].taskId
        } else {
          result.data.payload.list.splice(0, 0, {
            reportWorkName: '全部',
            taskId: ''
          })
        }
        this.workLoadStatistics = result.data.payload.list
      } else {
        this.$message.error(result.data.msg)
      }
    },
    //查询列表数据
    selectWorkload() {
      const params = {
        taskId: this.taskId,
        status: this.status,
        teamIds: this.teamIds.toString()
      }
      if (!params.taskId) {
        return
      }
      this.$refs.workloadListTable.options.multipleSelection = []
      this.count = 0
      this.checkedData = []
      this.$refs.workloadListTable.refresh(params)
    },
    //切换ridio
    handlerRadio() {
      if (this.radio == 1) {
        this.status = ''
        this.selectWorkload()
      } else {
        this.status = this.radio
        this.selectWorkload()
      }
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
      this.checkedData = [...selection]
    },
    //批量归档
    batchArchiving() {
      // const rows = this.$refs.workloadListTable.getSelectRow()
      this.ids = this.checkedData.map((item) => {
        return item.id
      })
      if (this.ids.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let data = { ids: this.ids.toString(), status: 4 }
      this.$confirm('确认批量归档吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/workload/updateStatus'),
            method: 'get',
            params: data
          }).then((result) => {
            if (result.data.code == 200 && result.data.success) {
              this.selectWorkload()
              this.$message.success('批量归档成功')
            } else {
              this.$message.error('批量归档失败：' + result.data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消归档'
          })
        })
    },
    //归档
    goToArchived(row) {
      let data = { ids: row.item.id, status: 4 }
      this.$confirm('确认归档吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/workload/updateStatus'),
            method: 'get',
            params: data
          }).then((result) => {
            if (result.data.code == 200 && result.data.success) {
              this.selectWorkload()
              this.$message.success('归档成功')
            } else {
              this.$message.error('归档失败：' + result.data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消归档'
          })
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
  width: 100%;
  padding: 0;
  .top {
    background: white;
  }
  .header-title {
    display: flex;
    align-items: center;
    padding-left: 24px;
  }
  .status {
    padding: 24px 60px;
  }
}
.table {
  background-color: white;
}

.setstyle {
  min-height: 200px;
  padding: 0 !important;
  margin: 0;
  overflow: auto;
  cursor: default !important;
}
</style>
