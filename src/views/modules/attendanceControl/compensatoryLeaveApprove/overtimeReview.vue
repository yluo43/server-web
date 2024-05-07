<template>
  <div style="height: 100%">
    <el-container style="height: 100%" direction="vertical">
      <div style="margin-left: 16px">
        <el-form ref="dataForm" label-width="90px" label-position="left" :inline="true" :model="dataForm">
          <el-form-item label="用户姓名:" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="请输入用户姓名" clearable />
          </el-form-item>
          <el-form-item label="归属团队:" prop="teamId">
            <el-select v-model="dataForm.teamId" placeholder="请选择归属团队" clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="审批状态:" prop="status">
            <el-select v-model="dataForm.status" placeholder="请选择审批状态" clearable>
              <el-option v-for="item in approvalStatus" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="归属部门:" prop="deptIds">
            <el-select v-model="dataForm.deptIds" placeholder="请选择归属部门" multiple collapse-tags clearable>
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.name == '新讯数字科技有限公司'" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属团队:" prop="teamIds">
            <el-select v-model="dataForm.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item> -->
          <div v-if="showFlag" style="display: contents">
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder="请输入工号" clearable />
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptId">
              <el-select v-model="dataForm.deptId" placeholder="请选择归属部门" clearable>
                <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否居家办公:" prop="isRemoteWork">
              <el-select v-model="dataForm.isRemoteWork" placeholder="请选择是否居家办公" clearable>
                <el-option v-for="item in isRemoteWorks" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="加班类型:" prop="overtimeType">
              <el-select v-model="dataForm.overtimeType" placeholder="请选择加班类型" clearable>
                <el-option v-for="item in overtimeTypes" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间:" prop="applyTime">
              <el-date-picker
                style="width: 200px"
                v-model="dataForm.applyTime"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              />
            </el-form-item>
            <el-form-item label="加班开始时间:" prop="startTime">
              <el-date-picker
                style="width: 200px"
                v-model="dataForm.startTime"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              />
            </el-form-item>
            <el-form-item label="加班结束时间:" prop="endTime">
              <el-date-picker
                style="width: 200px"
                v-model="dataForm.endTime"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              />
            </el-form-item>
          </div>
          <el-form-item>
            <div style="display: inline-block; margin-right: 15px" @click="showFlag = !showFlag">
              <svg-icon :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'" style="height: 1.5em; width: 1.5em; position: relative; top: 3px" />
              <span v-if="showFlag" style="color: #2462f9">收起</span>
              <span v-else style="color: #2462f9">展开</span>
            </div>
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
          <!-- @select="checkedTable" -->
          <baseTable :tableData="tableData" ref="table" :multi-select="true" @selectData="selectData">
            <template v-slot:overtimeType="row">
              <span v-if="row.item.overtimeType == 0">日常加班</span>
              <span v-else>节假日加班</span>
            </template>
            <template v-slot:isRemoteWork="row">
              <span v-if="row.item.isRemoteWork == 1">是</span>
              <span v-else>否</span>
            </template>
            <template v-slot:status="row">
              <span v-if="row.item.status == 0">待初审</span>
              <span v-if="row.item.status == 2">待复审</span>
              <span v-if="row.item.status == 1">初审驳回</span>
              <span v-if="row.item.status == 3">复审驳回</span>
              <span v-if="row.item.status == 4">已通过</span>
            </template>
            <template v-slot:clientType="row">
              <template>
                <el-button :disabled="row.item.status != 2" type="text" @click="pass(row.item)">通过</el-button>
                <el-button :disabled="row.item.status != 2" type="text" @click="reject(row.item)">驳回</el-button>
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
//import baseTable from '@/views/modules/base/baseTable.vue'
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import { getCName } from '@/utils/auth'
import rejectDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/rejectDialog.vue'
import approvalProcessDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/approvalProcessDialog.vue'
export default {
  components: { baseTable, baseDialog, rejectDialog, approvalProcessDialog },
  props: {},
  data() {
    return {
      showFlag: false,
      count: 0,
      deptList: [],
      teamList: [],
      selData: [],
      approvalStatus: [
        { id: 2, name: '待复审' },
        { id: 3, name: '复审驳回' },
        { id: 4, name: '已通过' }
      ],
      isRemoteWorks: [
        { id: 0, name: '否' },
        { id: 1, name: '是' }
      ],
      overtimeTypes: [
        { id: 0, name: '日常加班' },
        { id: 1, name: '节假日加班' }
      ],
      dataForm: {
        operatorName: '',
        userName: '',
        empId: '',
        deptId: '',
        teamId: '',
        // deptIds: [],
        // teamIds: [],
        status: '',
        isRemoteWork: '',
        overtimeType: '',
        applyTime: [],
        startTime: [],
        endTime: [],
        createTimeStart: '',
        createTimeEnd: '',
        startTimeStart: '',
        startTimeEnd: '',
        endTimeStart: '',
        endTimeEnd: '',
        searchType: 2
      },
      tableData: {
        theads: [
          { label: '用户姓名', prop: 'userName' },
          { label: '工号', prop: 'empId', width: '70px' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '加班开始时间', prop: 'startTime', width: '140px' },
          { label: '加班结束时间', prop: 'endTime', width: '140px' },
          { label: '加班类型', prop: 'overtimeType', slotName: 'overtimeType' },
          { label: '加班时长(小时)', prop: 'overtimeHours' },
          { label: '是否居家办公', prop: 'isRemoteWork', slotName: 'isRemoteWork' },
          { label: '加班原因', prop: 'reason' },
          { label: '申请时间', prop: 'createTime', width: '140px' },
          { label: '审批状态', prop: 'status', slotName: 'status' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '205px' }
        ],
        url: '/attendance/getOvertimeList'
      }
    }
  },

  mounted() {
    this.getDept()
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
    //获取部门
    getDept() {
      this.$http({
        url: this.$http.adornUrl('/common/getDeptByRole'),
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
        url: this.$http.adornUrl('/common/getTeamByRole'),
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
    //查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.applyTime.length > 0) {
        params.createTimeStart = params.applyTime[0]
        params.createTimeEnd = params.applyTime[1]
      }
      if (params.startTime.length > 0) {
        params.startTimeStart = params.startTime[0]
        params.startTimeEnd = params.startTime[1]
      }
      if (params.endTime.length > 0) {
        params.endTimeStart = params.endTime[0]
        params.endTimeEnd = params.endTime[1]
      }
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].toString()
        }
      })
      delete params.applyTime
      delete params.startTime
      delete params.endTime
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
          h('span', null, `${row.userName}在${row.startTime}至${row.endTime}的加班申请,`),
          h('span', { style: 'color: red' }, `加班时长${row.overtimeHours}小时`),
          h('span', null, `,确认通过吗？`)
        ])
        ids = [row.overtimeId]
        this.open(message, ids, row)
      } else {
        if (this.count === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        this.selData.filter((item) => {
          if (item.status == 2) {
            ids.push(item.overtimeId)
          }
        })
        if (ids.length == 0) {
          this.$message.warning('请选择待复审数据！')
          return
        }
        message = '已选中多条数据，确定批量通过吗？'
        this.open(message, ids)
      }
    },
    open(message, ids, row) {
      this.$msgbox({
        title: '提示',
        message: message,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'msgClass'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/attendance/overtimeAudit'),
            method: 'get',
            params: { ids: ids.toString(), status: 4 }
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message.success(data.msg)
              this.selectTableData()
              if (row) {
                this.$refs.approvalProcessDialog.show()
                this.$nextTick(() => {
                  this.$refs.approvalProcess.init(row, 1)
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
        this.$refs.reject.init(row, 2)
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
        this.$refs.approvalProcess.init(row, 1)
      })
    },
    //关闭查看详情弹窗
    closeApprovalProcessDialog() {
      this.$refs.approvalProcessDialog.hide()
    },
    //选择框选择
    // checkedTable(sel) {
    //   this.count = sel.length
    //   this.selData = sel
    // }
    selectData(sel) {
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
.el-input {
  width: 200px;
}
</style>
