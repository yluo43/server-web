<template>
  <div class="home-container">
    <page-header active-menu="home" @system-changed="handleSystemChange" />

    <div class="filter-container">
      <el-date-picker
        v-model="selectedDate"
        type="month"
        placeholder="选择年月"
        format="yyyy年 MM月"
        value-format="yyyy-MM"
        :clearable="false"
        @change="handleDateChange"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        class="search-btn"
        @click="fetchData"
      >
        查询
      </el-button>
      <el-button
        type="success"
        icon="el-icon-download"
        :loading="exportLoading"
        class="export-btn"
        @click="exportExcel"
      >
        导出Excel
      </el-button>
    </div>

    <div class="chart-container">
      <div ref="chart" v-loading="loading" class="chart"></div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" border stripe>
        <el-table-column prop="registerDate" label="注册日期" width="180" />
        <el-table-column prop="dailyRegistrations" label="注册人数" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { getRegistrationStats } from '@/api/stats'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'HomePage',
  components: {
    PageHeader
  },
  data() {
    return {
      selectedDate: '',
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      chart: null,
      chartData: [],
      tableData: [],
      loading: false,
      exportLoading: false
    }
  },
  mounted() {
    this.initDate()
    this.initChart()
    this.fetchData()

    // 监听系统切换事件
    this.$root.$on('system-changed', this.handleSystemChanged)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }

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
    initDate() {
      const year = this.currentYear
      const month = String(this.currentMonth).padStart(2, '0')
      this.selectedDate = `${year}-${month}`
    },

    initChart() {
      this.chart = this.$echarts.init(this.$refs.chart)

      const option = {
        title: {
          text: '用户注册统计',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}<br/>{a}: {c}人'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            rotate: 45,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '注册人数',
          axisLabel: {
            formatter: '{value}人'
          }
        },
        series: [
          {
            name: '注册人数',
            type: 'bar',
            data: [],
            itemStyle: {
              color: '#409EFF'
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}人'
            }
          }
        ]
      }

      this.chart.setOption(option)

      // 添加双击事件
      this.chart.on('dblclick', (params) => {
        if (params.componentType === 'series' && params.seriesType === 'bar') {
          // 通过 dataIndex 获取对应的数据
          const dataIndex = params.dataIndex
          if (this.chartData && this.chartData[dataIndex]) {
            const registerDate = this.chartData[dataIndex].registerDate

            // 跳转到用户列表页面，传递具体日期参数
            this.$router.push({
              path: '/users',
              query: {
                registerDate: registerDate
              }
            })
          }
        }
      })

      // 响应式调整
      window.addEventListener('resize', () => {
        this.chart && this.chart.resize()
      })
    },

    handleDateChange(value) {
      console.log('选择的日期:', value)
      // 日期改变后自动查询数据
      if (value) {
        this.fetchData()
      }
    },

    fetchData() {
      if (!this.selectedDate) {
        this.$message.warning('请选择年月')
        return
      }

      const [year, month] = this.selectedDate.split('-')

      this.loading = true
      getRegistrationStats({
        year: parseInt(year),
        month: parseInt(month)
      })
        .then(response => {
          this.loading = false
          if (response.data && response.data.code === 200) {
            const stats = response.data.data || []
            this.chartData = stats
            this.tableData = stats
            this.updateChart(stats)
          } else {
            this.$message.error(response.data?.msg || '获取数据失败')
          }
        })
        .catch(error => {
          this.loading = false
          console.error('获取统计数据失败:', error)
          this.$message.error('获取数据失败')
        })
    },

    updateChart(stats) {
      if (!stats || stats.length === 0) {
        this.$message.warning('暂无数据')
        this.chart.setOption({
          xAxis: { data: [] },
          series: [{ data: [] }]
        })
        return
      }

      const dates = stats.map(item => {
        const date = new Date(item.registerDate)
        return `${date.getMonth() + 1}/${date.getDate()}`
      })
      const values = stats.map(item => item.dailyRegistrations)

      this.chart.setOption({
        xAxis: {
          data: dates
        },
        series: [
          {
            data: values
          }
        ]
      })
    },

    exportExcel() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message.warning('暂无数据可导出')
        return
      }

      this.exportLoading = true

      try {
        // 准备导出数据
        const exportData = this.tableData.map(item => ({
          '注册日期': item.registerDate,
          '注册人数': item.dailyRegistrations
        }))

        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(exportData)

        // 设置列宽
        ws['!cols'] = [
          { wch: 20 },
          { wch: 15 }
        ]

        // 创建工作簿
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, '用户注册统计')

        // 生成文件名
        const [year, month] = this.selectedDate.split('-')
        const fileName = `用户注册统计_${year}年${month}月.xlsx`

        // 导出文件
        XLSX.writeFile(wb, fileName)

        this.$message.success('导出成功')
      } catch (error) {
        console.error('导出Excel失败:', error)
        this.$message.error('导出失败')
      } finally {
        this.exportLoading = false
      }
    },

    handleSystemChange() {
      // 系统切换时重新获取数据
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
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

    .el-date-picker {
      margin-right: 0;
    }

    .el-button {
      margin-left: 0;
      min-width: 100px;
      padding: 12px 20px;

      &.search-btn,
      &.export-btn {
        min-width: 120px;
      }
    }
  }

  .chart-container {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .chart {
      width: 100%;
      height: 500px;
    }
  }

  .table-container {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  ::v-deep .el-input--prefix .el-input__inner {
    padding-right: 0 !important;
  }

  ::v-deep [class*="el-icon-date"] {
    line-height: 30px;
  }
}
</style>
