<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <div>
        <el-form ref="dataForm" :inline="true" :model="dataForm">
          <el-form-item label="日期:" prop="dateRange">
            <el-date-picker
              v-model="dataForm.dateRange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
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
            <el-button type="primary" icon="el-icon-search" @click="selectTableData">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button style="margin: 10px 0 10px 0" type="primary" icon="el-icon-circle-plus-outline" @click="importFile">导入</el-button>
        <div>
          <baseTable :tableData="tableData" ref="table" :type="null"></baseTable>
        </div>
      </div>
    </el-container>

    <base-dialog ref="importDialog" title="导入" :width="'500px'">
      <template>
        <importDialog ref="importData" :cancelDialog="closeDialog" @refreshTableData="selectTableData"></importDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import importDialog from '@/views/modules/attendanceControl/attendanceManagement/importDialog.vue'
export default {
  components: { baseTable, baseDialog, importDialog },
  props: {},
  data() {
    return {
      deptList: [],
      teamList: [],
      selData: [],
      dataForm: {
        name: '',
        empId: '',
        deptIds: [],
        teamIds: [],
        dateRange: [],
        recordStartDate: '',
        recordEndDate: ''
      },
      tableData: {
        theads: [
          { label: '日期', prop: 'recordDate' },
          { label: '姓名', prop: 'name' },
          { label: '工号', prop: 'empId' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '上班时间', prop: 'onTime' },
          { label: '下班时间', prop: 'offTime' },
          { label: '迟到(分钟)', prop: 'late' },
          { label: '早退(分钟)', prop: 'early' },
          { label: '工作时间(小时)', prop: 'workingHours' },
          { label: '申请加班时间(小时)', prop: 'overtimeHours' }
        ],
        url: '/attendance/list'
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
      this.$refs.table.refresh(this.dataConversion(this.dataForm))
    },
    //表单重置
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.dateRange.length != 0) {
        params.recordStartDate = params.dateRange[0]
        params.recordEndDate = params.dateRange[1]
      }
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].toString()
        }
      })
      delete params.dateRange
      return params
    },
    //导入
    importFile() {
      this.$refs.importDialog.show()
    },
    //关闭导入弹窗
    closeDialog() {
      this.$refs.importDialog.hide()
    }
  }
}
</script>

<style scoped></style>
