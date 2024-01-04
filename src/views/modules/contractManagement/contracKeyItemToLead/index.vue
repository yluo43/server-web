<template>
  <div style="height: 100%;">
    <el-container class="header-container">
      <el-header >
        <el-form :inline="true"   :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="订单名称:" prop="orderName">
              <el-input v-model="dataForm.orderName" placeholder="请输入订单名称" clearable></el-input>
            </el-form-item>

            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询</el-button>
            <el-button type="danger" @click="resetForm()" style="margin-right: 20px">重置</el-button>
            <el-button type="primary" @click="deriveExcel()" icon="el-icon-download" style="margin-right: 20px">导入Excel</el-button>
            <baseUpload
              name="uploadFile"
              ref="uploadFile"
              :url = "url"
              :accept="'.xls,.xlsx'"
              :file-list="uploadFile"
              :hideAllBtn="false"
            ></baseUpload>
          </div>
        </el-form>
      </el-header>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true"  @refresh="refresh">
        <template v-slot:clientType2="row">
          <!--类型插槽-->
          <template>
            <el-tag type="primary" @click="openOrder(row.item)">查看附属项目</el-tag>
          </template>
        </template>
      </baseTable>
    </el-container>

    <baseDialog :title="titles" ref="orderDialog" :width="'860px'" :height="'600px'">
      <template>
        <order   ref="order" ></order>
      </template>
    </baseDialog>


  </div>
</template>
<script>

import order from './order.vue'
import baseTable from '../../base/baseTable.vue'
import baseTableNoSelect from '../../base/baseTableNoSelect.vue'
import baseDialog from '../../base/baseDialog.vue'
import baseUpload from '../../base/baseUpload.vue'
export default {
  data() {
    let that = this
    return {
      titles: '附属项目',
      uploadFile: [],
      url: this.$http.adornUrl(`/itemProcurement/import`),
      imageBaseUrl: [],
      contractNo:'',
      dataForm: {
        orderName:'',//项目名称
      },
      tableData: {
        theads: [
          { label: '订单名称', prop: 'orderName',fixed:'left' ,width:'95px'},
          { label: '订单描述', prop: 'orderDescription' },
          { label: '项目实际金额', prop: 'realAmount' },
          { label: '项目合同金额', prop: 'contractAmount' },
          { label: '应付厂家金额', prop: 'payAmount'},
          { label: '厂家信息', prop: 'factory'},
          { label: '本期差额', prop: 'periodExtra'},
          { label: '累计金额', prop: 'accumulateExtra'},
          { label: '采购员', prop: 'purchaser'},
          { label: '付款方式', prop: 'payWay' },
          { label: '回款周期', prop: 'paymentPeriod'},
          { label: '时间', prop: 'date' },
          { label: '操作', prop: '', slotName: 'clientType2' ,fixed:'right'}
        ],
        // dataList: [{ paperBookName: '123456', isbn: '654321', paperBookName: 'firstBookName', paperBookName: 'thirdBookName', createTime: 'fifthBookName', modifyTime: 'seventhBookName', paperBookName: 'ninthBookName' }]
        dataList:[]
      },
    }
  },
  components: {
    baseTable,
    baseDialog,
    baseTableNoSelect,
    baseUpload,
    order
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh(curPage,pageSize) {
      let that=this;
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        let searchParams = {
          curPage:curPage?curPage:that.$refs.table.options.curPage,
          pageSize:pageSize?pageSize:that.$refs.table.options.pageSize
        }
        that.$refs.table.options.tableLoading = true
        this.$http({
          method: "get",
          url: that.$http.adornUrl("/itemProcurement/list"),
          params: that.$http.adornParams(Object.assign(this.dataForm,searchParams))
        }).then(({data}) => {
          that.$refs.table.options.tableLoading = false
          if(data && data.code === 200){
            this.tableData.dataList.length=0
            that.tableData.dataList.push(...data.payload.list);
            that.$refs.table.options.count=data.payload.totalCount
            that.$refs.table.options.pageSize=data.payload.pageSize
            that.$refs.table.clearSelection()
          }else{
            that.$message.warning(data.msg)
          }}).catch(error =>{
          that.$refs.table.options.tableLoading = false
        })
      })
    },
    openOrder(row) {
      this.$refs.orderDialog.show()
      this.$nextTick(() => {
        this.$refs.order.init(row.orderId)
      })
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    deriveExcel() {
      this.$refs.uploadFile.click()
    },
  }
}
</script>
<style scoped>



</style>
