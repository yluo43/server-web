<template>
  <div style="height: calc(100vh - 127px); background: white">
    <el-container style="height: 100%; width: 100%">
      <div style="height: 100%; width: 50%; display: flex; flex-direction: column">
        <div style="display: flex; padding: 20px 20px 20px 20px; justify-content: space-between">
          <el-tabs v-model="activeName" type="border-card" @tab-click="tabChange">
            <el-tab-pane label="活跃部门" name="first"></el-tab-pane>
            <el-tab-pane label="所有部门" name="second"></el-tab-pane>
          </el-tabs>
          <div>
            <el-button class="el-button-func" type="primary" @click="add()" v-auth="'deptInfo:add'">添加部门</el-button>
          </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column">
          <el-input style="width: 100%; padding: 0 20px" placeholder="请输入部门名称" v-model="keyword"></el-input>
          <div style="margin-top: 20px; padding: 0 20px; height: 435px; overflow-y: auto">
            <el-tree
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              default-expand-all
              :filter-node-method="filterNode"
              @node-click="alter"
              ref="tree"
            ></el-tree>
          </div>
        </div>
      </div>
      <el-drawer :title="title" :visible.sync="drawer" :direction="direction" size="20%">
        <el-form :inline="true" :disabled="isDisabled" :model="editDataForm" ref="editDataForm" class="editForm">
          <div>
            <!--            <el-form-item label="部门ID" prop="id" :rules="[ { required: true, message: '部门ID不能为空'}]" >-->
            <!--              <el-input v-model="editDataForm.id"  clearable  maxlength="50"></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="部门名称" prop="deptName" :rules="[{ required: true, message: '部门名称不能为空' }]">
              <el-input v-model="editDataForm.deptName" placeholder="请输入部门名称" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="部门经理" prop="managerId" :rules="[{ required: managerRequired, message: '部门经理不能为空' }]">
              <el-select clearable v-model="editDataForm.managerId" placeholder="请选择部门负责人">
                <el-option v-for="item in managerList" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="部门助理" prop="assistantId">
              <el-select clearable v-model="editDataForm.assistantId" placeholder="请选择部门助理">
                <el-option v-for="item in assistList" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上级部门" prop="parentId">
              <el-select clearable v-model="editDataForm.parentId" placeholder="请选择上级部门">
                <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="团队" v-if="op == 'alter'">
              <div style="border: 1px solid lightgray; width: 190px; max-height: 200px; overflow-y: auto">
                <el-tree :data="editDataForm.deptTeam" :props="defaultProps" default-expand-all ref="deptTeam"></el-tree>
              </div>
            </el-form-item>

            <el-form-item label="状态" prop="state" v-if="showStatus">
              <el-radio-group v-model="editDataForm.state">
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="1">解散</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="说明" prop="remarks">
              <el-input
                type="textarea"
                show-word-limit
                :maxlength="50"
                v-model="editDataForm.remarks"
                placeholder="请输入部门说明"
                clearable
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div style="display: flex; justify-content: flex-end; margin-top: 30px; margin-right: 10px">
          <el-button @click="drawer = false">取消</el-button>
          <el-button v-if="!isDisabled" type="primary" style="margin-right: 20px" @click="editSubmit()">确认</el-button>
        </div>
      </el-drawer>
    </el-container>
  </div>
