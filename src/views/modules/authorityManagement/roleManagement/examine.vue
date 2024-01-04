<template>
  <div style="height: 100%;">
    <el-container style="height: 100%; border: 1px solid #eee">
      <baseTable :tableData="tableData" ref="table" type="">
        <!-- 这个是自定义列字段 -->
        <template v-slot:status="row">
          <template v-if="row.item.status == 0">
            <el-tag type="success">正常</el-tag>
          </template>
            <template v-if="row.item.status == 1">
            <el-tag type="danger">冻结</el-tag>
          </template>
        </template>
      </baseTable>
    </el-container>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
export default {
  data() {
    return {
      ids: '',
      dataForm: {
        status: '0'
      },
      tableData: {
        theads: [
          { label: '用户账号', prop: 'account' },
          { label: '手机号', prop: 'phone' },
          { label: '邮箱', prop: 'mail' },
          { label: '开通时间', prop: 'createTime' },
          { label: '账号状态', prop: 'status', slotName: 'status' }
        ],
        url:"/userInfo/list",
      }
    }
  },
  components: {
    baseTable
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
        this.$refs.table.refresh(this.dataForm)
    },
    init(id) {
      this.dataForm.roleId = id
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    // 取消
    cancelDialog() {
      this.$parent.hide()
    }
  }
}
</script>
