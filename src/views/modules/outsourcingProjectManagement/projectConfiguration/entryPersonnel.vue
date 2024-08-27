<template>
  <div class="main-box">
    <baseTable :tableData="tableData" ref="table" :multiSelect="true" @selectData="selectData">
      <template v-slot:clientType="row">
        <!--类型插槽-->
        <template>
          <el-tooltip class="item" effect="dark" content="离场" placement="bottom">
            <svg-icon :icon-class="'detials-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="goToDetails(row.item)" />
          </el-tooltip>
        </template>
      </template>
    </baseTable>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
export default {
  components: { baseTable },
  props: {},
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
          { label: '在离职状态', prop: '' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
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
