<template>
  <div style="height: 100%;">
    <el-container >
      <el-header >
        <el-form :inline="true"   :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="公司名:" prop="name">
              <el-input v-model="dataForm.factoryName" placeholder="请输入公司名称" clearable></el-input>
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
            <el-tag type="primary" @click="updateType(0,row.item.relationId)">单项项目</el-tag>
            <el-tag type="primary" @click="updateType(1,row.item.relationId)">框架项目</el-tag>
            </div>
            <div v-else>
              <el-tag type="primary" @click="makeContract(row.item)">生成合同</el-tag>
              <el-tag type="primary" @click="purchaseOrder(row.item)">导出订单</el-tag>

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
        factoryName:'',//公司名称
        contractNo:'',//框架合同号
        contractName:''
      },
      tableData: {
        theads: [
          { label: '厂商名称', prop: 'factoryName',fixed:'left' ,width:'95px'},
          { label: '通讯地址', prop: 'mailingAddress' },
          { label: '开票地址', prop: 'invoiceAddress' },
          { label: '邮编', prop: 'postcode' },
          { label: '法人电话', prop: 'phone' },
          { label: '传真', prop: 'fax' },
          { label: '开户银行', prop: 'bank' },
          { label: '银行账号', prop: 'bankAccount' },
          { label: '统一社会信用代码', prop: 'creditCode' },
          { label: '联系人', prop: 'linkman' },
          { label: '联系电话', prop: 'linkmanPhone' },
          { label: '备用电话', prop: 'spareComplaintPhone' },
          { label: '合同编号', prop: 'contractNo' },
          { label: '创建时间', prop: 'createTime',fixed:'right' },
          { label: '类型', prop: 'type' ,formatter: function (row) {
              if (row.type === 0) {
                return '单项合同'
              } else if (row.type === 1) {
                return '框架合同'
              } else if (!row.type) {
                return '未定义'
              } else {
                return '错误'
              }}},
          { label: '操作', prop: '', slotName: 'clientType2',width: '200px' ,fixed:'right'}
        ],
        // dataList: [{ paperBookName: '123456', isbn: '654321', paperBookName: 'firstBookName', paperBookName: 'thirdBookName', createTime: 'fifthBookName', modifyTime: 'seventhBookName', paperBookName: 'ninthBookName' }]
        dataList:[]
      },
      schemeTableData :[

      ],
      //要显示哪个合同
      schemeIDForDisplay: '1',
      purchaseOrderData :[
        { orderType: '1', orderTypeName:"采购订单模板1"},
        { orderType: '2', orderTypeName:"采购订单模板2"}
      ],
      purchaseOrderDForDisplay:'',
      payRateTableData :[
        { payId: '1', payName:"10% - 90%"},
        { payId: '2', payName:"5% - 95%"}
      ],
      //要显示哪个合同
      payRateForDisplay: ''
    }
  },
  components: {
    baseTable,
    baseDialog,
    baseTableNoSelect,
    baseUpload
  },
  mounted() {
  },
  methods: {

    init(name){
      //查询获取单项/框架对应的模板类型
      let that=this;
      this.$http({
        method: "get",
        url: that.$http.adornUrl("/factory/getModelList")
      }).then(({data}) => {
        if(data && data.code === 200){
          let val = data.payload;
          val.map(it =>{
            this.schemeTableData.push(it);
          })
        }
      })
      this.dataForm.contractName = name
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
          pageSize:pageSize?pageSize:that.$refs.table.options.pageSize,
        }
        that.$refs.table.options.tableLoading = true
        this.$http({
          method: "get",
          url: that.$http.adornUrl("/factory/list"),
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
    updateType(type,relationId) {
      this.$http({
        url: this.$http.adornUrl('/factory/update'),
        method: 'post',
        data: {type:type,relationId:relationId}
      }).then(({ data }) => {
        if (data.success) {
          this.$message.success("定义成功")
          this.refresh()
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    purchaseOrder(row){
      var _this = this;
      const o = this.$createElement;

      //成功操作
      let form = new FormData()
      form.append('relationId',row.relationId)
      this.$http.downloadPost(
        this.$http.adornUrl('/itemProcurement/export/purchaseOrder'),
        form
      )



      // this.$msgbox({
      //   title: '请选择采购订单类型', //弹框标题
      //   //弹框信息
      //   message: o('el-select', {
      //       props: {
      //         value: '请选择',
      //       },
      //       ref: 'selectView',
      //       on: {
      //         change: e => {
      //           _this.purchaseOrderDForDisplay = e;
      //           _this.$refs.selectView.value = e;
      //         }
      //       }
      //     },
      //     [
      //       _this.purchaseOrderData.map(it => {
      //         return o('el-option', {
      //           props: {
      //             key: it.orderType,
      //             label: it.orderTypeName,
      //             value: it.orderType
      //           }
      //         });
      //       })
      //     ]
      //   ),
      //   showCancelButton: true,
      //   closeOnClickModal: false,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(_ => {
      //   //成功操作
      //   let form = new FormData()
      //   form.append('relationId',row.relationId)
      //   form.append('fileType',_this.purchaseOrderDForDisplay)
      //   this.$http.downloadPost(
      //     this.$http.adornUrl('/itemProcurement/export/purchaseOrder'),
      //     form
      //   )
      // }).catch(_ => {
      //   //取消操作
      //   console.log('取消');
      // });
    },
    makeContract(row){
      this.payRateForDisplay=''
      const h = this.$createElement;
      var _this = this;
      this.$msgbox({
        title: '请选择技术规范类型', //弹框标题
        //弹框信息
        message: h('el-select', {
            props: {
              value: '',
            },
            ref: 'selectView',
            on: {
              change: e => {
                _this.schemeIDForDisplay = e;
                _this.$refs.selectView.value = e;
              }
            }
          },
          [
            _this.schemeTableData.filter(value=>value.model_type==row.type).map(it => {
              return h('el-option', {
                props: {
                  key: it.model_seq,
                  label: it.model_name,
                  value: it.model_seq
                }
              });
            })
          ]
        ),
        showCancelButton: true,
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(_ => {
        var relationId = row.relationId;
        var contractType = row.type;

        //单项合同需选择支付比例
        if(contractType=='0'){
          this.$msgbox({
            title: '请选择支付比例', //弹框标题
            //弹框信息
            message: h('el-select', {
                props: {
                  value: '请选择',
                },
                ref: 'selectView',
                on: {
                  change: e => {
                    _this.payRateForDisplay = e;
                    _this.$refs.selectView.value = e;
                  }
                }
              },
              [
                _this.payRateTableData.map(it => {
                  return h('el-option', {
                    props: {
                      key: it.payId,
                      label: it.payName,
                      value: it.payId
                    }
                  });
                })
              ]
            ),
            showCancelButton: true,
            closeOnClickModal: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(_ => {

            if(_this.payRateForDisplay==''){
              alert('请选择支付比例');
              return ;
            }
            //成功操作
            let form = new FormData()
            form.append('relationId',relationId)
            form.append('fileType',_this.schemeIDForDisplay)
            form.append('payType',_this.payRateForDisplay)
            this.$http.downloadPost(
              this.$http.adornUrl('/itemProcurement/exportWord'),
              form
            )
          }).catch(_ => {
            //取消操作
            console.log('取消');
          });
        }else{
          //成功操作
          console.log('点击确定，选择的规范为=' + _this.schemeIDForDisplay);
          let form = new FormData()
          form.append('relationId',relationId)
          form.append('fileType',_this.schemeIDForDisplay)
          this.$http.downloadPost(
            this.$http.adornUrl('/itemProcurement/exportWord'),
            form
          )
        }
      }).catch(_ => {
        //取消操作
        //取消操作
        console.log('取消');
      });
    }
  }
}
</script>
<style scoped>

  .el-select{
    margin:  0 auto;
    width: 300px;
  }


</style>

