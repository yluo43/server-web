<template>
  <div style="height: 100%;">
    <el-container >
      <el-header style=" height: 130px">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="用户姓名:" prop="account">
              <el-input v-model="dataForm.account" placeholder="输入关键字" clearable  maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" placeholder="输入关键字" clearable maxlength="50"></el-input>
            </el-form-item>

            <el-form-item label="成本中心:" prop="costCenters">
              <el-select  v-model="dataForm.costCenters" placeholder="请选择" >
                <el-option      v-for="costCenter in costCenters"
                                :key="costCenter"
                                :label="costCenter"
                                :value="costCenter"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptNames">
              <el-select  v-model="dataForm.deptNames" placeholder="请选择" >
              <el-option      v-for="dept in deptNames"
                              :key="dept"
                              :label="dept"
                              :value="dept"
                              multiple="true"
              >
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="事由:" prop="reason">
              <el-select  v-model="dataForm.reason" placeholder="请选择" >

              <el-option      v-for="item in reason"
                              :key="item"
                              :label="item"
                              :value="item"
                              multiple="true"
              >
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamNames">
              <el-select  v-model="dataForm.teamNames" placeholder="请选择" >
              <el-option      v-for="team in teamNames"
                              :key="team"
                              :label="team"
                              :value="team"
                              multiple="true"
              >
              </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="目的城市:" prop="backCitys">
              <el-input v-model="dataForm.backCitys" placeholder="输入关键字" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="出发日期:" prop="startDate" style="width: 280px !important;">
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="dataForm.startDate"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="返回日期:" prop="backDate"  style="width: 280px !important;">
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="dataForm.backDate"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="导入日期:" prop="createTime"  style="width: 280px !important;">
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="dataForm.createTime"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
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
          <span class="chooseResultStr" v-text="chooseStr"></span>  <span style="color:blue;margin-left: 100px" @click="batchDelete()"> 批量删除 </span><span style="color:blue;margin-left: 20px" @click="download()"> 批量下载 </span>
        </div>

      </el-header>


      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <svg-icon :icon-class="'delete'" style="height:1.5em;width:1.5em; margin-right: 2em;"
                      @click="deleteList(row)"/>
            <svg-icon :icon-class="'amend'" style="height:1.5em;width:1.5em;" @click="alter(row)"/>
          </template>
        </template>

        <template v-slot:totalMoney="row">
          <template >
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover">
<!--              :content='getHoverContent(row)'-->
              <div class="custom-content">
                住宿费:{{row.item.hotelMoney}} <br/>
                出租车费:{{row.item.taxiMoney}}<br/>
                交通费:{{row.item.trafficMoney}}<br/>
                夜间火车宾馆差额:{{row.item.marginMoney}}<br/>
                日常补贴:{{row.item.dailySubsidyMoney}}<br/>
                资金补贴:{{row.item.moneySubsidy}}
              </div>
              <span slot="reference">{{row.item.totalMoney}}</span>
            </el-popover>

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
              <el-input v-model="editDataForm.account" clearable disabled="disabled" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="editDataForm.empId" clearable disabled="disabled" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="归属部门:" prop="backCitys">
              <el-input v-model="editDataForm.deptName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="归属团队:" prop="backCitys">
              <el-input v-model="editDataForm.teamNames" clearable disabled="disabled"></el-input>
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
            <el-form-item label="出发日期:" prop="empId" disabled="disabled">
              <el-input v-model="editDataForm.startDate" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="返回日期:" prop="empId">
              <el-input v-model="editDataForm.backDate" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="目的城市:" prop="backCitys">
              <el-input v-model="editDataForm.backCitys" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="事由:" prop="reason">
              <el-select  v-model="editDataForm.reason"  >
                <el-option      v-for="item in reason"
                                :key="item"
                                :label="item"
                                :value="item"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="宾馆名称:" prop="hotelName">
              <el-input v-model="editDataForm.hotelName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="出差合计:" prop="totalMoney">
              <el-input v-model="editDataForm.totalMoney" clearable disabled="disabled"></el-input>
            </el-form-item>


            <div style="display: inline-block; margin-top: 60px">
              <el-button type="primary"  icon="el-icon-search" style="margin-right: 20px" @click="editSubmit()">保存</el-button>
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
      deleteIds:[],
      drawer:false,
      direction: 'rtl',
      createTime: '',
      startDate: '',
      backDate: '',

      dataForm: {
        account: ''|| undefined,
        backDateStart: ''|| undefined,
        backDateEnd: ''|| undefined,
        costCenters: ''|| undefined,
        createTimeStart: ''|| undefined,
        createTimeEnd: ''|| undefined,

        deptNames: ''|| undefined,
        empId: ''|| undefined,
        reason: ''|| undefined,
        startDateStart: ''|| undefined,
        startDateEnd: ''|| undefined,

        teamNames: '' || undefined,
        ids:''|| undefined,
        backCitys:''||undefined
      },

      editDataForm:{
        id:'',
        account: '',
        backDate: '',
        costCenter: '',
        createTime: '',
        deptName: '',
        empId: '',
        reason: '',
        startDate: '',
        teamNames: '',
        hotelName:'',
        totalMoney:'',
        updateUser:''
      },
      costCenters:[],
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
          {label: '出发日期', prop: 'startDate'},
          {label: '返回日期', prop: 'backDate'},
          {label: '目的城市', prop: 'backCitys'},
          {label: '事由', prop: 'reason'},
          {label: '宾馆名称', prop: 'hotelName'},
          {label: '出差合计', prop: 'totalMoney',slotName: 'totalMoney'},
          {label: '导入时间', prop: 'createTime'},
          {label: '操作', prop: 'clientType', slotName: 'clientType'}
        ],
        url: '/tripCost/tripCostListPage'
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
        url: this.$http.adornUrl("/tripCost/update"),
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
        if(this.dataForm.startDate!=null&&this.dataForm.startDate!=""){
          this.dataForm.startDateStart = this.dataForm.startDate[0]
          this.dataForm.startDateEnd = this.dataForm.startDate[1]
          this.dataForm.startDate = ''
        }

        if(this.dataForm.backDate!=null&&this.dataForm.backDate!=""){
          this.dataForm.backDateStart = this.dataForm.backDate[0]
          this.dataForm.backDateEnd = this.dataForm.backDate[1]
          this.dataForm.backDate = ''

        }

        if(this.dataForm.createTime!=null&&this.dataForm.createTime!=""){
          this.dataForm.createTimeStart = this.dataForm.createTime[0]
          this.dataForm.createTimeEnd = this.dataForm.createTime[1]
          this.dataForm.createTime = ''

        }


        this.$refs.table.refresh(this.dataForm)
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
          url: this.$http.adornUrl('/tripCost/deleteTripCost'),
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
      this.$http.downloadPost(this.$http.adornUrl('/tripCost/export'), this.$http.adornParams(this.dataForm), this)

    },
    onSelect(selection){
      this.deleteIds = []
      let totalMoney = 0
      if(selection.length>0){
        selection.forEach(a =>{
          console.log(a)
          this.deleteIds.push(a.id)
          totalMoney += a.totalMoney
        })
        this.chooseStr = '已选中'+this.deleteIds.length+'项，合计：'+totalMoney
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
          url: this.$http.adornUrl('/tripCost/deleteTripCost'),
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
      this.$refs.dataForm.resetFields()
      this.createTime =''
      this.startDate = ''
      this.endDate = ''
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
