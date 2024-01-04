<template>
  <div style="height: 100%;">
    <el-container >
      <el-header >
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
<!--            <el-form-item label="部门名称:" prop="account">-->
<!--              <el-input v-model="dataForm.deptName" placeholder="请输入部门名称" clearable></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="部门负责人:" prop="phone">-->
<!--              <el-input v-model="dataForm.managerName" placeholder="请输入部门负责人" clearable></el-input>-->
<!--            </el-form-item>-->
<!--            <div style="display: contents;">-->
<!--              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询-->
<!--              </el-button>-->
<!--              <el-button type="primary" @click="resetForm()" icon="el-icon-search">重置</el-button>-->
<!--            </div>-->
          </div>
        </el-form>
      </el-header>
      <div style="padding:20px 0 10px 2px;">
        <el-button class="el-button-func" type="primary" @click="addOrAlter()">添加团队</el-button>
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

        <template v-slot:managerSlot="row">
          <template >
            {{changeManagerId(row)}}
          </template>
        </template>


        <template v-slot:parentId="row">
          <template >
            {{changeParentId(row)}}
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
        deptName: '',
        managerName: ''
      },
      tableData: {
        theads: [
          {label: 'ID', prop: 'id',width:'100px'},
          {label: '项目名称', prop: 'name'},
          {label: '所属部门', prop: 'deptId'},
          {label: '团队', prop: 'teamId'},
          {label: '创建时间', prop: 'createTime'},
          {label: '更新时间', prop: 'updateTime'},
          {label: '创建人', prop: 'createUser'},
          {label: '更新人', prop: 'updateUser'}
        ],
        url: '/deptInfo/list'
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

    //初始化managerList
    // this.$http({
    //   url: this.$http.adornUrl('/userRole/list'),
    //   method: 'get'
    // }).then(({data}) => {
    //   if (data && data.code === 200) {
    //     this.managerList = data.payload
    //   } else {
    //     this.$message.error(data.msg)
    //   }
    // })
  },
  methods: {
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
      let name
      this.managerList.forEach(manager =>{
        if(manager.managerId === row.item.managerId){
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
    addOrAlter() {
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
          url: this.$http.adornUrl('/deptInfo/delete?id='+id),
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
