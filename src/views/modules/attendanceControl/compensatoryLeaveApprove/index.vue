<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-header style="padding: 0">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane v-if="hasPermission('attendance:overtimeFirst')" label="加班初审" name="first"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:overtimeRe')" label="加班复审" name="second"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:dayoffFirst')" label="调休初审" name="third"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:dayoffRe')" label="调休复审" name="fourth"></el-tab-pane>
          <el-tab-pane v-if="hasPermission('attendance:count')" label="加班统计" name="fifth"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container style="background: #ffffff">
        <!-- 加班初审-->
        <div v-if="activeName === 'first'">
          <overtimePreliminaryReview ref="overtimePreliminaryReview"></overtimePreliminaryReview>
        </div>
        <!-- 加班复审 -->
        <div v-if="activeName === 'second'">
          <overtimeReview ref="overtimeReview"></overtimeReview>
        </div>
        <!-- 调休初审 -->
        <div v-if="activeName === 'third'">
          <compensatoryLeavePreliminaryReview ref="compensatoryLeavePreliminaryReview"></compensatoryLeavePreliminaryReview>
        </div>
        <!-- 调休复审 -->
        <div v-if="activeName === 'fourth'">
          <compensatoryLeaveReview ref="compensatoryLeaveReview"></compensatoryLeaveReview>
        </div>
        <!-- 加班统计 -->
        <div v-if="activeName === 'fifth'">
          <overtimeStatistics ref="overtimeStatistics"></overtimeStatistics>
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import overtimePreliminaryReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/overtimePreliminaryReview.vue'
import overtimeReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/overtimeReview.vue'
import compensatoryLeavePreliminaryReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/compensatoryLeavePreliminaryReview.vue'
import compensatoryLeaveReview from '@/views/modules/attendanceControl/compensatoryLeaveApprove/compensatoryLeaveReview.vue'
import overtimeStatistics from '@/views/modules/attendanceControl/compensatoryLeaveApprove/overtimeStatistics.vue'
export default {
  components: {
    baseTable,
    baseDialog,
    overtimePreliminaryReview,
    overtimeReview,
    compensatoryLeavePreliminaryReview,
    compensatoryLeaveReview,
    overtimeStatistics
  },
  props: {},
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
