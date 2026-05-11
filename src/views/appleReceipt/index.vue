<template>
  <div class="apple-receipt-container">
    <page-header active-menu="appleReceipt" />

    <div class="receipt-wrapper">
      <el-card class="receipt-card">
        <div slot="header" class="card-header">
          <span class="card-title">
            <i class="el-icon-apple" />
            Apple 收据验证工具
          </span>
          <span class="card-subtitle">EggNote 独属</span>
        </div>

        <div class="receipt-form">
          <div class="form-item">
            <label class="form-label">收据数据 (Receipt Data)</label>
            <el-input
              v-model="receiptData"
              type="textarea"
              :rows="10"
              placeholder="请粘贴 Apple 收据数据(base64 编码的 receipt-data)..."
              clearable
              class="receipt-textarea"
            />
          </div>

          <div class="form-item">
            <label class="form-label">交易 ID (Transaction ID) <span class="optional">可选</span></label>
            <el-input
              v-model="transactionId"
              placeholder="请输入交易 ID，用于提取特定交易记录"
              clearable
              class="transaction-input"
            >
              <template slot="prefix">
                <i class="el-icon-key" />
              </template>
            </el-input>
          </div>

          <div class="button-group">
            <el-button
              type="primary"
              :loading="verifying"
              :disabled="!receiptData"
              class="verify-btn"
              @click="handleVerify"
            >
              <i v-if="!verifying" class="el-icon-check" />
              {{ verifying ? '验证中...' : '验证收据' }}
            </el-button>

            <el-button
              icon="el-icon-delete"
              :disabled="!receiptData && !responseBody"
              @click="handleClear"
            >
              清空
            </el-button>
          </div>
        </div>

        <!-- 响应结果显示 -->
        <div v-if="responseBody" class="response-section">
          <el-divider content-position="left">
            <span class="divider-title">
              <i class="el-icon-document-checked" />
              Apple 响应结果
            </span>
          </el-divider>

          <div class="response-content">
            <div class="response-header">
              <el-tag :type="responseStatus === 0 ? 'success' : 'danger'" size="medium">
                状态码: {{ responseStatus }}
              </el-tag>
              <el-tag v-if="responseStatus === 0" type="success" size="medium">
                验证成功
              </el-tag>
              <el-tag v-else type="danger" size="medium">
                验证失败
              </el-tag>
            </div>

            <div class="response-body">
              <el-input
                :value="formattedResponse"
                type="textarea"
                :rows="20"
                readonly
                class="response-textarea"
              />
            </div>
          </div>
        </div>

        <!-- 错误信息显示 -->
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          :closable="false"
          show-icon
          class="error-alert"
        />

        <!-- 环境信息 -->
        <div class="environment-info">
          <el-tag size="mini" type="info">
            <i class="el-icon-info" />
            正式环境: https://buy.itunes.apple.com/verifyReceipt
          </el-tag>
          <el-tag size="mini" type="info">
            <i class="el-icon-info" />
            沙盒环境: https://sandbox.itunes.apple.com/verifyReceipt
          </el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import { verifyAppleReceipt } from '@/api/apple'

export default {
  name: 'AppleReceipt',
  components: {
    PageHeader
  },
  data() {
    return {
      receiptData: '',
      transactionId: '',
      verifying: false,
      responseBody: null,
      responseStatus: null,
      errorMessage: ''
    }
  },
  computed: {
    formattedResponse() {
      if (!this.responseBody) {
        return ''
      }
      return JSON.stringify(this.responseBody, null, 2)
    }
  },
  methods: {
    async handleVerify() {
      if (!this.receiptData) {
        this.$message.warning('请输入收据数据')
        return
      }

      this.verifying = true
      this.errorMessage = ''
      this.responseBody = null
      this.responseStatus = null

      try {
        const response = await verifyAppleReceipt({
          receiptData: this.receiptData.trim(),
          transactionId: this.transactionId.trim() || undefined
        })

        // axios返回的是response对象，实际数据在response.data中
        const result = response.data

        if (result.code === 200) {
          // 成功时，data字段中是Apple返回的实际数据
          this.responseBody = result.data
          this.responseStatus = 0
          this.$message.success('收据验证成功')
        } else {
          this.responseBody = result
          this.responseStatus = result.code
          this.$message.error('收据验证失败: ' + (result.msg || result.message || '未知错误'))
        }
      } catch (error) {
        console.error('验证收据失败:', error)
        this.errorMessage = '验证失败: ' + (error.message || '网络错误，请稍后重试')
        this.responseBody = error.response?.data || error
        this.responseStatus = error.response?.status || -1
      } finally {
        this.verifying = false
      }
    },
    handleClear() {
      this.receiptData = ''
      this.transactionId = ''
      this.responseBody = null
      this.responseStatus = null
      this.errorMessage = ''
      this.$message.success('已清空')
    }
  }
}
</script>

<style lang="scss" scoped>
.apple-receipt-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.receipt-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.receipt-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;

      i {
        margin-right: 8px;
        color: #606266;
      }
    }

    .card-subtitle {
      font-size: 14px;
      color: #909399;
      font-weight: normal;
    }
  }
}

.receipt-form {
  .form-item {
    margin-bottom: 24px;

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #606266;

      .optional {
        font-size: 12px;
        color: #909399;
        font-weight: normal;
        margin-left: 4px;
      }
    }

    .receipt-textarea {
      ::v-deep .el-textarea__inner {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
      }
    }

    .transaction-input {
      ::v-deep .el-input__inner {
        font-family: 'Courier New', monospace;
      }
    }
  }

  .button-group {
    display: flex;
    gap: 12px;
    justify-content: flex-end;

    .verify-btn {
      min-width: 120px;
    }
  }
}

.response-section {
  margin-top: 32px;

  .divider-title {
    font-size: 15px;
    font-weight: 500;
    color: #606266;

    i {
      margin-right: 6px;
    }
  }

  .response-content {
    margin-top: 16px;

    .response-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .response-body {
      .response-textarea {
        ::v-deep .el-textarea__inner {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.6;
          background-color: #f5f7fa;
          color: #303133;
        }
      }
    }
  }
}

.error-alert {
  margin-top: 20px;
}

.environment-info {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  i {
    margin-right: 4px;
  }
}
</style>
