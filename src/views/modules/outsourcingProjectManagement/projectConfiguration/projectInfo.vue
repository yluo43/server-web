<template>
  <div class="main-box">
    <div class="left">
      <div class="left-right-header">
        <div class="header-title">基本信息</div>
        <el-button v-if="!editMode" type="primary" @click="edit">编辑</el-button>
        <div v-if="editMode">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <div v-if="editMode" class="form-info">
        <el-form ref="projectForm" :model="projectFormData" label-width="100px">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="projectFormData.name" placeholder="请输入项目名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目经理:" prop="managerId">
            <el-cascader
                v-model="projectManagerId"
                :options="projectManagers"
                placeholder="请选择项目经理"
                :show-all-levels="false"
                @change="changeManagerId"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="关联项目:" prop="projectId">
            <el-select v-model="projectFormData.projectId" placeholder="请选择关联项目" clearable>
              <el-option
                  v-for="item in associatedProjects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目客户:" prop="customerId">
            <el-select v-model="projectFormData.customerId" placeholder="请选择项目客户" clearable @change="customerChange">
              <el-option
                  v-for="item in customerNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户所属集团:" prop="belongGroup">
            <el-input v-model="projectFormData.belongGroup" placeholder="客户所属集团" disabled></el-input>
          </el-form-item>
          <el-form-item label="项目开始日期:" prop="startTime">
            <el-date-picker
                v-model="projectFormData.startTime"
                style="width: 100%"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始日期"
                clearable
            />
          </el-form-item>
          <el-form-item label="项目结束日期:" prop="endTime">
            <el-date-picker
                v-model="projectFormData.endTime"
                style="width: 100%"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束日期"
                clearable
            />
          </el-form-item>
          <el-form-item label="备注:" prop="notes">
            <el-input v-model="projectFormData.remark" type="textarea" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="form-info">
        <el-form ref="projectForm" :model="projectFormDataOrigin" label-width="100px" class="form-item">
          <el-form-item label="项目名称:" prop="name">
            {{ projectFormDataOrigin.name }}
          </el-form-item>
          <el-form-item label="项目经理:" prop="managerName">
            {{ projectFormDataOrigin.managerName }}
          </el-form-item>
          <el-form-item label="关联项目:" prop="projectName">
            {{ projectFormDataOrigin.projectName }}
          </el-form-item>
          <el-form-item label="项目客户:" prop="customerName">
            {{ projectFormDataOrigin.customerName }}
          </el-form-item>
          <el-form-item label="客户所属集团:" prop="belongGroup">
            {{ projectFormDataOrigin.belongGroup }}
          </el-form-item>
          <el-form-item label="项目开始日期:" prop="startTime">
            {{ projectFormDataOrigin.startTime }}
          </el-form-item>
          <el-form-item label="项目结束日期:" prop="endTime">
            {{ projectFormDataOrigin.endTime }}
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            {{ projectFormDataOrigin.remark }}
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="right">
      <div class="left-right-header">
        <div class="header-title">岗位单价信息</div>
        <el-button
            class="btn-download"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="addUnit"
        >添加岗位
        </el-button>
      </div>
      <el-divider></el-divider>
      <div style="margin: 20px">
        <baseTable ref="table" :table-data="tableData" :multi-select="true" @updateTable="updateTable">
          <template v-slot:clientType="row">
            <!--类型插槽-->
            <template>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <svg-icon
                    :icon-class="'delete-icon'"
                    style="height: 1.5em; width: 1.5em; margin-right: 2em"
                    @click="deleteItem(row.item)"
                />
              </el-tooltip>
            </template>
          </template>
        </baseTable>
      </div>
    </div>
    <base-drawer ref="addUnitDrawer" title="新增岗位" size="23%">
      <template>
        <addUnit ref="addUnit" @closeDrawer="closeAddUnitDrawer"/>
      </template>
    </base-drawer>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableEdit.vue'
import baseDrawer from '@/views/modules/base/baseDrawer.vue'
import addUnit from './addUnit.vue'

