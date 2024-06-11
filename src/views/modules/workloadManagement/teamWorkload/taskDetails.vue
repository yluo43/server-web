<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main class="main">
        <div class="top">
          <div class="header-title">
            <div>工作量统计:</div>
            <div style="margin-left: 6px">
              <el-select v-model="taskId" style="width: 278px !important" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.id" :label="item.reportWorkName" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div style="padding-left: 24px">
            <el-form ref="formData" :inline="true" label-width="60px" :label-position="labelposition" :model="formData">
              <el-form-item label="用户姓名:" prop="userName">
                <el-input style="width: 200px" v-model="formData.userName" placeholder="请输入用户姓名" clearable />
              </el-form-item>
              <el-form-item label="归属团队:" prop="teamIds">
                <el-select v-model="formData.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
                  <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <!-- multiple collapse-tags -->
              <el-form-item label="报工类别:" prop="workLoadIds">
                <el-select v-model="formData.workLoadIds" placeholder="请选择报工类别" clearable>
                  <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="成本项目:" prop="projectIds">
                <el-select v-model="formData.projectIds" multiple collapse-tags placeholder="请选择成本项目" clearable>
                  <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <div v-if="showFlag" style="display: contents">
                <el-form-item label="工号:" prop="empId">
                  <el-input
                    style="width: 200px"
                    v-model="formData.empId"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    placeholder="请输入工号"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="项目经理:" prop="managerIds">
                  <el-select v-model="formData.managerIds" multiple collapse-tags placeholder="请选择项目经理" clearable>
                    <el-option v-for="item in projectManagers" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id" />
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item>
                <div style="display: inline-block; margin-right: 15px" :style="showFlag ? { 'margin-left': '10px' } : ''" @click="showFlag = !showFlag">
                  <svg-icon :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'" style="height: 1.3em; width: 1.3em; position: relative; top: 3px" />
                  <span v-if="showFlag" class="btn-font-size" style="color: #2462f9">收起</span>
                  <span v-else class="btn-font-size" style="color: #2462f9">展开</span>
                </div>
                <el-button type="primary" icon="el-icon-search" @click="searchTableData" style="margin-right: 10px">查询</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="chooseResult" style="display: flex; margin: 24px 0">
          <div>
            已选中
            <span>{{ count }}</span>
            项
          </div>
          <div>
            <el-button type="text" @click="batchDownLoad">批量下载</el-button>
          </div>
        </div>
        <div class="table">
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              border
              height="430px"
              style="width: 100%"
              :header-cell-style="{ 'text-align': 'center' }"
              :cell-style="{ 'text-align': 'center' }"
              :span-method="objectSpanMethod"
              :row-key="(row) => row.id"
              @select="handleSelect"
              @select-all="handleSelectionAll"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="团队成员" show-overflow-tooltip></el-table-column>
              <el-table-column prop="empId" label="工号" show-overflow-tooltip></el-table-column>
              <el-table-column prop="startTime" label="开始时间" min-width="90px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="overTime" label="结束时间" min-width="90px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="workloadName" label="报工类别" show-overflow-tooltip></el-table-column>
              <el-table-column prop="projectName" label="成本项目" min-width="210px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="managerName" label="项目经理" show-overflow-tooltip></el-table-column>
              <el-table-column prop="realityRate" label="实际投入(%)" show-overflow-tooltip></el-table-column>
              <el-table-column prop="marks" label="备注" show-overflow-tooltip></el-table-column>
              <el-table-column prop="commitTime" label="提交时间" min-width="90px" show-overflow-tooltip></el-table-column>
              <el-table-column prop="workStatusName" label="确认状态" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 10px">
            <el-pagination
              :page-sizes="[20, 50, 100]"
              :page-size="pageSize"
              :current-page="curPage"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
