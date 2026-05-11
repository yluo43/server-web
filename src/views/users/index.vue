<template>
  <div class="users-container">
    <page-header active-menu="users" @system-changed="handleSystemChange" />

    <div class="filter-container">
      <el-input
        v-model="queryParams.phone"
        placeholder="手机号"
        clearable
        class="filter-item phone-input"
        @clear="handleQuery"
      >
        <template #prefix>
          <i class="el-icon-phone" />
        </template>
      </el-input>

      <el-input
        v-model="queryParams.mail"
        placeholder="邮箱"
        clearable
        class="filter-item mail-input"
        @clear="handleQuery"
      >
        <template #prefix>
          <i class="el-icon-message" />
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

      <el-select
        v-model="queryParams.isForever"
        placeholder="会员类型"
        clearable
        class="filter-item"
        @change="handleQuery"
      >
        <el-option label="永久会员" :value="true" />
        <el-option label="普通会员" :value="false" />
      </el-select>

      <el-date-picker
        v-model="queryParams.registerDate"
        type="date"
        placeholder="注册时间"
        clearable
        class="filter-item"
        value-format="yyyy-MM-dd"
        @change="handleQuery"
      />

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
    </div>

    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
<!--        <el-table-column prop="userId" label="用户ID" width="180" />-->
        <el-table-column prop="phone" label="手机号"  />
        <el-table-column prop="mail" label="邮箱" />
        <el-table-column label="会员类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isForever" type="warning">永久会员</el-tag>
            <el-tag v-else type="info">普通会员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="inviteNumber" label="可邀请个数" width="100" align="center" />
        <el-table-column prop="createTime" label="注册时间" width="160" />
        <el-table-column prop="expireDate" label="过期时间" width="120" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleView(row)">
              查看
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
  </div>
</template>

<script>
import { getClientUserList } from '@/api/stats'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'UserList',
  components: {
    PageHeader
  },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      queryParams: {
        phone: '',
        mail: '',
        status: null,
        isForever: null,
        year: null,
        month: null,
        registerDate: null,
        page: 1,
        limit: 10
      }
    }
  },
  mounted() {
    // 从路由query参数获取日期
    const { registerDate } = this.$route.query
    if (registerDate) {
      // 设置注册日期筛选
      this.queryParams.registerDate = registerDate
    }
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

      getClientUserList(params)
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
          console.error('获取用户列表失败:', error)
          this.$message.error('获取数据失败')
        })
    },

    handleQuery() {
      this.queryParams.page = 1
      this.fetchData()
    },

    handleReset() {
      this.queryParams = {
        phone: '',
        mail: '',
        status: null,
        isForever: null,
        year: null,
        month: null,
        registerDate: null,
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

    handleView(row) {
      this.$message.info(`查看用户：${row.phone}`)
      // TODO: 实现查看详情功能
    },

    handleSystemChange() {
      // 系统切换时重新获取数据
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.users-container {
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
      min-width: 180px;

      &.phone-input,
      &.mail-input {
        width: 200px;
      }

      // 日期选择器样式
      &.el-date-picker {
        width: 200px;
      }

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
