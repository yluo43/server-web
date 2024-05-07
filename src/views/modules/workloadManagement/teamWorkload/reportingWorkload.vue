<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div class="header-title">工作量统计：{{ taskInfo.reportWorkName }}</div>
        </div>
        <div class="info-box">
          <div>
            <span>填报人:</span>
            <span>{{ taskInfo.manageName }}</span>
          </div>
          <div>
            <span>团队名称:</span>
            <span>{{ taskInfo.teamName }}</span>
          </div>
          <div>
            <span>团队成员:</span>
            <span>{{ taskInfo.teamNum }}</span>
          </div>
          <div>
            <span>填报开始时间:</span>
            <span>{{ taskInfo.reportStartTime }}</span>
          </div>
        </div>
        <div class="desc">
          <span>简介:</span>
          <span>{{ taskInfo.intro }}</span>
        </div>

        <div class="table">
          <div style="display: flex; align-items: center">
            <div class="table-title">填报工作量</div>
            <div style="margin-left: 20px">
              <el-button type="text" @click="add">添加</el-button>
            </div>
          </div>
          <div>
            <el-table :data="tableData" style="width: 100%" border height="300px" :span-method="objectSpanMethod">
              <el-table-column prop="name" label="姓名" width="80px" align="center"></el-table-column>
              <el-table-column prop="empId" label="工号" width="80px" align="center"></el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="100px" align="center"></el-table-column>
              <el-table-column prop="overTime" label="结束时间" width="100px" align="center"></el-table-column>

              <el-table-column prop="projectName" label="成本项目" width="160px" align="center">
                <template slot-scope="scope">
                  <el-tooltip class="item" :disabled="!scope.row.projectName" :content="scope.row.projectName" placement="top-end">
                    <el-select
                      style="width: 120px !important"
                      placeholder="请选择成本项目"
                      filterable
                      v-model="scope.row.projectName"
                      @change="handlerSel(scope.row, scope.column)"
                      ref="projectName"
                    >
                      <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="workloadName" label="报工类别" width="160px" align="center">
                <template slot-scope="scope">
                  <el-select
                    style="width: 120px !important"
                    v-model="scope.row.workloadName"
                    @change="handlerWorkLoadName(scope.row, scope.column)"
                    ref="workloadName"
                    filterable
                    placeholder="请选择报工类别"
                  >
                    <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="workloadName" label="报工类别">
                <template slot-scope="scope">
                  <div @dblclick="handlerCategory(scope.row, scope.column)" style="height: 50px; line-height: 50px">
                    <el-select
                      style="width: 120px !important"
                      v-if="scope.row.isCategory"
                      v-model="scope.row.workloadName"
                      @change="handlerWorkLoadName(scope.row, scope.column)"
                      ref="workloadName"
                    >
                      <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.workloadName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="projectName" label="成本项目">
                <template slot-scope="scope">
                  <div @dblclick="handlerSelect(scope.row, scope.column)" style="height: 50px; line-height: 50px">
                    <el-select
                      style="width: 120px !important"
                      v-if="scope.row.isSelect"
                      v-model="scope.row.projectName"
                      @change="handlerSel(scope.row, scope.column)"
                      ref="projectName"
                    >
                      <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.projectName }}</span>
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column prop="managerName" label="项目经理" align="center"></el-table-column>
              <el-table-column prop="realityRate" label="实际投入" width="160px" align="center">
                <template slot-scope="scope">
                  <el-input
                    style="width: 120px !important"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '');if(value > 100) value = 100; "
                    ref="realityRate"
                    clearable
                    v-model.number="scope.row.realityRate"
                  ></el-input>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="realityRate" label="实际投入" width="160px" align="center">
                <template slot-scope="scope">
                  <div @dblclick="handler(scope.row, scope.column)" style="height: 50px; line-height: 50px">
                    <el-input
                      v-if="scope.row.isEdit"
                      oninput="this.value = this.value.replace(/[^0-9]/g, '');if(value > 100) value = 100; "
                      ref="realityRate"
                      clearable
                      v-model.number="scope.row.realityRate"
                      @blur="onBlur(scope.row)"
                      @keyup.enter.native="onBlur(scope.row)"
                    ></el-input>

                    <span v-else>{{ scope.row.realityRate || 0 }}%</span>
                  </div>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="goToDelete(scope.row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
      <div class="btnGroup">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="submitData">提交</el-button>
      </div>
    </el-container>
    <!-- 添加一条数据 -->
    <base-dialog ref="addDataDialog" title="添加" :width="'500px'">
      <template>
        <addDataDialog ref="addData" :cancelDialog="closeDialog" @addData="pushTableData"></addDataDialog>
      </template>
    </base-dialog>
    <!-- 提交成功 -->
    <base-dialog ref="successDialog" :width="'500px'">
      <template>
        <successDialog ref="success" :cancelDialog="closeDialog" @track="goTrack"></successDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addDataDialog from '@/views/modules/workloadManagement/teamWorkload/addDataDialog.vue'
