<template>
  <div style="height: 100%;">
    <el-container >
      <el-header style=" height: 165px">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入关键字" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" placeholder="请输入工号" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="mailbox">
              <el-input v-model="dataForm.mailbox" placeholder="请输入邮箱前缀" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="驻地:" prop="stationIds">
              <el-select v-model="dataForm.stationIds" filterable clearable placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option v-for="item in empLocations" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptIds">
              <el-select  v-model="dataForm.deptIds" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option      v-for="dept in deptNames"
                                :key="dept.id"
                                :label="dept.name"
                                :value="dept.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamIds">
              <el-select  v-model="dataForm.teamIds" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option      v-for="team in teamNames"
                                :key="team.id"
                                :label="team.name"
                                :value="team.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色:" prop="roleIds">
              <el-select  v-model="dataForm.roleIds" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option      v-for="role in roleNames"
                                :key="role.id"
                                :label="role.name"
                                :value="role.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职时间:" prop="entryDate" >
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="entryDate"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="离职时间:" prop="departDate" >
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="departDate"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态:" prop="departStatus" >
              <el-select  v-model="dataForm.departStatus" placeholder="请选择" @change="showEntryDate">
                <el-option key="1" label="在职" value="1"></el-option>
                <el-option key="0" label="离职" value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="岗位类型:" prop="positionTypes" >
              <el-select  v-model="dataForm.positionTypes" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option key="0" label="A岗" :value="0"></el-option>
                <el-option key="1" label="B岗" :value="1"></el-option>
                <el-option key="2" label="外包" :value="2"></el-option>
                <el-option key="3" label="学生" :value="3"></el-option>
                <el-option key="4" label="实习" :value="4"></el-option>
                <el-option key="5" label="兼职" :value="5"></el-option>

              </el-select>
            </el-form-item>

            <el-form-item label="技术级别:" prop="empLevels" >
              <el-select  v-model="dataForm.empLevels" placeholder="请选择" :multiple="true" :collapse-tags="true">
                <el-option key="2" label="2" value="2"></el-option>
                <el-option key="3" label="3" value="3"></el-option>
                <el-option key="4" label="4" value="4"></el-option>
                <el-option key="5" label="5" value="5"></el-option>
                <el-option key="6-" label="6-" value="6-"></el-option>
                <el-option key="6" label="6" value="6"></el-option>
                <el-option key="6+" label="6+" value="6+"></el-option>
                <el-option key="7" label="7" value="7"></el-option>
                <el-option key="8" label="8" value="8"></el-option>
                <el-option key="9" label="9" value="9"></el-option>
              </el-select>
            </el-form-item>




            <div style="display: contents;">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询</el-button>
              <el-button type="primary" @click="resetForm()" icon="el-icon-search" style="margin-right: 20px">重置</el-button>

            </div>
          </div>
        </el-form>
        <div class="chooseResult">
          <span class="chooseResultStr" v-text="chooseStr"></span>
          <span style="color:blue;margin-left: 100px;cursor: pointer" @click="batchDelete()"> 批量删除 </span>
          <span style="color:blue;margin-left: 20px;cursor: pointer" @click="download()"> 批量下载 </span>
          <span style="color:blue;margin-left: 20px;cursor: pointer" @click="add()"> 添加员工 </span>
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
      </baseTable>
      <el-drawer
        :title="title"
        :visible.sync="drawer"
        :direction="direction"
        size="21%"
      >
        <div style="padding-left: 20px">
          <el-form :inline="true" :model="editDataForm" ref="editdataForm" class="editForm">
            <el-form-item label="姓名:" prop="name" :rules="[ { required: true, message: '姓名不能为空'}]">
              <el-input v-model="editDataForm.name" clearable  maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId" :rules="[ { required: true, message: '工号不能为空'}]" >
              <el-input v-model="editDataForm.empId" clearable  maxlength="50" :disabled= "disabled"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="mailbox" :rules="[ { required: true, message: '邮箱不能为空'}]">
              <el-input v-model="editDataForm.mailbox" placeholder="请输入邮箱前缀" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="驻地:" prop="stationId">
              <el-select v-model="editDataForm.stationId" filterable clearable placeholder="请选择">
                <el-option v-for="location in empLocations"
                           :key="location.id"
                           :label="location.name"
                           :value="location.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptId" :rules="[ { required: true, message: '归属部门不能为空'}]">
              <el-select  v-model="editDataForm.deptId" placeholder="请选择" >
                <el-option      v-for="dept in deptNames"
                                :key="dept.id"
                                :label="dept.name"
                                :value="dept.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamId" >
              <el-select  v-model="editDataForm.teamId" placeholder="请选择" >
                <el-option      v-for="team in teamNames"
                                :key="team.id"
                                :label="team.name"
                                :value="team.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色:" prop="roleId" :rules="[ { required: true, message: '角色不能为空'}]">
              <el-select  v-model="editDataForm.roleId" placeholder="请选择" >
                <el-option      v-for="role in roleNames"
                                :key="role.id"
                                :label="role.name"
                                :value="role.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="岗位类型:" prop="positionType" :rules="[ { required: true, message: '岗位为空'}]">
              <el-select  v-model="editDataForm.positionType" placeholder="请选择" >
                <el-option key="0" label="A岗" :value="0"></el-option>
                <el-option key="1" label="B岗" :value="1"></el-option>
                <el-option key="2" label="外包" :value="2"></el-option>
                <el-option key="3" label="学生" :value="3"></el-option>
                <el-option key="4" label="实习" :value="4"></el-option>
                <el-option key="5" label="兼职" :value="5"></el-option>

              </el-select>
            </el-form-item>

            <el-form-item label="技术级别:" prop="empLevel" >
              <el-select  v-model="editDataForm.empLevel" placeholder="请选择" >
                <el-option key="2" label="2" value="2"></el-option>
                <el-option key="3" label="3" value="3"></el-option>
                <el-option key="4" label="4" value="4"></el-option>
                <el-option key="5" label="5" value="5"></el-option>
                <el-option key="6-" label="6-" value="6-"></el-option>
                <el-option key="6" label="6" value="6"></el-option>
                <el-option key="6+" label="6+" value="6+"></el-option>
                <el-option key="7" label="7" value="7"></el-option>
                <el-option key="8" label="8" value="8"></el-option>
                <el-option key="9" label="9" value="9"></el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="入职时间:" prop="entryDate" >
              <el-date-picker
                style="width: 130px"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="editDataForm.entryDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="状态:" prop="departStatusName" v-if="departStatusNameShow">
              <el-select  v-model="editDataForm.departStatusName" placeholder="请选择" @change="showEntryDate">
                <el-option key="在职" label="在职" value="在职"></el-option>
                <el-option key="离职" label="离职" value="离职"></el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="离职时间:" prop="entryDate"  v-if="entryDateShow" >
              <el-date-picker
                style="width: 130px"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="editDataForm.departDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <div style="display: inline-block; margin-top: 60px">
              <el-button type="primary"  icon="el-icon-search" style="margin-right: 20px" @click="editSubmit()">确定</el-button>
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
      disabled:false,
      title:'',
      chooseStr:'已选择 0 项',
      deleteIds:[],
      drawer:false,
      entryDateShow:false,
      departStatusNameShow:false,
      direction: 'rtl',
      entryDate:'',
      departDate:'',
      dataForm: {
        name: '',
        empId: '',
        mailbox: '',
        stationIds:[],
        deptIds:[],
        teamIds:[],
        roleIds:[],
        entryDateStart:'',
        entryDateEnd:'',
        departDateStart:'',
        departDateEnd:'',
        positionTypes:[],
        empLevels:[],
        departStatus:''
      },
      editDataForm: {
        id:'',
        name: '',
        empId: '',
        mailbox: '',
        stationId:'',
        deptId:'',
        teamId:'',
        roleId:'',
        entryDate:'',
        departStatusName:'',
        departDate:'',
        createUser:'',
        updateUser:'',
        positionType:'',
        empLevel:''
      },
      deptNames:[],
      empLocations:[],
      teamNames:[],
      roleNames:[],
      tableData: {
        theads: [
          {label: '姓名', prop: 'name'},
          {label: '工号', prop: 'empId'},
          {label: '邮箱', prop: 'mailbox',width:'180px'},
          {label: '驻地', prop: 'stationName'},
          {label: '归属部门', prop: 'deptName'},
          {label: '归属团队', prop: 'teamName'},
          {label: '角色', prop: 'roleName'},
          {label: '技术级别', prop: 'empLevel'},
          {label: '岗位类型', prop: 'positionTypeName'},
          {label: '入职时间', prop: 'entryDate'},
          {label: '离职时间', prop: 'departDate'},
          {label: '状态', prop: 'departStatusName'},
          {label: '操作', prop: 'clientType',slotName:'clientType'}
        ],
        url: '/employee/selectEmployeeListWithPage'
      }
    }
  },
  components: {
    baseTable, baseDialog
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)

    //初始化成本中心/部门
    this.$http({
      url: this.$http.adornUrl('/common/getDept'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.deptNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })

    //初始化驻地
    this.$http({
      url: this.$http.adornUrl('/common/getStation'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.empLocations = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    //初始化团队
    this.$http({
      url: this.$http.adornUrl('/common/getTeam'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.teamNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })

    //初始化角色
    this.$http({
      url: this.$http.adornUrl('/common/getRole'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.roleNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })




  },
  methods: {

    editSubmit(){

      let go
      this.$refs['editdataForm'].validate((valid) => {
        go = valid
      });

      if(!go){
        return ;
      }

      let user =getCName()
      this.editDataForm.createUser= user
      if(this.editDataForm.departDate=='-'){
        this.editDataForm.departDate = undefined
      }

      this.$http({
        url: this.$http.adornUrl(this.url),
        method: 'post',
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
    alter(row){
      this.editDataForm = {...row.item}
      this.drawer = true
      this.title = '编辑'
      this.departStatusNameShow = true
      this.url = '/employee/updateEmployee'
      this.disabled = true
      this.showEntryDate()

    },
    showEntryDate(){
      if(this.editDataForm.departStatusName == '离职'){
        this.entryDateShow = true
      }else{
        this.entryDateShow = false
      }
    },
    add(){
      this.drawer = true
      this.title = '新增'
      this.url = '/employee/insertEmployee'
      this.clear(this.editDataForm)
      this.disabled = false


    },

    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }

        if(this.departDate!=null&&this.departDate!=""){
          this.dataForm.departDateStart = this.departDate[0]
          this.dataForm.departDateEnd = this.departDate[1]

        }

        if(this.entryDate!=null&&this.entryDate!=""){
          this.dataForm.entryDateStart = this.entryDate[0]
          this.dataForm.entryDateEnd = this.entryDate[1]

        }




        let form ={...this.dataForm}
        if(form.positionTypes.length>0){
          form.positionTypes =form.positionTypes +''
        }

        if(form.roleIds.length>0){
          form.roleIds =form.roleIds +''
        }
        if(form.stationIds.length>0){
          form.stationIds =form.stationIds +''
        }
        if(form.teamIds.length>0){
          form.teamIds =form.teamIds +''
        }
        if(form.empLevels.length>0){
          form.empLevels =form.empLevels +''
        }

        if(form.deptIds.length>0){
          form.deptIds =form.deptIds +''
        }

        this.$refs.table.refresh(form)
      })
    },
    deleteList(row) {
      this.$confirm('确定删除吗（'+row.item.name+'）吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/employee/deleteEmployee?id='+row.item.id),
          method: 'get'
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
    onSelect(selection){
      this.deleteIds = []
      let totalMoney = 0
      if(selection.length>0){
        selection.forEach(a =>{
          this.deleteIds.push(a.id)
          totalMoney += a.totalMoney
        })
        this.chooseStr = '已选中'+this.deleteIds.length+'位成员'
      }else{
        this.chooseStr = '已选中 0 项'
      }
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
          url: this.$http.adornUrl('/employee/deleteEmployees'),
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
        this.$message.error('当前未选中任何员工数据！')
        return ;
      }
      this.dataForm.ids = this.deleteIds
      this.$http.downloadPost(this.$http.adornUrl('/employee/export'), this.$http.adornParams(this.dataForm), this)

    },

    resetForm() {
      this.departDate = ''
      this.entryDate = ''
      this.dataForm.departDateStart = ''
      this.dataForm.departDateEnd = ''
      this.dataForm.entryDateStart = ''
      this.dataForm.entryDateEnd = ''

      this.$refs.dataForm.resetFields()
    },
    clear(form){
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

::v-deep .editForm .el-form-item__label{
  width: 80px !important;
}
::v-deep .editForm .el-form-item{
  width: 95% !important;
}
::v-deep  .el-date-editor .el-input__inner{
    padding-left: 30px !important;
  }

</style>
