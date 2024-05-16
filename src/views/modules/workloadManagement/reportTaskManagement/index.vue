<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div>
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabChange" style="padding: 24px">
          <el-tab-pane label="填报任务管理" name="first"></el-tab-pane>
          <el-tab-pane label="工作量归档" name="second"></el-tab-pane>
          <el-tab-pane label="归档任务详情" name="third"></el-tab-pane>
        </el-tabs>
      </div>
      <el-main style="width: 100%; padding: 0" v-if="activeName === 'first'">
        <div class="management-header">
          <div class="type-area">
            <div class="management-content">
              <div class="management-item">
                <div>
                  <img src="@/assets/commission-task.png" />
                </div>
                <div style="margin-left: 12px">
                  <p>我的待办</p>
                  <p>
                    <span class="font-bold">{{ commissionTask }}</span>
                    个任务
                  </p>
                </div>
              </div>
              <div class="management-item">
                <div>
                  <img src="@/assets/month-task.png" />
                </div>
                <div style="margin-left: 12px">
                  <p>本月完成任务数</p>
                  <p>
                    <span class="font-bold">{{ monthTask }}</span>
                    个任务
                  </p>
                </div>
              </div>
              <div class="management-item border-none">
                <div>
                  <img src="@/assets/year-task.png" />
                </div>
                <div style="margin-left: 12px">
                  <p>本年完成任务数</p>
                  <p>
                    <span class="font-bold">{{ yearTask }}</span>
                    个任务
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-top">
            <div style="display: flex; align-items: center">
              <p style="font-size: 16px; font-weight: 600">任务列表</p>
              <el-button style="margin-left: 10px; width: 130px" type="primary" icon="el-icon-circle-plus-outline" @click="addReportTask">
                下发填报任务
              </el-button>
            </div>
            <div>
              <el-radio-group v-model="radio" @change="handlerRadio">
                <el-radio-button label="1">全部</el-radio-button>
                <el-radio-button label="2">待开始</el-radio-button>
                <el-radio-button label="3">填报中</el-radio-button>
                <el-radio-button label="4">确认中</el-radio-button>
                <el-radio-button label="5">待归档</el-radio-button>
                <el-radio-button label="6">已归档</el-radio-button>
              </el-radio-group>
            </div>
            <div style="display: flex; justify-content: flex-end">
              <el-input
                style="width: 240px"
                v-model="keyword"
                placeholder="请输入搜索关键字"
                @change="search"
                suffix-icon="el-icon-search"
                clearable
              ></el-input>
            </div>
          </div>
          <div>
            <!-- @afterQuery="afterTaskListQuery" -->
            <baseTable ref="taskListTable" :table-data="taskList" :type="null" propHeight="425px">
              <template v-slot:reportWorkName="row">
                <div v-if="row.item.taskStatus == 3">
                  {{ row.item.reportWorkName }}
                  <el-tag type="danger" effect="dark">待归档</el-tag>
                </div>
                <div v-else>{{ row.item.reportWorkName }}</div>
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
                    <el-col :span="12">
                      <el-button v-show="row.item.taskStatus == 4" type="text" style="width: 100px" @click="goToArchiveDetails(row)">>>归档详情</el-button>
                      <el-button v-show="row.item.taskStatus == 3" type="text" style="width: 100px" @click="goToArchive(row)">>>去归档</el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-tooltip class="item" effect="dark" content="任务详情" placement="bottom">
                        <svg-icon :icon-class="'detials-icon'" style="height: 1.5em; width: 1.5em; margin-right: 20px" @click="goToTaskDetails(row)" />
                      </el-tooltip>
                      <el-tooltip v-if="row.item.taskStatus !== 0" class="item" effect="dark" content="编辑" placement="bottom">
                        <svg-icon :icon-class="'edit-disabled-icon'" style="height: 1.5em; width: 1.5em; margin-right: 20px" />
                      </el-tooltip>
                      <el-tooltip v-else class="item" effect="dark" content="编辑" placement="bottom">
                        <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em; margin-right: 20px" @click="editReportTask(row)" />
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                        <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em" @click="goToDelete(row)" />
                      </el-tooltip>
                    </el-col>
                    <!-- <el-col :span="6">
                      <el-button type="text" style="width: 100px" @click="goToTaskDetails(row)">任务详情</el-button>
                    </el-col>
                    <el-col :span="5">
                      <el-button :disabled="row.item.taskStatus !== 0" type="text" style="width: 100px" @click="editReportTask(row)">编辑</el-button>
                    </el-col>
                    <el-col :span="5"><el-button type="text" style="width: 100px" @click="goToDelete(row)">删除</el-button></el-col> -->
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
          { label: '任务名称', prop: 'reportWorkName', slotName: 'reportWorkName', width: '260px' },
          { label: '简介', prop: 'intro' },
          { label: '创建人', prop: 'managerName', width: '80px' },
          { label: '创建时间', prop: 'createTime', width: '90px' },
          { label: '开始填报时间', prop: 'reportStartTime', width: '100px' },
          { label: '填报天数', prop: 'reportDay', width: '80px' },
          { label: '提醒频率', prop: 'frequency', width: '80px' },
          { label: '任务状态', prop: 'taskStatus', slotName: 'taskStatus', width: '80px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/workload/selectReportPage'
      }
    }
  },

  mounted() {
    // console.log(this.$store.state.user.empId)
    this.selectTaskList({ empId: this.empId })
    this.selectTaskAmount()
  },
  created() {
    this.empId = this.$store.state.user.empId
  },
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
            message = '该任务待开始填报,确定删除吗?删除后该任务下的报工将作废!'
            break
          case 1:
            message = '该任务正在填报中,确定删除吗?删除后该任务下的报工将作废!'
            break
          case 2:
            message = '该任务正在确认中,确定删除吗?删除后该任务下的报工将作废!'
            break
          case 3:
            message = '该任务待归档,确定删除吗?删除后该任务下的报工将作废!'
            break
          case 4:
            message = '该任务已归档,确定删除吗?删除后该任务下的报工将作废!'
            break
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
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
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
::v-deep .el-tag {
  height: 20px;
  line-height: 20px;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border-bottom: none;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
::v-deep .el-tabs--border-card {
  border: none;
}
::v-deep .el-input__icon {
  line-height: 30px;
}
.management-header {
  height: 100px;
  background: white;
  .type-area {
    height: 100%;
    margin: 0 24px;
    border-top: 1px solid #f2f3f5;
    .management-content {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 130px;
    }
  }
  .management-item {
    width: 208px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #f2f3f5;
    img {
      width: 54px;
      height: 54px;
    }
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
  margin-top: 24px;
  .table-top {
    margin: 0 24px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
