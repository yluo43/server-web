<template>
  <div class="task-claim-list">
    <div class="filter-container">
      <el-input
        v-model="queryParams.userId"
        placeholder="用户ID"
        clearable
        class="filter-item"
        @clear="handleQuery"
      />

      <el-input
        v-model="queryParams.taskId"
        placeholder="任务ID"
        clearable
        class="filter-item"
        @clear="handleQuery"
      />

      <el-input
        v-model="queryParams.periodKey"
        placeholder="周期键"
        clearable
        class="filter-item"
        @clear="handleQuery"
      />

      <el-select
        v-model="queryParams.rewardType"
        placeholder="奖励类型"
        clearable
        class="filter-item"
        @change="handleQuery"
      >
        <el-option label="锤子" value="hammer" />
        <el-option label="蛋币" value="egg" />
        <el-option label="碎片" value="piece" />
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
          prop="userId"
          label="用户ID"
          width="150"
        />
        <el-table-column
          prop="taskId"
          label="任务ID"
          width="100"
          align="center"
        />
        <el-table-column
          prop="periodKey"
          label="周期键"
          width="150"
        />
        <el-table-column
          prop="rewardType"
          label="奖励类型"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="getRewardTypeTagType(scope.row.rewardType)">
              {{ getRewardTypeLabel(scope.row.rewardType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="rewardCount"
          label="奖励数量"
          width="100"
          align="center"
        />
        <el-table-column
          prop="claimedAt"
          label="领取时间"
          width="180"
        />
        <el-table-column
          prop="createdAt"
          label="创建时间"
          width="180"
        />
      </el-table>

      <pagination
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.limit"
        @pagination="handleQuery"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getTaskClaimRecordList } from '@/api/task'

export default {
  name: 'TaskClaimList',
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      queryParams: {
        userId: '',
        taskId: '',
        periodKey: '',
        rewardType: '',
        page: 1,
        limit: 10
      }
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    async handleQuery() {
      this.loading = true
      try {
        const res = await getTaskClaimRecordList(this.queryParams)
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
        userId: '',
        taskId: '',
        periodKey: '',
        rewardType: '',
        page: 1,
        limit: 10
      }
      this.handleQuery()
    },

    getRewardTypeLabel(type) {
      const typeMap = {
        hammer: '锤子',
        egg: '蛋币',
        piece: '碎片'
      }
      return typeMap[type] || type
    },

    getRewardTypeTagType(type) {
      const typeMap = {
        hammer: 'primary',
        egg: 'warning',
        piece: 'success'
      }
      return typeMap[type] || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.task-claim-list {
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
}
</style>
