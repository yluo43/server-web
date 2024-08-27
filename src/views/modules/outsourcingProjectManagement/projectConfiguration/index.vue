<template>
  <div>
    <el-container v-if="flag == 1">
      <el-header style="height: auto">
        <el-form :inline="true" label-width="auto" label-position="right" :model="dataForm" ref="dataForm">
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="dataForm.projectName" placeholder="请输入项目名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目经理:" prop="projectManager">
            <el-input v-model="dataForm.customerName" placeholder="请输入项目经理" clearable></el-input>
          </el-form-item>
          <el-form-item label="关联项目:" prop="associatedProjectIds">
            <el-select v-model="dataForm.associatedProjectIds" multiple placeholder="请选择关联项目" clearable>
              <el-option v-for="item in associatedProjects" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称:" prop="customerIds">
            <el-select v-model="dataForm.customerIds" multiple placeholder="请选择客户名称" clearable>
              <el-option v-for="item in customerNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="showFlag" style="display: contents">
            <el-form-item label="客户所属集团:" prop="membershipGroupIds">
              <el-select v-model="dataForm.membershipGroupIds" multiple placeholder="请选择客户所属集团" clearable>
                <el-option v-for="item in membershipGroups" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间:" prop="startTime">
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
            <el-form-item label="结束时间:" prop="endTime">
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
              <svg-icon :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'" style="height: 1.3em; width: 1.3em; position: relative; top: 3px" />
              <span v-if="showFlag" class="btn-font-size" style="color: #2462f9">收起</span>
              <span v-else class="btn-font-size" style="color: #2462f9">展开</span>
            </div>
            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
            <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
            <el-button type="primary" @click="goToDetails()">详情</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <div class="chooseResult">
        <span>已选中 {{ count }} 项</span>
      </div>
      <div class="operate-button">
        <el-button class="btn-download" icon="el-icon-download" type="primary" @click="download()">批量下载</el-button>
        <el-button class="btn-download" type="primary" icon="el-icon-circle-plus-outline" @click="addProject()">新建项目</el-button>
      </div>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @selectData="selectData">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
              <svg-icon :icon-class="'detials-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="goToDetails(row.item)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteItem(row.item)" />
            </el-tooltip>
          </template>
        </template>
      </baseTable>
      <base-drawer ref="addProjectDrawer" :title="drawerTitle" size="23%">
        <template>
          <addProject ref="addProject" @closeDrawer="closeAddProjectDrawer" />
        </template>
      </base-drawer>
    </el-container>
    <div v-if="flag == 2">
      <projectDetail @changeFlag="changeFlag" />
    </div>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDrawer from '@/views/modules/base/baseDrawer.vue'
import addProject from '@/views/modules/outsourcingProjectManagement/projectConfiguration/addProject.vue'
import projectDetail from './projectDetail'
export default {
  components: {
    baseTable,
    baseDrawer,
    addProject,
    projectDetail
  },
  data() {
    return {
      //1为当前页 2为详情页
      flag: 1,
      showFlag: false,
      count: 0,
      drawerTitle: '',
      //选中的数据
      checkedIds: [],
      dataForm: {
        //项目名称
        projectName: '',
        //项目经理
        projectManager: '',
        //关联项目
        associatedProjectIds: [],
        //客户名称
        customerIds: [],
        //客户所属集团
        membershipGroupIds: [],
        //开始时间
        startTime: [],
        //结束时间
        endTime: []
      },
      //关联项目
      associatedProjects: [],
      customerNames: [],
      membershipGroups: [],
      tableData: {
        theads: [
          { label: '项目名称', prop: 'projectName' },
          { label: '项目经理', prop: 'projectManager' },
          { label: '关联项目', prop: 'associatedProject' },
          { label: '项目客户', prop: 'customerName' },
          { label: '客户所属集团', prop: 'membershipGroup' },
          { label: '项目开始时间', prop: 'startTime' },
          { label: '项目结束时间', prop: 'endTime' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: ''
      }
    }
  },

  mounted() {
    this.refresh()
  },
  methods: {
    changeFlag() {
      this.flag = 1
    },
    //查询表格
    refresh() {
      this.$refs.table.refresh(this.dataConversion(this.dataForm))
    },
    //查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.startTime.length > 0) {
        params.startStartDate = params.startTime[0]
        params.startEndDate = params.startTime[1]
      }
      if (params.endTime.length > 0) {
        params.endStartDate = params.endTime[0]
        params.endEndDate = params.endTime[1]
      }
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].toString()
        }
      })
      delete params.startTime
      delete params.endTime
      return params
    },
    //重置表格
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    //获取选中的数据
    selectData(selection) {
      this.checkedIds = []
      if (selection.length > 0) {
        selection.forEach((item) => {
          this.checkedIds.push(item.id)
        })
        this.count = this.checkedIds.length
      } else {
        this.count = 0
      }
    },
    //批量下载
    download() {
      if (this.checkedIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let form = { ...this.dataForm }
      form.ids = this.checkedIds
      this.$http.downloadPost(this.$http.adornUrl('/dailyCost/export'), this.$http.adornParams(form), this)
    },
    //新建项目
    addProject() {
      this.$refs.addProjectDrawer.show()
      this.drawerTitle = '新建项目'
    },
    //详情
    goToDetails(row) {
      this.flag = 2
    },
    //删除
    deleteItem(row) {
      const message = `确定删除[${row.deptName}-${row.account}]${row.costDate}的日常费用(${row.reason}:${row.costName}:${row.totalMoney})记录吗？删除后将无法恢复!`
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(''),
            method: 'post',
            data: row.id
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closeAddProjectDrawer() {
      this.$refs.addProjectDrawer.hide()
      this.refresh()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  color: #333;
  padding: 0 0;
}
.el-input {
  width: 200px;
}
::v-deep .drawerForm {
  .el-form-item__label {
    width: 60px !important;
  }
  .el-form-item {
    width: 100% !important;
  }
  .el-form-item__content {
    width: calc(100% - 60px);
  }
  .el-input,
  .el-select {
    width: 100%;
  }
}

::v-deep .el-table__cell {
  text-align: center;
}
</style>
