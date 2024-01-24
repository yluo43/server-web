<template>
  <div style="height: 100%;">
    <el-container >
      <el-header style=" height: 130px">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="用户姓名:" prop="account">
              <el-input v-model="dataForm.account" placeholder="输入关键字" clearable></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" placeholder="输入关键字" clearable></el-input>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptNames" >
              <el-select  v-model="dataForm.deptNames" placeholder="请选择"  :multiple="true" :collapse-tags="true">
                <el-option      v-for="dept in deptNames"
                                :key="dept"
                                :label="dept"
                                :value="dept"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamNames" >
              <el-select  v-model="dataForm.teamNames" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option      v-for="team in teamNames"
                                :key="team"
                                :label="team"
                                :value="team"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成本中心:" prop="costCenters" >
              <el-select  v-model="dataForm.costCenters" placeholder="请选择" :multiple="true" :collapse-tags="true" >
                <el-option      v-for="costCenter in costCenters"
                                :key="costCenter"
                                :label="costCenter"
                                :value="costCenter"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
    <br/>
            <el-form-item label="费用名称:" prop="costNames" >
              <el-select  v-model="dataForm.costNames"  :multiple="true" :collapse-tags="true" style="width: 240px !important;">
                <el-option      v-for="costName in costNames"
                                :key="costName"
                                :label="costName"
                                :value="costName"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期:" prop="createTime"  >
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="costDate"
                type="daterange"
                range-separator="~"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="导入日期:" prop="createTime"  >
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="createTime"
                type="daterange"
                range-separator="~"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日">
              </el-date-picker>
            </el-form-item>
            <div style="display: contents;">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询
              </el-button>
              <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
            </div>
          </div>
        </el-form>

        <div class="chooseResult">
          <span class="chooseResultStr" v-text="chooseStr"></span>
          <span style="color:blue;margin-left: 100px" @click="batchDelete()" v-auth="'dailyCost:deletes'"> 批量删除 </span>
          <span style="color:blue;margin-left: 20px" @click="download()" v-auth="'dailyCost:export'"> 批量下载 </span>
        </div>

      </el-header>


      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <svg-icon :icon-class="'delete'" style="height:1.5em;width:1.5em; margin-right: 2em;"
                      @click="deleteList(row)" v-auth="'dailyCost:delete'"/>
            <svg-icon :icon-class="'amend'" style="height:1.5em;width:1.5em;" @click="alter(row)" v-auth="'dailyCost:update'"/>
          </template>
        </template>
      </baseTable>


      <el-drawer
        title="编辑"
        :visible.sync="drawer"
        :direction="direction"
        size="17%"
        >
        <div style="padding-left: 20px">
          <el-form :inline="true" :model="editDataForm" ref="editdataForm" class="editForm">
            <el-form-item label="姓名:" prop="account">
              <el-input v-model="editDataForm.account" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="editDataForm.empId" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="归属部门:" prop="backCitys">
              <el-input v-model="editDataForm.deptName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="归属团队:" prop="backCitys">
              <el-input v-model="editDataForm.teamName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="成本中心:" prop="costCenters">
              <el-select  v-model="editDataForm.costCenter"  >
                <el-option      v-for="costCenter in costCenters"
                                :key="costCenter"
                                :label="costCenter"
                                :value="costCenter"
                                multiple="true">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期:" prop="empId" disabled="disabled">
              <el-input v-model="editDataForm.costDate" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="事由:" prop="reason">
              <el-input v-model="editDataForm.reason" clearable ></el-input>

              <!--              <el-select  v-model="editDataForm.reason"  >-->
<!--                <el-option      v-for="item in reason"-->
<!--                                :key="item"-->
<!--                                :label="item"-->
<!--                                :value="item"-->
<!--                                multiple="true"-->
<!--                >-->
<!--                </el-option>-->
<!--              </el-select>-->
            </el-form-item>

            <el-form-item label="费用名称:" prop="backCitys">
              <el-select  v-model="editDataForm.costName"  >
                <el-option      v-for="costName in costNames"
                                :key="costName"
                                :label="costName"
                                :value="costName"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="单数张数:" prop="backCitys">
              <el-input v-model="editDataForm.documentNum" clearable disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="金额:" prop="totalMoney">
              <el-input v-model="editDataForm.totalMoney" clearable disabled="disabled"></el-input>
            </el-form-item>

            <div style="display: inline-block; margin-top: 60px">
              <el-button type="primary"  icon="el-icon-search" style="margin-right: 20px" @click="editSubmit()" >保存</el-button>
              <el-button type="primary"  icon="el-icon-refresh-right" @click="drawer = false">取消</el-button>
            </div>
          </el-form>
        </div>


      </el-drawer>


    </el-container>

  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog'
import { getCName } from '@/utils/auth'


