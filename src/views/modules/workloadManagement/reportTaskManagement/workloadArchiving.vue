<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div class="header-title">
            <div>工作量统计:</div>
            <div style="margin-left: 10px; font-weight: 600">
              <el-select v-model="workLoad" clearable style="font-weight: 600px" @change="changeSelect">
                <el-option v-for="item in workLoadStatistics" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div class="status">
              状态：
              <el-radio-group v-model="radio" @change="handlerRadio">
                <el-radio-button label="1">全部</el-radio-button>
                <el-radio-button label="2">待归档</el-radio-button>
                <el-radio-button label="3">待驳回</el-radio-button>
                <el-radio-button label="4">已归档</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <el-select
                v-model="selectData"
                multiple
                placeholder="所有团队"
                @remove-tag="removetag"
                collapse-tags
                @clear="clearall"
                :popper-append-to-body="false"
                clearable
                @change="search"
              >
                <el-option :value="selectTree" class="setstyle" disabled>
                  <el-tree
                    :data="list"
                    :props="defaultProps"
                    ref="tree"
                    show-checkbox
                    check-strictly
                    :default-expand-all="true"
                    :expand-on-click-node="false"
                    node-key="id"
                    check-on-click-node
                    @check-change="handleNodeClick"
                  ></el-tree>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="row-box">
            <div>
              已选择
              <span>{{ count }}</span>
              项
            </div>
            <div>
              <el-button type="text" @click="batchArchiving">批量归档</el-button>
              <el-button type="text" @click="goToReject(row)">驳回</el-button>
            </div>
          </div>
        </div>

        <div class="table">
          <div>
            <baseTable ref="workloadListTable" :multi-select="true" @select="onSelect" :table-data="workloadList" style="margin-top: 10px">
              <!-- 操作 -->
              <template v-slot:clientType="row">
                <template>
                  <el-button type="text" @click="goToArchived(row)">归档|</el-button>
                  <el-button type="text" @click="goToReject(row)">驳回</el-button>
                </template>
              </template>
            </baseTable>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 驳回 -->
    <base-dialog ref="rejectDialog" title="工作量驳回" :width="'500px'">
      <template>
        <rejectDialog ref="reject" :cancelDialog="closeDialog"></rejectDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import rejectDialog from '@/views/modules/workloadManagement/reportTaskManagement/rejectDialog.vue'
export default {
  components: { baseTable, baseDialog, rejectDialog },
  props: {},
  data() {
    return {
      //工作量统计
      workLoad: '',
      workLoadStatistics: [
        {
          id: 1,
          name: '2021-1-31至2024-2-2'
        }
      ],
      //已选择多少项
      count: 0,
      radio: '1',
      //团队选择数据
      selectData: [],
      selectTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      queryData: {},
      workloadList: {
        theads: [
          { label: '团队成员', prop: 'orderCode' },
          { label: '工号', prop: 'orderName' },
          { label: '归属部门', prop: 'orderPrice' },
          { label: '归属团队', prop: 'projectName' },
          { label: '开始时间', prop: 'firstReviewer' },
          { label: '结束时间', prop: 'secondReviewer' },
          { label: '成本项目', prop: 'thirdReviewer' },
          { label: '项目经理', prop: 'thirdReviewer' },
          { label: '计划投入(%)', prop: 'thirdReviewer' },
          { label: '实际投入(%)', prop: 'thirdReviewer' },
          { label: '提交人', prop: 'thirdReviewer' },
          { label: '提交时间', prop: 'thirdReviewer' },
          { label: '审批时间', prop: 'thirdReviewer' },
          { label: '归档状态', prop: 'thirdReviewer' },
          { label: '操作', prop: 'clientType', slotName: 'clientType' }
        ],
        url: ''
      },
      list: [
        {
          id: 1,
          label: '一级 2',
          children: [
            {
              id: 3,
              label: '二级 2-1',
              children: [
                {
                  id: 4,
                  label: '三级 3-1-1'
                },
                {
                  id: 5,
                  label: '三级 3-1-2'
                }
              ]
            },
            {
              id: 2,
              label: '二级 2-2',
              children: [
                {
                  id: 6,
                  label: '三级 3-2-1'
                },
                {
                  id: 7,
                  label: '三级 3-2-2'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  mounted() {},
  created() {},
  methods: {
    //统计工作量下拉框改变
    changeSelect() {},
    //团队下拉框值改变
    search() {
      this.selectWorkload({
        teams: this.selectData
      })
    },
    //查询
    selectWorkload(params) {
      this.$refs.workloadListTable.refresh(queryData)
    },
    //切换ridio
    handlerRadio() {
      this.selectWorkload({
        status: this.radio
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
    //批量归档
    batchArchiving() {
      const rows = this.$refs.workloadListTable.getSelectRow()
      this.reviewIds = rows.map((item) => {
        return item.reviewId
      })
      if (this.reviewIds.length === 0) {
        this.$message.warning('请选择一条数据！')
        return
      }
      this.$http({
        url: this.$http.adornUrl('/review/batchAuditPass'),
        method: 'post',
        data: this.reviewIds
      }).then((result) => {
        if (result.data.success) {
          this.$message.success('归档成功')
        } else {
          this.$message.error('归档失败失败：' + result.data.msg)
        }
      })
    },
    //归档
    goToArchived(row) {
      let data = { id: row.item.id }
      this.$http({
        url: this.$http.adornUrl('/review/batchAuditPass'),
        method: 'post',
        data: data
      }).then((result) => {
        if (result.data.success) {
          this.$message.success('归档成功')
        } else {
          this.$message.error('归档失败失败：' + result.data.msg)
        }
      })
    },
    //驳回
    goToReject(row) {
      this.$refs.rejectDialog.show()
      this.$nextTick(() => {
        this.$refs.reject.init({ data: row })
      })
    },
    //关闭驳回弹窗
    closeDialog() {
      this.$refs.rejectDialog.hide()
    },
    //树选中
    handleNodeClick(data, self, child) {
      let datalist = this.$refs.tree.getCheckedNodes()
      this.selectTree = [] //置空
      this.selectData = []
      datalist.forEach((item) => {
        this.selectTree.push({ id: item.id, label: item.label })
        this.selectData.push(item.label)
      })
    },
    removetag() {
      this.selectTree.splice(0, 1)
      let setlist = this.$refs.tree.getCheckedNodes()
      setlist.splice(0, 1)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(setlist)
      })
    },
    clearall() {
      this.selectTree = []
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes([])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
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

.setstyle {
  min-height: 200px;
  padding: 0 !important;
  margin: 0;
  overflow: auto;
  cursor: default !important;
}
</style>