</template>
<script>
export default {
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      activeName: 'first',
      keyword: '',
      isDisabled: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      managerRequired: false,
      showStatus: false,
      drawer: false,
      direction: 'rtl',
      title: '',
      dataForm: {
        deptName: '',
        managerName: ''
      },
      editDataForm: {
        deptName: '',
        id: '',
        managerId: '',
        assistantId: '',
        parentId: '',
        parentName: '',
        managerName: '',
        status: '',
        remarks: '',
        deptTeam: []
      },
      deptList: [],
      managerList: [],
      assistList: []
    }
  },

  mounted() {
    this.getDeptInfoTree({ state: 0 })
    //初始化deptList
    this.$http({
      url: this.$http.adornUrl('/deptInfo/listAll'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.deptList = data.payload.list
      } else {
        this.$message.error(data.msg)
      }
    })

    //初始化部门助理
    this.$http({
      url: this.$http.adornUrl('/common/getManager?pid=2'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.assistList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    tabChange() {
      if (this.activeName === 'first') {
        this.getDeptInfoTree({ state: 0 })
      } else {
        this.getDeptInfoTree()
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    //获取部门树
    getDeptInfoTree(params) {
      this.$http({
        url: this.$http.adornUrl('/deptInfo/tree'),
        method: 'get',
        params: params
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.data = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取部门详情
    getDeptDetial(params) {
      this.$http({
        url: this.$http.adornUrl('/deptInfo/detail'),
        method: 'get',
        params: params
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.editDataForm = { ...data.payload }
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    //树数据转换
    treeChange(treeData) {
      treeData.map((ele) => {
        ele.label = ele.name
        if (ele.children && ele.children.length != 0) this.treeChange(ele.children)
      })
      return treeData
    },
    changeParentId(row) {
      let name
      this.deptList.forEach((dept) => {
        if (dept.id === row.item.parentId) {
          name = dept.deptName
        }
      })
      return name
    },
    changeManagerId(row) {
      let name
      this.managerList.forEach((manager) => {
        if (manager.managerId === row.item.managerId) {
          name = manager.managerName
        }
      })

      return name
    },

    add() {
      this.title = '部门添加'
      this.drawer = true
      this.isDisabled = false
      this.op = 'add'
      this.clear(this.editDataForm)
      delete this.editDataForm['deptTeam']
      this.showStatus = false
      this.managerRequired = false

      //初始化managerList
      this.$http({
        url: this.$http.adornUrl('/common/getManager?pid=1'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.managerList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增
    editSubmit() {
      let go
      this.$refs['editDataForm'].validate((valid) => {
        go = valid
      })

      if (!go) {
        return
      }

      let url
      if (this.op == 'add') {
        url = '/deptInfo/add'
      } else {
        url = '/deptInfo/update'
      }

      this.managerList.forEach((manager) => {
        if (manager.id == this.editDataForm.managerId) {
          this.editDataForm.managerName = manager.name
        }
      })
      this.assistList.forEach((item) => {
        if (item.id == this.editDataForm.assistantId) {
          this.editDataForm.assistantName = item.name
        }
      })
      if (this.editDataForm.state == 0) {
        this.editDataForm.stateName = '正常'
      } else {
        this.editDataForm.stateName = '解散'
      }

      if (this.editDataForm.parentId == '' || this.editDataForm.parentId == null) {
        this.editDataForm.parentId = 0
        this.editDataForm.parentName = '新讯数字科技有限公司'
      } else {
        this.deptList.forEach((dept) => {
          if (dept.id == this.editDataForm.parentId) {
            this.editDataForm.parentName = dept.deptName
          }
        })
      }

      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(this.editDataForm)
      }).then(({ data }) => {
        if (data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.tabChange()
          this.drawer = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    alter(params) {
      this.managerRequired = true
      this.drawer = true
      this.title = '部门详情'
      this.op = 'alter'
      this.showStatus = true
      this.getDeptDetial({ id: params.id })
      this.checkDept({ id: params.id })
      //初始化managerList
      this.$http({
        url: this.$http.adornUrl('/common/getDeptManager?pid=1&deptId=' + params.id),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.managerList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //校验是否有编辑权限
    checkDept(params) {
      this.$http({
        url: this.$http.adornUrl('/deptInfo/checkDept'),
        method: 'get',
        params: params
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.isDisabled = !data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    clear(form) {
      Object.keys(form).forEach((key) => (form[key] = ''))
    },
    deleteList(row) {
      let id = ''
      id = row.item.id

      this.$confirm(`您确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/deptInfo/delete?id=' + id),
            method: 'post'
          }).then(({ data }) => {
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0px;
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
::v-deep .el-table__cell {
  text-align: center;
}

::v-deep .editForm .el-form-item__label {
  width: 80px !important;
}
::v-deep .editForm .el-form-item {
  width: 100% !important;
}
</style>
