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
          { label: '补贴项目', prop: 'projectName' },
          { label: '补贴天数', prop: 'affirmDay' },
          { label: '添加时间', prop: 'affirmDay' }
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
