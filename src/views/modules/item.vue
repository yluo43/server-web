<template>
  <div style="height: 100%;">
    <el-container >
      <el-header >
        <el-form :inline="true"   :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="项目内容:" prop="name">
              <el-input v-model="dataForm.projectContent" placeholder="请输入项目内容" clearable></el-input>
            </el-form-item>

            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
            <el-button type="danger" @click="resetForm()" style="margin-right: 10px">重置</el-button>
          </div>
        </el-form>
      </el-header>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @refresh="refresh">
        <template v-slot:clientType2="row">
          <!--类型插槽-->
          <template>
            <div v-if ="row.item.type===null">
            <el-tag type="primary" @click="updateType(0,row.item.paymentId)">单项项目</el-tag>
            <el-tag type="primary" @click="updateType(1,row.item.paymentId)">框架项目</el-tag>
            </div>
          </template>
        </template>
      </baseTable>
    </el-container>

    <baseDialog :title="titles" ref="batchAddDialog" :width="'500px'" :height="'300px'">
      <template>
        <batchAdd :refreshDataList="refresh" ref="batchAdd" ></batchAdd>
      </template>
    </baseDialog>
  </div>
</template>
<script>

import baseTable from './base/baseTable.vue'
import baseTableNoSelect from './base/baseTableNoSelect.vue'
import baseDialog from './base/baseDialog.vue'
import baseUpload from './base/baseUpload.vue'
export default {
  data() {
    let that = this
    return {
      titles: '',
      uploadFile: [],
      imageBaseUrl: [],
      contractNo:'',
      dataForm: {
        projectName: '',
        projectContent:'',//项目内容
      },
      tableData: {
        theads: [
          { label: '项目名称', prop: 'projectName',fixed:'left' ,width:'95px'},
          { label: '项目内容', prop: 'projectContent' },
          { label: '规格型号', prop: 'size' },
          { label: '数量', prop: 'number' },
          { label: '单位', prop: 'department' },
          { label: '税率', prop: 'taxRate' },
          { label: '含税单价', prop: 'unitPriceInclude' },
          { label: '不含税单价', prop: 'unitPriceNotInclude' },
          { label: '不含税总金额', prop: 'extraNotInclude' },
          { label: '含税总金额', prop: 'extraInclude' },
          { label: '备注', prop: 'remark' },
          { label: '创建时间', prop: 'createTime',fixed:'right' },
          { label: '操作', prop: '', slotName: 'clientType2',width: '200px' ,fixed:'right'}
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
    baseUpload
  },
  mounted() {
    this.refresh()
  },
  methods: {
    init(projectName){
      this.dataForm.projectName = projectName
      this.refresh()
    },
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
          url: that.$http.adornUrl("/payment/item/list"),
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
    teamwork(){
      this.$refs.factoryDialog.show()
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    deriveExcel() {
      this.$refs.uploadFile.click()
    },
    // 添加标签
    updateType(type,paymentId) {
      debugger
      this.$http({
        url: this.$http.adornUrl('/payment/update'),
        method: 'post',
        data: {type:type,paymentId:paymentId}
      }).then(({ data }) => {
        if (data.success) {
          this.$message.success("定义成功")
          this.refresh()
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>


</style>

