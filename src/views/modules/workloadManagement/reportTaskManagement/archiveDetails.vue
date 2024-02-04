<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div style="display: flex; align-items: center; margin: 0 0 10px 30px; font-weight: 600">
            <div>工作量统计:</div>
            <div style="margin-left: 10px; font-weight: 600">
              <el-select v-model="workLoad" clearable style="font-weight: 600px" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div>
            <el-form ref="formData" :inline="true" label-width="110px" :label-position="labelposition" :model="formData">
              <el-form-item label="用户姓名:" prop="userName">
                <el-input v-model="formData.userName" placeholder="请输入用户姓名" clearable />
              </el-form-item>
              <el-form-item label="工号:" prop="jobNumber">
                <el-input v-model="formData.jobNumber" placeholder="请输入工号" clearable />
              </el-form-item>
              <el-form-item label="归属部门:" prop="belongingDepartment">
                <el-select v-model="formData.belongingDepartment" placeholder="请选择" clearable>
                  <el-option v-for="item in belongingDepartments" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="归属团队:" prop="team">
                <el-select v-model="formData.team" placeholder="请选择" clearable>
                  <el-option v-for="item in teams" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="团队负责人:" prop="teamLeader">
                <el-select v-model="formData.teamLeader" placeholder="请选择" clearable>
                  <el-option v-for="item in teamLeaders" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="成本项目:" prop="costItem">
                <el-select v-model="formData.costItem" placeholder="请选择" clearable>
                  <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="项目经理:" prop="projectManager">
                <el-select v-model="formData.projectManager" placeholder="请选择" clearable>
                  <el-option v-for="item in projectManagers" :key="item.id" :label="item.name" :value="item.id" />
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
        </div>

        <div class="table">
          <div>
            <baseTable ref="taskListTable" :multi-select="true" @select="onSelect" :table-data="taskList" style="margin-top: 10px"></baseTable>
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
      count: 0,
      //工作量统计
      workLoad: '',
      workLoadStatistics: [
        {
          id: 1,
          name: '2021-1-31至2024-2-2'
        }
      ],
      // form表单右对齐
      labelposition: 'right',
      formData: {
        //用户姓名
        userName: '',
        //工号
        jobNumber: '',
        //归属部门
        belongingDepartment: '',
        //归属团队
        team: '',
        //团队负责人
        teamLeader: '',
        //成本项目
        costItem: '',
        //项目经理
        projectManager: '',
        //审批状态
        status: ''
      },
      belongingDepartments: [],
      jobNumbers: [],
      projectManagers: [],
      teams: [],
      teamLeaders: [],
      status: [],
      costItems: [
        {
          id: 1,
          name: '哈哈哈'
        },
        {
          id: 2,
          name: '嘻嘻嘻'
        }
      ],
      taskList: {
        theads: [
          { label: '团队成员', prop: 'orderCode' },
          { label: '工号', prop: 'orderName' },
          { label: '归属部门', prop: 'orderPrice' },
          { label: '归属团队', prop: 'projectName' },
          { label: '团队负责人', prop: 'firstReviewer' },
          { label: '开始时间', prop: 'secondReviewer' },
          { label: '结束时间', prop: 'secondReviewer' },
          { label: '成本项目', prop: 'thirdReviewer' },
          { label: '项目经理', prop: 'thirdReviewer' },
          { label: '计划投入(%)', prop: 'thirdReviewer' },
          { label: '实际投入(%)', prop: 'thirdReviewer' },
          { label: '提交人', prop: 'thirdReviewer' },
          { label: '提交时间', prop: 'thirdReviewer' },
          { label: '审批时间', prop: 'thirdReviewer' },
          { label: '归档时间', prop: 'thirdReviewer' }
        ],
        url: ''
      }
    }
  },
  mounted() {
    this.getManager()
    this.getDept()
    this.getTeam()
  },
  created() {},
  methods: {
    init(initData) {
      this.workLoad = initData.workLoad
    },
    //统计工作量下拉框改变
    changeSelect() {},
    //查询
    selectData() {},
    //获取负责人
    getManager() {
      this.$http({
        url: this.$http.adornUrl('/common/getManager'),
        params: { pid: 3 },
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamLeaders = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //获取部门
    getDept() {
      this.$http({
        url: this.$http.adornUrl('/common/getDept'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.belongingDepartments = data.payload
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
          this.teams = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    //选中项数
    onSelect(selection) {
      if (selection.length > 0) {
        this.count = selection.length
      } else {
        this.count = 0
      }
    },
    //查询工作量
    selectTaskList() {
      this.$refs.taskListTable.refresh()
    },
    //批量下载
    batchDownLoad() {
      let params = JSON.parse(JSON.stringify(this.formData))
      this.$http.downloadPost(this.$http.adornUrl('/costItems/export'), params, this)
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
  width: 190px;
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
    background-color: #e8f4ff;
    padding-left: 20px;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
}
</style>
