<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div class="header-title">
            <div>工作量统计:</div>
            <div style="margin-left: 10px; font-weight: 600">
              <el-select v-model="reportWorkName" style="font-weight: 600px; width: 230px !important" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.id" :label="item.reportWorkName" :value="item.id" />
              </el-select>
            </div>
          </div>

          <div class="status">
            状态：
            <el-radio-group v-model="radio" @change="handlerRadio">
              <el-radio-button label="0">全部</el-radio-button>
              <el-radio-button label="1">待确认</el-radio-button>
              <el-radio-button label="3">被驳回</el-radio-button>
              <el-radio-button label="2">已确认</el-radio-button>
            </el-radio-group>
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
            <el-table :data="tableData" border style="width: 100%; height: 425px; max-height: 425px; overflow-y: scroll" :span-method="objectSpanMethod">
              <el-table-column prop="name" label="团队成员"></el-table-column>
              <el-table-column prop="empId" label="工号"></el-table-column>
              <el-table-column prop="startTime" label="开始时间"></el-table-column>
              <el-table-column prop="overTime" label="结束时间"></el-table-column>
              <el-table-column prop="workloadName" label="报工类别"></el-table-column>
              <el-table-column prop="projectName" label="成本项目"></el-table-column>
              <el-table-column prop="managerName" label="项目经理"></el-table-column>
              <el-table-column prop="realityRate" label="实际投入(%)"></el-table-column>
              <el-table-column prop="commitTime" label="提交时间"></el-table-column>
              <el-table-column prop="workStatus" label="确认状态">
                <template slot-scope="scope">
                  <template v-if="scope.row.workStatus == 0">
                    <span>填报中</span>
                  </template>
                  <template v-if="scope.row.workStatus == 1">
                    <span>待确认</span>
                  </template>
                  <template v-if="scope.row.workStatus == 3">
                    <el-tooltip class="item" effect="dark" placement="bottom-start">
                      <div slot="content">
                        驳回人:{{ scope.row.rejectPeople }}
                        <br />
                        驳回理由:{{ scope.row.rejectReason }}
                      </div>
                      <span style="color: red">被驳回</span>
                    </el-tooltip>
                  </template>
                  <template v-if="scope.row.workStatus == 2">
                    <span>已确认</span>
                  </template>
                  <template v-if="scope.row.workStatus == 4">
                    <span>已归档</span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="edit(scope.row)" type="text">编辑</el-button>
                </template>
              </el-table-column>
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
    <!-- 驳回 -->
    <base-dialog ref="editDataDialog" title="编辑工作量" :width="'800px'">
      <template>
        <editDataDialog ref="edit" :cancelDialog="closeDialog" @select="select"></editDataDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import editDataDialog from '@/views/modules/workloadManagement/teamWorkload/editDataDialog.vue'
export default {
  components: { baseTable, baseDialog, editDataDialog },
  props: {},
  data() {
    return {
      //总条数
      total: 10,
      curPage: 1,
      pageSize: 10,
      //任务Id
      taskId: '',
      teamId: '',
      //工作量统计
      reportWorkName: '',
      workLoadStatistics: [],
      radio: '0',
      queryData: {},
      tableData: [],
      spanArr: [],
      pos: 0,
      checkTeam: [],
      teams: [],
      empId: '1260'
    }
  },
  mounted() {
    // this.empId = this.$store.state.user.empId
    this.getTeam()
  },
  created() {},
  methods: {
    //初始化数据
    async init(initData) {
      await this.selectTaskList()
      this.reportWorkName = initData.reportWorkName
      this.taskId = initData.id
      this.teamId = initData.teamId
      this.selectWorkload({ teamIdList: this.teamId })
      // console.log(initData)
    },
    async initTable() {
      await this.selectTaskList()
      this.selectWorkload()
    },
    select() {
      this.handlerRadio()
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
      if (item.check && this.checkTeam.indexOf(item.name) == -1) {
        this.checkTeam.push(item.id)
      } else if (!item.check) {
        this.checkTeam.forEach((elm, idx) => {
          if (elm == item.id) {
            this.checkTeam.splice(idx, 1)
          }
        })
      }
      this.handlerRadio()
    },

    removeTag(id) {
      this.teams.forEach((elm, idx) => {
        if (elm.id == id) {
          elm.check = false
          this.checkTeam.splice(idx, 1)
        }
      })
      this.handlerRadio()
    },
    //查询表格数据
    selectWorkload(params) {
      let data = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        taskId: this.taskId,
        type: 1
      }
      data = { ...data, ...params }
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
    //统计工作量下拉框改变
    changeSelect(params) {
      this.taskId = params
      this.handlerRadio()
    },

    // 分页自带的函数，当pageSize变化时会触发此函数
    handleSizeChange(val) {
      this.pageSize = val
      this.handlerRadio()
    },
    // 分页自带函数，当curPage变化时会触发此函数
    handleCurrentChange(val) {
      this.curPage = val
      this.handlerRadio()
    },

    //切换ridio
    handlerRadio() {
      if (this.radio == 0) {
        this.selectWorkload({ teamIdList: this.checkTeam.toString() || this.teamId })
      } else {
        this.selectWorkload({
          workStatus: this.radio,
          teamIdList: this.checkTeam.toString() || this.teamId
        })
      }
    },

    //编辑
    edit(row) {
      let data = {
        userName: row.name,
        empId: row.empId,
        taskId: this.taskId
        //工作量
        // workLoad: []
      }
      // this.tableData.map((item) => {
      //   if (item.empId === row.empId) {
      //     data.workLoad.push(item)
      //   }
      // })
      this.$refs.editDataDialog.show()
      this.$nextTick(() => {
        this.$refs.edit.init(data)
      })
    },
    //关闭编辑弹窗
    closeDialog() {
      this.$refs.editDataDialog.hide()
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
    //合并单元格
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 10) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
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
.main {
  .top {
    background: white;
    padding-left: 30px;
  }
  .header-title {
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  .status {
    padding: 20px 0;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
}
::v-deep .el-input__icon {
  line-height: 0;
}

.setstyle {
  min-height: 200px;
  padding: 0 !important;
  margin: 0;
  overflow: auto;
  cursor: default !important;
}
</style>
