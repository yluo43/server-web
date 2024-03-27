<template>
  <div style="height: 100%;">
    <el-container >
      <el-header >
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="部门名称:" prop="account">
              <el-input v-model="dataForm.deptName" placeholder="请输入部门名称" clearable></el-input>
            </el-form-item>
            <div style="display: contents;">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询
              </el-button>
              <el-button type="primary" @click="resetForm()" icon="el-icon-search">重置</el-button>
            </div>
          </div>
        </el-form>
      </el-header>

      <baseTable :tableData="tableData" ref="table" :multiSelect="true" >


      </baseTable>
    </el-container>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog'

export default {
  data() {
    return {
      titles: '',
      dataForm: {
        deptName: '',
      },
      deptList:[],
      managerList:[
      ],
      tableData: {
        theads: [
          {label: '部门序号', prop: 'id',width:'100px'},
          {label: '部门名称', prop: 'deptName'},
          // {label: '部门负责人', prop: 'managerId',width: "120px",slotName: 'managerSlot'},
          {label: '部门负责人', prop: 'managerName'},
          {label: '上级部门', prop: 'parentId',width: "120px",slotName:'parentId'},
          // {label: '上级部门', prop: 'pDeptName'},
          {label: '操作', prop: 'clientType', slotName: 'clientType'}
        ],
        url: '/deptInfo/list'
      }
    }
  },
  components: {
    baseTable, baseDialog
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

    //初始化managerList
    this.$http({
      url: this.$http.adornUrl('/employee/selectEmployeeList'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        data.payload.forEach(data=>{
          if(data.empLevel=='6-'||data.empLevel=='6'||data.empLevel=='7'||data.empLevel=='8'||data.empLevel=='9'||data.empLevel=='6+'){
            this.managerList.push(data)
          }
        })
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {

    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
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
</style>