export default {
  components: {baseTable, baseDrawer, addUnit},
  data() {
    return {
      // 是否是编辑模式
      editMode: false,
      associatedProjects: [],
      membershipGroups: [],
      tableData: {
        theads: [
          {label: '岗位', prop: 'name'},
          {label: '级别', prop: 'level'},
          {label: '单价（含税/元）', prop: 'unitPrice'},
          {label: '单价（不含税/元）', prop: 'taxUnitPrice'},
          {label: '类型（按n天计）', prop: 'type'},
          {label: '操作', slotName: 'clientType'}
        ],
        url: '/externalProject/listProjectUnitPrice'
      },
      projectManagerId: [],
      projectManagers: [],
      customerNames: [],
      projectFormData: {
        // 项目名称
        name: '',
        // 项目经理
        managerId: '',
        managerName: '',
        // 关联项目
        projectId: '',
        projectName: '',
        customerName: '',
        // 项目客户
        customerId: '',
        // 客户所属集团
        belongGroup: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 备注
        remark: ''
      },
      projectFormDataOrigin: {
        // 项目名称
        name: '',
        // 项目经理
        managerId: '',
        managerName: '',
        // 关联项目
        projectId: '',
        projectName: '',
        customerName: '',
        // 项目客户
        customerId: '',
        // 客户所属集团
        belongGroup: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 备注
        remark: ''
      }
    }
  },

  mounted() {
    this.$http({
      url: this.$http.adornUrl('/externalProject/listRelProjectData'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.associatedProjects = data.payload.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })
    this.$http({
      url: this.$http.adornUrl('/common/getManagerData'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.projectManagers = data.payload.map(dept => {
          const transformedDept = {
            value: dept.deptId,
            label: dept.deptName,
            children: dept.managerDtoList.map(manager => ({
              value: manager.id, // 同样，将id转换为字符串
              label: manager.name
            }))
          }
          return transformedDept
        })
      } else {
        this.$message.error(data.msg)
      }
    })

    this.$http({
      url: this.$http.adornUrl('/externalProject/listCustomer?pageSize=999'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.customerNames = data.payload.list.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    init(projectFormData) {
      this.projectFormData = projectFormData
      this.projectManagerId = [projectFormData.deptId, projectFormData.managerId]
      Object.assign(this.projectFormDataOrigin,this.projectFormData)
      this.refreshTable()
    },
    updateTable(row){
      this.$http({
        url: this.$http.adornUrl('/externalProject/updateProjectUnitPrice'),
        method: 'put',
        data: row
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    changeManagerId(a) {
      this.projectManagers.forEach(e => {
        if (e.value === a[0]) {
          e.children.forEach(f => {
            if (f.value === a[1]) {
              this.projectFormData.managerName = f.label
              return
            }
          })
        }
      })
    },
    customerChange(i){
      this.customerNames.forEach(e=>{
        if(i === e.id){
          this.projectFormData.customerName = e.name
          this.projectFormData.belongGroup = e.belongGroup
          return
        }
      })
    },
    refreshTable() {
      let queryParams = {}
      queryParams.projectId = this.projectFormData.id
      this.$refs.table.refresh(queryParams)
    },
    edit() {
      this.editMode = true
    },
    cancel() {
      this.editMode = false
    },
    confirm() {
      this.projectFormData.managerId = this.projectManagerId[1]
      this.$http({
        url: this.$http.adornUrl('/externalProject/updateExternalProject'),
        method: 'put',
        data: this.projectFormData
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          Object.assign(this.projectFormDataOrigin, this.projectFormData)
          this.editMode = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 删除
    deleteItem(row) {
      const message = `确定删除${row.name}岗位吗？`
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('/externalProject/deleteProjectUnitPrice?id=' + row.id),
              method: 'delete'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.refreshTable()
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
    // 新增
    addUnit() {
      this.$refs.addUnitDrawer.show()
      this.drawerTitle = '新建项目'
      this.$nextTick(function () {
        this.$refs.addUnit.init(this.projectFormData)
      })
    },
    // 关闭添加项目抽屉
    closeAddUnitDrawer() {
      this.$refs.addUnitDrawer.hide()
      this.refreshTable()
    }
  }
}
</script>
<style scoped lang="scss">
.main-box {
  height: 100%;
  margin-top: 24px;
  display: flex;

  .left {
    width: 500px;
    background: #fff;
    border-radius: 4px 4px 4px 4px;

    .form-info {
      padding: 20px 60px 60px 32px;
    }
  }

  .right {
    flex: 1;
    background: #fff;
    margin-left: 24px;
  }

  .left-right-header {
    height: 64px;
    padding: 0 24px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-title {
    font-size: 16px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 0;
}

.el-select {
  width: 100%;
}
</style>
