<template>
  <div style="width: 100%; height: 100%">
    <div>
      <baseTable :tableData="tableData" ref="table" :type="null"></baseTable>
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
          { label: '调休开始时间', prop: 'startTime' },
          { label: '调休结束时间', prop: 'endTime' },
          { label: '调休天数', prop: 'dayoffDays' },
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
