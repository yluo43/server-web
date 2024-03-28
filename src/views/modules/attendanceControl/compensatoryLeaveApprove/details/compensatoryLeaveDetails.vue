<template>
  <div style="width: 100%; height: 100%">
    <div>
      <baseTable :tableData="tableData" ref="table" @select="checkedTable">
        <template v-slot:clientType="row">
          <template>
            <el-button type="text" @click="pass(row)">通过</el-button>
            <el-button type="text" @click="reject(row)">驳回</el-button>
            <el-button type="text" @click="view(row)">查看</el-button>
          </template>
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
          { label: '用户姓名', prop: 'name' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'managerName' },
          { label: '归属团队', prop: 'startConfirmTime' },
          { label: '加班开始时间', prop: 'affirmDay' },
          { label: '加班结束时间', prop: 'affirmDay' },
          { label: '加班类型', prop: 'affirmDay' },
          { label: '加班时长', prop: 'affirmDay' },
          { label: '是否居家办公', prop: 'affirmDay' },
          { label: '加班原因', prop: 'affirmDay' },
          { label: '申请时间', prop: 'affirmDay' },
          { label: '审批状态', prop: 'taskStatus', slotName: 'taskStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
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
