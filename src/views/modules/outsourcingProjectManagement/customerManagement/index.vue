<template>
  <div style="height: 100%">
    <el-container>
      <el-header style="height: 100%">
        <el-form :inline="true" label-width="60px" label-position="right" :model="dataForm" ref="dataForm">
          <el-form-item label="客户编号:" prop="customerNumber">
            <el-input v-model="dataForm.customerNumber" placeholder="请输入客户编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户名称:" prop="customerName">
            <el-input v-model="dataForm.customerName" placeholder="请输入客户名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="所属集团:" prop="membershipGroup">
            <el-input v-model="dataForm.membershipGroup" placeholder="请输入所属集团" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
            <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <div class="chooseResult">
        <span>已选中 {{ count }} 项</span>
      </div>
      <div class="operate-button">
        <el-button class="btn-download" icon="el-icon-download" type="primary" @click="download()" v-auth="'dailyCost:export'">批量下载</el-button>
        <el-button class="el-button-func" type="primary" icon="el-icon-circle-plus-outline" @click="addCustomer()">新建客户</el-button>
      </div>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @selectData="selectData">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="alter(row.item)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteItem(row.item)" />
            </el-tooltip>
          </template>
        </template>
      </baseTable>
    </el-container>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
export default {
  components: {
    baseTable
  },
  data() {
    return {
      count: 0,
      //选中的数据
      checkedIds: [],
      dataForm: {
        //客户编号
        customerNumber: '',
        //客户名称
        customerName: '',
        //所属集团
        membershipGroup: ''
      },
      tableData: {
        theads: [
          { label: '客户编号', prop: 'customerNumber' },
          { label: '客户名称', prop: 'customerName' },
          { label: '所属集团', prop: 'membershipGroup' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: ''
      }
    }
  },

  mounted() {
    this.refresh()
  },
  methods: {
    //查询表格
    refresh() {
      this.$refs.table.refresh(this.dataForm)
    },
    //重置表格
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //获取选中的数据
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
    download() {
      if (this.checkedIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let form = { ...this.dataForm }
      form.ids = this.checkedIds
      this.$http.downloadPost(this.$http.adornUrl('/dailyCost/export'), this.$http.adornParams(form), this)
    },
    //新建客户
    addCustomer() {},
    //编辑
    alter(row) {},
    deleteItem(row) {
      const message = `确定删除[${row.deptName}-${row.account}]${row.costDate}的日常费用(${row.reason}:${row.costName}:${row.totalMoney})记录吗？删除后将无法恢复!`
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(''),
            method: 'post',
            data: row.id
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  color: #333;
  padding: 0 0;
}
.el-input {
  width: 200px;
}
// ::v-deep .editForm .el-form-item__label {
//   width: 80px !important;
// }
// ::v-deep .editForm .el-form-item {
//   width: 100% !important;
// }
// ::v-deep .editForm .el-form-item__content {
//   width: calc(100% - 80px);
// }
// ::v-deep .searchForm .el-form-item__label {
//   text-align: justify;
//   text-align-last: justify;
// }
::v-deep .drawerForm {
  .el-form-item__label {
    width: 60px !important;
  }
  .el-form-item {
    width: 100% !important;
  }
  .el-form-item__content {
    width: calc(100% - 60px);
  }
  .el-input,
  .el-select {
    width: 100%;
  }
}

::v-deep .el-table__cell {
  text-align: center;
}
</style>
