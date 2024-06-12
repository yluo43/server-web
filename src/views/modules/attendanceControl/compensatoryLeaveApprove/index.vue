<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div style="background: white; padding: 24px">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane v-if="hasPermission('attendance:overtimeFirst')" label="加班初审" name="first"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:overtimeRe')" label="加班复审" name="second"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:dayoffFirst')" label="调休初审" name="third"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:dayoffRe')" label="调休复审" name="fourth"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:count')" label="加班统计" name="fifth"></el-tab-pane>
        </el-tabs>
      </div>
      <el-container>
        <!-- 加班初审-->
        <div v-if="activeName === 'first'" style="width: 100%">
          <overtimePreliminaryReview ref="overtimePreliminaryReview"></overtimePreliminaryReview>
        </div>
        <!-- 加班复审 -->
        <div v-if="activeName === 'second'" style="width: 100%">
          <overtimeReview ref="overtimeReview"></overtimeReview>
        </div>
        <!-- 调休初审 -->
        <div v-if="activeName === 'third'" style="width: 100%">
          <compensatoryLeavePreliminaryReview ref="compensatoryLeavePreliminaryReview"></compensatoryLeavePreliminaryReview>
        </div>
        <!-- 调休复审 -->
        <div v-if="activeName === 'fourth'" style="width: 100%">
          <compensatoryLeaveReview ref="compensatoryLeaveReview"></compensatoryLeaveReview>
        </div>
        <!-- 加班统计 -->
        <div v-if="activeName === 'fifth'" style="width: 100%">
          <overtimeStatistics ref="overtimeStatistics"></overtimeStatistics>
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import overtimePreliminaryReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/overtimePreliminaryReview.vue'
import overtimeReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/overtimeReview.vue'
import compensatoryLeavePreliminaryReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/compensatoryLeavePreliminaryReview.vue'
import compensatoryLeaveReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/compensatoryLeaveReview.vue'
import overtimeStatistics from '@/views/modules/attendanceControl/compensatoryLeaveApprove/overtimeStatistics.vue'
export default {
  components: {
    overtimePreliminaryReview,
    overtimeReview,
    compensatoryLeavePreliminaryReview,
    compensatoryLeaveReview,
    overtimeStatistics
  },
  props: {},
  data() {
    return {
      activeName: ''
    }
  },
  mounted() {
    if (this.hasPermission('attendance:overtimeFirst')) {
      this.activeName = 'first'
    } else if (this.hasPermission('attendance:overtimeRe')) {
      this.activeName = 'second'
    } else if (this.hasPermission('attendance:dayoffFirst')) {
      this.activeName = 'third'
    } else if (this.hasPermission('attendance:dayoffRe')) {
      this.activeName = 'fourth'
    } else if (this.hasPermission('attendance:count')) {
      this.activeName = 'fifth'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border-bottom: none;
}
::v-deep .el-tabs--border-card {
  border: none;
}
</style>
