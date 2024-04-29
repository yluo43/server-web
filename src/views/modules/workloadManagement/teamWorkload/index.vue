<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-header style="padding: 0">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
          <el-tab-pane label="任务填报" name="first"></el-tab-pane>
          <el-tab-pane label="任务跟踪" name="second"></el-tab-pane>
          <el-tab-pane label="任务详情" name="third"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main class="main" v-if="activeName === 'first'">
        <div class="management-header">
          <div class="management-item">
            <p>我的待办</p>
            <p class="font-bold">
              <span>{{ waitCount }}</span>
              个任务
            </p>
          </div>
          <div class="management-item">
            <p>本月完成任务数</p>
            <p class="font-bold">
              <span>{{ monthCount }}</span>
              个任务
            </p>
          </div>
          <div class="management-item border-none">
            <p>本年完成任务数</p>
            <p class="font-bold">
              <span>{{ yearCount }}</span>
              个任务
            </p>
          </div>
        </div>
        <div class="table">
          <el-row style="display: flex; align-items: center">
            <el-col :span="10">
              <div style="display: flex; align-items: center">
                <p style="font-size: 16px; font-weight: 600; margin-left: 10px">任务列表</p>
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
            <baseTable ref="taskListTable" :table-data="taskList" :type="null" style="margin-top: 10px">
              <template v-slot:reportWorkName="row">
                <div v-if="row.item.taskStatus == 1">
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
                <el-button :disabled="row.item.taskStatus != 1" type="text" @click="goToReportingWorkload(row)">填报工作量</el-button>
                <el-button :disabled="row.item.taskStatus == 0 || row.item.taskStatus == 1 || row.item.taskStatus == 4" type="text" @click="goToTrack(row)">
                  去跟踪
                </el-button>
                <el-button :disabled="row.item.taskStatus == 0 || row.item.taskStatus == 1" type="text" @click="goToShowDetails(row)">查看详情</el-button>
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
    <base-dialog ref="reportingWorkloadDialog" title="工作量填报" :width="'1200px'">
      <template>
        <reportingWorkload ref="reportingWorkload" :cancelDialog="closeDialog" @track="goTrack"></reportingWorkload>
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
export default {
  components: { baseTable, baseDialog, taskTracking, taskDetails, reportingWorkload },
  props: {},
  data() {
    return {
      activeName: 'first',
      taskFlag: 'true',
      radio: '1',
      keyword: '',
      waitCount: '',
      monthCount: '',
      yearCount: '',
      taskList: {
        theads: [
          { label: '任务名称', prop: 'reportWorkName', slotName: 'reportWorkName', width: '260px' },
          { label: '简介', prop: 'intro' },
          { label: '创建人', prop: 'managerName', width: '80px' },
          { label: '填报团队', prop: 'teamName' },
          { label: '开始填报时间', prop: 'reportStartTime', width: '100px' },
          { label: '填报天数', prop: 'reportDay', width: '80px' },
          { label: '任务状态', prop: 'taskStatus', slotName: 'taskStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/teamWork/teamTaskList'
      }
    }
  },
  mounted() {
    this.selectTaskList()
    this.getMyTaskCount()
  },
  created() {},
  methods: {
    //搜索框搜索
    search() {
      this.handlerRadio()
    },

    //查询表格
    selectTaskList(params) {
      this.$refs.taskListTable.refresh(params)
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
    goTrack(params) {
      this.activeName = 'second'
      this.$nextTick(() => {
        this.$refs.taskTracking.init(params)
      })
    },
    //切换tab
    tabClick(params) {
      if (this.activeName === 'first') {
        this.$nextTick(() => {
          this.handlerRadio()
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
        this.selectTaskList({ reportWorkName: this.keyword })
      } else {
        this.selectTaskList({ taskStatus: this.radio - 2, reportWorkName: this.keyword })
      }
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
::v-deep .el-button {
  min-width: 0;
  width: auto;
}
.main {
  width: 100%;
  padding: 0;

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
}
.table {
  background-color: white;
  margin-top: 10px;
}
</style>
