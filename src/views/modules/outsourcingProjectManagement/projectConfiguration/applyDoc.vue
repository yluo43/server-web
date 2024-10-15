<template>
  <div class="container">
    <el-button type="primary" style="width: 100px;margin-block: 10px" @click="outDoc">导出结算单</el-button>
    <div class="projectName-header">
      <el-header style="height: auto; padding: 0">
        <el-form
          ref="entryPersonnelForm"
          :inline="true"
          label-width="auto"
          label-position="left"
        >
          <h1>订单信息</h1>
          <div style="display: flex;width: 100%;justify-content: space-between;">
            <el-form-item style="width:  400px" label="项目名称:" prop="name">
              {{ initData.name }}
            </el-form-item>
            <el-form-item style="width:  400px" label="合同编号:" prop="contractCode">
              {{ initData.contractCode }}
            </el-form-item>
            <el-form-item style="width:  400px" label="项目开始日期:" prop="startTime">
              {{ initData.startTime }}
            </el-form-item>
          </div>
          <div style="display: flex;width: 100%;justify-content: space-between;">
            <el-form-item style="width:  400px" label="订单名称:" prop="name">
              {{ order.name }}
            </el-form-item>
            <el-form-item style="width:  400px" label="订单编号:" prop="code">
              {{ order.code }}
            </el-form-item>
            <el-form-item style="width:  400px" label="订单开始日期:" prop="startTime">
              {{ order.startTime }}
            </el-form-item>
          </div>
        </el-form>
      </el-header>
    </div>
    <div class="projectTable">
      <h1>订单明细</h1>
      <baseTable ref="table" :table-data="tableData" :hide-page="true" :show-num="true"/>
      <div style="margin-top:50px;width: 100%; margin-bottom: 20px; display: flex; justify-content: right">
        <div> 总计金额（不含税）：{{sumMoney}}元</div>
      </div>
      <div style="width: 100%; margin-bottom: 20px; display: flex; justify-content: right">
        <div> 总计金额（含税）：{{taxSumMoney}}元</div>
      </div>
    </div>

  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableNoSelect.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addPerson from './addPerson.vue'

export default {
  components: { baseTable, baseDialog, addPerson },
  props: {},
  data() {
    return {
      editRules: {
        startDate: [{ required: true, message: '请选择投入开始日期', trigger: ['blur', 'change'] }],
        postIndex: [{ required: true, message: '请选择人员岗位', trigger: ['blur', 'change'] }],
        postId: [{ required: true, message: '请选择人员等级', trigger: ['blur', 'change'] }]
      },
      showFlag: false,
      teamMembers: [],
      importData: {},
      editData: {},
      tableData: {
        theads: [
          { label: '姓名', prop: 'name' },
          { label: '入场标记', prop: 'entryMarkName' },
          { label: '岗位', prop: 'postName' },
          { label: '级别', prop: 'level' },
          { label: '投入开始日期', prop: 'intoStartTime' },
          { label: '投入结束日期', prop: 'intoEndTime' },
          { label: '单价（不含税/元）', prop: 'unitPrice' },
          { label: '税率（%）', prop: 'taxRate' },
          { label: '单价（含税/元）', prop: 'taxUnitPrice' },
          { label: '类型（天）', prop: 'type' },
          { label: '工作量（天）', prop: 'workload' },
          { label: '费用（不含税/元）', prop: 'cost' },
          { label: '费用（含税/元）', prop: 'taxCost' },
        ],
        url: ''
      },
      jobListDetail: {},
      planExitTime: [],
      deptList: [],
      jobList: [],
      levelNameList: [],
      deleteIds: [],
      sumMoney: '',
      taxSumMoney: '',
      fakeData: {
        page: {
          curPage: 1,
          pageSize: 10,
          totalPage: 1,
          list: [{
            name: '陈小明',
            entryMark: '真实入场',
            postName: 'java开发工程师',
            level: '中级',
            intoStartTime: '2024-04-01',
            intoEndTime: '2024-06-30',
            unitPrice: '1000',
            taxRate: '6',
            taxUnitPrice: '1060',
            type: '1',
            workload: '45',
            cost: '45000',
            taxCost: '47700'
          }],
          totalCount: 1
        }
      },
      order: {
        name: '',
        code: '',
        startTime: ''
      },
      initData: {
        name: '',
        contractCode: '',
        startTime: ''
      }
    }
  },
  mounted() {
    this.getDept()
  },
  methods: {
    outDoc() {
      this.$http.downloadPost(this.$http.adornUrl('/itemProcurement/export/purchaseOrder'),{})
    },
    // 返回上一级页面
    handlerFlag() {
      this.$emit('changeFlag')
    },
    // 获取所属部门
    getDept() {
      this.$http({
        url: this.$http.adornUrl('/common/getDeptByRole'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.deptList = data.payload.filter((item) => item.id !== 0)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取岗位信息
    getJob() {
      this.$http({
        url: this.$http.adornUrl('/externalProject/listProjectUnitPrice?projectId=' + this.initData.id),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.jobList = [...new Set(data.payload.list.map(item => item.name))]
          this.levelNameList = [...new Set(data.payload.list.map(item => item.level))]
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    confirm() {

    },
    refresh() {
      this.$refs.table.refresh()
    },
    initProject() {
      // 人员岗位和level
      this.$http({
        url: this.$http.adornUrl('/externalProject/listProjectUnitPrice?projectId=' + this.initData.id),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          Object.assign(this.jobListDetail, data.payload.list.reduce((acc, item) => {
            // 如果acc中还没有这个name，就添加一个新对象
            if (!acc[item.name]) {
              acc[item.name] = { name: item.name, levels: [{ postId: item.id, level: item.level }] }
            } else {
              // 如果已经有了，就把level添加到levels数组中
              acc[item.name].levels.push({ postId: item.id, level: item.level })
            }
            return acc
          }, {}))
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    init(order, initData) {
      Object.assign(this.order, order)
      Object.assign(this.initData, initData)
      this.getJob()
      // 塞假数据
      // this.$refs.table.fakeData(this.fakeData)
      this.getTableData(order.id)
      // this.refresh()
    },
    getTableData(orderId){
      this.$http({
        url: this.$http.adornUrl('/externalProject/listProjectOrderStatement?orderId=' + orderId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.fakeData.page.list = data.payload.orderList
          this.sumMoney = data.payload.sumMoney
          this.taxSumMoney = data.payload.taxSumMoney
          this.$refs.table.fakeData(this.fakeData)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 添加订单
    addOrder(row) {
      this.$refs.addOrderDialog.show()
    },
    edit() {
      this.$refs.editDialog.show()
    },
    importPerson() {
      this.$refs.importDialog.show()
    },
    cancel() {
      this.$refs.addOrderDialog.hide()
      this.$refs.importDialog.hide()
      this.$refs.editDialog.hide()
    },
    remove() {
      this.$confirm(`确定删除此订单人员吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/userInfo/del'),
            method: 'post',
            data: userIds
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(data.msg)
            }
          })
          this.refresh()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetForm() {
      this.$refs.entryPersonnelForm.resetFields()
      this.queryParams.projectId = this.initData.id
      this.planExitTime = []
      this.entryTime = []
      this.refresh()
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  height: 100%;

  .projectName-header {
    padding: 24px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    margin-bottom: 20px;
    align-items: center;
  }
  .projectTable {
    padding: 24px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 20px;
    align-items: center;
  }

  .entry-header {
    padding: 24px 0 0 24px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
  }

  .search-form {
    margin-top: 20px;
  }
}

</style>
