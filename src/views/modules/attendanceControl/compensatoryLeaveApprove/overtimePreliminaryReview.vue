<template>
  <el-container style="height: 100%; width: 100%">
    <el-aside style="width: 200px; background-color: #ffffff; height: 625px; margin-top: 4px">
      <el-row>
        <el-col>
          <el-input v-model="projectName" placeholder="请输入" suffix-icon="el-icon-search" @change="projectNameChange"></el-input>
          <el-tree :data="data" :props="defaultProps" :highlight-current="true" node-key="id" ref="treeRef" @node-click="handleNodeClick"></el-tree>
        </el-col>
      </el-row>
    </el-aside>
    <div>
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
      <div class="row-box">
        <div>
          已选择
          <span>{{ count }}</span>
          项
        </div>
        <div>
          <el-button type="text" @click="pass">批量通过</el-button>
        </div>
      </div>
      <el-main class="table">
        <baseTable :tableData="tableData" ref="table" :multi-select="true" @select="checkedTable">
          <template v-slot:clientType="row">
            <template>
              <el-button type="text" @click="pass(row)">通过</el-button>
              <el-button type="text" @click="reject(row)">驳回</el-button>
              <el-button type="text" @click="view(row)">查看</el-button>
            </template>
          </template>
        </baseTable>
      </el-main>
    </div>
    <base-dialog ref="rejectDialog" title="加班时长驳回" :width="'500px'">
      <template>
        <rejectDialog ref="reject" :cancelDialog="closeDialog" @selectTableData="selectTableData"></rejectDialog>
      </template>
    </base-dialog>
  </el-container>
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
      projectName: '',
      count: 0,
      deptList: [],
      teamList: [],
      selData: [],
      dataForm: {
        name: '',
        empId: '',
        deptIds: [],
        teamIds: [],
        projectId: ''
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
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.getProjectList()
    this.getDept()
    this.getTeam()
    this.selectTableData()
  },
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
    //获取项目树
    getProjectList() {
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
          }
          this.data = list
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
    //表格查询
    selectTableData() {
      this.$refs.table.refresh(this.dataForm)
    },
    //表单重置
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //项目树搜索框数据变化
    projectNameChange() {
      this.getProjectList()
    },
    //点击树项目节点
    handleNodeClick(data) {
      this.dataForm.projectId = data.id
      this.selectTableData()
    },
    //通过
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
      this.selData = [...sel]
    }
  }
}
</script>

<style lang="scss" scoped>
.row-box {
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 5px;
  background-color: #e8f4ff;
  padding-left: 20px;
  margin: 20px 0 20px 20px;
}
</style>