export default {
  data() {
    return {
      chooseStr:'已选择 0 项',
      drawer:false,
      direction: 'rtl',
      deleteIds:[],
      createTime: ''|| undefined,
      costDate: ''|| undefined,

      dataForm: {
        costNames:[]||undefined,
        account: ''|| undefined,
        empId: ''|| undefined,
        deptNames: []|| undefined,
        teamNames: []|| undefined,
        reason: ''|| undefined,
        costCenters: []|| undefined,
        costDateStart: ''|| undefined,
        costDateEnd: ''|| undefined,
        createTimeStart: ''|| undefined,
        createTimeEnd: ''|| undefined,

        ids:''|| undefined
      },

      editDataForm:{
        id:'',
        account: '',
        empId: '',
        deptName: '',
        teamName: '',
        reason: '',
        costCenter: '',
        costDate: '',
        costName:'',
        createTime: '',
        totalMoney:'',
        documentNum:'',
        updateUser:''
      },
      costCenters:[],
      costNames:[],
      deptNames:[],
      teamNames:[],
      reason:[],
      tableData: {
        theads: [
          {label: '用户姓名', prop: 'account'},
          {label: '工号', prop: 'empId'},
          {label: '归属部门', prop: 'deptName'},
          {label: '归属团队', prop: 'teamName'},
          {label: '成本中心', prop: 'costCenter'},
          {label: '日期', prop: 'costDate'},
          {label: '事由', prop: 'reason'},
          {label: '费用名称', prop: 'costName'},
          {label: '单据张数', prop: 'documentNum'},
          {label: '报销金额（元）', prop: 'totalMoney'},
          {label: '导入时间', prop: 'createTime'},
          {label: '操作', prop: 'clientType', slotName: 'clientType'}
        ],
        url: '/dailyCost/dailyCostListPage'
      }
    }
  },
  components: {
    baseTable, baseDialog
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    //初始化成本中心
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllDept'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.costCenters = data.payload
        this.deptNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })

    //初始化团队
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllTeam'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.teamNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    //初始化事由
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllReason'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.reason = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    //初始化报销费用名称
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllCostName'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.costNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    alter(row){
      let data = row.item
      this.drawer = true
      this.editDataForm ={...data}

    },
    editSubmit(){
      let user =getCName()
      this.editDataForm.updateUser= user

      this.$http({
        url: this.$http.adornUrl("/dailyCost/update"),
        method: 'put',
        data: this.$http.adornData(
          this.editDataForm
        )
      }).then(({ data }) => {
        if (data.success) {
          this.refresh()
          this.$message({
            message: '编辑成功！',
            type: 'success'
          });
          this.drawer = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }

        if(this.createTime!=null&&this.createTime!=""){
          this.dataForm.createTimeStart = this.createTime[0] +' 00:00:00'
          this.dataForm.createTimeEnd = this.createTime[1]+' 23:59:59'
        }

        if(this.costDate!=null&&this.costDate!=""){
          this.dataForm.costDateStart = this.costDate[0]
          this.dataForm.costDateEnd = this.costDate[1]
        }


        let form ={...this.dataForm}

        if(form.costNames.length>0){
          form.costNames =form.costNames +''
        }

        if(form.deptNames.length>0){
          form.deptNames =form.deptNames +''
        }
        if(form.costCenters.length>0){
          form.costCenters =form.costCenters +''
        }
        if(form.teamNames.length>0){
          form.teamNames =form.teamNames +''
        }
         this.$refs.table.refresh(form)
      })
    },

    batchDelete(){
      if(this.deleteIds.length <= 0){
        this.$message.error('当前未选中任何报销数据！')
        return ;
      }


      this.$confirm('已选中'+this.deleteIds.length+'条报销数据,您确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/dailyCost/deleteTripCost'),
          method: 'post',
          data: this.deleteIds
        }).then(({data}) => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    download(){
      if(this.deleteIds.length <= 0){
        this.$message.error('当前未选中任何报销数据！')
        return ;
      }
      this.dataForm.ids = this.deleteIds
      this.$http.downloadPost(this.$http.adornUrl('/dailyCost/export'), this.$http.adornParams(this.dataForm), this)
    },
    onSelect(selection){
      this.deleteIds = []
      let totalMoney = 0
      if(selection.length>0){
        selection.forEach(a =>{
          this.deleteIds.push(a.id)
          totalMoney  +=  parseFloat(a.totalMoney)
        })
        this.chooseStr = '已选中'+this.deleteIds.length+'项，合计：'+totalMoney.toFixed(2)+'元'
      }else{
        this.chooseStr = '已选中 0 项'
      }
    },
    deleteList(row) {
      this.deleteIds = []
      this.deleteIds.push(row.item.id)
      this.$confirm(`您确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/dailyCost/deleteTripCost'),
          method: 'post',
          data: this.deleteIds
        }).then(({data}) => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    resetForm() {
      this.clear(this.dataForm)
      this.costDate = ''
      this.createTime = ''
    },clear(form){
      Object.keys(form).forEach(key => (form[key] = ''));
    }
  }
}
</script>
<style scoped>
.el-header {
  color: #333;
  padding: 0 0;
}

.el-form--inline > .inputlist {
  /*padding-top: 20px;*/
  padding-left: 20px;
  /*display: flex;*/
}

::v-deep .editForm .el-form-item__label{
  width: 80px !important;
}
::v-deep .editForm .el-form-item{
  width: 100% !important;
}

.el-button-func {
  width: 86px;
  height: 30px;
  text-align: center;
}
::v-deep .el-table__cell{
  text-align: center;
}

  .chooseResult{
    width: 98%;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    display: block;
    background: #E9F3FF;
    border-radius: 6px;
    padding-left: 20px;
  }
</style>
