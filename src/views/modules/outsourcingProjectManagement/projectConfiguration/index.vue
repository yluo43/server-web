<template>
  <div>
    <el-container v-if="pageFlag == 1">
      <el-header style="height: auto">
        <el-form ref="dataForm" :inline="true" label-width="auto" label-position="right" :model="dataForm">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入项目名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目经理:" prop="managerName">
            <el-input v-model="dataForm.managerName" placeholder="请输入项目经理" clearable></el-input>
          </el-form-item>
          <el-form-item label="关联项目:" prop="projectId">
            <el-select v-model="dataForm.projectId" placeholder="请选择关联项目" clearable>
              <el-option
                v-for="item in associatedProjects"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="showFlag" style="display: contents">
            <el-form-item label="项目客户:" prop="relCustomers">
              <el-select v-model="dataForm.relCustomers" multiple collapse-tags placeholder="请选择项目客户" clearable>
                <el-option v-for="item in customerNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户所属集团:" prop="relBelongGroups">
              <el-select v-model="dataForm.relBelongGroups" multiple collapse-tags placeholder="请选择客户所属集团"   clearable>
                <el-option v-for="item in membershipGroups" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间:" prop="startTime">
              <el-date-picker
                v-model="dataForm.startTime"
                style="width: 200px"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
                clearable
              />
            </el-form-item>
            <el-form-item label="结束时间:" prop="endTime">
              <el-date-picker
                v-model="dataForm.endTime"
                style="width: 200px"
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
              <svg-icon
                :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'"
                style="height: 1.3em; width: 1.3em; top: 3px"
              />
              <span v-if="showFlag" class="btn-font-size" style="color: #2462f9">收起</span>
              <span v-else class="btn-font-size" style="color: #2462f9">展开</span>
            </div>
            <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="refresh()">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <div class="chooseResult">
        <span>已选中 {{ count }} 项</span>
      </div>
      <div class="operate-button">
        <el-button class="btn-download" icon="el-icon-download" type="primary" @click="download()">批量下载</el-button>
        <el-button class="btn-download" type="primary" icon="el-icon-circle-plus-outline" @click="addProject()">新建项目
        </el-button>
      </div>
      <baseTable ref="table" :table-data="tableData" :multi-select="true" @selectData="selectData">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
              <svg-icon
                :icon-class="'detials-icon'"
                style="height: 1.5em; width: 1.5em; margin-right: 2em"
                @click="goToDetails(row.item)"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <svg-icon
                :icon-class="'delete-icon'"
                style="height: 1.5em; width: 1.5em; margin-right: 2em"
                @click="deleteItem(row.item)"
              />
            </el-tooltip>
          </template>
        </template>
      </baseTable>
      <base-drawer ref="addProjectDrawer" :title="drawerTitle" size="23%">
        <template>
          <addProject ref="addProject" @closeDrawer="closeAddProjectDrawer" @goDetail="confirm" />
        </template>
      </base-drawer>
    </el-container>
    <div v-if="pageFlag == 2">
      <projectDetail ref="projectDetail" @changePageFlag="changePageFlag" />
    </div>
    <el-dialog

        title="提示"
        :visible.sync="dialogVisible"
        :modal="false"
        width="30%">
      <div style="display: flex;justify-content: center;align-items: center;">
        <svg-icon
            icon-class="right"
            style="height: 70px; width: 70px; position: relative; top: 3px"
        />
      </div>
      <h1 style="text-align: center;">新建成功</h1>
      <div style="text-align: center;color: #0000FF">还需要去项目详情里完善项目的岗位单价信息</div>
      <span slot="footer" class="dialog-footer">
         <div style="display: flex;justify-content: center;align-items: center;">
            <el-button class="button" @click="dialogVisible = false">暂不填</el-button>
            <el-button class="button" type="primary" @click="goToDetails(singleRow)">去填写</el-button>
         </div>
         </span>
    </el-dialog>
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
      singleRow: {},
      dialogVisible: false,
      // 1为当前页 2为详情页
      pageFlag: 1,
      // 展开收起标识
      showFlag: false,
      count: 0,
      drawerTitle: '',
      // 选中的数据
      checkedIds: [],
      dataForm: {
        // 项目名称
        name: '',
        // 项目经理
        managerName: '',
        // 项目客户
        relCustomers: [],
        // 客户所属集团
        relBelongGroups: [],
        // 开始时间
        startTime: [],
        // 结束时间
        endTime: []
      },
      // 关联项目
      associatedProjects: [],
      customerNames: [],
      membershipGroups: [],
      customers: {},
      tableData: {
        theads: [
          { label: '项目名称', prop: 'name' },
          { label: '合同编号', prop: 'contractCode' },
          { label: '项目经理', prop: 'managerName' },
          { label: '关联项目', prop: 'projectName' },
          { label: '项目客户', prop: 'customerName' },
          { label: '客户所属集团', prop: 'belongGroup' },
          { label: '项目开始时间', prop: 'startTime' },
          { label: '项目结束时间', prop: 'endTime' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: '/externalProject/listExternalProject'
      }
    }
  },

  mounted() {
    this.refresh()
    this.$http({
      url: this.$http.adornUrl('/externalProject/listRelProjectData'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.associatedProjects = data.payload.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })

    this.$http({
      url: this.$http.adornUrl('/externalProject/listCustomer?pageSize=999'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.customerNames = data.payload.list.filter((item) => item.id != 0)
        for (let i in this.customerNames) {
          if (!this.customers[this.customerNames[i].belongGroup]) {
            this.membershipGroups.push(this.customerNames[i].belongGroup)
            this.customers[this.customerNames[i].belongGroup] = new Array(this.customerNames[i])
          } else {
            this.customers[this.customerNames[i].belongGroup].push(this.customerNames[i])
          }
        }
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    // 切换页面
    changePageFlag(pageFlag) {
      this.pageFlag = pageFlag
      this.refresh()
    },
    // 查询表格数据
    refresh() {
      this.$nextTick(() => {
        this.$refs.table.refresh(this.dataConversion(this.dataForm))
      })
    },
    // 查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.startTime.length > 0) {
        params.startDateBegin = params.startTime[0]
        params.startDateOver = params.startTime[1]
      }
      if (params.endTime.length > 0) {
        params.endDateBegin = params.endTime[0]
        params.endDateOver = params.endTime[1]
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
    // 重置表格
    resetForm() {
      this.$refs.dataForm.resetFields()
      this.dataForm.startTime= []
      this.dataForm.endTime= []
      this.refresh()
    },
    // 获取选中的数据
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
    // 批量下载
    download() {
      if (this.checkedIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      this.$http.downloadPost(this.$http.adornUrl('/externalProject/exportProject'), {ids:this.checkedIds}, this)
    },
    // 新建项目
    addProject() {
      this.$refs.addProjectDrawer.show()
      this.drawerTitle = '新建项目'
    },
    // 详情
    goToDetails(row) {
      this.dialogVisible = false
      this.pageFlag = 2
      this.singleRow = null
      this.$nextTick(() => {
        this.$refs.projectDetail.init(row)
      })
    },
    // 删除
    deleteItem(row) {
      const message = `确定删除${row.name}项目吗？`
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/externalProject/deleteExternalProject?id='+row.id),
            method: 'delete'
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
    // 关闭添加项目抽屉
    closeAddProjectDrawer() {
      this.$refs.addProjectDrawer.hide()
      this.refresh()
    },
    memberChange(){
      this.customerNames = this.customers[this.dataForm.membershipGroupIds]
    },
    confirm(row) {
      this.dialogVisible = true
      this.singleRow = row
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

.button {
  width: 100px;
  height: 40px;
  margin: 20px;
}
</style>