import successDialog from '@/views/modules/workloadManagement/teamWorkload/successDialog.vue'
export default {
  props: {
    cancelDialog: {
      type: Function
    }
  },
  components: { baseDialog, addDataDialog, successDialog },
  data() {
    return {
      number: '',
      taskId: '',
      teamId: '',
      taskInfo: [],
      newCostItem: '',
      tableData: [],
      costItems: [],
      categories: [],
      spanArr: [], // 需要合并的行数
      pos: 0 // 索引
    }
  },
  mounted() {
    this.getProject()
    this.getWorkloadType()
  },
  created() {},
  methods: {
    //初始化
    init(initData) {
      console.log(initData)
      this.taskId = initData.id
      this.teamId = initData.teamId
      this.selectWorkload()
    },
    //日期格式化
    format(date) {
      var date = new Date(date)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = (month < 10 ? '0' : '') + month
      var datee = date.getDate()
      datee = (datee < 10 ? '0' : '') + datee
      return year + '-' + month + '-' + datee
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
    pushTableData(params) {
      this.tableData = [...this.tableData, params]
      this.tableData = this.tableData.sort(this.compare('empId'))
      this.spanArr = []
      this.getSpanArr(this.tableData)
    },
    compare(prop) {
      return function (a, b) {
        return a[prop] - b[prop] // 升序
      }
    },
    goTrack() {
      this.cancelDialog()
      this.$emit('track', { reportWorkName: this.taskInfo.reportWorkName, id: this.taskId, teamId: this.teamId })
    },
    //查询
    selectWorkload() {
      let params = { taskId: this.taskId, teamId: this.teamId }
      this.$http({
        url: this.$http.adornUrl('/teamWork/teamWorkList'),
        method: 'get',
        params: params
      }).then(({ data }) => {
        if (data && data.code == 200) {
          this.taskInfo = data.payload
          this.taskInfo.reportStartTime = this.format(this.taskInfo.reportStartTime)
          data.payload.pmsWorkloadVoList.map((item) => {
            // this.$set(item, 'isEdit', false)
            // this.$set(item, 'isSelect', false)
            // this.$set(item, 'isCategory', false)
            if (!item.workloadName) {
              item.workloadName = '项目工作'
              item.workloadType = 1
            }
            if (!item.realityRate) {
              item.realityRate = 0
            }
          })
          this.tableData = [...data.payload.pmsWorkloadVoList]
          this.tableData.sort(this.compare('empId'))
          this.spanArr = []
          this.getSpanArr(this.tableData)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //增加
    add() {
      this.$refs.addDataDialog.show()
      this.$nextTick(() => {
        this.$refs.addData.init(this.taskInfo, this.teamId)
      })
    },
    //关闭弹窗
    closeDialog() {
      this.$refs.addDataDialog.hide()
    },
    //删除
    goToDelete(row) {
      debugger
      let message = '确认删除?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let index = this.tableData.indexOf(row)
          if (index != -1) {
            this.tableData.splice(index, 1)
            this.spanArr = []
            this.getSpanArr(this.tableData)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    //保存
    save() {
      let data = {
        pmsWorkloadVoList: this.tableData,
        operate: 1,
        taskId: this.taskId,
        teamId: this.teamId
      }
      this.$http({
        url: this.$http.adornUrl('/teamWork/saveTeamWork'),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message.success('保存成功')
          this.selectWorkload()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //提交
    submitData() {
      let arr = this.sortClass(this.tableData)
      let workloadNameFlag = this.tableData.every((item) => {
        return item.workloadName
      })
      let projectNameFlag = this.tableData.every((item) => {
        return item.projectName
      })
      let realityRateFlag = this.tableData.every((item) => {
        return item.realityRate > 0
      })
      if (!workloadNameFlag) {
        this.$message.error('报工类别不能为空')
        return false
      }
      if (!projectNameFlag) {
        this.$message.error('成本项目不能为空')
        return false
      }
      if (!realityRateFlag) {
        this.$message.error('实际投入须大于0')
        return false
      }
      let flag = arr.every((item) => {
        let total = 0
        for (let i = 0; i < item.length; i++) {
          total += Number(item[i].realityRate)
        }
        return total === 100
      })
      if (flag) {
        //发起请求
        let data = {
          pmsWorkloadVoList: this.tableData,
          operate: 2,
          taskId: this.taskId,
          teamId: this.teamId
        }
        this.$http({
          url: this.$http.adornUrl('/teamWork/saveTeamWork'),
          method: 'post',
          data: data
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.selectWorkload()
            this.$refs.successDialog.show()
            this.$nextTick(() => {
              this.$refs.success.init(this.taskInfo)
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        this.$message.error('成员投入占比不为100%，请填报后再提交！')
      }
    },
    sortClass(sortData) {
      const groupBy = (array, f) => {
        let groups = {}
        array.forEach((o) => {
          let group = JSON.stringify(f(o))
          groups[group] = groups[group] || []
          groups[group].push(o)
        })
        return Object.keys(groups).map((group) => {
          return groups[group]
        })
      }
      const sorted = groupBy(sortData, (item) => {
        return item.empId // 返回需要分组的对象
      })
      return sorted
    },
    //双击报工类别
    // handlerCategory(row, column) {
    //   row.isCategory = true
    //   this.$nextTick(() => {
    //     this.$refs[column.property].focus()
    //   })
    // },
    //报工类别数据改变
    handlerWorkLoadName(row, column, sel) {
      this.categories.map((item) => {
        if (item.name == row.workloadName) {
          row.workloadType = item.id
        }
      })
      // this.$nextTick(() => {
      //   row.isCategory = false
      //   this.$refs[column.property].blur()
      // })
    },
    //双击下拉框
    // handlerSelect(row, column) {
    //   row.isSelect = true
    //   this.$nextTick(() => {
    //     this.$refs[column.property].focus()
    //   })
    // },
    //下拉框数据改变
    handlerSel(row, column, sel) {
      this.costItems.forEach((item) => {
        if (item.name == row.projectName) {
          row.projectId = item.id
          row.managerName = item.managerName
        }
      })
      // this.$nextTick(() => {
      //   row.isSelect = false
      //   this.$refs[column.property].blur()
      // })
    },
    //双击修改实际投入
    // handler(row, column) {
    //   row.isEdit = true
    //   this.$nextTick(() => {
    //     this.$refs[column.property].focus()
    //   })
    // },
    //失去焦点
    // onBlur(row) {
    //   row.isEdit = false
    // },
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
::v-deep .el-input__icon {
  line-height: 30px;
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
  .info-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 70%;
    margin: 20px 0 20px 30px;
  }
  .desc {
    height: 40px;
    margin-left: 30px;
  }
}
.btnGroup {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.table {
  background-color: white;
  margin-top: 10px;
  border: 1px solid lightgray;
  .table-title {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
    padding-left: 20px;
    font-weight: 600;
  }
}
</style>
