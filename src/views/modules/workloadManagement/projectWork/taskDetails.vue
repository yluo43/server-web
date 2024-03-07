<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-container>
        <el-main style="width: 100%">
          <div class="table" style="height: 640px; background-color: white">
            <el-row style="display: flex; align-items: center">
              <el-col>
                <div style="display: flex; align-items: center">
                  <span style="font-size: 16px; font-weight: 600; margin-left: 10px">工作量统计：</span>
                  <el-select v-model="dataForm.taskId" style="font-weight: 600px; width: 230px !important" @change="changeSelect">
                    <el-option v-for="item in commandList" :key="item.id" :label="item.reportWorkName" :value="item.id" />
                  </el-select>
                  <!-- <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{ command }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="item.reportWorkName" v-for="(item, index) in commandList" :key="index">
                        {{ item.reportWorkName }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-col>
                  <el-header style="height: auto">
                    <el-form :inline="true" :model="dataForm" ref="dataForm">
                      <el-form-item label="用户名姓名:" prop="empName">
                        <el-input v-model="dataForm.empName" placeholder="请输入关键字" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="工号:" prop="empId">
                        <el-input v-model="dataForm.empId" placeholder="请输入工号" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="归属部门:">
                        <el-select v-model="deptIdList" multiple collapse-tags placeholder="请选择">
                          <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="归属团队:">
                        <el-select v-model="teamIdList" multiple collapse-tags placeholder="请选择">
                          <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="团队负责人:">
                        <el-select v-model="managerIdList" multiple collapse-tags placeholder="请选择">
                          <el-option v-for="item in managerList" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                      <div style="display: contents; float: right">
                        <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
                        <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
                      </div>
                    </el-form>
                  </el-header>
                </el-col>
              </el-col>
            </el-row>
            <div class="chooseResult">
              <span class="chooseResultStr" v-text="chooseStr"></span>
              <span style="color: blue; margin-left: 50px" @click="download()">批量下载</span>
            </div>
            <div>
              <baseTable ref="table" :table-data="taskList" :multiSelect="true" style="margin-top: 10px" @select="onSelect"></baseTable>
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
      chooseStr: '已选择 0 项',
      command: '选择任务',
      radio: 1,
      keyword: '',
      taskList: {
        theads: [
          { label: '团队成员', prop: 'name' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '团队负责人', prop: 'teamManagerName' },
          { label: '开始时间', prop: 'startTime' },
          { label: '结束时间', prop: 'overTime' },
          { label: '计划投入（%）', prop: 'planRate' },
          { label: '实际投入（%）', prop: 'realityRate' },
          { label: '提交时间', prop: 'commitTime' },
          { label: '审批时间', prop: 'approveTime' }
        ],
        url: '/projectWork/projectWorkList'
      },
      managerList: [],
      deptList: [],
      teamList: [],
      managerIdList: [],
      deptIdList: [],
      teamIdList: [],
      dataForm: {
        teamManagerIds: '',
        deptIds: '',
        teamIds: '',
        projectId: '',
        empName: '',
        empId: '',
        taskId: '',
        type: '2'
      },
      commandList: []
    }
  },
  watch: {
    deptIdList(newName, oldName) {
      if (newName) {
        this.dataForm.deptIds = newName.join(',')
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
  },
  methods: {
    async init(data) {
      await this.projectTaskListNoPage()
      if (data) {
        Object.assign(this.dataForm, data)
        // if (data.reportWorkName) {
        //   this.command = data.reportWorkName
        // }
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
    clearTable() {
      this.$nextTick(() => {
        this.$refs.table.options.dataList = []
      })
    },
    changeSelect() {
      this.selectTaskList()
    },
    // handleCommand(command) {
    //   this.command = command
    //   const obj = this.commandList.find((item) => item.reportWorkName === command)
    //   this.dataForm.taskId = obj.id
    //   this.selectTaskList()
    // },
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
      this.managerIdList = []
      this.deptIdList = []
      this.teamIdList = []
    },
    onSelect(selection) {
      if (selection.length > 0) {
        this.chooseStr = '已选择 ' + selection.length + ' 项'
      } else {
        this.chooseStr = '已选择 0 项'
      }
    },
    //搜索
    search() {},
    //查询
    selectTaskList() {
      this.$refs.table.refresh(this.dataForm)
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
    // projectTaskListNoPage() {
    //   this.$http({
    //     url: this.$http.adornUrl('/projectWork/projectTaskListNoPage'),
    //     method: 'get',
    //     params: {
    //       workStatus: this.dataForm.workStatus,
    //       projectId: this.dataForm.projectId,
    //       taskId: this.dataForm.taskId
    //     }
    //   }).then(({ data }) => {
    //     if (data && data.code === 200) {
    //       this.commandList = data.payload
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   })
    // },
    download() {
      const list = this.$refs.table.getSelectRow()
      if (list.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let data = list.map((obj) => obj.id)
      this.$http.downloadPost(this.$http.adornUrl('/projectWork/export'), { ids: data }, this)
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
