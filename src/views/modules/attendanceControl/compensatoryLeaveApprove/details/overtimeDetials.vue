<template>
  <div style="width: 100%; height: 100%">
    <div>
      <baseTable :tableData="tableData" :type="null" ref="table"></baseTable>
    </div>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTable.vue'
export default {
  components: { baseTable },
  props: {
    empId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableData: {
        theads: [
          { label: '加班项目', prop: 'projectName' },
          { label: '加班开始时间', prop: 'startTime' },
          { label: '加班结束时间', prop: 'endTime' },
          { label: '加班类型', prop: 'overtimeType' },
          { label: '加班时长', prop: 'overtimeHours' },
          { label: '是否居家办公', prop: 'isRemoteWork' },
          { label: '申请时间', prop: 'createTime' },
          { label: '审批通过时间', prop: 'approveTime' }
        ],
        url: '/projectWork/projectTaskList'
      }
    }
  },
  mounted() {
    this.selectTableData()
  },
  created() {},
  methods: {
    //表格查询
    selectTableData() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped></style>
