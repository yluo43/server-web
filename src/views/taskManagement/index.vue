<template>
  <div class="task-management-container">
    <page-header active-menu="taskManagement" />

    <!-- 任务定义管理 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="任务定义" name="definition">
        <div class="filter-container">
          <el-input
            v-model="queryParams.taskCode"
            placeholder="任务编码"
            clearable
            class="filter-item"
            @clear="handleQuery"
          >
            <template slot="prefix">
              <i class="el-icon-document" />
            </template>
          </el-input>

          <el-input
            v-model="queryParams.taskName"
            placeholder="任务名称"
            clearable
            class="filter-item"
            @clear="handleQuery"
          />

          <el-select
            v-model="queryParams.taskCategory"
            placeholder="任务类别"
            clearable
            class="filter-item"
            @change="handleQuery"
          >
            <el-option
              v-for="item in taskCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="queryParams.resetType"
            placeholder="重置类型"
            clearable
            class="filter-item"
            @change="handleQuery"
          >
            <el-option
              v-for="item in resetTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="queryParams.isEnabled"
            placeholder="状态"
            clearable
            class="filter-item"
            @change="handleQuery"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
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
            @click="handleCreate"
          >
            新建任务
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
            <el-table-column
              prop="taskId"
              label="任务ID"
              width="80"
              align="center"
            />
            <el-table-column
              prop="taskCode"
              label="任务编码"
              width="180"
            />
            <el-table-column
              prop="taskName"
              label="任务名称"
              width="150"
            />
            <el-table-column
              prop="taskDesc"
              label="任务描述"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="taskCategory"
              label="任务类别"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag :type="getTaskCategoryTagType(scope.row.taskCategory)">
                  {{ getTaskCategoryLabel(scope.row.taskCategory) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="resetType"
              label="重置类型"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                {{ getResetTypeLabel(scope.row.resetType) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="targetProgress"
              label="目标进度"
              width="100"
              align="center"
            />
            <el-table-column
              label="奖励"
              width="120"
              align="center"
            >
              <template slot-scope="scope">
                {{ getRewardLabel(scope.row.rewardType, scope.row.rewardCount) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="isEnabled"
              label="状态"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isEnabled"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              label="排序"
              width="80"
              align="center"
            />
            <el-table-column
              label="操作"
              width="150"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-delete"
                  style="color: #f56c6c"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            :total="total"
            :page.sync="queryParams.page"
            :limit.sync="queryParams.limit"
            @pagination="handleQuery"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="用户任务进度" name="progress">
        <task-progress-list />
      </el-tab-pane>

      <el-tab-pane label="领取记录" name="records">
        <task-claim-list />
      </el-tab-pane>
    </el-tabs>

    <!-- 新建/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="taskForm"
        :model="taskForm"
        :rules="taskRules"
        label-width="120px"
      >
        <el-form-item label="任务ID" prop="taskId">
          <el-input
            v-model.number="taskForm.taskId"
            type="number"
            placeholder="请输入任务ID"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="任务编码" prop="taskCode">
          <el-input
            v-model="taskForm.taskCode"
            placeholder="如：daily_create_page"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="任务名称" prop="taskName">
          <el-input
            v-model="taskForm.taskName"
            placeholder="如：每日创建1页"
          />
        </el-form-item>

        <el-form-item label="任务描述" prop="taskDesc">
          <el-input
            v-model="taskForm.taskDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
          />
        </el-form-item>

        <el-form-item label="任务类别" prop="taskCategory">
          <el-select v-model="taskForm.taskCategory" placeholder="请选择任务类别">
            <el-option
              v-for="item in taskCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="重置类型" prop="resetType">
          <el-select v-model="taskForm.resetType" placeholder="请选择重置类型">
            <el-option
              v-for="item in resetTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="重置时区">
          <el-input
            v-model="taskForm.resetTimezone"
            placeholder="默认：Asia/Shanghai"
          />
        </el-form-item>

        <el-form-item label="目标进度" prop="targetProgress">
          <el-input-number
            v-model="taskForm.targetProgress"
            :min="1"
            placeholder="请输入目标进度"
          />
        </el-form-item>

        <el-form-item label="奖励类型" prop="rewardType">
          <el-select v-model="taskForm.rewardType" placeholder="请选择奖励类型">
            <el-option label="锤子" value="hammer" />
            <el-option label="蛋币" value="egg" />
            <el-option label="碎片" value="piece" />
          </el-select>
        </el-form-item>

        <el-form-item label="奖励数量" prop="rewardCount">
          <el-input-number
            v-model="taskForm.rewardCount"
            :min="1"
            placeholder="请输入奖励数量"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch
            v-model="taskForm.isEnabled"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="taskForm.sort"
            :min="0"
            placeholder="数字越小越靠前"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import {
  getTaskDefinitionList,
  createTaskDefinition,
  updateTaskDefinition,
  updateTaskDefinitionStatus,
  deleteTaskDefinition
} from '@/api/task'
import TaskProgressList from './components/TaskProgressList'
import TaskClaimList from './components/TaskClaimList'

export default {
  name: 'TaskManagement',
  components: {
    PageHeader,
    Pagination,
    TaskProgressList,
    TaskClaimList
  },
  data() {
    return {
      activeTab: 'definition',
      loading: false,
      tableData: [],
      total: 0,
      queryParams: {
        taskCode: '',
        taskName: '',
        taskCategory: '',
        resetType: '',
        isEnabled: '',
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      dialogTitle: '新建任务',
      isEdit: false,
      taskForm: {
        id: null,
        taskId: null,
        taskCode: '',
        taskName: '',
        taskDesc: '',
        taskCategory: '',
        resetType: '',
        resetTimezone: 'Asia/Shanghai',
        targetProgress: 1,
        rewardType: 'hammer',
        rewardCount: 1,
        isEnabled: 1,
        sort: 0
      },
      taskRules: {
        taskId: [
          { required: true, message: '请输入任务ID', trigger: 'blur' }
        ],
        taskCode: [
          { required: true, message: '请输入任务编码', trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        taskDesc: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ],
        taskCategory: [
          { required: true, message: '请选择任务类别', trigger: 'change' }
        ],
        resetType: [
          { required: true, message: '请选择重置类型', trigger: 'change' }
        ],
        targetProgress: [
          { required: true, message: '请输入目标进度', trigger: 'blur' }
        ],
        rewardType: [
          { required: true, message: '请选择奖励类型', trigger: 'change' }
        ],
        rewardCount: [
          { required: true, message: '请输入奖励数量', trigger: 'blur' }
        ]
      },
      taskCategoryOptions: [
        { label: '每日任务', value: 'daily' },
        { label: '每周任务', value: 'weekly' },
        { label: '每月任务', value: 'monthly' },
        { label: '长期任务', value: 'longterm' },
        { label: '活动任务', value: 'activity' }
      ],
      resetTypeOptions: [
        { label: '每日重置', value: 'daily' },
        { label: '每周重置', value: 'weekly' },
        { label: '每月重置', value: 'monthly' },
        { label: '不重置', value: 'none' }
      ]
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    handleTabClick(tab) {
      console.log('切换到标签页:', tab.name)
    },

    async handleQuery() {
      this.loading = true
      try {
        const res = await getTaskDefinitionList(this.queryParams)
        if (res.data && res.data.code === 200) {
          const pageData = res.data.data
          this.tableData = pageData.records || []
          this.total = pageData.total || 0
        } else {
          this.$message.error(res.data?.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('查询失败:', error)
        this.$message.error('查询失败，请重试')
      } finally {
        this.loading = false
      }
    },

    handleReset() {
      this.queryParams = {
        taskCode: '',
        taskName: '',
        taskCategory: '',
        resetType: '',
        isEnabled: '',
        page: 1,
        limit: 10
      }
      this.handleQuery()
    },

    handleCreate() {
      this.dialogTitle = '新建任务'
      this.isEdit = false
      this.taskForm = {
        id: null,
        taskId: null,
        taskCode: '',
        taskName: '',
        taskDesc: '',
        taskCategory: '',
        resetType: '',
        resetTimezone: 'Asia/Shanghai',
        targetProgress: 1,
        rewardType: 'hammer',
        rewardCount: 1,
        isEnabled: 1,
        sort: 0
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm && this.$refs.taskForm.clearValidate()
      })
    },

    handleEdit(row) {
      this.dialogTitle = '编辑任务'
      this.isEdit = true
      this.taskForm = {
        id: row.id,
        taskId: row.taskId,
        taskCode: row.taskCode,
        taskName: row.taskName,
        taskDesc: row.taskDesc,
        taskCategory: row.taskCategory,
        resetType: row.resetType,
        resetTimezone: row.resetTimezone || 'Asia/Shanghai',
        targetProgress: row.targetProgress,
        rewardType: row.rewardType,
        rewardCount: row.rewardCount,
        isEnabled: row.isEnabled,
        sort: row.sort
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm && this.$refs.taskForm.clearValidate()
      })
    },

    async handleStatusChange(row) {
      try {
        const res = await updateTaskDefinitionStatus({
          id: row.id,
          isEnabled: row.isEnabled
        })
        if (res.data && res.data.code === 200) {
          this.$message.success('状态更新成功')
        } else {
          // 失败时回滚状态
          row.isEnabled = row.isEnabled === 1 ? 0 : 1
          this.$message.error(res.data?.msg || '状态更新失败')
        }
      } catch (error) {
        // 失败时回滚状态
        row.isEnabled = row.isEnabled === 1 ? 0 : 1
        console.error('状态更新失败:', error)
        this.$message.error('状态更新失败，请重试')
      }
    },

    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await deleteTaskDefinition(row.id)
        if (res.data && res.data.code === 200) {
          this.$message.success('删除成功')
          this.handleQuery()
        } else {
          this.$message.error(res.data?.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败，请重试')
        }
      }
    },

    handleSubmit() {
      this.$refs.taskForm.validate(async(valid) => {
        if (valid) {
          try {
            let res
            if (this.isEdit) {
              res = await updateTaskDefinition(this.taskForm)
            } else {
              res = await createTaskDefinition(this.taskForm)
            }

            if (res.data && res.data.code === 200) {
              this.$message.success(this.isEdit ? '更新成功' : '创建成功')
              this.dialogVisible = false
              this.handleQuery()
            } else {
              this.$message.error(res.data?.msg || '操作失败')
            }
          } catch (error) {
            console.error('提交失败:', error)
            this.$message.error('操作失败，请重试')
          }
        }
      })
    },

    getTaskCategoryLabel(category) {
      const option = this.taskCategoryOptions.find(item => item.value === category)
      return option ? option.label : category
    },

    getTaskCategoryTagType(category) {
      const typeMap = {
        daily: '',
        weekly: 'success',
        monthly: 'warning',
        longterm: 'info',
        activity: 'danger'
      }
      return typeMap[category] || ''
    },

    getResetTypeLabel(type) {
      const option = this.resetTypeOptions.find(item => item.value === type)
      return option ? option.label : type
    },

    getRewardLabel(type, count) {
      const typeMap = {
        hammer: '锤子',
        egg: '蛋币',
        piece: '碎片'
      }
      return `${typeMap[type] || type} x${count}`
    }
  }
}
</script>

<style lang="scss" scoped>
.task-management-container {
  padding: 20px;

  .filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .filter-item {
      width: 200px;

      &.search-btn {
        width: auto;
      }
    }
  }

  .table-container {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  ::v-deep .el-tabs__content {
    margin-top: 20px;
  }
}
</style>
