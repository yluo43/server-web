<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%">
        <div class="table" style="height: 640px; background-color: white">
          <el-row style="display: flex; align-items: center">
            <el-col>
              <div style="display: flex; align-items: center">
                <span style="font-size: 16px; font-weight: 600; margin-left: 10px">工作量统计：</span>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{ command }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="item.reportWorkName" v-for="(item, index) in commandList" :key="index">
                      {{ item.reportWorkName }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-col>
                <span style="font-size: 16px; margin-left: 10px">状态：</span>
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
            <span class="chooseResultStr" v-text="chooseStr"></span>
            <span style="color: blue; margin-left: 50px" @click="projectWorkOperate(null, 1)">批量确认</span>
          </div>
          <div>
            <baseTable ref="taskListTable" :table-data="taskList" :multiSelect="true" style="margin-top: 10px" @select="onSelect">
              <!-- 操作 -->
              <template v-slot:clientType="row">
                <template>
                  <el-tooltip class="item" effect="dark" content="确认" placement="bottom">
                    <i class="el-icon-circle-check" style="font-size: 1.5em; margin-right: 1em" @click="projectWorkOperate(row, 1)"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="驳回" placement="bottom">
                    <i class="el-icon-circle-close" style="font-size: 1.5em; margin-right: 1em" @click="projectWorkOperateTwo(row, 2)"></i>
                  </el-tooltip>
                </template>
              </template>
            </baseTable>
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
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import projectWorkOperate from '@/views/modules/workloadManagement/projectWork/projectWorkOperate.vue'

export default {
  components: { projectWorkOperate, baseTable, baseDialog },
  props: {},
  data() {
    return {
      chooseStr: '已选择 0 项',
      command: '选择任务',
      radio: 1,
      keyword: '',
      dataForm: {
        workStatus: null,
        projectId: null,
        taskId: null,
        type: '1'
      },
      taskList: {
        theads: [
          { label: '团队成员', prop: 'name', width: '100px' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '团队负责人', prop: 'teamManagerName', width: '120px' },
          { label: '开始时间', prop: 'startTime' },
          { label: '结束时间', prop: 'overTime' },
          { label: '计划投入（%）', prop: 'planRate', width: '120px' },
          { label: '实际投入（%）', prop: 'realityRate', width: '120px' },
          { label: '确认状态', prop: 'workStatusName' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '100px' }
        ],
        url: '/projectWork/projectWorkList'
      },
      commandList: []
    }
  },
  methods: {
    init(data) {
      if (data) {
        Object.assign(this.dataForm, data)
        if (data.reportWorkName) {
          this.command = data.reportWorkName
        }
      }
      this.selectTaskList()
      this.projectTaskListNoPage()
    },
    projectTaskListNoPage() {
      this.$http({
        url: this.$http.adornUrl('/projectWork/projectTaskListNoPage'),
        method: 'get',
        params: {
          workStatus: this.dataForm.workStatus,
          projectId: this.dataForm.projectId,
          taskId: this.dataForm.taskId
        }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.commandList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    onSelect(selection) {
      if (selection.length > 0) {
        this.chooseStr = '已选择 ' + selection.length + ' 项'
      } else {
        this.chooseStr = '已选择 0 项'
      }
    },
    handleCommand(command) {
      this.command = command
      const obj = this.commandList.find((item) => item.reportWorkName === command)
      this.dataForm.taskId = obj.id
      this.selectTaskList()
    },
    //查询
    selectTaskList() {
      this.$refs.taskListTable.refresh(this.dataForm)
    },
    //切换radio
    handlerRadio() {
      this.selectTaskList()
    },
    projectWorkOperateTwo(row, operateType) {
      this.$refs.projectWorkOperateDialog.show()
      this.$nextTick(() => {
        row.item.operateType = operateType
        this.$refs.projectWorkOperate.init(row.item)
      })
    },
    projectWorkOperate(row, operateType) {
      let message = ''
      let ids = []
      if (row) {
        ids = [row.item.id]
        message = '您确定提交吗?'
      } else {
        const list = this.$refs.taskListTable.getSelectRow()
        if (list.length === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        message = '已选中' + list.length + '项，批量确认吗？'
        list.forEach((item) => {
          ids.push(item.id)
        })
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
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

.chooseResult {
  height: 30px;
  line-height: 30px;
  margin: 10px auto;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
}
</style>
