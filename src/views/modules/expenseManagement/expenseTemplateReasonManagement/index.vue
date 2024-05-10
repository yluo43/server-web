<template>
  <div style="height: 100%">
    <el-container>
      <el-header style="height: 100%">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist">
            <el-form-item label="报销项目名称:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入报销项目名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="报销项目归属部门:" prop="deptId">
              <el-select v-model="dataForm.deptId" placeholder="请选择报销项目归属部门" :multiple="true" :collapse-tags="true">
                <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联项目:" prop="projectId">
              <el-select v-model="dataForm.projectId" filterable placeholder="请选择关联项目" multiple collapse-tags clearable>
                <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联项目归属部门:" prop="projectDeptId">
              <el-select v-model="dataForm.projectDeptId" placeholder="请选择关联项目归属部门" :multiple="true" :collapse-tags="true">
                <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
              <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
            </el-form-item>
          </div>
        </el-form>

        <div class="chooseResult">
          <span>已选中 {{ count }} 项</span>
          <el-button type="text" @click="batchDelete()">批量删除</el-button>
        </div>
      </el-header>
      <div class="operate-button">
        <el-button class="btn-download" icon="el-icon-download" type="primary" @click="download()">批量下载</el-button>
        <el-button class="el-button-func" type="primary" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
      </div>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="alter(row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em" @click="deleteList(row)" />
            </el-tooltip>

            <!-- <svg-icon :icon-class="'delete'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteList(row)" />
            <svg-icon :icon-class="'amend'" style="height: 1.5em; width: 1.5em" @click="alter(row)" /> -->
          </template>
        </template>
      </baseTable>
      <el-drawer :title="title" :visible.sync="drawer" :direction="direction" size="23%">
        <div style="padding: 0 50px">
          <el-form :inline="true" :model="editDataForm" :rules="rules" ref="editDataForm" class="drawerForm">
            <el-form-item label="报销项目名称:" prop="name">
              <el-input v-model="editDataForm.name" placeholder="请输入报销项目名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="报销项目归属部门:" prop="deptName">
              <el-select v-model="editDataForm.deptName" placeholder="请选择报销项目归属部门">
                <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.name" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="关联项目:" prop="projectName">
              <el-select v-model="editDataForm.projectName" filterable placeholder="请选择关联项目" clearable>
                <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="关联项目:" prop="value">
              <el-cascader
                clearable
                :append-to-body="false"
                placeholder="请选择关联项目"
                style="width: 100%"
                v-model="editDataForm.value"
                :options="options"
              ></el-cascader>
            </el-form-item>
            <div style="display: flex; justify-content: flex-end; margin-top: 60px">
              <el-button type="primary" style="margin-right: 20px" @click="editSubmit('editDataForm')">确定</el-button>
              <el-button @click="drawer = false">取消</el-button>
            </div>
          </el-form>
        </div>
      </el-drawer>
    </el-container>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import { getCName } from '@/utils/auth'

