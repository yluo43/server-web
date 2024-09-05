<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div>
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick" style="padding: 24px">
          <el-tab-pane label="任务填报" name="first"></el-tab-pane>
          <el-tab-pane label="任务跟踪" name="second"></el-tab-pane>
          <el-tab-pane label="任务详情" name="third"></el-tab-pane>
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
                    <span class="font-bold">{{ waitCount }}</span>
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
                    <span class="font-bold">{{ monthCount }}</span>
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
                    <span class="font-bold">{{ yearCount }}</span>
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
                @change="selectTaskList"
                suffix-icon="el-icon-search"
                clearable
              ></el-input>
            </div>
          </div>
          <div>
            <baseTable ref="taskListTable" :table-data="taskList" :type="null" propHeight="425px">
              <template v-slot:reportWorkName="row">
                <div v-if="row.item.taskStatus == 1 || (row.item.taskStatus == 2 && row.item.hasReject > 0)">
                  {{ row.item.reportWorkName }}
                  <el-tag type="danger" effect="dark">待填报</el-tag>
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
                <template v-if="row.item.taskStatus == 2 && row.item.hasReject == 0">
                  <span>确认中</span>
                </template>
                <template v-if="row.item.taskStatus == 2 && row.item.hasReject > 0">
                  <span>存在驳回记录</span>
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
                <el-button :disabled="row.item.taskStatus != 1" type="text" @click="goToReportingWorkload(row)" style="width: 100px">填报工作量</el-button>
                <el-button
                  :disabled="row.item.taskStatus == 0 || row.item.taskStatus == 1 || row.item.taskStatus == 4"
                  type="text"
                  style="width: 100px"
                  @click="goToTrack(row)"
                >
                  去跟踪
                </el-button>
                <el-button :disabled="row.item.taskStatus == 0 || row.item.taskStatus == 1" type="text" style="width: 100px" @click="goToShowDetails(row)">
                  查看详情
                </el-button>
              </template>
            </baseTable>
          </div>
        </div>
      </el-main>
      <!-- 任务跟踪 -->
      <div v-if="activeName === 'second'">
        <taskTracking ref="taskTracking"></taskTracking>
      </div>
      <!-- 任务详情 -->
      <div v-if="activeName === 'third'">
        <taskDetails ref="taskDetails"></taskDetails>
      </div>
    </el-container>
    <!-- 工作量填报 -->
    <base-dialog ref="reportingWorkloadDialog" title="工作量填报" :width="clientX">
      <template>
        <reportingWorkload ref="reportingWorkload" @successShow="successShow" @refresh="selectTaskList" :cancelDialog="closeDialog"></reportingWorkload>
      </template>
    </base-dialog>

    <!-- 提交成功 -->
    <!-- :cancelDialog="closeSuccessDialog" -->
    <base-dialog ref="successDialog" :width="'500px'">
      <template>
        <successDialog ref="success" :cancelDialog="closeSuccessDialog" @track="goTrack"></successDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import taskTracking from '@/views/modules/workloadManagement/teamWorkload/taskTracking.vue'
import taskDetails from '@/views/modules/workloadManagement/teamWorkload/taskDetails.vue'
import reportingWorkload from '@/views/modules/workloadManagement/teamWorkload/reportingWorkload.vue'
import successDialog from '@/views/modules/workloadManagement/teamWorkload/successDialog.vue'
export default {
  components: { baseTable, baseDialog, taskTracking, taskDetails, reportingWorkload, successDialog },
  props: {},
  data() {
    return {
      activeName: 'first',
      taskFlag: 'true',
      radio: 1,
      keyword: '',
      waitCount: '',
      monthCount: '',
      yearCount: '',
      taskStatus: '',
      taskList: {
        theads: [
          { label: '任务名称', prop: 'reportWorkName', slotName: 'reportWorkName', width: '260px' },
          { label: '简介', prop: 'intro' },
          { label: '创建人', prop: 'managerName', width: '80px' },
          { label: '填报团队', prop: 'teamName' },
          { label: '开始填报时间', prop: 'reportStartTime', width: '100px' },
          { label: '填报天数', prop: 'reportDay', width: '80px' },
          { label: '任务状态', prop: 'taskStatus', slotName: 'taskStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '260px' }
        ],
        url: '/teamWork/teamTaskList'
      }
    }
  },
  mounted() {
    this.selectTaskList()
    this.getMyTaskCount()
  },
  computed: {
    clientX() {
      let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (clientWidth > 1600) {
        return '1400px'
      } else if (clientWidth > 1400) {
        return '1200px'
      } else {
        return '1000px'
      }
    }
  },
  created() {
    console.log(this.clientX)
  },
  methods: {
    //查询表格数据
    selectTaskList() {
      const params = {
        reportWorkName: this.keyword,
        taskStatus: this.taskStatus
      }
      this.$refs.taskListTable.refresh(params)
    },
    checkStatus(row) {
      if (row.item.taskStatus == 2 && row.item.hasReject > 0) {
        return false
      }
      if (row.item.taskStatus != 1) {
        return true
      }
    },
    //获取代办信息
    getMyTaskCount() {
      this.$http({
        url: this.$http.adornUrl('/teamWork/getMyTaskCount'),
        method: 'get',
        params: { type: 0 }
      }).then(({ data }) => {
        if (data && data.code == 200) {
          this.waitCount = data.payload.waitCount
          this.monthCount = data.payload.monthCount
          this.yearCount = data.payload.yearCount
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    successShow(params) {
      this.selectTaskList()
      this.$refs.successDialog.show()
      this.$nextTick(() => {
        this.$refs.success.init(params)
      })
    },
    goTrack(params) {
      this.closeSuccessDialog()
      this.activeName = 'second'
      this.$nextTick(() => {
        this.$refs.taskTracking.init(params)
      })
    },
    //切换tab
    tabClick(params) {
      if (this.activeName === 'first') {
        this.$nextTick(() => {
          this.selectTaskList()
        })
      }
      if (this.activeName === 'second') {
        this.$nextTick(() => {
          this.$refs.taskTracking.initTable()
        })
      }
      if (this.activeName === 'third') {
        this.$nextTick(() => {
          this.$refs.taskDetails.initTable()
        })
      }
    },
    //切换radio
    handlerRadio() {
      if (this.radio == 1) {
        this.taskStatus = ''
      } else {
        this.taskStatus = this.radio - 2
      }
      this.selectTaskList()
    },
    //填报工作量
    goToReportingWorkload(row) {
      this.$refs.reportingWorkloadDialog.show()
      this.$nextTick(() => {
        this.$refs.reportingWorkload.init(row.item)
      })
    },
    //去跟踪
    goToTrack(row) {
      this.activeName = 'second'
      this.$nextTick(() => {
        this.$refs.taskTracking.init(row.item)
      })
    },
    //查看详情
    goToShowDetails(row) {
      this.activeName = 'third'
      this.$nextTick(() => {
        this.$refs.taskDetails.init(row.item)
      })
    },
    //关闭弹窗
    closeDialog() {
      this.$refs.reportingWorkloadDialog.hide()
    },
    //关闭提交成功弹窗
    closeSuccessDialog() {
      this.$refs.successDialog.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
::v-deep .el-tag {
  height: 18px;
  line-height: 18px;
  padding: 0 3px;
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
