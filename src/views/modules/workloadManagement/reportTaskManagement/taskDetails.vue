<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div class="header-title">工作量统计：2024-1-1至2024-1-31</div>
          <div>简介简介</div>
          <div class="row-box">
            <div>
              <span>部门:</span>
              <span>产品拓展部</span>
            </div>
            <div>
              <span>统计团队:</span>
              <span>23</span>
            </div>
            <div>
              <span>统计成员:</span>
              <span>500</span>
            </div>
            <div>
              <span>填报天数:</span>
              <span>2</span>
            </div>
            <div>
              <span>确定天数:</span>
              <span>2</span>
            </div>
            <div>
              <span>归档天数:</span>
              <span>2</span>
            </div>
            <div>
              <span>提醒频率:</span>
              <span>2小时(9:00-18:00)</span>
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
            <baseTable ref="taskDetialTable" :table-data="taskDetial" :type="null" style="margin-top: 10px"></baseTable>
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
      taskDetial: {
        theads: [
          { label: '团队名称', prop: 'orderCode' },
          { label: '团队负责人', prop: 'orderName' },
          { label: '团队编码', prop: 'orderPrce' },
          { label: '驻地', prop: 'projectName' },
          { label: '归属部门', prop: 'firstReviewer' },
          { label: '团队成员', prop: 'secondReviewer' }
        ],
        url: ''
      }
    }
  },
  mounted() {},
  created() {},
  methods: {}
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
