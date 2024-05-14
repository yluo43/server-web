<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-container>
        <el-main style="width: 100%; padding: 0">
          <div class="table" style="height: 650px; background-color: white">
            <el-row style="display: flex; align-items: center">
              <el-col>
                <div style="display: flex; align-items: center">
                  <span style="font-size: 16px; font-weight: 600; margin-left: 16px">工作量统计：</span>
                  <el-select v-model="dataForm.taskId" style="width: 230px !important" @change="changeSelect">
                    <el-option v-for="item in commandList" :key="item.id" :label="item.reportWorkName" :value="item.id" />
                  </el-select>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-col>
                  <el-header style="height: auto">
                    <el-form :inline="true" label-width="70px" label-position="right" :model="dataForm" ref="dataForm">
                      <el-form-item label="用户姓名:" prop="empName">
                        <el-input style="width: 200px" v-model="dataForm.empName" placeholder="请输入用户姓名" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="归属部门:">
                        <el-select v-model="deptIdList" multiple collapse-tags placeholder="请选择归属部门">
                          <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="归属团队:">
                        <el-select v-model="teamIdList" multiple collapse-tags placeholder="请选择归属团队">
                          <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="报工类别:">
                        <el-select v-model="workloadType" multiple collapse-tags placeholder="请选择报工类别">
                          <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <div v-if="showFlag" style="display: contents">
                        <el-form-item label="工号:" prop="empId">
                          <el-input
                            style="width: 200px"
                            v-model="dataForm.empId"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                            placeholder="请输入工号"
                            clearable
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="团队负责人:">
                          <el-select v-model="managerIdList" multiple collapse-tags placeholder="请选择团队负责人">
                            <el-option v-for="item in managerList" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <el-form-item>
                        <div style="display: inline-block; margin-right: 15px" :style="showFlag ? { 'margin-left': '10px' } : ''" @click="showFlag = !showFlag">
                          <svg-icon
                            :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'"
                            style="height: 1.3em; width: 1.3em; position: relative; top: 3px"
                          />
                          <span v-if="showFlag" class="btn-font-size" style="color: #2462f9">收起</span>
                          <span v-else class="btn-font-size" style="color: #2462f9">展开</span>
                        </div>
                        <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
                        <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
                      </el-form-item>
                    </el-form>
                  </el-header>
                </el-col>
              </el-col>
            </el-row>
            <div class="chooseResult">
              <span>已选中 {{ count }} 项</span>
              <el-button type="text" @click="download()">批量下载</el-button>
              <!-- <span style="color: blue; margin-left: 50px" @click="download()">批量下载</span> -->
            </div>
            <div style="margin-top: 10px">
              <!-- @selection-change="selChange" -->
              <div>
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  border
                  :header-cell-style="{ 'text-align': 'center' }"
                  :cell-style="{ 'text-align': 'center' }"
                  style="width: 100%; height: 425px; overflow-y: scroll"
                  :span-method="objectSpanMethod"
                  :row-key="(row) => row.id"
                  @select="handleSelect"
                  @select-all="handleSelectionAll"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="name" label="团队成员" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="empId" label="工号" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deptName" label="归属部门" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="teamName" label="归属团队" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="teamManagerName" label="团队负责人" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="startTime" label="开始时间" width="90px" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="overTime" label="结束时间" width="90px" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="workloadName" label="报工类别" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="planRate" label="计划投入(%)" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="realityRate" label="实际投入(%)" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="commitTime" label="提交时间" width="90px" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="approveTime" label="审批时间" width="90px" show-overflow-tooltip></el-table-column>
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
          </div>
        </el-main>
      </el-container>
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
      showFlag: false,
      command: '选择任务',
      radio: 1,
      keyword: '',
      tableData: [],
      //总条数
      total: 0,
      curPage: 1,
      pageSize: 20,
      spanArr: [],
      pos: 0,
      //  checkedData: [],
      count: 0,
      managerList: [],
      deptList: [],
      teamList: [],
      managerIdList: [],
      deptIdList: [],
      teamIdList: [],
      categories: [],
      workloadType: [],
      dataForm: {
        teamManagerIds: '',
        deptIds: '',
        teamIds: '',
        workloadType: null,
        projectId: '',
        empName: '',
        empId: '',
        taskId: '',
        type: '2'
      },
      commandList: [],
      multipleSelection: []
    }
  },
  watch: {
    deptIdList(newName, oldName) {
      if (newName) {
        this.dataForm.deptIds = newName.join(',')
      }
    },
    workloadType(newName, oldName) {
      if (newName) {
        this.dataForm.workloadType = newName.join(',')
      }
    },
    managerIdList(newName, oldName) {
      if (typeof newName === 'number') {
        this.dataForm.teamManagerIds = newName.toString()
      } else if (newName) {
        this.dataForm.teamManagerIds = newName.join(',')
      }
    },
    teamIdList(newName, oldName) {
      if (newName) {
        this.dataForm.teamIds = Object(newName).join(',')
      }
    }
  },
  mounted() {
    this.$http({
      url: this.$http.adornUrl('/common/getManager'),
      params: { pid: 3 },
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.managerList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    this.$http({
      url: this.$http.adornUrl('/common/getDept'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.deptList = data.payload.filter((item) => item.id !== 0)
      } else {
        this.$message.error(data.msg)
      }
    })
    this.$http({
      url: this.$http.adornUrl('/common/getTeam'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.teamList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    this.getWorkloadType()
  },
  methods: {
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
    async init(data) {
      if (data) {
        Object.assign(this.dataForm, data)
      }
      await this.projectTaskListNoPage()
      if (this.dataForm.projectId && this.dataForm.taskId) {
        this.selectTaskList()
      }
    },
    initData(params) {
      if (params) {
        Object.assign(this.dataForm, params)
      }
      if (!this.dataForm.taskId) {
        return
      }
      this.selectTaskList()
    },
    changeSelect() {
      this.selectTaskList()
    },
    selectTaskList() {
      let params = { ...this.dataForm, curPage: this.curPage, pageSize: this.pageSize }
      Object.keys(params).map((key) => {
        if (!params[key]) {
          delete params[key]
        }
      })
      this.$http({
        url: this.$http.adornUrl('/projectWork/projectWorkList'),
        method: 'get',
        params: params
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData = data.payload.list
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
    // 分页自带的函数，当pageSize变化时会触发此函数
    handleSizeChange(val) {
      this.pageSize = val
      this.selectTaskList()
    },
    // 分页自带函数，当curPage变化时会触发此函数
    handleCurrentChange(val) {
      this.curPage = val
      this.selectTaskList()
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
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 4 ||
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex === 7
      ) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    clearTable() {
      this.tableData = []
    },
    refresh() {
      this.selectTaskList()
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
      this.managerIdList = []
      this.deptIdList = []
      this.teamIdList = []
      this.workloadType = []
    },
    // selChange(selection) {
    //   this.count = selection.length
    //   this.checkedData = [...selection]
    // },
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
    async projectTaskListNoPage() {
      const result = await this.$http({
        url: this.$http.adornUrl('/projectWork/projectTaskListNoPage'),
        method: 'get',
        params: {
          workStatus: this.dataForm.workStatus,
          projectId: this.dataForm.projectId,
          taskId: this.dataForm.taskId
        }
      })
      if (result.data && result.data.code === 200) {
        this.commandList = result.data.payload
        // this.command = result.data.payload[0].reportWorkName
        if (result.data.payload.length != 0) {
          this.dataForm.taskId = result.data.payload[0].id
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    //下载
    download() {
      if (this.count === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      data.ids = this.multipleSelection.map((item) => item.id)
      // let ids = []
      // this.tableData.map((item) => {
      //   this.checkedData.map((ele) => {
      //     if (item.empId === ele.empId) {
      //       ids.push(item.id)
      //     }
      //   })
      // })
      // let data = ids
      this.$http.downloadPost(this.$http.adornUrl('/projectWork/export'), { ids: data }, this)
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
.table {
  background-color: white;
  margin-top: 10px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-weight: 600;
}

.el-icon-arrow-down {
  font-size: 16px;
}

// .chooseResult {
//   height: 30px;
//   line-height: 30px;
//   margin: 10px auto;
//   display: block;
//   background: #e9f3ff;
//   border-radius: 6px;
// }
</style>
