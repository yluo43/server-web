<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div style="margin-left: 20px">
        <el-form ref="dataForm" :inline="true" :model="dataForm">
          <el-form-item label="用户姓名:" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入用户姓名" clearable />
          </el-form-item>
          <el-form-item label="工号:" prop="empId">
            <el-input v-model="dataForm.empId" placeholder="请输入工号" clearable />
          </el-form-item>
          <el-form-item label="归属部门:" prop="deptIds">
            <el-select v-model="dataForm.deptIds" placeholder="请选择归属部门" multiple collapse-tags clearable>
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.name == '新讯数字科技有限公司'" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属团队:" prop="teamIds">
            <el-select v-model="dataForm.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="审批状态:" prop="teamIds">
            <el-select v-model="dataForm.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否居家办公:" prop="teamIds">
            <el-select v-model="dataForm.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="加班类型:" prop="teamIds">
            <el-select v-model="dataForm.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间:" prop="deliveryDate">
            <el-date-picker
              v-model="dataForm.deliveryDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item label="加班开始时间:" prop="deliveryDate">
            <el-date-picker
              v-model="dataForm.deliveryDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item label="加班结束时间:" prop="deliveryDate">
            <el-date-picker
              v-model="dataForm.deliveryDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" style="margin: 0 10px" @click="selectTableData">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="chooseResult">
          <span>已选择{{ count }}项</span>
          <el-button type="text" @click="pass()">批量通过</el-button>
        </div>
        <div style="margin-left: 20px">
          <baseTable :tableData="tableData" ref="table" :multi-select="true" @select="checkedTable">
            <template v-slot:clientType="row">
              <template>
                <el-button type="text" @click="pass(row.item)">通过</el-button>
                <el-button type="text" @click="reject(row.item)">驳回</el-button>
                <el-button type="text" @click="view(row.item)">查看</el-button>
              </template>
            </template>
          </baseTable>
        </div>
      </div>
    </el-container>
    <!-- 驳回加班时长 -->
    <base-dialog ref="rejectDialog" title="加班时长驳回" :width="'500px'">
      <template>
        <rejectDialog ref="reject" :cancelDialog="closeDialog" @selectTableData="selectTableData"></rejectDialog>
      </template>
    </base-dialog>
    <!-- 审批流程 -->
    <base-dialog ref="approvalProcessDialog" title="查看审批流程" :width="'800px'">
      <template>
        <approvalProcessDialog ref="approvalProcess" :cancelDialog="closeApprovalProcessDialog"></approvalProcessDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import rejectDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/rejectDialog.vue'
import approvalProcessDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/approvalProcessDialog.vue'
export default {
  components: { baseTable, baseDialog, rejectDialog, approvalProcessDialog },
  props: {},
  data() {
    return {
      count: 0,
      deptList: [],
      teamList: [],
      selData: [],
      dataForm: {
        name: '',
        empId: '',
        deptIds: [],
        teamIds: []
      },
      tableData: {
        theads: [
          { label: '用户姓名', prop: 'name' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'managerName' },
          { label: '归属团队', prop: 'startConfirmTime' },
          { label: '加班开始时间', prop: 'affirmDay' },
          { label: '加班结束时间', prop: 'affirmDay' },
          { label: '加班类型', prop: 'affirmDay' },
          { label: '加班时长', prop: 'affirmDay' },
          { label: '是否居家办公', prop: 'affirmDay' },
          { label: '加班原因', prop: 'affirmDay' },
          { label: '申请时间', prop: 'affirmDay' },
          { label: '审批状态', prop: 'taskStatus', slotName: 'taskStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/projectWork/projectTaskList'
      }
    }
  },
  mounted() {
    this.getDept()
    this.getTeam()
    this.selectTableData()
  },
  created() {},
  methods: {
    //获取部门
    getDept() {
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
    },
    //获取团队
    getTeam() {
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
    //表格查询
    selectTableData() {
      this.$refs.table.refresh(this.dataForm)
    },
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.dateRange.length != 0) {
        params.startDate = params.dateRange[0]
        params.endDate = params.dateRange[1]
      }
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].toString()
        }
      })
      delete params.dateRange
      return params
    },
    //表单重置
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //通过
    pass(row) {
      const h = this.$createElement
      let message = ''
      let ids = []
      if (row) {
        message = h('p', null, [
          h('span', null, `${row.name}在${row.startTime}至${row.endTime}的加班申请,`),
          h('span', { style: 'color: red' }, `加班时长${row.hours}`),
          h('span', null, `,确认通过吗？`)
        ])
        ids = [row.id]
        this.open(message, ids)
      } else {
        if (this.count === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        ids = this.selData.filter((item) => {
          return item.id
        })
        message = '已选中多条数据，确定批量通过吗？'
        this.open(message, ids)
      }
    },
    open(message, ids) {
      this.$msgbox({
        message: message,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'msgClass'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/projectWork/projectList'),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message.success(data.msg)
              this.$refs.approvalProcessDialog.show()
              this.$nextTick(() => {
                this.$refs.approvalProcess.init({ flag: 1 })
              })
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
    },
    //驳回
    reject(row) {
      this.$refs.rejectDialog.show()
      this.$nextTick(() => {
        this.$refs.reject.init(row.item)
      })
    },
    //关闭驳回弹窗
    closeDialog() {
      this.$refs.rejectDialog.hide()
    },
    //查看
    view() {
      this.$refs.approvalProcessDialog.show()
    },
    //关闭查看详情弹窗
    closeApprovalProcessDialog() {
      this.$refs.approvalProcessDialog.hide()
    },
    //选择框选择
    checkedTable(sel) {
      this.count = sel.length
      this.selData = sel
    }
  }
}
</script>

<style scoped>
::v-deep .el-button {
  min-width: 60px;
  margin-left: 0;
  width: auto;
}

.chooseResult {
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 5px;
  background-color: #e8f4ff;
  padding-left: 20px;
  margin: 20px 0 20px 20px;
}
</style>
<style lang="scss">
.msgClass {
  padding: 20px;
  .el-message-box__content {
    padding: 0 0 20px 0;
    font-size: 16px;
  }
}
</style>
