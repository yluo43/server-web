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
        <el-form
            ref="projectForm"
            :rules="projectFormRules"
            :model="projectFormData"
            label-width="100px"
        >
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="projectFormData.name" placeholder="请输入项目名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="合同编号:" prop="contractCode">
            <el-input v-model="projectFormData.contractCode" placeholder="请输入合同编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目经理:" prop="managerId">
            <el-cascader
                v-model="projectManagerId"
                :options="projectManagers"
                placeholder="请选择项目经理"
                :show-all-levels="false"
                style="width: 100%"
                @change="changeManagerId"
                :disabled="isManager"
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
            <el-input
                v-model="projectFormData.remark"
                style="margin-block: 6px"
                type="textarea"
                maxlength="100"
                show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="form-info">
        <el-form ref="projectFormOrigin" :model="projectFormDataOrigin" label-width="100px" class="form-item">
          <el-form-item label="项目名称:" prop="name">
            {{ projectFormDataOrigin.name }}
          </el-form-item>
          <el-form-item label="合同编号:" prop="contractCode">
            {{ projectFormDataOrigin.contractCode }}
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
          <el-form-item label="备注:" prop="remark">
            {{ projectFormDataOrigin.remark }}
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="right">
      <div class="left-right-header">
        <div class="header-title">岗位单价信息</div>
        <div style="display: flex">
          <el-button class="btn-download" size="small" type="primary" @click="batchUploadFactoryInfo">批量导入</el-button>
          <el-button
              class="btn-download"
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="addUnit"
          >添加岗位
          </el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <div style="margin: 20px">
        <baseTable
            ref="table"
            :table-data="tableData"
            :multi-select="true"
            :edit-flag="false"
            @updateTable="updateTable"
            @handleInput="handleInput"
        >
          <template v-slot:clientType="row">
            <!--类型插槽-->
            <template>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <svg-icon
                    :icon-class="'edit-icon'"
                    style="height: 1.5em; width: 1.5em; margin-right: 2em"
                    @click="alter(row.item)"
                />
              </el-tooltip>
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
    <base-drawer ref="addUnitDrawer" :title="drawerTitle" size="23%">
      <template>
        <addUnit ref="addUnit" @closeDrawer="closeAddUnitDrawer"/>
      </template>
    </base-drawer>
    <baseDialog title="批量导入" ref="batchUploadFactoryInfoDialog" width="500px">
      <template>
        <div>
          <el-row
              style="min-height: 100px; width: 450px; margin-bottom: 10px; padding: 5px 0 0 5px; border-radius: 4px; border: #ebeef5 solid 1px">
            <el-upload
                ref="factoryInfoBatchUpload"
                action=""
                :on-change="changeUploadFile"
                :file-list="uploadFileList"
                :upload-success="uploadSuccess"
                :accept="'.xls,.xlsx'"
                :limit="2"
                :auto-upload="false"
            >
              <el-button class="btn-download" slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button class="btn-download" style="margin-left: 10px" size="small" @click="download">下载导入模板</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件, 且样式需同模板一致</div>
            </el-upload>
          </el-row>

          <el-row style="display: flex; justify-content: right; margin-bottom: 20px">
            <el-button type="primary" style="margin-right: 10px" @click="submitBatchUpload">确认</el-button>
            <el-button @click="closeBatchUploadDialog">取消</el-button>
          </el-row>
        </div>
      </template>
    </baseDialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableEdit.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import baseDrawer from '@/views/modules/base/baseDrawer.vue'
import addUnit from './addUnit.vue'

