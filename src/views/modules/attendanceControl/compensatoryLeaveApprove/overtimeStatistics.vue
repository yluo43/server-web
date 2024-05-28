<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div style="margin-left: 16px">
        <el-form ref="dataForm" :inline="true" :model="dataForm">
          <el-form-item label="用户姓名:" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="请输入用户姓名" clearable />
          </el-form-item>
          <el-form-item label="工号:" prop="empId">
            <el-input v-model="dataForm.empId" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder="请输入工号" clearable />
          </el-form-item>
          <el-form-item label="归属部门:" prop="deptId">
            <el-select v-model="dataForm.deptId" placeholder="请选择归属部门" clearable>
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属团队:" prop="teamId">
            <el-select v-model="dataForm.teamId" placeholder="请选择归属团队" clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="selectTableData">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="chooseResult">
          <span>已选中 {{ count }} 项</span>
        </div>
        <div class="operate-button">
          <el-button class="btn-download" type="primary" icon="el-icon-download" @click="batchDownload">批量下载</el-button>
        </div>
        <div>
          <!-- @select="checkedTable" -->
          <baseTable :tableData="tableData" ref="table" :multi-select="true" @selectData="selectData" propHeight="467px">
            <template v-slot:clientType="row">
              <template>
                <el-button type="text" style="width: 100px" @click="viewDetails(row.item)">查看明细</el-button>
                <el-button type="text" style="width: 100px" v-auth="'attendance:subsidy'" @click="workAllowance(row.item)">工时补贴</el-button>
              </template>
            </template>
          </baseTable>
        </div>
      </div>
    </el-container>
    <!-- 查看明细 -->
    <base-dialog ref="detailsDialog" title="查看明细" :width="'1200px'" :speail-style="true">
      <template>
        <detailsDialog ref="details" :cancelDialog="closeDetailsDialog"></detailsDialog>
      </template>
    </base-dialog>
    <!-- 工时补贴 -->
    <base-dialog ref="workAllowanceDialog" title="工时补贴" :width="'500px'">
      <template>
        <workAllowanceDialog ref="workAllowance" :cancelDialog="closeWorkAllowanceDialog" @selectTableData="selectTableData"></workAllowanceDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
//import baseTable from '@/views/modules/base/baseTable.vue'
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import detailsDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/detailsDialog.vue'
import workAllowanceDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/dialog/workAllowanceDialog.vue'
export default {
  components: { baseTable, baseDialog, detailsDialog, workAllowanceDialog },
  props: {},
  data() {
    return {
      count: 0,
      deptList: [],
      teamList: [],
      selData: [],
      dataForm: {
        userName: '',
        empId: '',
        teamId: '',
        deptId: ''
        // deptIds: [],
        // teamIds: []
      },
      tableData: {
        theads: [
          { label: '用户姓名', prop: 'userName' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '团队负责人', prop: 'teamManager' },
          { label: '累计加班时长(小时)', prop: 'overtimeHours' },
          { label: '可调休天数(天)', prop: 'dayoffDays' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '250px' }
        ],
        url: '/attendance/overtimeStats'
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
    //查询条件格式转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].toString()
        }
      })
      return params
    },
    //表单重置
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //查看明细
    viewDetails(row) {
      this.$refs.detailsDialog.show()
      this.$nextTick(() => {
        this.$refs.details.init(row)
      })
    },
    //工时补贴
    workAllowance(row) {
      this.$refs.workAllowanceDialog.show()
      this.$nextTick(() => {
        this.$refs.workAllowance.init(row)
      })
    },
    //关闭查看详情弹窗
    closeDetailsDialog() {
      this.$refs.detailsDialog.hide()
    },
    //关闭工时补贴弹窗
    closeWorkAllowanceDialog() {
      this.$refs.workAllowanceDialog.hide()
    },

    //选择框选择
    // checkedTable(sel) {
    //   this.count = sel.length
    //   this.selData = sel
    // },
    selectData(sel) {
      this.count = sel.length
      this.selData = [...sel]
    },
    //批量下载
    batchDownload() {
      if (this.count === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let form = { ...this.dataForm }
      form.ids = this.selData.map((item) => {
        return item.empId
      })
      Object.keys(form).map((key) => {
        if (!form[key]) {
          delete form[key]
        }
      })

      this.$http.downloadPost(this.$http.adornUrl('/attendance/export'), this.$http.adornParams(form), this)
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 200px;
}
</style>
<style>
.speail-style .el-dialog__body {
  padding: 5px 20px 2px 20px;
}
.speail-style .el-dialog__header {
  border-bottom: none;
}
</style>
