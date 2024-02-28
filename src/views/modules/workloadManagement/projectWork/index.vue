<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-header style="padding: 0">
        <el-tabs v-model="activeName" type="border-card" @tab-click="activeNameChange">
          <el-tab-pane label="我的项目" name="first"></el-tab-pane>
          <el-tab-pane label="工时确认" name="second"></el-tab-pane>
          <el-tab-pane label="任务详情" name="third"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container>
        <el-aside style="width: 200px; background-color: #ffffff; height: 645px; margin-top: 4px">
          <el-row>
            <el-col>
              <el-input v-model="projectName" placeholder="请输入" suffix-icon="el-icon-search" @change="projectNameChange"></el-input>
              <el-tree
                :data="data"
                :render-content="renderContent"
                :props="defaultProps"
                :highlight-current="true"
                node-key="id"
                ref="treeRef"
                @node-click="handleNodeClick"
              ></el-tree>
            </el-col>
          </el-row>
        </el-aside>
        <el-main style="width: 100%" class="main" v-if="activeName === 'first'">
          <div class="management-header">
            <div class="management-item">
              <el-statistic title="我的待办">
                <template slot="formatter">{{ myTaskCount.waitCount }}个任务</template>
              </el-statistic>
            </div>
            <div class="management-item">
              <el-statistic title="本月完成任务数">
                <template slot="formatter">{{ myTaskCount.monthCount }}个任务</template>
              </el-statistic>
            </div>
            <div class="management-item border-none">
              <el-statistic title="本年完成任务数">
                <template slot="formatter">{{ myTaskCount.yearCount }}个任务</template>
              </el-statistic>
            </div>
          </div>
          <div class="table">
            <el-row style="display: flex; align-items: center">
              <el-col :span="10">
                <div style="display: flex; align-items: center">
                  <p style="font-size: 16px; font-weight: 600; margin-left: 10px">任务列表</p>
                </div>
              </el-col>
              <el-col :span="14">
                <el-row style="display: flex; align-items: center">
                  <el-col :span="18">
                    <el-radio-group v-model="dataForm.taskStatus" @change="handlerRadio">
                      <el-radio-button :label="null">全部</el-radio-button>
                      <el-radio-button :label="0">待开始</el-radio-button>
                      <el-radio-button :label="1">填报中</el-radio-button>
                      <el-radio-button :label="2">确认中</el-radio-button>
                      <el-radio-button :label="3">待归档</el-radio-button>
                      <el-radio-button :label="4">已归档</el-radio-button>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="6">
                    <el-input
                      v-model="dataForm.reportWorkName"
                      placeholder="请输入搜索关键字"
                      @change="search"
                      prefix-icon="el-icon-search"
                      clearable
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div>
              <baseTable :tableData="tableData" ref="table" :type="null" style="margin-top: 10px">
                <template v-slot:reportWorkName="row">
                  <template v-if="row.item.taskStatus === 2">
                    <el-badge value="待确认" class="small-badge badge-table">
                      <span>{{ row.item.reportWorkName }}</span>
                    </el-badge>
                  </template>
                  <template v-else>
                    <span>{{ row.item.reportWorkName }}</span>
                  </template>
                </template>
                <template v-slot:taskStatus="row">
                  <template v-if="row.item.taskStatus === 0">
                    <span>待开始</span>
                  </template>
                  <template v-if="row.item.taskStatus === 1">
                    <span>填报中</span>
                  </template>
                  <template v-if="row.item.taskStatus === 2">
                    <span>确认中</span>
                  </template>
                  <template v-if="row.item.taskStatus === 3">
                    <span>待归档</span>
                  </template>
                  <template v-if="row.item.taskStatus === 4">
                    <span>已归档</span>
                  </template>
                </template>
                <!-- 操作 -->
                <template v-slot:clientType="row">
                  <template>
                    <el-button type="text" @click="goToTrack(row)">>>去确认</el-button>
                    <el-button type="text" @click="goToShowDetails(row)">查看详情</el-button>
                  </template>
                </template>
              </baseTable>
            </div>
          </div>
        </el-main>
        <!-- 工时审批 -->
        <div v-if="activeName === 'second'">
          <workerHourApproval ref="workerHourApproval" @projectListRefresh="projectListRefresh"></workerHourApproval>
        </div>
        <!-- 任务详情 -->
        <div v-if="activeName === 'third'">
          <taskDetails ref="taskDetails"></taskDetails>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog.vue'
import workerHourApproval from './workHourApproval.vue'
import taskDetails from './taskDetails.vue'

