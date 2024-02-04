<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-header style="padding: 0 10px 0 16px">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="任务填报" name="first"></el-tab-pane>
          <el-tab-pane label="任务跟踪" name="second"></el-tab-pane>
          <el-tab-pane label="任务详情" name="third"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main style="width: 100%" class="main" v-if="activeName === 'first'">
        <div class="management-header">
          <div class="management-item">
            <p>我的待办</p>
            <p class="font-bold">
              <span>8</span>
              个任务
            </p>
          </div>
          <div class="management-item">
            <p>本月完成任务数</p>
            <p class="font-bold">
              <span>8</span>
              个任务
            </p>
          </div>
          <div class="management-item border-none">
            <p>本年完成任务数</p>
            <p class="font-bold">
              <span>8</span>
              个任务
            </p>
          </div>
        </div>
        <div class="table">
          <el-row style="display: flex; align-items: center">
            <el-col :span="10">
              <div style="display: flex; align-items: center">
                <p style="font-size: 16px; font-weight: 600; margin-left: 10px">任务列表</p>
                <el-button type="text" @click="goToReportingWorkload(row)">>>填报工作量</el-button>
                <el-button type="text" @click="goToTrack(row)">>>去跟踪</el-button>
                <el-button type="text" @click="goToShowDetails(row)">查看详情</el-button>
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
              <!-- 操作 -->
              <template v-slot:clientType="row">
                <template>
                  <el-button type="text" @click="goToReportingWorkload(row)">>>填报工作量</el-button>
                  <el-button type="text" @click="goToTrack(row)">>>去跟踪</el-button>
                  <el-button type="text" @click="goToShowDetails(row)">查看详情</el-button>
                </template>
              </template>
            </baseTable>
          </div>
        </div>
      </el-main>
      <!-- 任务跟踪 -->
      <div v-if="activeName === 'second'">
        <taskTracking></taskTracking>
      </div>
      <!-- 任务详情 -->
      <div v-if="activeName === 'third'">
        <taskDetails></taskDetails>
      </div>
    </el-container>
    <!-- 工作量填报 -->
    <base-dialog ref="reportingWorkloadDialog" title="工作量填报" :width="'1200px'">
      <template>
        <reportingWorkload ref="reportingWorkload" :cancelDialog="closeDialog"></reportingWorkload>
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
      radio: '1',
      keyword: '',
      taskList: {
        theads: [
          { label: '任务名称', prop: 'orderCode' },
          { label: '简介', prop: 'orderName' },
          { label: '开始填报时间', prop: 'projectName' },
          { label: '填报天数', prop: 'firstReviewer' },
          { label: '任务状态', prop: 'thirdReviewer' },
          { label: '操作', prop: 'clientType', slotName: 'clientType' }
        ],
        url: ''
      }
    }
  },
  mounted() {
    this.selectTaskList()
  },
  created() {},
  methods: {
    //搜索
    search() {},
    //查询
    selectTaskList() {
      this.$refs.taskListTable.refresh({ status: this.radio })
    },
    //切换radio
    handlerRadio() {
      this.selectTaskList()
    },
    //填报工作量
    goToReportingWorkload(row) {
      this.$refs.reportingWorkloadDialog.show()
      this.$nextTick(() => {
        this.$refs.reportingWorkload.init(row)
      })
    },
    //去跟踪
    goToTrack() {},
    //查看详情
    goToShowDetails() {},
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
