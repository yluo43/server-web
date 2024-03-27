<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div style="display: flex; align-items: center; margin-bottom: 10px; font-weight: 600">
            <div>工作量统计:</div>
            <div style="margin-left: 10px; font-weight: 600">
              <el-select v-model="reportWorkName" style="font-weight: 600px; width: 230px !important" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.id" :label="item.reportWorkName" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div style="margin-bottom: 10px">
            <el-form ref="formData" :inline="true" label-width="65px" :label-position="labelposition" :model="formData">
              <el-form-item label="用户姓名:" prop="userName">
                <el-input v-model="formData.userName" placeholder="请输入用户姓名" clearable />
              </el-form-item>
              <el-form-item label="工号:" prop="empId">
                <el-input v-model="formData.empId" placeholder="请输入工号" clearable />
              </el-form-item>
              <el-form-item label="报工类别:" prop="workLoadIds">
                <el-select v-model="formData.workLoadIds" multiple collapse-tags placeholder="请选择报工类别" clearable>
                  <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="成本项目:" prop="projectIds">
                <el-select v-model="formData.projectIds" multiple collapse-tags placeholder="请选择成本项目" clearable>
                  <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="项目经理:" prop="managerIds">
                <el-select v-model="formData.managerIds" multiple collapse-tags placeholder="请选择项目经理" clearable>
                  <el-option v-for="item in projectManagers" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-button type="primary" icon="el-icon-search" style="margin-left: 30px" @click="selectData">查询</el-button>
              <el-button icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
            </el-form>
          </div>
          <div class="row-box">
            <div>
              已选择
              <span>{{ count }}</span>
              项
            </div>
            <div>
              <el-button type="text" @click="batchDownLoad">批量下载</el-button>
            </div>
          </div>
          <div style="padding-bottom: 20px; display: flex; justify-content: flex-end">
            <el-select v-model="checkTeam" multiple clearable @remove-tag="removeTag" collapse-tags>
              <el-option disabled v-for="item in teams" :key="item.id" :label="item.name" :value="item.id">
                <el-checkbox v-model="item.check" @change="isCheck(item)">
                  {{ item.name }}
                </el-checkbox>
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="table">
          <div>
            <el-table
              :data="tableData"
              border
              style="width: 100%; height: 425px; max-height: 425px; overflow-y: scroll"
              @selection-change="selChange"
              :span-method="objectSpanMethod"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="团队成员"></el-table-column>
              <el-table-column prop="empId" label="工号"></el-table-column>
              <el-table-column prop="startTime" label="开始时间"></el-table-column>
              <el-table-column prop="overTime" label="结束时间"></el-table-column>
              <el-table-column prop="workloadName" label="报工类别"></el-table-column>
              <el-table-column prop="projectName" label="成本项目"></el-table-column>
              <el-table-column prop="managerName" label="项目经理"></el-table-column>
              <el-table-column prop="realityRate" label="实际投入(%)"></el-table-column>
              <el-table-column prop="commitTime" label="提交时间"></el-table-column>
              <el-table-column prop="workStatusName" label="确认状态"></el-table-column>
            </el-table>
          </div>
          <div style="display: flex; justify-content: center">
            <el-pagination
              :page-sizes="[10, 15, 20, 25, 30]"
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
      total: 10,
      taskId: '',
      teamId: '',
      curPage: 1,
      pageSize: 10,
      count: 0,
      empId: '1260',
      //工作量统计
      reportWorkName: '',
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
        workLoadIds: [],
        //项目经理
        managerIds: []
      },
      belongingDepartments: [],
      projectManagers: [],
      costItems: [],
      tableData: [],
      spanArr: [],
      pos: '',
      checkedData: [],
      checkTeam: [],
      teams: [],
      categories: []
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
      this.reportWorkName = initData.reportWorkName
      this.taskId = initData.id
      this.teamId = initData.teamId
      this.selectTaskDetial({ teamIdList: this.teamId })
    },
    async initTable() {
      await this.selectTaskList()
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
          this.reportWorkName = result.data.payload[0].reportWorkName
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
    //选择框多选
    isCheck(item) {
      if (item.check && this.checkTeam.indexOf(item.id) == -1) {
        this.checkTeam.push(item.id)
      } else if (!item.check) {
        this.checkTeam.forEach((elm, idx) => {
          if (elm == item.id) {
            this.checkTeam.splice(idx, 1)
          }
        })
      }
      this.selectData()
    },
    removeTag(id) {
      this.teams.forEach((elm, idx) => {
        if (elm.id == id) {
          elm.check = false
          this.checkTeam.splice(idx, 1)
        }
      })
      this.selectData()
    },
    //数据选择框改变
    selChange(sel) {
      this.count = sel.length
      this.checkedData = [...sel]
    },
    //统计工作量下拉框改变
    changeSelect(params) {
      this.taskId = params
      this.selectData()
    },
    //查询
    selectData() {
      let data = {
        empName: this.formData.userName,
        empId: this.formData.empId,
        workloadType: this.formData.workLoadIds.toString() || null,
        managerIds: this.formData.managerIds.toString(),
        projectIds: this.formData.projectIds.toString(),
        teamIdList: this.checkTeam.toString() || this.teamId
      }
      this.selectTaskDetial(data)
    },
    //查询详情
    selectTaskDetial(params) {
      let data = { curPage: this.curPage, pageSize: this.pageSize, taskId: this.taskId, type: 2 }
      data = { ...data, ...params }
      Object.keys(data).map((key) => {
        if (!data[key]) {
          delete data[key]
        }
      })
      this.$http({
        url: this.$http.adornUrl('/teamWork/viewTeamWorkList'),
        method: 'get',
        params: data
      }).then(({ data }) => {
        if (data && data.code == 200) {
          this.tableData = data.payload.list
          this.total = data.payload.totalCount
          this.spanArr = []
          this.getSpanArr(this.tableData)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 分页自带的函数，当pageSize变化时会触发此函数
    handleSizeChange(val) {
      this.pageSize = val
      this.selectData()
    },
    // 分页自带函数，当curPage变化时会触发此函数
    handleCurrentChange(val) {
      this.curPage = val
      this.selectData()
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
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
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

      let ids = []
      this.tableData.map((item) => {
        this.checkedData.map((ele) => {
          if (item.empId === ele.empId) {
            console.log(item)
            ids.push(item.id)
          }
        })
      })
      data.ids = ids
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
::v-deep .el-form-item__content {
  width: 180px;
}
::v-deep.el-table::before {
  display: none !important;
}
::v-deep .el-input__icon {
  line-height: 0;
}
.main {
  .top {
    background: white;
    padding-left: 30px;
  }
  .header-title {
    font-size: 16px;
    font-weight: 600;
  }
  .status {
    padding: 20px 0;
  }
  .row-box {
    display: flex;
    align-items: center;
    height: 40px;
    border-radius: 5px;
    margin-left: -20px;
    margin-bottom: 20px;
    background-color: #e8f4ff;
    padding-left: 20px;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
}
</style>
