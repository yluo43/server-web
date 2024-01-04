<template>
  <div id="contentBar">
    <el-container>
<!--      <el-form :inline="true" :model="dataForm" ref="dataForm">-->
<!--        <div class="inputlist" >-->
<!--            <el-form :inline="true" :model="dataForm" ref="dataForm">-->
<!--              &lt;!&ndash;配置内容&ndash;&gt;-->
<!--              <el-form-item label="搜索词:" :prop="dataForm.words">-->
<!--                <el-col :span="12">-->
<!--                  <el-input v-model="dataForm.words" style="width: 400px" placeholder="请输入检索关键词，支持多个（以逗号分隔）"></el-input>-->
<!--                </el-col>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--            <div style="margin-left: 20%">-->
<!--              <el-button type="primary" @click="search()" icon="el-icon-search">搜索</el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--      </el-form>-->
      <baseTable :tableData="tableData" ref="table" :multiSelect="false"  @refresh="refresh"/>
    </el-container>
  </div>
</template>
<script>
import baseDialog from '../../base/baseDialog.vue'
import baseTable from '../../base/baseTable.vue'

export default {
  data() {
    return {
      titles: '',
      badList: '',
      typeObject: {},
      typeList: [],
      checkboxList: [],
      index: null,
      dialogImageUrl: '',
      dialogVisible: false,
      dataForm: {
        orderId: ''
      },
      tableData: {
        theads: [
          { label: '项目名', prop: 'content',fixed:'left' ,width:'400px'},
          { label: '含税单价', prop: 'price' },
          { label: '项目数量', prop: 'number' },
        ],
        url: '/itemProcurement/list/item'
      },
    }
  },
  components: {
    baseDialog,
    baseTable
  },
  props: {
    refreshDataList:{
      type: Function
    }
  },
  methods: {
    init(orderId){
      this.dataForm.orderId = orderId
      this.$refs.table.refresh(this.dataForm)
    },
    refresh(){
      this.$refs.table.refresh(this.dataForm)
    },
    search() {
      this.$http({
        method: "get",
        url: this.$http.adornUrl("/contractManager/words/search"),
        params: this.$http.adornParams(this.dataForm)
      }).then(({data}) => {
        if(data && data.code === 200){
          this.$message.success('开始执行')
          this.refreshDataList()
          this.$parent.hide()
        }else{
          this.$message.warning(data.msg)
        }}).catch(error =>{
      })
    }

  }
}
</script>
<style scoped>
.el-form--inline > .inputlist > .orManagement > .el-form-item {
  width: 20%;
}

#contentBar > .el-container > .el-form {
  width: 100%;
}

.fieldlist > .el-input--small .el-input__inner {
  width: 200px;
}


</style>
