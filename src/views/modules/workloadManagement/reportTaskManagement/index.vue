<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-header style="padding: 0 10px 0 16px">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabChange">
          <el-tab-pane label="填报任务管理" name="first"></el-tab-pane>
          <el-tab-pane label="工作量归档" name="second"></el-tab-pane>
          <el-tab-pane label="归档任务详情" name="third"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main style="width: 100%" class="main" v-if="activeName === 'first'">
        <div class="management-header">
          <div class="management-item">
            <p>我的待办</p>
            <p class="font-bold">
              <span>{{ commissionTask }}</span>
              个任务
            </p>
          </div>
          <div class="management-item">
            <p>本月完成任务数</p>
            <p class="font-bold">
              <span>{{ monthTask }}</span>
              个任务
            </p>
          </div>
          <div class="management-item border-none">
            <p>本年完成任务数</p>
            <p class="font-bold">
              <span>{{ yearTask }}</span>
              个任务
            </p>
          </div>
        </div>
        <div class="table">
          <el-row style="display: flex; align-items: center">
            <el-col :span="10">
              <div style="display: flex; align-items: center">
                <p style="font-size: 16px; font-weight: 600; margin-left: 10px">任务列表</p>
                <el-button style="margin-left: 10px; width: 130px" type="primary" icon="el-icon-plus" @click="addReportTask">下发填报任务</el-button>
              </div>
            </el-col>
            <el-col :span="14">
              <el-row style="display: flex; align-items: center">
                <el-col :span="18">
                  <el-radio-group v-model="radio" @change="handlerRadio">
                    <el-radio-button label="1">全部</el-radio-button>
                    <el-radio-button label="2">待开始</el-radio-button>
                    <el-radio-button label="3">填报中</el-radio-button>
                    <el-radio-button label="4">确认中</el-radio-button>
                    <el-radio-button label="5">待归档</el-radio-button>
                    <el-radio-button label="6">已归档</el-radio-button>
                  </el-radio-group>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="keyword" placeholder="请输入搜索关键字" @change="search" prefix-icon="el-icon-search" clearable></el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div>
            <!-- @afterQuery="afterTaskListQuery" -->
            <baseTable ref="taskListTable" :table-data="taskList" :type="null" style="margin-top: 10px">
              <template v-slot:reportWorkName="row">
                <div v-if="row.item.taskStatus == 3">
                  {{ row.item.reportWorkName }}
                  <el-tag type="danger" effect="dark">待归档</el-tag>
                </div>
                <div v-else>{{ row.item.reportWorkName }}</div>
              </template>
              <template v-slot:createTime="row">
                <div>{{ format(row.item.createTime) }}</div>
              </template>
              <template v-slot:reportStartTime="row">
                <div>{{ format(row.item.reportStartTime) }}</div>
              </template>
              <template v-slot:taskStatus="row">
                <template v-if="row.item.taskStatus == 0">
                  <span>待开始</span>
                </template>
                <template v-if="row.item.taskStatus == 1">
                  <span>填报中</span>
                </template>
                <template v-if="row.item.taskStatus == 2">
                  <span>确认中</span>
                </template>
                <template v-if="row.item.taskStatus == 3">
                  <span>待归档</span>
                </template>
                <template v-if="row.item.taskStatus == 4">
                  <span>已归档</span>
                </template>
              </template>
              <!-- 操作 -->
              <template v-slot:clientType="row">
                <template>
                  <el-row>
                    <el-col :span="8">
                      <el-button v-show="row.item.taskStatus == 4" type="text" @click="goToArchiveDetails(row)">>>归档详情</el-button>
                      <el-button v-show="row.item.taskStatus == 3" type="text" @click="goToArchive(row)">>>去归档</el-button>
                    </el-col>
                    <el-col :span="6">
                      <el-button type="text" @click="goToTaskDetails(row)">任务详情</el-button>
                    </el-col>
                    <el-col :span="5"><el-button :disabled="row.item.taskStatus !== 0" type="text" @click="editReportTask(row)">编辑</el-button></el-col>
                    <el-col :span="5"><el-button type="text" @click="goToDelete(row)">删除</el-button></el-col>
                  </el-row>
                </template>
              </template>
            </baseTable>
          </div>
        </div>
      </el-main>
      <!-- 工作量归档 -->
      <div v-if="activeName === 'second'">
        <workloadArchiving ref="workloadArchiving"></workloadArchiving>
      </div>
      <!-- 归档任务详情 -->
      <div v-if="activeName === 'third'">
        <archiveDetails ref="archiveDetails"></archiveDetails>
      </div>
    </el-container>
    <!-- 下发填报任务或编辑 -->
    <base-dialog ref="addOrUpdateReportTaskDialog" :title="reportTaskTitle" :width="'500px'">
      <template>
        <addOrUpdateReportTask @selectTableData="selectTable" ref="addOrUpdateReportTask" :cancelDialog="closeDialog"></addOrUpdateReportTask>
      </template>
    </base-dialog>
    <!-- 任务详情 -->
    <base-dialog ref="taskDetailsDialog" title="任务详情" :width="'1200px'">
      <template>
        <taskDetails ref="taskDetails" :cancelDialog="closeDialog"></taskDetails>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addOrUpdateReportTask from '@/views/modules/workloadManagement/reportTaskManagement/addOrUpdateReportTask.vue'