export default {
  components: { baseTable, baseDialog },
  props: {},
  data() {
    return {
      //总条数
      showFlag: false,
      total: 0,
      taskId: '',
      teamId: '',
      curPage: 1,
      pageSize: 20,
      count: 0,
      empId: '',
      //工作量统计
      // reportWorkName: '',
      workLoadStatistics: [],
      // form表单右对齐
      labelposition: 'right',
      formData: {
        //用户姓名
        userName: '',
        //工号
        empId: '',
        //成本项目
        projectIds: [],
        //报工类别
        // workLoadIds: [],
        workLoadIds: '',
        //项目经理
        managerIds: [],
        teamIds: []
      },
      belongingDepartments: [],
      projectManagers: [],
      costItems: [],
      tableData: [],
      spanArr: [],
      pos: 0,
      teams: [],
      categories: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.empId = this.$store.state.user.empId
    this.getManager()
    this.getTeam()
    this.getProject()
    this.getWorkloadType()
  },
  created() {},
  methods: {
    //初始化数据
    async init(initData) {
      await this.selectTaskList()
      // this.reportWorkName = initData.reportWorkName
      this.taskId = initData.id
      this.teamId = initData.teamId
      this.selectTaskDetial()
    },
    async initTable() {
      await this.selectTaskList()
      if (!this.taskId) {
        return
      }
      this.selectTaskDetial()
    },
    searchTableData() {
      this.count = 0
      this.multipleSelection = []
      this.selectTaskDetial()
    },
    //获取报工类别
    getWorkloadType() {
      this.$http({
        url: this.$http.adornUrl('/common/getWorkloadType'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.categories = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //查询任务列表
    async selectTaskList() {
      const result = await this.$http({
        url: this.$http.adornUrl('/teamWork/teamTaskListNoPage'),
        method: 'get'
      })
      if (result.data && result.data.code === 200) {
        this.workLoadStatistics = result.data.payload
        if (result.data.payload.length != 0) {
          //  this.reportWorkName = result.data.payload[0].reportWorkName
          this.taskId = result.data.payload[0].id
        }
      } else {
        this.$message.error(result.data.msg)
      }
    },
    //获取成本项目
    getProject() {
      this.$http({
        url: this.$http.adornUrl('/costItems/listNoPage'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.costItems = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取团队
    getTeam() {
      this.$http({
        url: this.$http.adornUrl('/common/getTeam'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          data.payload.map((item) => {
            item.check = false
          })
          this.teams = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //单选
    handleSelect(rows, row) {
      let foundIndex = this.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(row))
      if (foundIndex !== -1) {
        this.multipleSelection = this.multipleSelection.filter((item) => {
          return row.empId !== item.empId
        })
      } else {
        this.tableData.forEach((item) => {
          if (item.empId === row.empId) {
            this.multipleSelection.push(item)
          }
        })
      }
      this.count = this.multipleSelection.length
    },
    // 全选
    handleSelectionAll(val) {
      let foundIndex
      if (val.length) {
        const result = []
        this.tableData.forEach((ele) => {
          if (this.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(ele)) == -1) result.push(ele)
        })
        this.multipleSelection.push(...result)
      } else {
        this.tableData.forEach((ele) => {
          foundIndex = this.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(ele))
          if (foundIndex != -1) {
            this.multipleSelection.splice(foundIndex, 1)
          }
        })
      }
      this.count = this.multipleSelection.length
    },
    //统计工作量下拉框改变
    changeSelect(params) {
      // this.taskId = params
      this.count = 0
      this.multipleSelection = []
      this.selectTaskDetial()
    },
    //查询详情
    selectTaskDetial() {
      let data = {
        taskId: this.taskId,
        empName: this.formData.userName,
        empId: this.formData.empId,
        // workloadType: this.formData.workLoadIds.toString(),
        workloadType: this.formData.workLoadIds,
        managerIds: this.formData.managerIds.toString(),
        projectIds: this.formData.projectIds.toString(),
        teamIdList: this.formData.teamIds.toString() || this.teamId,
        type: 2,
        curPage: this.curPage,
        pageSize: this.pageSize
      }
      Object.keys(data).map((key) => {
        if (!data[key]) {
          delete data[key]
        }
      })
      if (!data.taskId) {
        return
      }
      this.$http({
        url: this.$http.adornUrl('/teamWork/viewTeamWorkList'),
        method: 'get',
        params: data
      }).then(({ data }) => {
        if (data && data.code == 200) {
          this.tableData = data.payload.list.sort(this.compare('empId'))
          this.total = data.payload.totalCount
          this.pos = 0
          this.spanArr = []
          this.getSpanArr(this.tableData)
          this.$nextTick(() => {
            let foundIndex
            this.tableData.forEach((ele, index) => {
              foundIndex = this.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(ele))
              if (foundIndex != -1) {
                this.$refs.multipleTable.toggleRowSelection(this.$refs.multipleTable.data[index], true)
              }
            })
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    compare(prop) {
      return function (a, b) {
        return a[prop] - b[prop] // 升序
      }
    },
    // 分页自带的函数，当pageSize变化时会触发此函数
    handleSizeChange(val) {
      this.pageSize = val
      this.selectTaskDetial()
    },
    // 分页自带函数，当curPage变化时会触发此函数
    handleCurrentChange(val) {
      this.curPage = val
      this.selectTaskDetial()
    },
    getSpanArr(data) {
      // 遍历数据
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          if (data[i].empId === data[i - 1].empId) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    //获取负责人
    getManager() {
      this.$http({
        url: this.$http.adornUrl('/common/getManager'),
        params: { pid: 4 },
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.projectManagers = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //批量下载
    batchDownLoad() {
      let data = {
        taskId: this.taskId,
        teamIdList: [],
        workStatus: '',
        empName: '',
        empId: '',
        managerName: '',
        projectId: [],
        type: 2
      }
      if (this.count === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      data.ids = this.multipleSelection.map((item) => item.id)
      this.$http.downloadPost(this.$http.adornUrl('/teamWork/export'), data, this)
    },
    //重置
    resetForm() {
      this.$refs.formData.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
::v-deep.el-table::before {
  display: none !important;
}
::v-deep .el-input__icon {
  line-height: 0;
}
.main {
  width: 100%;
  padding: 0;
  .top {
    padding-bottom: 20px;
    background: white;
  }
  .header-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 24px;
  }
}
.table {
  background-color: white;
}
</style>
