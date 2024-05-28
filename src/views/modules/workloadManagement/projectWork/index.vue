<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div>
        <el-tabs v-model="activeName" type="border-card" style="padding: 24px" @tab-click="activeNameChange">
          <el-tab-pane label="我的项目" name="first"></el-tab-pane>
          <el-tab-pane label="工时确认" name="second"></el-tab-pane>
          <el-tab-pane label="任务详情" name="third"></el-tab-pane>
        </el-tabs>
      </div>
      <el-container>
        <div style="background-color: #fff">
          <el-aside style="width: 256px; height: 650px; margin-left: 24px">
            <el-row>
              <el-col>
                <el-input v-model="projectName" placeholder="请输入" suffix-icon="el-icon-search" @change="projectNameChange"></el-input>
                <el-tree
                  style="width: 100%"
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
        </div>
        <el-main style="width: calc(100% - 280px); background: #fff; padding: 0 0 0 16px" v-if="activeName === 'first'">
          <div class="management-header">
            <div class="management-content">
              <div class="management-item">
                <div>
                  <img src="@/assets/commission-task.png" />
                </div>
                <div style="margin-left: 12px">
                  <p>我的待办</p>
                  <p>
                    <span class="font-bold">{{ myTaskCount.waitCount }}</span>
                    个任务
                  </p>
                </div>
              </div>
              <div class="management-item">
                <div>
                  <img src="@/assets/month-task.png" />
                </div>
                <div style="margin-left: 12px">
                  <p>本月完成任务数</p>
                  <p>
                    <span class="font-bold">{{ myTaskCount.monthCount }}</span>
                    个任务
                  </p>
                </div>
              </div>
              <div class="management-item border-none">
                <div>
                  <img src="@/assets/year-task.png" />
                </div>
                <div style="margin-left: 12px">
                  <p>本年完成任务数</p>
                  <p>
                    <span class="font-bold">{{ myTaskCount.yearCount }}</span>
                    个任务
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="table">
            <div class="table-top">
              <div style="display: flex; align-items: center">
                <p style="font-size: 16px; font-weight: 600">任务列表</p>
              </div>
              <div>
                <el-radio-group v-model="dataForm.taskStatus" @change="handlerRadio">
                  <el-radio-button :label="null">全部</el-radio-button>
                  <!-- <el-radio-button :label="0">待开始</el-radio-button>
                      <el-radio-button :label="1">填报中</el-radio-button> -->
                  <el-radio-button :label="2">确认中</el-radio-button>
                  <el-radio-button :label="3">待归档</el-radio-button>
                  <el-radio-button :label="4">已归档</el-radio-button>
                </el-radio-group>
              </div>
              <div style="display: flex; justify-content: flex-end">
                <el-input
                  style="width: 240px"
                  v-model="dataForm.reportWorkName"
                  placeholder="请输入搜索关键字"
                  @change="search"
                  suffix-icon="el-icon-search"
                  clearable
                ></el-input>
              </div>
            </div>
            <div>
              <baseTable :tableData="tableData" ref="table" :type="null" propHeight="425px">
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
                    <el-button type="text" :disabled="row.item.taskStatus != 2" style="width: 100px" @click="goToTrack(row)">>>去确认</el-button>
                    <el-button
                      type="text"
                      :disabled="row.item.taskStatus == 0 || row.item.taskStatus == 1 || row.item.taskStatus == 2"
                      style="width: 100px"
                      @click="goToShowDetails(row)"
                    >
                      查看详情
                    </el-button>
                  </template>
                </template>
              </baseTable>
            </div>
          </div>
        </el-main>
        <!-- 工时审批 -->
        <div v-if="activeName === 'second'" style="width: calc(100% - 280px); background: #fff; padding: 0 0 0 16px">
          <workerHourApproval ref="workerHourApproval" @projectListRefresh="projectListRefresh"></workerHourApproval>
        </div>
        <!-- 任务详情 -->
        <div v-if="activeName === 'third'" style="width: calc(100% - 280px); background: #fff; padding: 0 0 0 16px">
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
          { label: '任务名称', prop: 'reportWorkName', slotName: 'reportWorkName', width: '270px' },
          { label: '简介', prop: 'intro' },
          { label: '创建人', prop: 'managerName', width: '80px' },
          { label: '开始确认时间', prop: 'startConfirmTime', width: '100px' },
          { label: '确认天数', prop: 'affirmDay', width: '80px' },
          { label: '任务状态', prop: 'taskStatus', slotName: 'taskStatus', width: '80px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '230px' }
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
      // if (data.isConfirm === '1') {
      //   return (
      //     <el-badge value='待确认' class='small-badge'>
      //       <span> {node.label}</span>
      //     </el-badge>
      //   )
      // } else {
      //   return <span> {node.label}</span>
      // }
      if (data.isConfirm === '1') {
        return (
          <span class='tree-content'>
            <el-tooltip content={node.label} placement='top' popper-class='custom-tooltip'>
              <span class='first-span'> {node.label}</span>
            </el-tooltip>
            <span style='display: inline-block; color: white;border: 1px solid white;background-color:#F56C6C; border-radius:4px;padding: 0 3px; text-align: center; height: 18px;line-height:18px;'>
              待确认
            </span>
          </span>
        )
      } else {
        return (
          <span class='tree-content'>
            <el-tooltip content={node.label} effect='dark' placement='top' popper-class='custom-tooltip'>
              <span class='second-span'> {node.label}</span>
            </el-tooltip>
          </span>
        )
      }
    },
    handleNodeClick(data) {
      this.dataForm.projectId = data.id
      if (this.activeName === 'first') {
        this.selectTaskList()
        //this.projectList()
      } else if (this.activeName === 'second') {
        this.$nextTick(() => {
          this.$refs.workerHourApproval.init({
            projectId: this.dataForm.projectId
          })
        })
      } else if (this.activeName === 'third') {
        this.$nextTick(() => {
          this.$refs.taskDetails.init({
            projectId: this.dataForm.projectId
          })
        })
      }
    },
    projectNameChange() {
      this.projectListRefresh()
    },
    async activeNameChange() {
      this.projectName = ''
      if (this.activeName === 'first') {
        this.projectList()
      } else if (this.activeName === 'second') {
        await this.projectListRefresh()
        this.$nextTick(() => {
          this.$refs.workerHourApproval.init({ projectId: this.dataForm.projectId })
        })
      } else if (this.activeName === 'third') {
        await this.projectListRefresh()
        this.$nextTick(() => {
          this.$refs.taskDetails.init({ projectId: this.dataForm.projectId })
        })
      }
    },
    async projectListRefresh() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/projectWork/projectList'),
        method: 'get',
        params: { projectName: this.projectName }
      })
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
              this.data = list
              if (this.activeName == 'first') {
                this.$nextTick(() => {
                  this.selectTaskList()
                })
              } else if (this.activeName == 'second') {
                this.$nextTick(() => {
                  this.$refs.workerHourApproval.init({
                    projectId: this.dataForm.projectId
                  })
                })
              } else if (this.activeName == 'third') {
                this.$nextTick(() => {
                  this.$refs.taskDetails.init({
                    projectId: this.dataForm.projectId
                  })
                })
              }
              this.selectFirstNode()
            }
          } else {
            this.dataForm.projectId = null
            this.data = list
            if (this.activeName == 'first') {
              this.$nextTick(() => {
                this.$refs.table.options.dataList = []
              })
            } else if (this.activeName == 'second') {
              this.$nextTick(() => {
                this.$refs.workerHourApproval.clearTable()
              })
            } else if (this.activeName == 'third') {
              this.$refs.taskDetails.clearTable()
            }

            this.selectFirstNode()
          }
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
        this.$refs.workerHourApproval.init(
          {
            projectId: this.dataForm.projectId,
            reportWorkName: row.item.reportWorkName
          },
          row.item.id
        )
      })
    },
    //查看详情
    goToShowDetails(row) {
      this.activeName = 'third'
      this.$nextTick(() => {
        this.$refs.taskDetails.init(
          {
            projectId: this.dataForm.projectId,
            reportWorkName: row.item.reportWorkName
          },
          row.item.id
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border-bottom: none;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
::v-deep .el-tabs--border-card {
  border: none;
}
::v-deep .el-input__icon {
  line-height: 30px;
}
.management-header {
  background-color: white;
  height: 100px;
  border: 1px solid #f2f3f5;
  .management-content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 85px;
  }
  .management-item {
    width: 208px;
    border-right: 1px solid #f2f3f5;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 54px;
      height: 54px;
    }
    .font-bold {
      font-size: 18px;
      font-weight: 600;
    }
  }
  .border-none {
    border-right: 0;
  }
}
.table {
  background-color: white;
  .table-top {
    border-left: 1px solid #f2f3f5;
    padding: 0 24px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

::v-deep .small-badge .el-badge__content {
  font-size: 12px; /* 设置你想要的字体大小 */
}

::v-deep .small-badge .el-badge__content.is-fixed {
  top: 20px;
  right: 0;
}

::v-deep .badge-table .el-badge__content.is-fixed {
  top: 10px;
}
::v-deep .el-badge__content {
  border-radius: 4px;
  padding: 0 3px;
}
::v-deep .el-icon-caret-right:before {
  content: '';
}
::v-deep .el-tree-node__content > .el-tree-node__expand-icon {
  padding: 0;
  display: none;
}
::v-deep .tree-content {
  display: flex;
  align-items: center;
  height: 26px;
}
::v-deep .tree-content .first-span {
  display: inline-block;
  max-width: 200px;
  height: 26px;
  line-height: 26px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
::v-deep .tree-content .second-span {
  display: inline-block;
  max-width: 230px;
  height: 26px;
  line-height: 26px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .first-span {
  color: #2462f9;
}
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .second-span {
  color: #2462f9;
}
</style>
<style>
.custom-tooltip {
  margin-bottom: 5px !important;
}
</style>
