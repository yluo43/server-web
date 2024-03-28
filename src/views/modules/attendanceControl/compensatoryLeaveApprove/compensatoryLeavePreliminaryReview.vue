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
          <el-form-item label="归属团队:" prop="teamIds">
            <el-select v-model="dataForm.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="调休开始时间:" prop="deliveryDate">
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
          <el-form-item label="调休结束时间:" prop="deliveryDate">
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
          <el-form-item label="审批状态:" prop="teamIds">
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
          <el-button type="text" @click="pass">批量通过</el-button>
        </div>
        <div style="margin-left: 20px">
          <baseTable :tableData="tableData" ref="table" :multi-select="true" @select="checkedTable">
            <template v-slot:clientType="row">
              <template>
                <el-button type="text" @click="pass(row)">通过</el-button>
                <el-button type="text" @click="reject(row)">驳回</el-button>
                <el-button type="text" @click="view(row)">查看</el-button>
              </template>
            </template>
          </baseTable>
        </div>
      </div>
    </el-container>
    <base-dialog ref="rejectDialog" title="加班时长驳回" :width="'500px'">
      <template>
        <rejectDialog ref="reject" :cancelDialog="closeDialog" @selectTableData="selectTableData"></rejectDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import rejectDialog from '@/views/modules/attendanceControl/compensatoryLeaveApprove/rejectDialog.vue'
export default {
  components: { baseTable, baseDialog, rejectDialog },
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
          { label: '归属团队', prop: 'startConfirmTime' },
          { label: '调休开始时间', prop: 'affirmDay' },
          { label: '调休结束时间', prop: 'affirmDay' },
          { label: '调休天数', prop: 'affirmDay' },
          { label: '申请时间', prop: 'affirmDay' },
          { label: '审批状态', prop: 'taskStatus', slotName: 'taskStatus' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: '/projectWork/projectTaskList'
      }
    }
  },
  mounted() {
    this.getTeam()
    this.selectTableData()
  },
  created() {},
  methods: {
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
    pass(row) {
      let message = ''
      let ids = []
      if (row) {
        message = `${row.item.name}在${row}至${row}的加班申请,加班时长${row}小时,确定通过吗？`
        ids = [row.id]
      } else {
        if (this.count === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        ids = this.selData.filter((item) => {
          return item.id
        })
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(''),
            method: 'post',
            data
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message.success(data.msg)
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
    view() {},
    //选择框选择
    checkedTable(sel) {
      this.count = sel.length
      this.selData = sel
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
  margin: 20px 0 20px 20px;
}

.el-button {
  margin-left: 0;
  width: auto;
}
</style>
