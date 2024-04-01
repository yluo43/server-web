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
          { label: '加班项目', prop: 'name' },
          { label: '加班开始时间', prop: 'empId' },
          { label: '加班结束时间', prop: 'managerName' },
          { label: '加班类型', prop: 'startConfirmTime' },
          { label: '加班时长', prop: 'affirmDay' },
          { label: '是否居家办公', prop: 'affirmDay' },
          { label: '申请时间', prop: 'affirmDay' },
          { label: '审批通过时间', prop: 'taskStatus' }
        ],
        url: '/projectWork/projectTaskList'
      }
    }
  },
  mounted() {
    console.log(this.empId)
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
