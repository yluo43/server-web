<template>
  <div style="height: 100%;">
    <el-container >
      <el-header style=" height: 130px">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入关键字" clearable></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" placeholder="请输入工号" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="mailbox">
              <el-input v-model="dataForm.mailbox" placeholder="请输入邮箱前缀" clearable></el-input>
            </el-form-item>
            <el-form-item label="驻地:" prop="empLocation">
              <el-select v-model="dataForm.empLocation" filterable clearable placeholder="请选择">
                <el-option v-for="item in empLocations" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptNames">
              <el-select  v-model="dataForm.deptNames" placeholder="请选择" >
                <el-option      v-for="dept in deptNames"
                                :key="dept.id"
                                :label="dept.name"
                                :value="dept.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamNames">
              <el-select  v-model="dataForm.teamNames" placeholder="请选择" >
                <el-option      v-for="team in teamNames"
                                :key="team.id"
                                :label="team.name"
                                :value="team.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色:" prop="roleName">
              <el-select  v-model="dataForm.roleName" placeholder="请选择" >
                <el-option      v-for="role in roleNames"
                                :key="role.id"
                                :label="role.name"
                                :value="role.id"
                                multiple="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职时间:" prop="entryDate" style="width: 280px !important;">
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="dataForm.entryDate"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="离职时间:" prop="departDate" style="width: 280px !important;">
              <el-date-picker
                style="width: 220px;"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="dataForm.departDate"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <div style="display: contents;">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询
              </el-button>
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
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" >
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
        size="18%"
      >
        <div style="padding-left: 20px">
          <el-form :inline="true" :model="editDataForm" ref="editdataForm" class="editForm">
            <el-form-item label="姓名:" prop="account">
              <el-input v-model="editDataForm.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="editDataForm.empId" clearable ></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="mailbox">
              <el-input v-model="editDataForm.mailbox" placeholder="请输入邮箱前缀" clearable></el-input>
            </el-form-item>
            <el-form-item label="驻地:" prop="stationName">
              <el-select v-model="editDataForm.stationId" filterable clearable placeholder="请选择">
                <el-option v-for="location in empLocations"
                           :key="location.id"
                           :label="location.name"
                           :value="location.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptName">
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
            <el-form-item label="归属团队:" prop="backCitys">
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
            <el-form-item label="角色:" prop="roleName">
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
            <el-form-item label="离职时间:" prop="entryDate"   :visible.sync="entryDateShow">
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
      title:'',
      chooseStr:'已选择 0 项',
      deleteIds:[],
      drawer:false,
      entryDateShow:false,
      direction: 'rtl',
      entryDate:'',
      departDate:'',
      dataForm: {
        name: '',
        empId: '',
        mailbox: '',
        empLocation:'',
        deptName:'',
        teamName:'',
        roleName:'',
        entryDateStart:'',
        entryDateEnd:'',
        departDateStart:'',
        departDateEnd:''
      },
      editDataForm: {
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
        updateUser:''
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
          {label: '驻地', prop: 'empLocation'},
          {label: '归属部门', prop: 'deptName'},
          {label: '归属团队', prop: 'teamName'},
          {label: '角色', prop: 'roleName'},
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
      let user =getCName()
      this.editDataForm.createUser= user

      this.$http({
        url: this.$http.adornUrl("/employee/insertEmployee"),
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
    add(){
      this.drawer = true
      this.title = '新增'
    },

    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },

    deleteList(row) {
      let id = ''
      id = row.item.id
      this.$confirm(`您确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/employee/deleteEmployee?id='+id),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            location.reload()
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
  width: 100% !important;
}
::v-deep  .el-date-editor .el-input__inner{
    padding-left: 30px !important;
  }

</style>
