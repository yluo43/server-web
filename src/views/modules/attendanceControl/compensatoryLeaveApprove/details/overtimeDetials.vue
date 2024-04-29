<template>
  <div style="width: 100%; height: 100%">
    <div>
      <baseTable :tableData="tableData" :type="null" ref="table">
        <template v-slot:overtimeType="row">
          <span v-if="row.item.overtimeType == 0">日常加班</span>
          <span v-else>节假日加班</span>
        </template>
        <template v-slot:isRemoteWork="row">
          <span v-if="row.item.isRemoteWork == 0">否</span>
          <span v-else>是</span>
        </template>
      </baseTable>
    </div>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTable.vue'
export default {
  components: { baseTable },

  data() {
    return {
      tableData: {
        theads: [
          { label: '加班项目', prop: 'projectName' },
          { label: '加班开始时间', prop: 'startTime' },
          { label: '加班结束时间', prop: 'endTime' },
          { label: '加班类型', prop: 'overtimeType', slotName: 'overtimeType' },
          { label: '加班时长(小时)', prop: 'overtimeHours' },
          { label: '是否居家办公', prop: 'isRemoteWork', slotName: 'isRemoteWork' },
          { label: '申请时间', prop: 'createTime' },
          { label: '审批通过时间', prop: 'reTrialTime' }
        ],
        url: '/attendance/overtimeDetailByEmp'
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    init(empId) {
      this.empId = empId
      this.selectTableData()
    },
    //表格查询
    selectTableData() {
      this.$refs.table.refresh({ empId: this.empId })
    }
  }
}
</script>

<style scoped></style>