export default {
  components: { baseTable, baseDialog, workerHourApproval, taskDetails },
  props: {},
  data() {
    return {
      activeName: 'first',
      dataForm: {
        taskStatus: null,
        projectId: null,
        reportWorkName: ''
      },
      tableData: {
        theads: [
          { label: '任务名称', prop: 'reportWorkName', slotName: 'reportWorkName' },
          { label: '创建人', prop: 'managerName' },
          { label: '开始填报时间', prop: 'reportStartTime' },
          { label: '填报天数', prop: 'reportDay' },
          { label: '任务状态', prop: 'taskStatus', slotName: 'taskStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: '/projectWork/projectTaskList'
      },
      projectName: null,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      myTaskCount: { waitCount: 0, monthCount: 0, yearCount: 0 }
    }
  },
  mounted() {
    this.projectList()
  },
  methods: {
    renderContent(h, { node, data, store }) {
      if (data.isConfirm === '0') {
        return (
          <el-badge value='待确认' class='small-badge'>
            <span> {node.label}</span>
          </el-badge>
        )
      }
      return <span> {node.label}</span>
    },
    handleNodeClick(data) {
      this.dataForm.projectId = data.id
      if (this.activeName === 'first') {
        this.projectList()
      } else if (this.activeName === 'second') {
        this.$nextTick(() => {
          this.$refs.workerHourApproval.init({
            projectId: this.dataForm.projectId,
            taskId: null,
            reportWorkName: null
          })
        })
      } else if (this.activeName === 'third') {
        this.$nextTick(() => {
          this.$refs.taskDetails.init({
            projectId: this.dataForm.projectId,
            taskId: null,
            reportWorkName: null
          })
        })
      }
    },
    projectNameChange() {
      this.projectList()
    },
    activeNameChange() {
      if (this.activeName === 'first') {
        this.projectList()
      } else if (this.activeName === 'second') {
        this.$nextTick(() => {
          this.$refs.workerHourApproval.init({})
        })
      } else if (this.activeName === 'third') {
        this.$nextTick(() => {
          this.$refs.taskDetails.init({})
        })
      }
    },
    projectListRefresh() {
      this.$http({
        url: this.$http.adornUrl('/projectWork/projectList'),
        method: 'get',
        params: { projectName: this.projectName }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          let list = []
          if (data.payload.length > 0) {
            data.payload.forEach((item) => {
              list.push({
                label: item.name,
                id: item.id,
                isConfirm: item.isConfirm
              })
            })
            if (list.length !== 0) {
              this.dataForm.projectId = list[0].id
            }
          } else {
            this.dataForm.projectId = null
          }
          this.data = list
          this.selectFirstNode()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    projectList() {
      this.$http({
        url: this.$http.adornUrl('/teamWork/getMyTaskCount'),
        method: 'get',
        params: { type: 1 }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.myTaskCount = data.payload
        }
      })
      this.$http({
        url: this.$http.adornUrl('/projectWork/projectList'),
        method: 'get',
        params: { projectName: this.projectName }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          let list = []
          if (data.payload.length > 0) {
            data.payload.forEach((item) => {
              list.push({
                label: item.name,
                id: item.id,
                isConfirm: item.isConfirm
              })
            })
            if (list.length !== 0) {
              this.dataForm.projectId = list[0].id
            }
          } else {
            this.dataForm.projectId = null
          }
          this.data = list
          this.$nextTick(() => {
            this.selectTaskList()
          })
          this.selectFirstNode()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    selectFirstNode() {
      // 等待树形控件渲染完成
      this.$nextTick(() => {
        const tree = this.$refs.treeRef
        if (tree && tree.store) {
          // 获取第一个节点
          const firstNode = tree.root.childNodes[0]
          // 设置节点为选中状态
          if (firstNode) {
            tree.setCurrentKey(firstNode.key)
          }
        }
      })
    },
    //搜索
    search() {
      this.selectTaskList()
    },
    //查询
    selectTaskList() {
      this.$refs.table.refresh(this.dataForm)
    },
    //切换radio
    handlerRadio() {
      this.selectTaskList()
    },
    goToTrack(row) {
      this.activeName = 'second'
      this.$nextTick(() => {
        this.$refs.workerHourApproval.init({
          projectId: this.dataForm.projectId,
          taskId: row.item.id,
          reportWorkName: row.item.reportWorkName
        })
      })
    },
    //查看详情
    goToShowDetails(row) {
      this.activeName = 'third'
      this.$nextTick(() => {
        this.$refs.taskDetails.init({
          projectId: this.dataForm.projectId,
          taskId: row.item.id,
          reportWorkName: row.item.reportWorkName
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

.management-header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  height: 100px;

  .management-item {
    width: 100%;
    border-right: 1px solid lightgray;
  }
}

.table {
  background-color: white;
  margin-top: 10px;
}

::v-deep .small-badge .el-badge__content {
  font-size: 10px; /* 设置你想要的字体大小 */
}

::v-deep .small-badge .el-badge__content.is-fixed {
  top: 16px;
  right: 0;
}

::v-deep .badge-table .el-badge__content.is-fixed {
  top: 8px;
}
</style>
