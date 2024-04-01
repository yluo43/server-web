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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" style="margin: 0 10px" @click="selectTableData">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="chooseResult">
          <span>已选择{{ count }}项</span>
        </div>
        <div style="margin-bottom: 10px; margin-left: 20px">
          <el-button
            v-auth="'costItems:export'"
            class="el-button-func"
            type="primary"
            icon="el-icon-download"
            style="margin-right: 10px"
            @click="batchDownload"
          >
            批量下载
          </el-button>
        </div>
        <div style="margin-left: 20px">
          <baseTable :tableData="tableData" ref="table" :multi-select="true" @select="checkedTable">
            <template v-slot:clientType="row">
              <template>
                <el-button type="text" @click="viewDetails(row)">查看明细</el-button>
                <el-button type="text" @click="workAllowance(row)">工时补贴</el-button>
              </template>
            </template>
          </baseTable>
        </div>
      </div>
    </el-container>
    <!-- 查看明细 -->
    <base-dialog ref="detailsDialog" title="查看明细" :width="'800px'">
      <template>
        <detailsDialog ref="details" :cancelDialog="closeDetailsDialog" @selectTableData="selectTableData"></detailsDialog>
      </template>
    </base-dialog>
    <!-- 工时补贴 -->
    <base-dialog ref="workAllowanceDialog" title="工时补贴" :width="'600px'">
      <template>
        <workAllowanceDialog ref="workAllowance" :cancelDialog="closeWorkAllowanceDialog" @selectTableData="selectTableData"></workAllowanceDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
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
        name: '',
        empId: '',
        deptIds: [],
        teamIds: []
      },
      tableData: {
        theads: [
          { label: '用户姓名', prop: 'name' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'startConfirmTime' },
          { label: '归属团队', prop: 'startConfirmTime' },
          { label: '团队负责人', prop: 'startConfirmTime' },
          { label: '累计加班时长', prop: 'affirmDay' },
          { label: '可调休天数', prop: 'affirmDay' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
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
    //表单重置
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //查看明细
    viewDetails() {
      this.$refs.detailsDialog.show()
    },
    //关闭驳回弹窗
    closeDetailsDialog() {
      this.$refs.detailsDialog.hide()
    },
    closeWorkAllowanceDialog() {
      this.$refs.workAllowanceDialog.hide()
    },
    //工时补贴
    workAllowance() {
      this.$refs.workAllowanceDialog.show()
    },
    //选择框选择
    checkedTable(sel) {
      this.count = sel.length
      this.selData = sel
    },
    //批量下载
    batchDownload() {
      if (this.count === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let form = { ...this.dataForm }
      form.ids = this.selData.filter((item) => {
        return item.id
      })
      Object.keys(form).map((key) => {
        if (!form[key]) {
          delete form[key]
        }
      })
      this.$http.downloadPost(this.$http.adornUrl('/costItems/export'), this.$http.adornParams(form), this)
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 200px !important;
}

::v-deep .el-select .el-tag {
  max-width: 70% !important;
}

.chooseResult {
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 5px;
  background-color: #e8f4ff;
  padding-left: 20px;
  margin: 20px 0 10px 20px;
}

.el-button {
  margin-left: 0;
  width: auto;
}
</style>
