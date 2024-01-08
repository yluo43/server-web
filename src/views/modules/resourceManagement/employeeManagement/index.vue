<template>
  <div style="height: 100%;">
    <el-container >
      <el-header >
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptId">
              <el-select v-model="dataForm.deptId" filterable clearable placeholder="请选择">
                <el-option v-for="item in deptList" :key="item.deptName" :label="item.deptName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" placeholder="请输入工号" clearable></el-input>
            </el-form-item>
            <div style="display: contents;">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询
              </el-button>
              <el-button type="primary" @click="resetForm()" icon="el-icon-search">重置</el-button>
            </div>
          </div>
        </el-form>
      </el-header>
      <div style="padding:20px 0 10px 2px;">
        <el-button class="el-button-func" type="primary" @click="add()">添加员工</el-button>
      </div>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" >
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <svg-icon :icon-class="'delete'" style="height:1.5em;width:1.5em; margin-right: 2em;"
                      @click="deleteList(row)"/>
            <svg-icon :icon-class="'amend'" style="height:1.5em;width:1.5em;" @click="alter(row)"/>
          </template>
        </template>

        <template v-slot:admin="row">
          <template v-if="row.item.admin == 0" >
            <el-tag type="danger">否</el-tag>
          </template>
          <template v-if="row.item.admin == 1" >
            <el-tag type="success">是</el-tag>
          </template>
        </template>


        <template v-slot:state="row">
          <template v-if="row.item.state == 0" >
            <el-tag type="success">正式</el-tag>
          </template>
          <template v-if="row.item.state == 1" >
            <el-tag >试用</el-tag>
          </template>
          <template v-if="row.item.state == 2" >
            <el-tag type="danger">临时</el-tag>
          </template>
        </template>


        <template v-slot:departStatus="row">
          <template v-if="row.item.departStatus == 0" >
            <el-tag type="danger">离职</el-tag>
          </template>
          <template v-if="row.item.departStatus == 1" >
            <el-tag type="success">在职</el-tag>
          </template>
        </template>


        <template v-slot:empType="row">
          <template v-if="row.item.empType == 0" >
            <el-tag type="success">总公司员工</el-tag>
          </template>
          <template v-if="row.item.empType == 1" >
            <el-tag type="success">总公司员工</el-tag>
          </template>
          <template v-if="row.item.empType == 2" >
            <el-tag type="success">专项员工</el-tag>
          </template>
          <template v-if="row.item.empType == 3" >
            <el-tag type="success">研究生员工</el-tag>
          </template>
          <template v-if="row.item.empType == 4" >
            <el-tag type="success">委培研究生员工</el-tag>
          </template>
          <template v-if="row.item.empType == 5" >
            <el-tag type="success">实习生</el-tag>
          </template>
        </template>

        <template v-slot:deptId="row">
          <template >
            {{changeDept(row)}}
          </template>
        </template>


      </baseTable>
    </el-container>
    <baseDialog :title="titles" ref="addOrUpdateDialog" :width="'800px'" :height="'600px'">
      <template>
        <addOrUpdate @refreshDataList="refresh" ref="addOrUpdate"></addOrUpdate>
      </template>
    </baseDialog>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog'
import addOrUpdate from './addOrUpdata.vue'

export default {
  data() {
    return {
      titles: '',
      dataForm: {
        name: '',
        deptId: '',
        empId: ''
      },
      managerList:{},
      deptList:[],
      tableData: {
        theads: [
          {label: '姓名', prop: 'name',width:'100px'},
          {label: '邮箱', prop: 'mailbox',width:'180px'},
          {label: '部门', prop: 'deptId',width: "120px",slotName:'deptId'},
          {label: '职位', prop: 'empPost',width: "120px"},
          {label: '直接上级', prop: 'parentId',width: "120px",slotName:'parentId'},
          // {label: '团队', prop: 'teamId',width: "120px"},
          {label: '工号', prop: 'empId',width: "120px"},
          {label: '入职时间', prop: 'entryDate',width: "120px"},
          {label: '离职时间', prop: 'departDate',width: "120px"},
          {label: '是否管理员', prop: 'admin',width: "120px",slotName:'admin'},
          {label: '状态', prop: 'state',width: "120px",slotName:'state'},
          {label: '离职状态', prop: 'departStatus',width: "120px",slotName:'departStatus'},
          {label: '员工类型', prop: 'empType',width: "120px",slotName:'empType'},
          {label: '级别', prop: 'empLevel'},
          {label: '工作地点', prop: 'empLocation'},
          {label: '创建时间', prop: 'createTime'},
          {label: '更新时间', prop: 'updateTime'},
          {label: '创建人', prop: 'createUser'},
          {label: '更新人', prop: 'updateUser'},
          {label: '操作', prop: 'clientType',fixed:'right',width:'120px',slotName:'clientType'}
        ],
        url: '/employee/selectEmployeeListWithPage'
      }
    }
  },
  components: {
    baseTable, baseDialog, addOrUpdate
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    //初始化deptList
    this.$http({
      url: this.$http.adornUrl('/deptInfo/listAll'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.deptList = data.payload.list
      } else {
        this.$message.error(data.msg)
      }
    })


  },
  methods: {
    changeDept(row){
      let name
      this.deptList.forEach(dept =>{
        if(dept.id === row.item.deptId){
          name =  dept.deptName
        }
      })

      return name;
    },
    changeParentId(row){
      let name
      this.deptList.forEach(dept =>{
        if(dept.id === row.item.parentId){
          name =  dept.deptName
        }
      });
      return name;
    },
    changeManagerId(row){

      console.log(this.managerName)
      let name
      this.managerList.forEach(manager =>{
        if(manager.managerId === row.item.parentId){
          name =  manager.managerName
        }
      });

      return name;
    },
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },
    add() {
      this.titles = '添加员工'
      this.$refs.addOrUpdateDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('add', false,this.managerList)
      })
    },
    alter(row) {
      this.titles = '员工编辑'
      this.$refs.addOrUpdateDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row.item, true,this.managerList)
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
  padding-top: 20px;
  padding-left: 20px;
  display: flex;
}

.el-form--inline > .inputlist > .el-form-item {
  width: 26%;
  margin-bottom: 20px;
}

.el-form-item__content {
  width: 200px;
}

.el-button {
  width: 80px;
  height: 35px;
}

.el-button-func {
  width: 86px;
  height: 30px;
  text-align: center;
}
::v-deep .el-table__cell{
  text-align: center;
}
::v-deep .el-table__cell {
  padding: 2px 0 !important;
}
</style>
