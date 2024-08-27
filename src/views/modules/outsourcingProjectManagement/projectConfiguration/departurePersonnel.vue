<template>
  <div class="main-box">
    <baseTable :tableData="tableData" ref="table" :multiSelect="true" @selectData="selectData"></baseTable>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
export default {
  components: { baseTable },
  data() {
    return {
      tableData: {
        theads: [
          { label: '工号', prop: 'empId' },
          { label: '姓名', prop: 'name' },
          { label: '部门', prop: '' },
          { label: '岗位', prop: '' },
          { label: '级别', prop: '' },
          { label: '入场日期', prop: '' },
          { label: '计划离场日期', prop: '' },
          { label: '入场标记', prop: '' },
          { label: '入场原因', prop: '' },
          { label: '在离职状态', prop: '' }
        ],
        url: ''
      }
    }
  },

  mounted() {},
  methods: {
    refreshTable(params) {
      this.$refs.table.refresh(params)
    }
  }
}
</script>
<style scoped lang="scss">
.main-box {
  height: 100%;
  margin-top: 24px;
}
</style>
