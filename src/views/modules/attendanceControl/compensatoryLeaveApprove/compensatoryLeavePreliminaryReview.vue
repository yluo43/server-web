<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div style="margin-left: 16px">
        <el-form ref="dataForm" :inline="true" :model="dataForm">
          <el-form-item label="用户姓名:" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="请输入用户姓名" clearable />
          </el-form-item>
          <!-- <el-form-item label="工号:" prop="empId">
            <el-input v-model="dataForm.empId" placeholder="请输入工号" clearable />
          </el-form-item> -->
          <el-form-item label="归属团队:" prop="teamId">
            <el-select v-model="dataForm.teamId" placeholder="请选择归属团队" clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="归属团队:" prop="teamIds">
            <el-select v-model="dataForm.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="审批状态:" prop="status">
            <el-select v-model="dataForm.status" placeholder="请选择审批状态" clearable>
              <el-option v-for="item in approvalStatus" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="调休开始时间:" prop="compensatoryLeaveStartTime">
            <el-date-picker
              v-model="dataForm.compensatoryLeaveStartTime"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item label="调休结束时间:" prop="compensatoryLeaveEndTime">
            <el-date-picker
              v-model="dataForm.compensatoryLeaveEndTime"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item label="申请时间:" prop="applyTime">
            <el-date-picker
              v-model="dataForm.applyTime"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="selectTableData">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="chooseResult">
          <span>已选择{{ count }}项</span>
          <el-button type="text" @click="pass()">批量通过</el-button>
        </div>
        <div style="margin-top: 10px">
          <baseTable :tableData="tableData" ref="table" :multi-select="true" @select="checkedTable">
            <template v-slot:status="row">
              <span v-if="row.item.status == 0">待初审</span>
              <span v-if="row.item.status == 2">待复审</span>
              <span v-if="row.item.status == 1">初审驳回</span>
              <span v-if="row.item.status == 3">复审驳回</span>
              <span v-if="row.item.status == 4">已通过</span>
            </template>
            <template v-slot:clientType="row">
              <template>
                <el-button :disabled="row.item.status != 0" type="text" @click="pass(row.item)">通过</el-button>
                <el-button :disabled="row.item.status != 0" type="text" @click="reject(row.item)">驳回</el-button>
                <el-button type="text" @click="view(row.item)">查看</el-button>
              </template>
            </template>
          </baseTable>
        </div>
      </div>
    </el-container>
    <!-- 驳回 -->
    <base-dialog ref="rejectDialog" title="调休申请驳回" :width="'500px'">
      <template>
        <rejectDialog ref="reject" :closeDialog="closeDialog" @refrshTable="refrshTable"></rejectDialog>
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
import { getCName } from '@/utils/auth'
import rejectDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/rejectDialog.vue'
import approvalProcessDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/approvalProcessDialog.vue'
export default {
  components: { baseTable, baseDialog, rejectDialog, approvalProcessDialog },
  props: {},
  data() {
    return {
      count: 0,
      remainingDays: 0,
      approvalStatus: [
        { id: 0, name: '待初审' },
        { id: 1, name: '初审驳回' },
        { id: 2, name: '待复审' },
        { id: 3, name: '复审驳回' },
        { id: 4, name: '已通过' }
      ],
      teamList: [],
      selData: [],
      dataForm: {
        operatorName: '',
        userName: '',
        empId: '',
        teamId: '',
        //  teamIds: [],
        status: '',
        compensatoryLeaveStartTime: [],
        compensatoryLeaveEndTime: [],
        applyTime: [],
        createTimeStart: '',
        createTimeEnd: '',
        startTimeStart: '',
        startTimeEnd: '',
        endTimeStart: '',
        endTimeEnd: '',
        searchType: 1
      },
      tableData: {
        theads: [
          { label: '用户姓名', prop: 'userName' },
          { label: '工号', prop: 'empId' },
          { label: '归属团队', prop: 'teamName' },
          { label: '调休开始时间', prop: 'startTime' },
          { label: '调休结束时间', prop: 'endTime' },
          { label: '调休天数(天)', prop: 'days' },
          { label: '申请时间', prop: 'createTime' },
          { label: '审批状态', prop: 'status', slotName: 'status' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '150px' }
        ],
        url: '/attendance/getDayoffList'
      }
    }
  },
  mounted() {
    this.getTeam()
    this.selectTableData()
  },
  created() {
    this.dataForm.operatorName = getCName()
  },
  methods: {
    //刷新页面并打开弹窗
    refrshTable(initData, rejectFlag) {
      this.selectTableData()
      this.$refs.approvalProcessDialog.show()
      this.$nextTick(() => {
        if (rejectFlag == 1 || rejectFlag == 2) {
          this.$refs.approvalProcess.init(initData, 1)
        } else {
          this.$refs.approvalProcess.init(initData, 2)
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
      this.$refs.table.refresh(this.dataConversion(this.dataForm))
    },
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.compensatoryLeaveStartTime.length > 0) {
        params.startTimeStart = params.compensatoryLeaveStartTime[0]
        params.startTimeEnd = params.compensatoryLeaveStartTime[1]
      }
      if (params.compensatoryLeaveEndTime.length > 0) {
        params.endTimeStart = params.compensatoryLeaveEndTime[0]
        params.endTimeEnd = params.compensatoryLeaveEndTime[1]
      }
      if (params.applyTime.length > 0) {
        params.createTimeStart = params.applyTime[0]
        params.createTimeEnd = params.applyTime[1]
      }
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].toString()
        }
      })
      delete params.compensatoryLeaveStartTime
      delete params.compensatoryLeaveEndTime
      delete params.applyTime
      return params
    },
    //表单重置
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //获取剩余可调休天数
    async getRemainingDays(empId) {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/attendance/getEmpDayoffCount'),
        method: 'get',
        params: { empId: empId }
      })
      if (data && data.code === 200) {
        this.remainingDays = data.payload.days
      } else {
        this.$message.error(data.msg)
      }
    },
    //通过
    async pass(row) {
      const h = this.$createElement
      let message = ''
      let ids = []
      if (row) {
        await this.getRemainingDays(row.empId)
        message = h('p', null, [
          h('span', null, `${row.userName}在${row.startTime}至${row.endTime}的调休申请,`),
          h('span', { style: this.remainingDays >= row.days ? 'color:#70B603' : 'color:red' }, `调休天数${row.days}天(剩余可调休天数:${this.remainingDays}天)`),
          h('span', { style: this.remainingDays >= row.days ? 'display:none' : 'display:inline-block;color:red' }, `,已超出剩余可调休天数`),
          h('span', null, `,确认通过吗？`)
        ])
        ids = [row.dayoffId]
        this.open(message, ids, row)
      } else {
        if (this.count === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        this.selData.filter((item) => {
          if (item.status == 0) {
            ids.push(item.dayoffId)
          }
        })
        if (ids.length == 0) {
          this.$message.warning('请选择待初审数据！')
          return
        }
        message = '已选中多条数据，确定批量通过吗？'
        this.open(message, ids)
      }
    },
    open(message, ids, row) {
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
            url: this.$http.adornUrl('/attendance/dayoffAudit'),
            method: 'get',
            params: { ids: ids.toString(), status: 2 }
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message.success(data.msg)
              this.selectTableData()
              if (row) {
                this.$refs.approvalProcessDialog.show()
                this.$nextTick(() => {
                  this.$refs.approvalProcess.init(row, 2)
                })
              }
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
        this.$refs.reject.init(row, 3)
      })
    },
    //关闭驳回弹窗
    closeDialog() {
      this.$refs.rejectDialog.hide()
    },
    //查看
    view(row) {
      this.$refs.approvalProcessDialog.show()
      this.$nextTick(() => {
        this.$refs.approvalProcess.init(row, 2)
      })
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
.el-input {
  width: 200px;
}

.el-button {
  min-width: 60px;
  margin-left: 0;
  width: auto;
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
