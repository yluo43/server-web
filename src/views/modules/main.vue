<template>
  <div style="height: 100%;">
    <el-container class="header-container">
      <el-header >
        <el-form :inline="true"   :model="dataForm" ref="dataForm"  @submit.prevent="refresh(1,10)">
          <div class="inputlist">
            <el-form-item label="项目名称:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入项目名称" clearable  ></el-input>
            </el-form-item>

            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
            <el-button type="primary" @click="deriveExcel()" icon="el-icon-download" style="margin-right: 10px">导入项目</el-button>
            <el-button type="primary" @click="deriveFactoryExcel()" icon="el-icon-download" style="margin-right: 10px">导入厂商</el-button>
            <el-button type="primary"   @click="dialogVisible = true" icon="el-icon-download" style="margin-right: 10px">导入合同模板</el-button>
            <el-button type="danger" @click="resetForm()" style="margin-right: 20px">重置</el-button>

          </div>
        </el-form>
      </el-header>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @refresh="refresh">
        <template v-slot:clientType2="row">
          <!--类型插槽-->
          <template>
            <div v-if ="row.item.type===null">
            <el-tag type="primary" @click="teamwork(row.item.name)" style="margin-right: 10px">合作厂商</el-tag>
            <el-tag type="primary" @click="itemList(row.item.name)">服务清单</el-tag>
            </div>
          </template>
        </template>
      </baseTable>
    </el-container>

    <baseUpload
      name="uploadFile"
      ref="uploadFile"
      :url = "url"
      :accept="'.xls,.xlsx'"
      :file-list="uploadFile"
      :hideAllBtn="true"
    ></baseUpload>
    <baseUpload
      name="uploadFactoryFile"
      ref="uploadFactoryFile"
      :url = "factoryUrl"
      :accept="'.xls,.xlsx'"
      :file-list="uploadFactoryFile"
      :hideAllBtn="true"
    ></baseUpload>

    <baseUpload
      name="uploadDocumentFile"
      ref="uploadDocumentFile"
      :url = "documentUrl"
      :accept="'.doc,.docx'"
      :file-list="uploadFactoryFile"
      :hideAllBtn="true"
    ></baseUpload>

    <baseDialog :title="titles" ref="factoryDialog" width="80%">
      <template>
        <factory :refreshDataList="refresh" ref="factory" ></factory>
      </template>
    </baseDialog>

    <baseDialog :title="titles" ref="itemDialog"  width="80%">
      <template>
        <item :refreshDataList="refresh" ref="item" ></item>
      </template>
    </baseDialog>


    <el-dialog
      title="上传新模板"
      :visible.sync="dialogVisible"
      width="25%"
      >
      <el-form :inline="true"   :model="submitSpecificationForm" ref="submitSpecificationForm"  :rules="rules">
          <el-form-item label="模版名称:" prop="model_name">
            <el-input v-model="submitSpecificationForm.model_name" placeholder="请输入模板名称" clearable  ></el-input>
          </el-form-item>

          <el-form-item label="模版类型:" prop="model_type">
            <el-select v-model="submitSpecificationForm.model_type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        <br>
        <el-form-item prop="fileList">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="documentUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :data="submitSpecificationForm"
            :on-change="changefile"
            :on-success="successUpload"
          >
            <el-button slot="trigger" size="small" type="success" style="width: 150px">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="width: 200px;margin: 0 auto">
        <el-button type="primary"   @click="submitUpload" style="margin-right: 20px">上 传</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>



    </el-dialog>


  </div>
</template>
<script>

import baseTable from './base/baseTable.vue'
import baseTableNoSelect from './base/baseTableNoSelect.vue'
import baseDialog from './base/baseDialog.vue'
import baseUpload from './base/baseUpload.vue'
import factory from './factory.vue'
import item from './item.vue'
export default {
  data() {
    let that = this
    return {
      rules: {
        model_name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
        model_type: [{ required: true, message: '请选择模板类型', trigger: 'blur' }]
      },
      fileList: [],
      dialogVisible:false,
      titles: '',
      uploadFile: [],
      uploadFactoryFile: [],
      url: this.$http.adornUrl(`/payment/import`),
      factoryUrl: this.$http.adornUrl(`/payment/factory/import`),
      documentUrl: this.$http.adornUrl(`/itemProcurement/import/extraTecSpc`),
      imageBaseUrl: [],
      contractNo:'',
      dataForm: {
        name:'',//项目名称
      },
      options: [{
        value: '0',
        label: '单项合同'
      }, {
        value: '1',
        label: '框架合同'
      }],
      submitSpecificationForm:{
        model_name:'',
        model_type:''
      },
      tableData: {
        theads: [
          { label: '项目名称', prop: 'name',fixed:'left' ,width:'250px'},
          { label: '是否已支付供应商', prop: 'hasPaySupplier' },
          { label: '供应商名称', prop: 'supplierName' },
          { label: '采购合同编号', prop: 'contractNo' },
          { label: '订单编号', prop: 'orderNo'},
          { label: '订单总金额', prop: 'orderAmount'},
          { label: '本次支付比例', prop: 'paymentRatio'},
          { label: '开票金额/元', prop: 'invoiceAmount'},
          { label: '来源', prop: 'source'},
          { label: '年度', prop: 'year' },
          { label: '项目交付时间', prop: 'deliveryDate'},
          { label: '是否已支付厂家', prop: 'hasPayFactory' },
          { label: '厂家单位', prop: 'factoryCompany',fixed:'right' },
          { label: '应付厂家金额/元', prop: 'factoryAmount',fixed:'right' },
          { label: '本次结算比例', prop: 'settlementRatio',fixed:'right' },
          { label: '本次结算金额/元', prop: 'settlementAmount',fixed:'right' },
          { label: '备注', prop: 'remark' },
          { label: '操作', prop: '', slotName: 'clientType2',width: '200px' ,fixed:'right'}
        ],
        dataList:[]
      },
    }
  },
  components: {
    baseTable,
    baseDialog,
    baseTableNoSelect,
    baseUpload,
    factory,
    item
  },
  mounted() {
    this.refresh()
  },
  methods: {
    successUpload(){
      this.dialogVisible = false;
      this.$alert('模板文件上传成功', '提示', {
        confirmButtonText: '确定'}).then(() => {
        location.reload()
      })
        },
    changefile(file, fileList) {
      let arr = [];
      fileList.forEach((item, index) => {
        let endname = item.raw.name.substring(item.raw.name.lastIndexOf("."));
        arr.push(endname);
      });
      this.fileList = fileList;
    },
    submitUpload() {
      let right = true;
      this.$refs.submitSpecificationForm.validate((valid) => {
        right= valid ;
      });
      if(!right)
        return ;
      if(this.fileList.length==0){
        alert('请上传模板文件');
        return ;
      }
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;

    },
    handlePreview(file) {
      console.log(file);
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
          url: that.$http.adornUrl("/payment/list"),
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
    teamwork(name){
      this.titles = '合作厂商'
      this.$refs.factoryDialog.show()
      this.$nextTick(()=>{
        this.$refs.factory.init(name)
      })
    },
    itemList(name){
      this.titles = '服务清单'
      this.$refs.itemDialog.show()
      this.$nextTick(()=>{
        this.$refs.item.init(name)
      })

    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    deriveExcel() {
      this.$refs.uploadFile.click()
    },
    deriveFactoryExcel() {
      this.$refs.uploadFactoryFile.click()
    },
    uploadDocument() {
      this.$refs.uploadDocumentFile.click()
    }

  }
}
</script>
<style scoped>


</style>
