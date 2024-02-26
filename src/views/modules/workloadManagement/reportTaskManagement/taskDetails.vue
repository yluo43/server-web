<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div class="header-title">工作量统计：{{ taskInfo.reportWorkName }}</div>
          <div>{{ taskInfo.intro }}</div>
          <div class="row-box">
            <div>
              <span>部门:</span>
              <span>{{ taskInfo.deptNames }}</span>
            </div>
            <div>
              <span>统计团队:</span>
              <span>{{ teamCount }}</span>
            </div>
            <div>
              <span>统计成员:</span>
              <span>{{ totalCount }}</span>
            </div>
            <div>
              <span>填报天数:</span>
              <span>{{ taskInfo.reportDay }}</span>
            </div>
            <div>
              <span>确定天数:</span>
              <span>{{ taskInfo.affirmDay }}</span>
            </div>
            <div>
              <span>归档天数:</span>
              <span>{{ taskInfo.pigeonholeDay }}</span>
            </div>
            <div>
              <span>提醒频率:</span>
              <span>{{ taskInfo.frequency }}小时(9:00-18:00)</span>
            </div>
          </div>
          <div class="status">
            <p>任务状态:</p>
            <div style="width: 60%">
              <el-steps :active="active" finish-status="success">
                <el-step title="待填报"></el-step>
                <el-step title="填报中"></el-step>
                <el-step title="确认中"></el-step>
                <el-step title="待归档"></el-step>
                <el-step title="已归档"></el-step>
              </el-steps>
            </div>
          </div>
        </div>

        <div class="table">
          <div class="table-title">填报团队</div>
          <div>
            <baseTable ref="taskDetialTable" :table-data="taskDetial" :type="null" @afterQuery="afterTeamListQuery" style="margin-top: 10px"></baseTable>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
export default {
  components: { baseTable },
  props: {},
  data() {
    return {
      active: 1,
      taskInfo: {},
      teamCount: 0,
      totalCount: 0,
      taskDetial: {
        theads: [
          { label: '团队名称', prop: 'teamName' },
          { label: '团队负责人', prop: 'managerName' },
          { label: '团队编码', prop: 'teamId' },
          { label: '驻地', prop: 'stationName' },
          { label: '归属部门', prop: 'deptName' },
          { label: '团队成员', prop: 'teamNum' }
        ],
        url: '/team/selectTeamPage'
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    //初始化数据
    init(initData) {
      this.active = initData.taskStatus
      Object.assign(this.taskInfo, initData)
      this.selectPersonCount({ deptIds: this.taskInfo.deptIds, curPage: 1, pageSize: 10 })
      this.selectTableData()
    },
    //查询表格数据
    selectTableData() {
      this.$refs.taskDetialTable.refresh({ deptIds: this.taskInfo.deptIds })
    },
    //查询部门下的总人数
    selectPersonCount(params) {
      this.$http({
        url: this.$http.adornUrl('/employee/selectEmployeeListWithPage'),
        method: 'get',
        params: params
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.totalCount = data.payload.totalCount
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    afterTeamListQuery() {
      let data = this.$refs.taskDetialTable.options.data.payload
      this.teamCount = data.totalCount
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
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
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin-left: -20px;
    padding-left: 20px;
  }
  .status {
    display: flex;
    align-items: flex-start;
    margin-top: 20px;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
  border: 1px solid lightgray;
  .table-title {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
    padding-left: 20px;
    font-weight: 600;
  }
}
</style>
