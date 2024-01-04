<template>
  <div style="height: 100%;">
    <el-container style="height: 100%; border: 1px solid #eee">
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" type="" :hidePage="true">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tag type="primary" @click="examine(row)">查看</el-tag>
          </template>
        </template>
        <template v-slot:clientType1="row">
          <!--类型插槽-->
          <template>
            <el-tag type="primary" @click="choice(row)">选择</el-tag>
          </template>
        </template>
      </baseTable>
    </el-container>
    <baseDialog :title="titles" ref="examineDialog" :width="'800px'" :height="'600px'">
      <template>
        <examine @refreshDataList="refresh" ref="examine"></examine>
      </template>
    </baseDialog>
    <baseDialog :title="titles" ref="choiceDialog" :width="'550px'" :height="'800px'">
      <template>
        <choice @refreshDataList="refresh" ref="choice"></choice>
      </template>
    </baseDialog>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog.vue'
import examine from './examine.vue'
import choice from './choice.vue'
export default {
  data() {
    return {
      titles: '',
      dataForm: {
        // isbn: ''
      },
      tableData: {
        theads: [
          { label: '角色名称', prop: 'roleName' },
          { label: '创建时间', prop: 'createTime' },
          { label: '用户清单', prop: 'paperBookId', slotName: 'clientType' },
          { label: '绑定权限', prop: 'brandPriceYuan', slotName: 'clientType1' }
        ],
        // url: '/userRole/list'
        dataList: []
      }
    }
  },
  components: {
    baseTable, baseDialog, examine, choice
  },
  mounted() {
    // this.$refs.table.refresh(this.dataForm)
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let that = this
      this.$http({
        method: 'get',
        url: that.$http.adornUrl('/userRole/list'),
        params: that.$http.adornParams(this.dataForm)
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData.dataList.length = 0
          that.tableData.dataList.push(...data.payload)
        } else {
          that.$message.warning(data.msg)
        }
      })
    },
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },
    examine(row) {
      this.titles = '用户清单'
      this.$refs.examineDialog.show()
      this.$nextTick(() => {
        this.$refs.examine.init(row.item.roleId)
      })
    },
    choice(row) {
      this.titles = '绑定权限'
      this.$refs.choiceDialog.show()
      this.$nextTick(() => {
        this.$refs.choice.init(row.item.roleId)
      })
    },
  }
}
</script>
<style scoped>
  .el-header {
    color: #333;
    padding: 0 0;
  }
  .el-form--inline>.inputlist{
    padding-top: 20px;
    padding-left: 20px;
  }
  .el-form--inline>.inputlist>.el-form-item{
    width: 450px;
    margin-bottom: 20px;
  }
  .el-button{
    width: 90px;
    height: 40px;
  }
.el-table thead th{
  background: #cbe5ff !important;
  color: rgb(90, 89, 89);
  height: 45px;
  font-size: 15px;
  font-weight: 600;
}
</style>
