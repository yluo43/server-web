<template>
  <div class="redemption-code-container">
    <page-header active-menu="redemptionCode" />

    <div class="filter-container">
      <el-input
        v-model="queryParams.code"
        placeholder="兑换码"
        clearable
        class="filter-item"
        @clear="handleQuery"
      >
        <template slot="prefix">
          <i class="el-icon-key" />
        </template>
      </el-input>

      <el-select
        v-model="queryParams.templateNo"
        placeholder="选择模板"
        clearable
        class="filter-item"
        @change="handleQuery"
      >
        <el-option
          v-for="template in templateList"
          :key="template.templateNo"
          :label="`${template.templateNo} ${template.cname || template.name} ${getTypeName(template.type)}`"
          :value="template.templateNo"
        />
      </el-select>

      <el-select
        v-model="queryParams.channel"
        placeholder="选择渠道"
        clearable
        class="filter-item"
        @change="handleQuery"
      >
        <el-option
          v-for="channel in channelOptions"
          :key="channel.value"
          :label="channel.label"
          :value="channel.value"
        />
      </el-select>

      <el-input
        v-model="queryParams.campaign"
        placeholder="活动标记"
        clearable
        class="filter-item"
        @clear="handleQuery"
      />

      <el-select
        v-model="queryParams.status"
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
        生成兑换码
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
        <el-table-column prop="code" label="兑换码" width="180" />
        <el-table-column prop="templateNo" label="模板编号" width="100" />
        <el-table-column label="模板名称" width="200">
          <template slot-scope="scope">
            {{ getTemplateName(scope.row.templateNo) }}
          </template>
        </el-table-column>
        <el-table-column label="渠道" width="120">
          <template slot-scope="scope">
            {{ getChannelName(scope.row.channel) }}
          </template>
        </el-table-column>
        <el-table-column prop="campaign" label="活动标记" width="100" />
        <el-table-column label="类型" width="100" align="center">
          <template slot-scope="scope">
            {{ getTypeName(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="使用次数" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.maxConsumeCount === -1">无限</span>
            <span v-else>{{ scope.row.consumeCount || 0 }}/{{ scope.row.maxConsumeCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.expireTime">永久</span>
            <span v-else>{{ formatDate(scope.row.expireTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handleCopyCode(scope.row)"
            >
              复制
            </el-button>
            <el-button
              type="text"
              size="small"
              style="color: #F56C6C;"
              @click="handleDelete(scope.row)"
            >
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

    <!-- 生成兑换码对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="生成兑换码"
      width="550px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="模板" prop="templateNo">
          <el-select
            v-model="formData.templateNo"
            placeholder="请选择模板"
            style="width: 100%"
          >
            <el-option
              v-for="template in templateList"
              :key="template.templateNo"
              :label="`${template.templateNo} ${template.cname || template.name} ${getTypeName(template.type)}`"
              :value="template.templateNo"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type" @change="handleTypeChange">
            <el-radio :label="1">一次性</el-radio>
            <el-radio :label="2">自定</el-radio>
          </el-radio-group>
          <div style="margin-top: 8px; color: #909399; font-size: 12px;">
            <span v-if="formData.type === 1">一次性兑换码：后台自动生成，消费次数固定为1，可批量生成</span>
            <span v-else>自定兑换码：可自定义兑换码和消费次数，一次生成一个</span>
          </div>
        </el-form-item>

        <!-- 一次性兑换码：批量生成数量 -->
        <el-form-item
          v-if="formData.type === 1"
          label="生成数量"
          prop="batchCount"
        >
          <el-input-number
            v-model="formData.batchCount"
            :min="1"
            :max="100"
            placeholder="请输入生成数量"
            style="width: 100%"
          />
          <div style="color: #909399; font-size: 12px; margin-top: 4px;">
            最多可生成100个兑换码
          </div>
        </el-form-item>

        <!-- 自定兑换码：消费次数 -->
        <el-form-item
          v-if="formData.type === 2"
          label="消费次数"
          prop="customConsumeCount"
        >
          <el-input-number
            v-model="formData.customConsumeCount"
            :min="1"
            :max="9999"
            placeholder="请输入消费次数"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 自定兑换码：兑换码输入 -->
        <el-form-item
          v-if="formData.type === 2"
          label="兑换码"
          prop="code"
        >
          <el-input
            v-model="formData.code"
            placeholder="留空自动生成，或手动输入12位兑换码"
            maxlength="12"
            show-word-limit
          >
            <el-button
              slot="append"
              icon="el-icon-refresh"
              @click="generateRandomCode"
            >
              生成
            </el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="渠道" prop="channel">
          <el-select
            v-model="formData.channel"
            placeholder="请选择渠道"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="channel in channelOptions"
              :key="channel.value"
              :label="channel.label"
              :value="channel.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="活动标记" prop="campaign">
          <el-input
            v-model="formData.campaign"
            placeholder="请输入活动标记，如：a/b"
            clearable
          />
        </el-form-item>

        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker
            v-model="formData.expireTime"
            type="date"
            placeholder="留空表示永久有效"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="width: 100%"
            clearable
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注（可选）"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">生成</el-button>
      </span>
    </el-dialog>

    <!-- 生成结果对话框 -->
    <el-dialog
      :visible.sync="resultDialogVisible"
      title="兑换码生成成功"
      :width="generatedCodes.length > 1 ? '700px' : '500px'"
    >
      <el-alert
        :title="generatedCodes.length > 1 ? `已成功生成 ${generatedCodes.length} 个兑换码，请妥善保存` : '兑换码已生成，请妥善保存'"
        type="success"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      />
      <div class="code-result">
        <!-- 批量生成：显示兑换码列表 -->
        <div v-if="generatedCodes.length > 1">
          <el-table
            :data="generatedCodes"
            border
            stripe
            max-height="400"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="code" label="兑换码" width="180">
              <template slot-scope="scope">
                <el-tag type="success" size="medium">{{ scope.row.code }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="模板" width="200">
              <template>
                {{ getTemplateName(formData.templateNo) }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="100">
              <template>
                一次性
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleCopySingleCode(scope.row.code)"
                >
                  复制
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 16px; padding: 12px; background: #f5f7fa; border-radius: 4px;">
            <div><strong>模板：</strong>{{ getTemplateName(formData.templateNo) }}</div>
            <div><strong>类型：</strong>一次性（消费次数固定为1）</div>
            <div><strong>过期时间：</strong>{{ formData.expireTime || '永久' }}</div>
            <div v-if="formData.channel"><strong>渠道：</strong>{{ getChannelName(formData.channel) }}</div>
            <div v-if="formData.campaign"><strong>活动标记：</strong>{{ formData.campaign }}</div>
          </div>
        </div>

        <!-- 单个生成：显示详情 -->
        <el-descriptions v-else :column="1" border>
          <el-descriptions-item label="兑换码">
            <el-tag type="success" size="medium">{{ generatedCodes[0] && generatedCodes[0].code }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="模板">
            {{ getTemplateName(formData.templateNo) }}
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            {{ formData.type === 1 ? '一次性' : '自定' }}
          </el-descriptions-item>
          <el-descriptions-item label="最大消费次数">
            {{ formData.type === 1 ? '1' : formData.customConsumeCount }}
          </el-descriptions-item>
          <el-descriptions-item label="过期时间">
            {{ formData.expireTime || '永久' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <el-button
          v-if="generatedCodes.length === 1"
          type="primary"
          @click="handleCopyGeneratedCode"
        >
          复制兑换码
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="handleCopyAllCodes"
        >
          复制全部兑换码
        </el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resultDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRedemptionCodeList,
  createRedemptionCode,
  updateRedemptionCodeStatus,
  deleteRedemptionCode,
  getTemplateList,
  generateUniqueCode
} from '@/api/redemptionCode'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'RedemptionCode',
  components: {
    PageHeader
  },
  data() {
    return {
      loading: false,
      tableData: [],
      templateList: [],
      total: 0,
      // 渠道选项
      channelOptions: [
        { label: '小红书', value: '112' },
        { label: '抖音', value: '113' }
      ],
      // 类型选项
      typeOptions: [
        { label: '一次性', value: 1 },
        { label: '自定', value: 2 }
      ],
      queryParams: {
        code: '',
        templateNo: null,
        channel: null,
        campaign: '',
        status: null,
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      formData: {
        templateNo: null,
        type: 1,
        batchCount: 1, // 批量生成数量
        customConsumeCount: 1,
        code: '',
        channel: null,
        campaign: '',
        expireTime: '',
        remark: ''
      },
      // 日期选择器选项
      pickerOptions: {
        disabledDate(time) {
          // 禁用今天之前的日期
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      formRules: {
        templateNo: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        customConsumeCount: [
          { required: true, message: '请输入消费次数', trigger: 'blur' }
        ],
        batchCount: [
          { required: true, message: '请输入生成数量', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入或生成兑换码', trigger: 'blur' }
        ]
      },
      resultDialogVisible: false,
      generatedCodes: [] // 存储生成的兑换码列表
    }
  },
  mounted() {
    this.fetchTemplateList()
    this.fetchData()

    // 监听系统切换事件
    this.$root.$on('system-changed', this.handleSystemChanged)
  },
  beforeDestroy() {
    // 移除系统切换事件监听
    this.$root.$off('system-changed', this.handleSystemChanged)
  },
  methods: {
    // 处理系统切换
    handleSystemChanged(system) {
      console.log('系统已切换到:', system)
      // 重新获取数据
      this.fetchData()
      this.fetchTemplateList()
    },
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

      getRedemptionCodeList(params)
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
          console.error('获取兑换码列表失败:', error)
          this.$message.error('获取数据失败')
        })
    },

    fetchTemplateList() {
      getTemplateList()
        .then(response => {
          if (response.data && response.data.code === 200) {
            this.templateList = response.data.data || []
          }
        })
        .catch(error => {
          console.error('获取模板列表失败:', error)
        })
    },

    getTemplateName(templateNo) {
      const template = this.templateList.find(t => t.templateNo === templateNo)
      if (template) {
        return `${template.templateNo} ${template.cname || template.name} ${this.getTypeName(template.type)}`
      }
      return '-'
    },

    getChannelName(channel) {
      const channelOption = this.channelOptions.find(c => c.value === channel)
      return channelOption ? channelOption.label : (channel || '-')
    },

    getTypeName(type) {
      // 兑换码类型（1-一次性，2-自定）
      const typeOption = this.typeOptions.find(t => t.value === type)
      if (typeOption) {
        return typeOption.label
      }

      // 模板类型（0普通模板，1高级模板，2限定模板，3合作模板）
      const templateTypeMap = {
        0: '普通模板',
        1: '高级模板',
        2: '限定模板',
        3: '合作模板'
      }
      return templateTypeMap[type] || '-'
    },

    formatDate(date) {
      if (!date) return '-'
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    generateRandomCode() {
      // 调用后端接口生成唯一兑换码
      generateUniqueCode()
        .then(response => {
          if (response.data && response.data.code === 200) {
            this.formData.code = response.data.data.code
            this.$message.success('兑换码生成成功')
          } else {
            this.$message.error(response.data?.msg || '生成失败')
          }
        })
        .catch(error => {
          console.error('生成兑换码失败:', error)
          this.$message.error('生成失败，请稍后重试')
        })
    },

    handleTypeChange(value) {
      // 类型切换时重置相关字段
      if (value === 1) {
        // 切换到一次性：清空兑换码和自定义消费次数
        this.formData.code = ''
        this.formData.customConsumeCount = 1
      } else if (value === 2) {
        // 切换到自定：清空批量数量
        this.formData.batchCount = 1
      }
    },

    handleQuery() {
      this.queryParams.page = 1
      this.fetchData()
    },

    handleReset() {
      this.queryParams = {
        code: '',
        templateNo: null,
        channel: null,
        campaign: '',
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

    handleCreate() {
      this.formData = {
        templateNo: null,
        type: 1,
        batchCount: 1,
        customConsumeCount: 1,
        code: '',
        channel: null,
        campaign: '',
        expireTime: '',
        remark: ''
      }
      this.generatedCodes = []
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef?.clearValidate()
      })
    },

    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 一次性兑换码：批量生成
          if (this.formData.type === 1) {
            this.handleBatchCreate()
          } else {
            // 自定兑换码：单个生成
            this.handleSingleCreate()
          }
        }
      })
    },

    // 批量创建一次性兑换码
    handleBatchCreate() {
      const data = {
        templateNo: this.formData.templateNo,
        type: 1, // 一次性
        batchCount: this.formData.batchCount,
        channel: this.formData.channel,
        campaign: this.formData.campaign,
        expireTime: this.formData.expireTime,
        remark: this.formData.remark
      }

      // 调用批量创建接口
      createRedemptionCode(data)
        .then(response => {
          if (response.data && response.data.code === 200) {
            this.$message.success(`成功生成 ${this.formData.batchCount} 个兑换码`)
            this.generatedCodes = response.data.data.codes || []
            this.resultDialogVisible = true
            this.dialogVisible = false
            this.fetchData()
          } else {
            this.$message.error(response.data?.msg || '生成失败')
          }
        })
        .catch(error => {
          console.error('批量生成兑换码失败:', error)
          this.$message.error('生成失败')
        })
    },

    // 单个创建自定兑换码
    handleSingleCreate() {
      const data = {
        templateNo: this.formData.templateNo,
        type: 2, // 自定
        code: this.formData.code,
        customConsumeCount: this.formData.customConsumeCount,
        channel: this.formData.channel,
        campaign: this.formData.campaign,
        expireTime: this.formData.expireTime,
        remark: this.formData.remark
      }

      createRedemptionCode(data)
        .then(response => {
          if (response.data && response.data.code === 200) {
            this.$message.success('兑换码生成成功')
            this.generatedCodes = [{ code: response.data.data.code }]
            this.resultDialogVisible = true
            this.dialogVisible = false
            this.fetchData()
          } else {
            this.$message.error(response.data?.msg || '生成失败')
          }
        })
        .catch(error => {
          console.error('生成兑换码失败:', error)
          this.$message.error('生成失败')
        })
    },

    handleToggleStatus(row) {
      const newStatus = row.status === 1 ? 0 : 1
      const action = newStatus === 1 ? '启用' : '禁用'

      this.$confirm(`确定要${action}该兑换码吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateRedemptionCodeStatus({ id: row.id, status: newStatus })
          .then(response => {
            if (response.data && response.data.code === 200) {
              this.$message.success(`${action}成功`)
              this.fetchData()
            } else {
              this.$message.error(response.data?.msg || `${action}失败`)
            }
          })
          .catch(error => {
            console.error('更新状态失败:', error)
            this.$message.error('操作失败')
          })
      }).catch(() => {
        // 取消操作
      })
    },

    handleCopyCode(row) {
      this.copyToClipboard(row.code)
    },

    handleCopyGeneratedCode() {
      if (this.generatedCodes.length > 0) {
        this.copyToClipboard(this.generatedCodes[0].code)
      }
    },

    // 复制单个兑换码（批量生成时使用）
    handleCopySingleCode(code) {
      this.copyToClipboard(code)
    },

    // 复制所有兑换码
    handleCopyAllCodes() {
      const allCodes = this.generatedCodes.map(item => item.code).join('\n')
      this.copyToClipboard(allCodes, true)
    },

    copyToClipboard(text, isBatch = false) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.$message.success(isBatch ? '已复制全部兑换码' : '复制成功')
        }).catch(() => {
          this.fallbackCopyToClipboard(text, isBatch)
        })
      } else {
        this.fallbackCopyToClipboard(text, isBatch)
      }
    },

    fallbackCopyToClipboard(text, isBatch = false) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        this.$message.success(isBatch ? '已复制全部兑换码' : '复制成功')
      } catch (err) {
        this.$message.error('复制失败')
      }
      document.body.removeChild(textarea)
    },

    handleDelete(row) {
      this.$confirm(`确定要删除兑换码"${row.code}"吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRedemptionCode(row.id)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.redemption-code-container {
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

  .codes-result {
    margin-bottom: 20px;
  }

  // 所有el-icon开头的图标样式
  ::v-deep [class*="el-icon-"] {
    line-height: 30px;
  }
}
</style>
