<template>
  <div style="height: 100%">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="加班明细" name="first"></el-tab-pane>
        <el-tab-pane label="调休明细" name="second"></el-tab-pane>
        <el-tab-pane label="补贴明细" name="third"></el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <!-- 加班明细-->
      <div v-if="activeName === 'first'">
        <overtimeDetials ref="overtimeDetials" :empId="empId"></overtimeDetials>
      </div>
      <!-- 调休明细-->
      <div v-if="activeName === 'second'">
        <compensatoryLeaveDetails ref="compensatoryLeaveDetails" :empId="empId"></compensatoryLeaveDetails>
      </div>
      <!-- 补贴-->
      <div v-if="activeName === 'third'">
        <subsidyDetails ref="subsidyDetails" :empId="empId"></subsidyDetails>
      </div>
    </div>
  </div>
</template>
<script>
import overtimeDetials from '@/views/modules/attendanceControl/compensatoryLeaveApprove/details/overtimeDetials.vue'
import compensatoryLeaveDetails from '@/views/modules/attendanceControl/compensatoryLeaveApprove/details/compensatoryLeaveDetails.vue'
import subsidyDetails from '@/views/modules/attendanceControl/compensatoryLeaveApprove/details/subsidyDetails.vue'
export default {
  components: { overtimeDetials, compensatoryLeaveDetails, subsidyDetails },
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {
      activeName: 'first',
      empId: ''
    }
  },
  mounted() {},
  created() {},
  methods: {
    init(initData) {
      this.empId = initData.empId
    }
  }
}
</script>

<style scoped>
::v-deep .el-tabs__nav-wrap::after {
  top: 0;
}
::v-deep .el-tabs__active-bar {
  top: 0;
}
</style>
