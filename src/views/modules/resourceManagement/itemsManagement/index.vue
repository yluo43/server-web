<template>
  <div style="height: 100%;">
    <el-container >
      <el-header >
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="部门名称:" prop="account">
              <el-input v-model="dataForm.name" placeholder="请输入部门名称" clearable></el-input>
            </el-form-item>
<!--            <el-form-item label="部门负责人:" prop="phone">-->
<!--              <el-input v-model="dataForm.managerName" placeholder="请输入部门负责人" clearable></el-input>-->
<!--            </el-form-item>-->



            <div style="display: contents;">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询
              </el-button>
              <el-button type="primary" @click="resetForm()" icon="el-icon-search">重置</el-button>
            </div>
          </div>
        </el-form>
      </el-header>
      <div style="padding:20px 0 10px 2px;">
        <el-button class="el-button-func" type="primary" @click="addOrAlter()" style="width: 125px">添加项目（事由）</el-button>
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

        <template v-slot:deptId="row">
          <template >
            {{changeDept(row)}}
          </template>
        </template>


      </baseTable>
    </el-container>
    <baseDialog :title="titles" ref="addOrUpdateDialog" :width="'450px'" :height="'600px'">
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
      },
      deptList:[],

      tableData: {
        theads: [
          // {label: 'ID', prop: 'id',width:'100px'},
          {label: '项目名称', prop: 'name'},
          {label: '所属部门', prop: 'deptId',slotName:'deptId'},
          // {label: '团队(暂无)', prop: 'teamId'},
          {label: '创建时间', prop: 'createTime'},
          {label: '更新时间', prop: 'updateTime'},
          {label: '创建人', prop: 'createUser'},
          {label: '更新人', prop: 'updateUser'},
          {label: '操作', prop: 'clientType',slotName: 'clientType'}
        ],
        url: '/costItems/list'
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
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },
    addOrAlter() {
      this.titles = '添加项目（事由）'
      this.$refs.addOrUpdateDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('add', false,this.managerList)
      })
    },
    alter(row) {
      this.titles = '修改项目（事由）'
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
          url: this.$http.adornUrl('/costItems/delete?id='+id),
          method: 'post',
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
</style>