export default {
  components: {baseTable, baseDrawer, addUnit, baseDialog},
  data() {
    return {
      isManager: false,
      uploadFileList: [],
      projectFormRules: {
        name: [{required: true, message: '请输入项目名称', trigger: ['blur', 'change']},
          {
            validator: (rule, value, callback) => {
              if (value.length > 30) {
                callback(new Error('项目名称最长不能超过30个字符'))
              } else {
                callback()
              }
            },
            trigger: ['blur', 'change']
          }],
        contractCode: [{required: true, message: '请输入合同编号', trigger: 'change'},
          {
            validator: (rule, value, callback) => {
              // 使用正则表达式匹配英文、数字和特定特殊字符
              // 注意：这里的正则表达式仅作为示例，你可能需要根据你的需求进行调整
              const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\/?]+$/
              if (!regex.test(value)) {
                // 如果输入不匹配，显示错误消息
                callback(new Error('项目名称只能包含英文、数字和特殊字符'))
              } else if (value.length > 100) {
                // 如果长度超过100个字符，也显示错误消息
                callback(new Error('项目名称最长不能超过100个字符'))
              } else {
                // 如果输入有效，调用callback没有参数
                callback()
              }
            },
            trigger: ['blur', 'change']
          }],
        managerId: [{required: true, message: '请选择项目经理', trigger: 'change'}],
        customerId: [{required: true, message: '请选择项目客户', trigger: 'change'}],
        startTime: [{required: true, message: '请选择开始日期', trigger: 'change'}],
        endTime: [{required: true, message: '请选择结束日期', trigger: 'change'}]
      },
      // 是否是编辑模式
      drawerTitle: '',
      editMode: false,
      associatedProjects: [],
      membershipGroups: [],
      tableData: {
        theads: [
          {label: '岗位', prop: 'name'},
          {label: '级别', prop: 'level'},
          {label: '单价（不含税/元）', prop: 'unitPrice'},
          {label: '税率（%）', prop: 'taxRate'},
          {label: '单价（含税/元）', prop: 'taxUnitPrice'},
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
        contractCode: '',
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
      projectFormDataBak: {},
      projectFormDataOrigin: {
        // 项目名称
        name: '',
        contractCode: '',
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
  watch: {
    editMode(newVal) {
      if (!newVal) {
        Object.assign(this.projectFormDataBak, this.projectFormData)
        this.$refs.projectForm.resetFields()
      } else {
        if (Object.values(this.projectFormDataBak).length > 0) {
          Object.assign(this.projectFormData, this.projectFormDataBak)
        }
      }
    }
  },

  mounted() {
    this.$http({
      url: this.$http.adornUrl('/projectSet/listRelProject'),
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
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.customerNames = data.payload.list.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })
    this.isManager = !!this.$store.state.user.isManager
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      let text = response.msg
      if (response.msg === 'excel文件中数据不符合要求') {
        response.payload.forEach(e => {
          text += '\n' + e
        })
      }
      this.$message.warning(text)
    },
    // 提交批量导入
    submitBatchUpload() {
      let uploadFiles = this.$refs.factoryInfoBatchUpload.uploadFiles
      if (!uploadFiles || uploadFiles.length === 0) {
        this.$message.warning('请选择上传文件')
        return false
      }

      let formData = new FormData()
      let uploadFile = uploadFiles[0].raw
      formData.append('projectId', this.projectFormData.id)
      formData.append('file', uploadFile)
      this.$http({
        url: this.$http.adornUrl('/externalProject/importProjectPost'),
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8' // 设置请求头为multipart/form-data
        }
      }).then(({data}) => {
        if (data.success) {
          let text = data.msg
          if (data.msg === 'excel文件中数据不符合要求') {
            data.payload.forEach(e => {
              text += '\t\n' + e
            })
            this.$message.warning(text)
          } else {
            this.$message.success(text)
            this.closeBatchUploadDialog()
            this.refreshTable()
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    closeBatchUploadDialog() {
      let uploadFiles = this.$refs.factoryInfoBatchUpload.uploadFiles
      if (uploadFiles && uploadFiles.length > 0) {
        this.uploadFileList = []
      }
      this.$refs.batchUploadFactoryInfoDialog.hide()
    },
    // 批量导入厂商信息-变更文件钩子
    changeUploadFile(file, fileList) {
      let fileName = file.name
      let extension = fileName.split('.').pop()
      if (extension !== 'xls' && extension !== 'xlsx') {
        this.$message.warning('只能上传xls/xlsx文件')
        this.$refs.factoryInfoBatchUpload.clearFiles()
        return false
      }
      this.uploadFileList = fileList.slice(-1)
    },
    init(projectFormData) {
      Object.assign(this.projectFormData, projectFormData)
      this.projectManagerId = [projectFormData.deptId, projectFormData.managerId]
      Object.assign(this.projectFormDataOrigin, this.projectFormData)
      this.refreshTable()
    },
    download() {
      this.$http.downloadPost(this.$http.adornUrl('/externalProject/downloadProjectPostTemplate'), {}, this)
    },
    handleInput(value, prop, scope, options) {
      if (prop === 'type') {
        // 使用正则表达式匹配并保留数字部分
        let numericValue = value.replace(/\D/g, '')
        // 如果输入值发生了变化（即包含非数字字符），则更新绑定的数据
        if (value !== numericValue) {
          // 直接更新绑定的数据，Vue 会自动更新 DOM
          options.dataList[scope.$index][prop] = numericValue
        }
      } else if (prop === 'unitPrice' || prop === 'taxUnitPrice') {
        const regex = /^\d*(\.\d{0,2})?$/
        // 如果不匹配，处理输入
        if (!regex.test(value)) {
          this.$nextTick(() => {
            // 找到最后一个有效的数字部分并更新输入框的值
            const validValue = value.match(/^\d*(\.\d{0,2})?/)[0] || ''
            options.dataList[scope.$index][prop] = validValue
          })
        }
      }
    },
    updateTable(row) {
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
          this.refreshTable()
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
    customerChange(i) {
      this.customerNames.forEach(e => {
        if (i === e.id) {
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
      this.$refs.projectForm.validate((valid) => {
        if (!valid) {
          return false
        }
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
            this.$emit('changeName', this.projectFormData.name)
            this.editMode = false
          } else {
            this.$message.error(data.msg)
          }
        })
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
        this.$refs.addUnit.init(null, this.projectFormData.id)
      })
    },
    alter(row) {
      this.$refs.addUnitDrawer.show()
      this.drawerTitle = '修改项目'
      this.$nextTick(function () {
        this.$refs.addUnit.init(row)
      })
    },
    // 关闭添加项目抽屉
    closeAddUnitDrawer() {
      this.$refs.addUnitDrawer.hide()
      this.refreshTable()
    },
    batchUploadFactoryInfo() {
      this.$refs.batchUploadFactoryInfoDialog.show()
    }
  }
}
</script>
<style scoped lang="scss">
.main-box {
  height: 100%;
  display: flex;

  .left {
    width: 35%;
    background: #fff;
    border-radius: 4px 4px 4px 4px;

    .form-info {
      padding: 20px 60px 60px 32px;
    }
  }

  .right {
    flex: 1;
    background: #fff;
    margin-left: 1px;
  }

  .left-right-header {
    height: 64px;
    padding: 0 0px 0 16px;
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