import workloadArchiving from '@/views/modules/workloadManagement/reportTaskManagement/workloadArchiving.vue'
import archiveDetails from '@/views/modules/workloadManagement/reportTaskManagement/archiveDetails.vue'
import taskDetails from '@/views/modules/workloadManagement/reportTaskManagement/taskDetails.vue'
export default {
  components: { baseTable, baseDialog, addOrUpdateReportTask, workloadArchiving, archiveDetails, taskDetails },
  props: {},
  data() {
    return {
      commissionTask: '',
      monthTask: '',
      yearTask: '',
      empId: '1260',
      //taskStatus 0:待开始，1:填报中，2:确认中，3:待归档，4:已归档
      activeName: 'first',
      radio: '1',
      keyword: '',
      reportTaskTitle: '',
      taskList: {
        theads: [
          { label: '任务名称', prop: 'reportWorkName', slotName: 'reportWorkName', width: '180px' },
          { label: '简介', prop: 'intro' },
          { label: '创建人', prop: 'managerName' },
          { label: '创建时间', prop: 'createTime', slotName: 'createTime' },
          { label: '开始填报时间', prop: 'reportStartTime', slotName: 'reportStartTime' },
          { label: '填报天数', prop: 'reportDay' },
          { label: '提醒频率', prop: 'frequency' },
          { label: '任务状态', prop: 'taskStatus', slotName: 'taskStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/workload/selectReportPage'
      }
    }
  },

  mounted() {
    // console.log(this.$store.state.user.empId)
    this.empId = this.$store.state.user.empId
    this.selectTaskList({ empId: this.empId })
    this.selectTaskAmount()
  },
  created() {},
  methods: {
    selectTable() {
      this.handlerRadio()
      this.selectTaskAmount()
    },
    //搜索框搜索
    search() {
      this.handlerRadio()
    },
    //查询列表
    selectTaskList(params) {
      this.$refs.taskListTable.refresh(params)
    },
    //统计任务数
    selectTaskAmount() {
      this.$http({
        url: this.$http.adornUrl('/workload/selectTaskAmount'),
        method: 'get',
        params: { empId: this.empId }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.commissionTask = data.payload.commissionTask
          this.monthTask = data.payload.monthTask
          this.yearTask = data.payload.yearTask
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取接口数据
    // afterTaskListQuery() {
    //   let data = this.$refs.taskListTable.options.data.payload
    //   this.commissionTask = data.commissionTask
    //   this.monthTask = data.monthTask
    //   this.yearTask = data.yearTask
    // },
    //table切换
    tabChange() {
      if (this.activeName === 'first') {
        this.$nextTick(() => {
          this.handlerRadio()
          // this.selectTaskList({ empId: this.empId })
        })
      }
      if (this.activeName === 'second') {
        this.$nextTick(() => {
          this.$refs.workloadArchiving.initTable()
        })
      }
      if (this.activeName === 'third') {
        this.$nextTick(() => {
          this.$refs.archiveDetails.initTable()
        })
      }
    },
    //切换radio查询
    handlerRadio() {
      if (this.radio == 1) {
        this.selectTaskList({ empId: this.empId, search: this.keyword })
      } else {
        this.selectTaskList({ empId: this.empId, status: this.radio - 2, search: this.keyword })
      }
    },
    //下发填报任务
    addReportTask() {
      this.reportTaskTitle = '下发填报任务'
      this.$refs.addOrUpdateReportTaskDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdateReportTask.init({ operate: 'add' })
      })
    },
    //编辑填报任务
    editReportTask(row) {
      this.reportTaskTitle = '编辑'
      this.$refs.addOrUpdateReportTaskDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdateReportTask.init({ operate: 'edit' }, row.item)
      })
    },
    //日期格式化
    format(date) {
      var date = new Date(date)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = (month < 10 ? '0' : '') + month
      var datee = date.getDate()
      datee = (datee < 10 ? '0' : '') + datee
      return year + '-' + month + '-' + datee
    },
    //去归档
    goToArchive(row) {
      this.activeName = 'second'
      this.$nextTick(() => {
        this.$refs.workloadArchiving.init(row.item)
      })
    },
    //归档详情
    goToArchiveDetails(row) {
      this.activeName = 'third'
      this.$nextTick(() => {
        this.$refs.archiveDetails.init(row.item)
      })
    },
    //任务详情
    goToTaskDetails(row) {
      this.$refs.taskDetailsDialog.show()
      this.$nextTick(() => {
        this.$refs.taskDetails.init(row.item)
      })
    },
    //删除
    goToDelete(row) {
      if (row) {
        let message = ''
        let data = { deptIds: row.item.deptIds, deleteFlag: 1, taskId: row.item.taskId }
        switch (row.item.taskStatus) {
          case 0:
            message = '该任务待开始,您确定删除吗?'
            break
          case 1:
            message = '该任务填报中,您确定删除吗?'
            break
          case 2:
            message = '该任务确认中,您确定删除吗?'
            break
          case 3:
            message = '该任务待归档,您确定删除吗?'
            break
          case 4:
            message = '该任务已归档,您确定删除吗?'
            break
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('/workload/updateReport'),
              method: 'post',
              data: data
            }).then(({ data }) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.handlerRadio()
                // this.selectTaskList({ empId: this.empId })
                this.selectTaskAmount()
              } else {
                this.$message.error(data.msg)
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    //关闭弹窗
    closeDialog() {
      this.$refs.addOrUpdateReportTaskDialog.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-button {
  min-width: 0;
}
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
::v-deep .el-tag {
  height: 20px;
  line-height: 20px;
}
.management-header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  .management-item {
    width: 100%;
    border-right: 1px solid lightgray;
    display: flex;
    flex-direction: column;
    align-items: center;
    .font-bold {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .border-none {
    border-right: 0;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
}
</style>