export default {
  components: {
    baseTable,
    baseDialog
  },
  data() {
    return {
      //选中项
      count: 0,
      //成本项目
      costItems: [],
      departments: [],
      deleteIds: [],
      drawer: false,
      direction: 'rtl',
      title: '',
      dataForm: {
        name: '',
        deptId: [],
        projectId: [],
        projectDeptId: []
      },
      editDataForm: {
        name: '',
        deptName: '',
        projectName: '',
        value: []
      },
      tableData: {
        theads: [
          { label: '报销项目名称', prop: 'name' },
          { label: '报销项目归属部门', prop: 'deptName' },
          { label: '关联项目', prop: 'projectName' },
          { label: '关联项目归属部门', prop: 'projectDeptName' },
          { label: '操作', prop: 'clientType', slotName: 'clientType' }
        ],
        url: '/staticItem/listPage'
      },
      rules: {
        name: [{ required: true, message: '请输入报销项目名称', trigger: 'blur' }],
        deptName: [{ required: true, message: '请选择报销项目归属部门', trigger: 'change' }]
        //  projectName: [{ required: true, message: '请选择关联项目', trigger: 'change' }]
      },
      options: []
    }
  },
  mounted() {
    //初始化项目
    this.getProject()
    //初始化部门
    this.getDept()
    //查询
    this.refresh()
    //初始化关联项目
    this.getProjectTreeWithDept()
  },
  methods: {
    //获取关联项目
    getProjectTreeWithDept() {
      this.$http({
        url: this.$http.adornUrl('/common/getProjectTreeWithDept'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          data.payload.map((item, index) => {
            if (item.deptId == 0) {
              data.payload.splice(index, 1)
            }
          })
          this.options = this.treeChange(data.payload)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //树数据转换
    treeChange(treeData) {
      treeData.map((ele) => {
        ele.value = ele.deptId || ele.id
        ele.label = ele.deptName || ele.name
        if (ele.children && ele.children.length != 0) this.treeChange(ele.children)
      })
      return treeData
    },

    //获取项目
    getProject() {
      this.$http({
        url: this.$http.adornUrl('/common/getTotalProject'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.costItems = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    //获取部门
    getDept() {
      this.$http({
        url: this.$http.adornUrl('/common/getDeptByRole'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.departments = data.payload.filter((item) => item.id !== 0)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //表格数据查询
    refresh() {
      let params = {
        name: this.dataForm.name,
        deptId: this.dataForm.deptId.toString(),
        projectId: this.dataForm.projectId.toString(),
        projectDeptId: this.dataForm.projectDeptId.toString()
      }
      this.$refs.table.refresh(params)
    },
    //表格选中
    onSelect(selection) {
      this.deleteIds = []
      if (selection.length > 0) {
        this.count = selection.length
        selection.forEach((item) => {
          this.deleteIds.push(item.id)
        })
      } else {
        this.count = 0
      }
    },
    //删除
    deleteList(row) {
      this.deleteIds = []
      this.deleteIds.push(row.item.id)
      this.$confirm(`确定删除"${row.item.name}"吗？删除后将无法恢复!`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/staticItem/delete'),
            method: 'get',
            params: { ids: this.deleteIds.toString() }
          }).then(({ data }) => {
            if (data.success && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //批量删除
    batchDelete() {
      if (this.deleteIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      this.$confirm('已选中' + this.deleteIds.length + '条数据,确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/staticItem/delete'),
            method: 'get',
            params: { ids: this.deleteIds.toString() }
          }).then(({ data }) => {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //新增
    add() {
      this.drawer = true
      this.title = '添加'
      this.clear(this.editDataForm)
    },
    clear(form) {
      for (let key in form) {
        if (Array.isArray(form[key])) {
          form[key] = []
        } else {
          form[key] = ''
        }
      }
    },
    //编辑
    alter(row) {
      let projectDeptId = null

      this.drawer = true
      this.title = '编辑'
      this.editDataForm = { ...row.item }
      this.departments.map((item) => {
        if (item.name == row.item.projectDeptName) {
          projectDeptId = item.id
        }
      })
      this.editDataForm.value = [projectDeptId, Number(row.item.projectId)]
      console.log(this.editDataForm)
    },
    //保存
    editSubmit(formName) {
      // let user = getCName()
      // this.editDataForm.updateUser = user

      this.departments.forEach((item) => {
        if (item.name == this.editDataForm.deptName) {
          this.editDataForm.deptId = item.id
        }
        if (item.id == this.editDataForm.value[0]) {
          this.editDataForm.projectDeptName = item.name
        }
      })
      this.editDataForm.projectId = this.editDataForm.value[1]
      this.costItems.forEach((item) => {
        if (item.id == this.editDataForm.projectId) {
          this.editDataForm.projectName = item.name
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == '添加') {
            this.$http({
              url: this.$http.adornUrl('/staticItem/insert'),
              method: 'post',
              data: this.$http.adornData(this.editDataForm)
            }).then(({ data }) => {
              if (data.success) {
                this.refresh()
                this.$message.success(data.msg)
                this.drawer = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            this.$http({
              url: this.$http.adornUrl('/staticItem/update'),
              method: 'put',
              data: this.$http.adornData(this.editDataForm)
            }).then(({ data }) => {
              if (data.success) {
                this.refresh()
                this.$message.success(data.msg)
                this.drawer = false
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    //抽屉关闭二次确认
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then((_) => {
    //       done()
    //     })
    //     .catch((_) => {})
    // },
    //批量下载
    download() {
      if (this.deleteIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let form = { ...this.dataForm }
      form.ids = this.deleteIds
      this.$http.downloadPost(this.$http.adornUrl('/staticItem/export'), this.$http.adornParams(form), this)
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  color: #333;
  padding: 0 0;
}
::v-deep .el-drawer__body {
  overflow: hidden;
}
.el-input {
  width: 200px;
}
::v-deep .drawerForm {
  .el-form-item__label {
    width: 120px !important;
  }
  .el-form-item {
    width: 100% !important;
  }
  .el-form-item__content {
    width: calc(100% - 120px);
  }
  .el-input,
  .el-select {
    width: 100%;
  }
}

.el-button-func {
  width: 86px;
  height: 28px;
}
::v-deep .el-table__cell {
  text-align: center;
}
</style>
