<template>
  <div class="main-box">
    <div style="margin-bottom: 16px">
      <el-button v-auth="'costItems:export'" class="btn-download" type="primary" icon="el-icon-download" @click="batchDownload">批量下载</el-button>
      <el-button v-auth="'costItems:add'" class="btn-download" type="primary" icon="el-icon-circle-plus-outline" @click="addProjectInfo">添加人员</el-button>
    </div>
    <baseTable :tableData="tableData" ref="table" :multiSelect="true" @selectData="selectData">
      <template v-slot:clientType="row">
        <!--类型插槽-->
        <template>
          <el-button type="text" @click="departure(row.item)">离场</el-button>
          <!-- <el-tooltip class="item" effect="dark" content="离场" placement="bottom">
            <svg-icon :icon-class="'detials-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="departure(row.item)" />
          </el-tooltip> -->
        </template>
      </template>
    </baseTable>
    <baseDialog title="离场" ref="departureDialog" width="500px">
      <template>
        <departure ref="departure" @refreshTableData="selectTableData"></departure>
      </template>
    </baseDialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import departure from './departure.vue'
export default {
  components: { baseTable, baseDialog, departure },
  props: {},
  data() {
    return {
      count: 0,
      checkedIds: [],
      queryParams: {},
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
      this.queryParams = params
      this.$refs.table.refresh(this.queryParams)
    },
    selectTableData() {
      this.$nextTick(() => {
        this.$refs.table.refresh(this.queryParams)
      })
    },
    //选中的数据
    selectData(selection) {
      this.checkedIds = []
      if (selection.length > 0) {
        selection.forEach((item) => {
          this.checkedIds.push(item.id)
        })
        this.count = this.checkedIds.length
      } else {
        this.count = 0
      }
    },
    //批量下载
    batchDownload() {
      if (this.count === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let data = { ...this.queryParams, ids: this.checkedIds }
      Object.keys(data).map((key) => {
        if (!data[key]) {
          delete data[key]
        }
      })
      this.$http.downloadPost(this.$http.adornUrl('/attendance/export'), this.$http.adornParams(data), this)
    },
    //添加人员 跳转到外协项目入场管理页面
    addProjectInfo() {
      this.$router.push({
        path: '/projectEntryManagement'
      })
    },
    //离场
    departure(row) {
      this.$refs.departureDialog.show()
      this.$nextTick(() => {
        this.$refs.departure.init(row)
      })
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
