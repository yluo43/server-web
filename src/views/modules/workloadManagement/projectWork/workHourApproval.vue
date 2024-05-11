<template>
  <div style="width: 100%; height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
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
                <span style="font-size: 13px; margin-left: 16px">状态：</span>
                <el-radio-group v-model="dataForm.workStatus" @change="handlerRadio">
                  <el-radio-button :label="null">全部</el-radio-button>
                  <el-radio-button :label="1">待确认</el-radio-button>
                  <el-radio-button :label="3">被驳回</el-radio-button>
                  <el-radio-button :label="2">已确认</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-col>
          </el-row>
          <div class="chooseResult">
            <span>已选中 {{ count }} 项</span>
            <el-button type="text" @click="projectWorkOperate(null, 1)">批量确认</el-button>
            <!-- <span style="color: blue" @click="projectWorkOperate(null, 1)">批量确认</span> -->
          </div>

          <div style="margin-top: 10px">
            <div>
              <el-table
                :data="tableData"
                border
                :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }"
                style="width: 100%; height: 475px; overflow-y: scroll"
                @selection-change="selChange"
                :span-method="objectSpanMethod"
                :row-key="(row) => row.id"
              >
                <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
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
                <el-table-column prop="workStatusName" label="确认状态" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="200px">
                  <template slot-scope="scope">
                    <el-button :disabled="scope.row.workStatusName != '待确认'" type="text" @click="projectWorkOperate(scope.row, 1)">确认</el-button>
                    <el-button :disabled="scope.row.workStatusName != '待确认'" type="text" @click="projectWorkOperateTwo(scope.row, 2)">驳回</el-button>
                  </template>
                </el-table-column>
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
    <base-dialog ref="projectWorkOperateDialog" title="工作量驳回" :width="'500px'">
      <template>
        <projectWorkOperate ref="projectWorkOperate" @refreshDataList="selectTaskList"></projectWorkOperate>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseDialog from '@/views/modules/base/baseDialog.vue'
import projectWorkOperate from '@/views/modules/workloadManagement/projectWork/projectWorkOperate.vue'

export default {
  components: { projectWorkOperate, baseDialog },
  props: {},
  data() {
    return {
      //总条数
      total: 0,
      curPage: 1,
      pageSize: 20,
      spanArr: [],
      pos: 0,
      checkedData: [],
      count: 0,
      chooseStr: '已选择 0 项',
      // command: '选择任务',
      radio: 1,
      keyword: '',
      dataForm: {
        workStatus: null,
        projectId: null,
        taskId: null,
        type: '1'
      },
      tableData: [],
      commandList: []
    }
  },
  methods: {
    async init(data) {
      await this.projectTaskListNoPage()
      if (data) {
        Object.assign(this.dataForm, data)
      }
      if (this.dataForm.projectId == null) {
        return
      }
      this.selectTaskList()
    },
    initData(params) {
      if (params) {
        Object.assign(this.dataForm, params)
      }
      this.selectTaskList()
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
        if (result.data.payload.length != 0) {
          this.dataForm.taskId = result.data.payload[0].id
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    selChange(selection) {
      this.count = selection.length
      this.checkedData = [...selection]
    },
    changeSelect() {
      this.selectTaskList()
    },
    selectTaskList() {
      let params = { ...this.dataForm, curPage: this.curPage, pageSize: this.pageSize }
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
    //切换radio
    handlerRadio() {
      this.selectTaskList()
    },
    projectWorkOperateTwo(row, operateType) {
      this.$refs.projectWorkOperateDialog.show()
      this.$nextTick(() => {
        row.operateType = operateType
        this.$refs.projectWorkOperate.init(row)
      })
    },
    projectWorkOperate(row, operateType) {
      let message = ''
      let ids = []
      if (row) {
        ids = [row.id]
        message = '确认提交吗?'
      } else {
        if (this.count === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        message = '已选中' + this.count + '项，批量确认吗？'
        this.tableData.map((item) => {
          this.checkedData.map((ele) => {
            if (item.empId === ele.empId) {
              ids.push(item.id)
            }
          })
        })
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/projectWork/projectWorkOperate'),
            method: 'post',
            data: { ids: ids, operateType: operateType }
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '确认成功',
                type: 'success'
              })
              this.$emit('projectListRefresh')
              this.selectTaskList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认'
          })
        })
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
