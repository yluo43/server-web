<template>
  <div class="admin-container">
    <page-header active-menu="adminManagement" />

    <div class="filter-container">
      <el-input
        v-model="queryParams.username"
        placeholder="用户名"
        clearable
        class="filter-item"
        @clear="handleQuery"
      >
        <template slot="prefix">
          <i class="el-icon-user" />
        </template>
      </el-input>

      <el-input
        v-model="queryParams.realName"
        placeholder="真实姓名"
        clearable
        class="filter-item"
        @clear="handleQuery"
      >
        <template slot="prefix">
          <i class="el-icon-postcard" />
        </template>
      </el-input>

      <el-select
        v-model="queryParams.status"
        placeholder="状态"
        clearable
        class="filter-item"
        @change="handleQuery"
      >
        <el-option label="正常" :value="0" />
        <el-option label="禁用" :value="1" />
      </el-select>

      <el-button
        type="primary"
        icon="el-icon-search"
        class="filter-item search-btn"
        @click="handleQuery"
      >
        查询
      </el-button>

      <el-button
        icon="el-icon-refresh"
        class="filter-item"
        @click="handleReset"
      >
        重置
      </el-button>

      <el-button
        type="primary"
        icon="el-icon-plus"
        class="filter-item"
        @click="handleAdd"
      >
        新增
      </el-button>
    </div>

    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="realName" label="真实姓名" width="150" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="mail" label="邮箱" />
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="handleChangePassword(scope.row)">
              修改密码
            </el-button>
            <el-button type="text" size="small" style="color: #F56C6C;" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="total > 0"
        :current-page="queryParams.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParams.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            v-model="formData.realName"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input
            v-model="formData.mail"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      :visible.sync="viewDialogVisible"
      title="管理员详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ viewData.userId }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ viewData.username }}</el-descriptions-item>
        <el-descriptions-item label="真实姓名">{{ viewData.realName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ viewData.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ viewData.mail || '-' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="viewData.status === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ viewData.updateTime }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      :visible.sync="passwordDialogVisible"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminList, createAdmin, updateAdmin, deleteAdmin, getAdminInfo, changePassword } from '@/api/admin'
import PageHeader from '@/components/PageHeader'
import { getUserID, removeToken, removeCName, removeUserID } from '@/utils/auth'

export default {
  name: 'AdminManagement',
  components: {
    PageHeader
  },
  data() {
    // 自定义验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      tableData: [],
      total: 0,
      queryParams: {
        username: '',
        realName: '',
        status: null,
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      formData: {
        userId: '',
        username: '',
        password: '',
        realName: '',
        phone: '',
        mail: '',
        status: 0
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        mail: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      viewDialogVisible: false,
      viewData: {},
      passwordDialogVisible: false,
      passwordForm: {
        userId: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true

      const params = {
        ...this.queryParams,
        page: this.queryParams.page,
        limit: this.queryParams.limit
      }

      // 移除空值参数
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      getAdminList(params)
        .then(response => {
          this.loading = false
          if (response.data && response.data.code === 200) {
            const pageData = response.data.data
            this.tableData = pageData.records || []
            this.total = pageData.total || 0
          } else {
            this.$message.error(response.data?.msg || '获取数据失败')
          }
        })
        .catch(error => {
          this.loading = false
          console.error('获取管理员列表失败:', error)
          this.$message.error('获取数据失败')
        })
    },

    handleQuery() {
      this.queryParams.page = 1
      this.fetchData()
    },

    handleReset() {
      this.queryParams = {
        username: '',
        realName: '',
        status: null,
        page: 1,
        limit: 10
      }
      this.fetchData()
    },

    handleSizeChange(val) {
      this.queryParams.limit = val
      this.queryParams.page = 1
      this.fetchData()
    },

    handleCurrentChange(val) {
      this.queryParams.page = val
      this.fetchData()
    },

    handleAdd() {
      this.dialogTitle = '新增管理员'
      this.isEdit = false
      this.formData = {
        userId: '',
        username: '',
        password: '',
        realName: '',
        phone: '',
        mail: '',
        status: 0
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef?.clearValidate()
      })
    },

    handleEdit(row) {
      this.dialogTitle = '编辑管理员'
      this.isEdit = true
      this.formData = {
        userId: row.userId,
        username: row.username,
        realName: row.realName,
        phone: row.phone,
        mail: row.mail,
        status: row.status
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef?.clearValidate()
      })
    },

    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const data = { ...this.formData }
          const api = this.isEdit ? updateAdmin : createAdmin

          api(data)
            .then(response => {
              if (response.data && response.data.code === 200) {
              this.$message.success(this.isEdit ? '更新成功' : '创建成功')
              this.dialogVisible = false
              this.fetchData()
            } else {
              this.$message.error(response.data?.msg || '操作失败')
            }
          })
          .catch(error => {
            console.error('操作失败:', error)
            this.$message.error('操作失败')
          })
        }
      })
    },

    handleView(row) {
      getAdminInfo(row.userId)
        .then(response => {
          if (response.data && response.data.code === 200) {
            this.viewData = response.data.data
            this.viewDialogVisible = true
          } else {
            this.$message.error(response.data?.msg || '获取详情失败')
          }
        })
        .catch(error => {
          console.error('获取管理员详情失败:', error)
          this.$message.error('获取详情失败')
        })
    },

    handleDelete(row) {
      this.$confirm(`确定要删除管理员"${row.username}"吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row.userId)
          .then(response => {
            if (response.data && response.data.code === 200) {
              this.$message.success('删除成功')
              this.fetchData()
            } else {
              this.$message.error(response.data?.msg || '删除失败')
            }
          })
          .catch(error => {
            console.error('删除失败:', error)
            this.$message.error('删除失败')
          })
      }).catch(() => {
        // 取消删除
      })
    },

    handleChangePassword(row) {
      this.passwordForm = {
        userId: row.userId,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.passwordDialogVisible = true
      this.$nextTick(() => {
        this.$refs.passwordFormRef?.clearValidate()
      })
    },

    handlePasswordSubmit() {
      this.$refs.passwordFormRef.validate((valid) => {
        if (valid) {
          const data = {
            userId: this.passwordForm.userId,
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          }

          changePassword(data)
            .then(response => {
              if (response.data && response.data.code === 200) {
                this.$message.success('修改密码成功')
                this.passwordDialogVisible = false

                // 判断是否修改的是当前登录账号的密码
                const currentUserId = getUserID()
                if (currentUserId === this.passwordForm.userId) {
                  // 清除登录信息
                  removeToken()
                  removeCName()
                  removeUserID()

                  // 延迟跳转到登录页，让用户看到成功提示
                  setTimeout(() => {
                    this.$router.push({ name: 'login' })
                  }, 1000)
                }
              } else {
                this.$message.error(response.data?.msg || '修改密码失败')
              }
            })
            .catch(error => {
              console.error('修改密码失败:', error)
              this.$message.error('修改密码失败')
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;

  .filter-container {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    .filter-item {
      margin: 0;
      width: 200px;

      &.search-btn {
        min-width: 100px;
      }
    }

    ::v-deep .el-input__prefix {
      left: 8px;
    }

    ::v-deep .el-input__inner {
      padding-left: 32px;
    }
  }

  .table-container {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .el-pagination {
      margin-top: 20px;
      text-align: right;
    }
  }

  // 所有el-icon开头的图标样式
  ::v-deep [class*="el-icon-"] {
    line-height: 30px;
  }
}
</style>
