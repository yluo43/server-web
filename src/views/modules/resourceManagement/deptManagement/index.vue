<template>
  <div style="height: 100%;">
    <el-container >
      <el-header >
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist" >
            <el-form-item label="部门名称:" prop="account">
              <el-input v-model="dataForm.deptName" placeholder="请输入部门名称" clearable maxlength="50"></el-input>
            </el-form-item>

<!--            <el-form-item label="部门名称:" prop="account">-->
<!--              <el-input v-model="dataForm.deptName" placeholder="请输入部门名称" clearable maxlength="50"></el-input>-->
<!--            </el-form-item>-->



            <div style="display: contents;">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询
              </el-button>
              <el-button class="el-button-func" type="primary" @click="add()">添加部门</el-button>

              <!--              <el-button type="primary" @click="resetForm()" icon="el-icon-search">重置</el-button>-->
            </div>
          </div>
        </el-form>
      </el-header>
<!--      <div style="padding:0 0 10px 2px;">-->
<!--        <el-button class="el-button-func" type="primary" @click="add()">添加部门</el-button>-->
<!--      </div>-->
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" >
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
<!--            <svg-icon :icon-class="'delete'" style="height:1.5em;width:1.5em; margin-right: 2em;" @click="deleteList(row)"/>-->
            <svg-icon :icon-class="'amend'" style="height:1.5em;width:1.5em;" @click="alter(row)"/>
          </template>
        </template>
        <template v-slot:parentId="row">
          <template >
            {{changeParentId(row)}}
          </template>
        </template>
      </baseTable>

      <el-drawer
        :title="title"
        :visible.sync="drawer"
        :direction="direction"
        size="17%"
      >
        <el-form :inline="true"  :model="editDataForm" ref="editDataForm" class="editForm">
          <div>
<!--            <el-form-item label="部门ID" prop="id" :rules="[ { required: true, message: '部门ID不能为空'}]" >-->
<!--              <el-input v-model="editDataForm.id"  clearable  maxlength="50"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="部门名称" prop="deptName" :rules="[ { required: true, message: '部门名称不能为空'}]">
              <el-input v-model="editDataForm.deptName"  placeholder="请输入部门名称" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="部门经理" prop="managerId" :rules="[ { required: true, message: '部门经理不能为空'}]">
              <el-select  v-model="editDataForm.managerId" placeholder="请选择部门负责人" >
                <el-option      v-for="item in managerList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="部门助理" prop="assistantId">
              <el-select  v-model="editDataForm.assistantId" placeholder="请选择部门负责人" >
                <el-option      v-for="item in assistList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级部门" prop="parentId" >
              <el-select  v-model="editDataForm.parentId" placeholder="请选择上级部门" >
                <el-option      v-for="item in deptList"
                                :key="item.id"
                                :label="item.deptName"
                                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="状态" prop="state">
              <el-select  v-model="editDataForm.state" placeholder="请选择" >
                <el-option :key="1" label="解散" :value="1"></el-option>
                <el-option :key="0" label="正常" :value="0"></el-option>

              </el-select>
            </el-form-item>


            <el-form-item label="说明" prop="remarks">
              <el-input v-model="editDataForm.remarks"  placeholder="请输入部门说明" clearable maxlength="50"></el-input>
            </el-form-item>


            <div style="display: inline-block; margin-top: 30px;margin-left: 30px">
              <el-button type="primary"  icon="el-icon-search" style="margin-right: 20px" @click="editSubmit()">保存</el-button>
              <el-button   icon="el-icon-refresh-right" @click="drawer = false">取消</el-button>
            </div>
          </div>
        </el-form>

      </el-drawer>

    </el-container>

  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog'

export default {
  data() {
    return {
      drawer:false,
      direction: 'rtl',
      title: '',
      dataForm: {
        deptName: '',
        managerName: ''
      },
      editDataForm:{
        deptName:'',
        id:'',
        managerId:'',
        assistantId:'',
        parentId:'',
        managerName:'',
        status:'',
        remarks:''
      },
      deptList:[],
      managerList:[],
      assistList:[],
      tableData: {
        theads: [
          {label: '部门序号', prop: 'id',width:'100px'},
          {label: '部门名称', prop: 'deptName'},
          // {label: '部门负责人', prop: 'managerId',width: "120px",slotName: 'managerSlot'},
          {label: '部门经理', prop: 'managerName'},
          {label: '部门助理', prop: 'assistantName'},
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
      url: this.$http.adornUrl('/common/getManager?pid=1'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {

        this.managerList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    //初始化部门助理
    this.$http({
      url: this.$http.adornUrl('/common/getManager?pid=2'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.assistList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })

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

      this.$refs.table.refresh(this.dataForm)

      // this.$refs.dataForm.validate((valid) => {
      //   if (!valid) {
      //     return false
      //   }
      //   this.$refs.table.refresh(this.dataForm)
      // })
    },
    add() {
      this.title = '部门添加'
      this.drawer = true
      this.op = 'add'
      this.clear(this.editDataForm)

    },
    // 新增
    editSubmit() {
      let go
      this.$refs['editDataForm'].validate((valid) => {
        go = valid
      });

      if(!go){
        return ;
      }


      let url
      if(this.op=='add'){
        url = '/deptInfo/add'
      }else{
        url = '/deptInfo/update'
      }

      this.managerList.forEach(manager =>{
        if(manager.empId == this.editDataForm.managerId){
          this.editDataForm.managerName = manager.name
        }
      })

      if(this.editDataForm.parentId==''||this.editDataForm.parentId==null){
        this.editDataForm.parentId = 0
      }

      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(
          this.editDataForm
        )
      }).then(({ data }) => {
        if (data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.refresh()
          this.drawer = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    alter(row) {
      this.title = '部门编辑'
      this.drawer = true
      this.op = 'alter'

      this.editDataForm = {...row.item}

    },
    clear(form){
      Object.keys(form).forEach(key => (form[key] = ''));
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


::v-deep .editForm .el-form-item__label{
  width: 80px !important;
}
::v-deep .editForm .el-form-item{
  width: 100% !important;
}

</style>
