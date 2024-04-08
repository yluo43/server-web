<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%; border: 1px solid #eee">
      <el-header style="height: auto">
        <el-form ref="projectConfigForm" :inline="true" :model="projectConfigFormData">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="projectConfigFormData.name" placeholder="请输入项目名称" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="项目编码:" prop="projectId">
            <el-input v-model="projectConfigFormData.projectId" placeholder="请输入编码后四位" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="项目经理:" prop="managerIds">
            <el-select v-model="projectConfigFormData.managerIds" multiple collapse-tags clearable placeholder="请选择项目经理">
              <el-option v-for="item in managerList" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="立项时间:" prop="approvalDate">
            <el-date-picker
              v-model="projectConfigFormData.approvalDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item label="合同类型:" prop="contractTypes">
            <el-select v-model="projectConfigFormData.contractTypes" placeholder="请选择合同类型" multiple collapse-tags clearable>
              <el-option v-for="item in contractTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属团队:" prop="teamIds">
            <el-select v-model="projectConfigFormData.teamIds" placeholder="请选择归属团队" multiple collapse-tags clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="甲方名称:" prop="firstParty">
            <el-input v-model="projectConfigFormData.firstParty" placeholder="请输入甲方名称" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="合同名称:" prop="contractName">
            <el-input v-model="projectConfigFormData.contractName" placeholder="请输入合同名称" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="合同编号:" prop="contractNo">
            <el-input v-model="projectConfigFormData.contractNo" placeholder="请输入合同编号" style="width: 200px" clearable />
          </el-form-item>
          <el-form-item label="交付时间:" prop="deliveryDate">
            <el-date-picker
              v-model="projectConfigFormData.deliveryDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item label="结算周期:" prop="settlementCycles">
            <el-select v-model="projectConfigFormData.settlementCycles" placeholder="请选择结算周期" multiple collapse-tags clearable>
              <el-option v-for="item in settlementCycleList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属部门:" prop="deptIds">
            <el-select v-model="projectConfigFormData.deptIds" placeholder="请选择归属部门" multiple collapse-tags clearable>
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.name == '新讯数字科技有限公司'" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属项目集:" prop="psIds">
            <el-select v-model="projectConfigFormData.psIds" placeholder="请选择归属项目集" multiple collapse-tags clearable>
              <el-option v-for="item in psList" :key="item.id" :label="item.psName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目类型:" prop="projectTypes">
            <el-select v-model="projectConfigFormData.projectTypes" placeholder="请选择项目类型" multiple collapse-tags clearable>
              <el-option v-for="item in projectTypeList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目标签:" prop="labels">
            <el-select v-model="projectConfigFormData.labels" placeholder="请选择项目标签" multiple collapse-tags clearable>
              <el-option v-for="item in itemLabels" :key="item.id" :label="item.labelName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" style="margin: 0 10px" @click="queryProjectList">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>

      <el-main>
        <div class="chooseResult">
          <span class="chooseResultStr" v-text="chooseStr" />
          <el-button type="text" @click="deleteProjectInfo()" v-auth="'costItems:deletes'">批量删除</el-button>
          <!-- <span v-auth="'costItems:deletes'" style="color: blue; margin-left: 50px" @click="deleteProjectInfo()">批量删除</span> -->
        </div>

        <!-- toolBar -->
        <div style="margin-bottom: 10px; margin-top: 15px">
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
          <el-button v-auth="'costItems:add'" class="el-button-func" type="primary" icon="el-icon-circle-plus-outline" @click="addProjectInfo">
            新建项目
          </el-button>
        </div>

        <baseTable ref="projectTable" :table-data="projectTableData" :multi-select="true" @select="onSelectTableItem">
          <template v-slot:contractTypeName="row">
            <div v-if="row.item.contractTypeName">{{ row.item.contractTypeName }}</div>
            <div v-else>--</div>
          </template>
          <template v-slot:contractAmount="row">
            <div v-if="row.item.contractAmount">{{ row.item.contractAmount }}</div>
            <div v-else>--</div>
          </template>
          <template v-slot:settlementCycle="row">
            <div v-if="row.item.settlementCycle">{{ row.item.settlementCycle }}个月</div>
            <div v-else>--</div>
          </template>
          <template v-slot:name="row">
            <el-tooltip class="item" effect="dark" placement="bottom">
              <div slot="content">
                项目编码：{{ row.item.projectId }}
                <br />
                归属部门：{{ row.item.deptName }}
                <br />
                归属团队：{{ row.item.teamName }}
                <br />
                归属项目集：{{ row.item.psName }}
                <br />
                项目标签：{{ row.item.labelNames }}
                <br />
                总预算：{{ row.item.generalBudget }} 元
                <br />
                目标利润率：{{ row.item.targetRate }} %
                <br />
                甲方名称：{{ row.item.firstParty }}
                <br />
                合同名称：{{ row.item.contractName }}
                <br />
                合同编号：{{ row.item.contractNo }}
                <br />
              </div>
              <div>{{ row.item.name }}</div>
            </el-tooltip>
          </template>
          <template v-slot:clientType="row">
            <!--类型插槽-->
            <template>
              <el-tooltip class="item" effect="dark" content="人员" placement="bottom">
                <svg-icon
                  :icon-class="'person-icon'"
                  style="height: 1.5em; width: 1.5em; margin-right: 2em"
                  @click="editPersonnelInfo(row.item)"
                  v-auth="'costItems:member'"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <svg-icon
                  :icon-class="'edit-icon'"
                  style="height: 1.5em; width: 1.5em; margin-right: 2em"
                  @click="updateProjectInfo(row.item)"
                  v-auth="'costItems:update'"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em" @click="deleteProjectInfo(row.item)" v-auth="'costItems:delete'" />
              </el-tooltip>
              <!-- <el-link v-auth="'costItems:member'" type="primary" icon="el-icon-edit" @click="editPersonnelInfo(row.item)">人员</el-link>
              <el-link v-auth="'costItems:update'" type="primary" style="margin-left: 10px" icon="el-icon-edit" @click="updateProjectInfo(row.item)">
                编辑
              </el-link>
              <el-link v-auth="'costItems:delete'" type="primary" style="margin-left: 10px" @click="deleteProjectInfo(row.item)">删除</el-link> -->
            </template>
          </template>
        </baseTable>
      </el-main>
    </el-container>

    <!-- 编辑项目信息 -->
    <!-- :handle-close="beforeCloseEditProjectDrawer" -->
    <base-drawer ref="editProjectInfoDrawer" :title="editDrawertitle">
      <template>
        <editProjectInfo ref="editProjectInfo" @closeDrawer="closeEditProjectInfoDrawer" />
      </template>
    </base-drawer>

    <!-- 编辑人员信息 -->
    <base-dialog ref="personnelManagementDialog" title="人员信息">
      <template>
        <personnel-management ref="personnelManagement"></personnel-management>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTable.vue'
import baseDrawer from '@/views/modules/base/baseDrawer.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import editProjectInfo from '@/views/modules/projectManagement/projectConfig/editProjectInfo.vue'
import personnelManagement from '@/views/modules/projectManagement/projectConfig/personnelManagement.vue'
import * as ArrUtil from '@/views/modules/common/arrUtil'
import * as ProjectConstants from '@/views/modules/projectManagement/projectConstants'

export default {
  components: { baseDrawer, baseTable, baseDialog, editProjectInfo, personnelManagement },
  props: {},
  data() {
    return {
      projectConfigFormData: {
        name: '',
        projectId: '',
        managerIds: [],
        approvalDate: '',
        approvalDateStart: '',
        approvalDateEnd: '',
        contractTypes: [],
        teamIds: [],
        firstParty: '',
        contractName: '',
        contractNo: '',
        psIds: [],
        deptIds: [],
        projectTypes: '',
        deliveryDate: '',
        deliveryDateStart: '',
        deliveryDateEnd: '',
        settlementCycles: [],
        labels: []
      },
      managerList: [],
      itemLabels: [],
      contractTypeList: [...ProjectConstants.contractType],
      teamList: [],
      psList: [],
      deptList: [],
      projectTypeList: [...ProjectConstants.projectType],
      settlementCycleList: [...ProjectConstants.settlementCycle],
      chooseStr: '已选择 0 项',
      projectTableData: {
        theads: [
          { label: '项目名称', prop: 'name', slotName: 'name' },
          { label: '项目经理', prop: 'managerName' },
          { label: '项目类型', prop: 'projectTypeName' },
          { label: '立项时间', prop: 'approvalDate' },
          { label: '计划交付时间', prop: 'deliveryDate' },
          { label: '合同类型', prop: 'contractTypeName', slotName: 'contractTypeName' },
          { label: '结算周期', prop: 'settlementCycle', slotName: 'settlementCycle' },
          { label: '合同金额(元)', prop: 'contractAmount', slotName: 'contractAmount', width: '100px' },
          { label: '订单金额(元)', prop: 'orderAmount', width: '100px' },
          { label: '结算单金额(元)', prop: 'settlementAmount', width: '120px' },
          { label: '回款金额(元)', prop: 'returnAmount', width: '100px' },
          { label: '状态', prop: 'stateName' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '180px' }
        ],
        url: '/costItems/list'
      },
      editDrawertitle: '编辑项目',
      operateType: 'add'
    }
  },
  mounted() {
    this.queryProjectList()
    this.queryEnumList()
    this.selectItemLabes()
  },
  created() {},
  methods: {
    //查询项目标签枚举
    selectItemLabes() {
      this.$http({
        url: this.$http.adornUrl('/common/getProjectLabel'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.itemLabels = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 查询枚举列表
    queryEnumList() {
      this.$http({
        url: this.$http.adornUrl('/common/getManager'),
        params: { pid: 4 },
        method: 'get'
      }).then(({ data }) => {
        if (data.success) {
          this.managerList = [...data.payload]
        } else {
          this.$message.error(data.msg)
        }
      })
      this.$http({
        url: this.$http.adornUrl('/common/getTeam'),
        method: 'get'
      }).then(({ data }) => {
        if (data.success) {
          this.teamList = [...data.payload]
        } else {
          this.$message.error(data.msg)
        }
      })
      this.$http({
        url: this.$http.adornUrl('/projectSet/projectSetPage'),
        method: 'get',
        params: { curPage: 1, pageSize: 500 }
      }).then(({ data }) => {
        if (data.success) {
          this.psList = [...data.payload.list]
        } else {
          this.$message.error(data.msg)
        }
      })
      this.$http({
        url: this.$http.adornUrl('/common/getDept'),
        method: 'get'
      }).then(({ data }) => {
        if (data.success) {
          this.deptList = [...data.payload.filter((item) => item.id !== 0)]
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 查询项目列表
    queryProjectList() {
      this.$refs.projectTable.refresh(this.translateQueryParams())
    },

    // 获取查询参数
    translateQueryParams() {
      let params = JSON.parse(JSON.stringify(this.projectConfigFormData))
      if (ArrUtil.isNotEmpty(params.approvalDate)) {
        params.approvalDateStart = params.approvalDate[0]
        params.approvalDateEnd = params.approvalDate[1]
      }
      if (ArrUtil.isNotEmpty(params.deliveryDate)) {
        params.deliveryDateStart = params.deliveryDate[0]
        params.deliveryDateEnd = params.deliveryDate[1]
      }
      ArrUtil.changeDataAllArrEntriesToStr(params)
      return params
    },

    // 重置查询条件
    resetForm() {
      this.$refs.projectConfigForm.resetFields()
    },

    // 批量下载
    batchDownload() {
      let params = JSON.parse(JSON.stringify(this.projectConfigFormData))
      if (ArrUtil.isNotEmpty(params.approvalDate)) {
        params.approvalDateStart = params.approvalDate[0]
        params.approvalDateEnd = params.approvalDate[1]
      }
      if (ArrUtil.isNotEmpty(params.deliveryDate)) {
        params.deliveryDateStart = params.deliveryDate[0]
        params.deliveryDateEnd = params.deliveryDate[1]
      }
      let data = []
      const list = this.$refs.projectTable.getSelectRow()
      if (list.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      data = list.map((item) => item.id)
      this.$http.downloadPost(this.$http.adornUrl('/costItems/export'), { ids: data }, this)
    },

    // 新建项目
    addProjectInfo() {
      this.editDrawertitle = '新建项目'
      this.operateType = 'add'
      this.editProjectInfo({ operateType: 'add' })
    },

    // 点击抽屉外区域时
    // beforeCloseEditProjectDrawer(done) {
    //   this.$confirm('确认关闭？')
    //     .then((_) => {
    //       done()
    //     })
    //     .catch((_) => {})
    // },

    // 表格勾选时
    onSelectTableItem(selection) {
      if (selection.length > 0) {
        this.chooseStr = '已选中' + selection.length + '项'
      } else {
        this.chooseStr = '已选中 0 项'
      }
    },

    // 编辑人员信息
    editPersonnelInfo(row) {
      this.$refs.personnelManagementDialog.show()
      this.$nextTick(() => {
        this.$refs.personnelManagement.initPersonnelList(row)
      })
    },

    // 修改项目信息
    updateProjectInfo(row) {
      this.editDrawertitle = '编辑项目'
      this.operateType = 'update'
      this.editProjectInfo({ rowData: row })
    },

    // 编辑项目信息
    editProjectInfo(initData) {
      this.$refs.editProjectInfoDrawer.show()
      this.$nextTick(() => {
        initData.operateType = this.operateType
        initData.deptList = this.deptList.filter((item) => item.id !== '')
        initData.teamList = this.teamList.filter((item) => item.id !== '')
        initData.psList = this.psList.filter((item) => item.id !== '')
        initData.managerList = this.managerList.filter((item) => item.id !== '')
        initData.contractTypeList = ProjectConstants.contractType
        initData.itemLabels = this.itemLabels
        this.$refs.editProjectInfo.init(initData)
      })
    },

    // 关闭编辑项目信息抽屉
    closeEditProjectInfoDrawer(refreshFlag = true) {
      this.$refs.editProjectInfoDrawer.hide()
      if (refreshFlag) {
        this.queryProjectList()
      }
    },

    // 删除选中项目/当前项目
    deleteProjectInfo(row) {
      let message = ''
      let data = []
      if (row) {
        // 删除单条数据时
        data = [row.id]
        switch (row.state) {
          case 0:
            message = '该项目正在交付中,您确定删除吗?'
            break
          case 1:
            message = '该项目已交付,您确定删除吗?'
            break
          case 2:
            message = '该项目已关闭,您确定删除吗?'
            break
          case 3:
            message = '该项目已回款,您确定删除吗?'
            break
          default:
            message = '您确定删除该项目吗?'
        }
      } else {
        // 批量删除时
        const list = this.$refs.projectTable.getSelectRow()
        if (list.length === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        message = '已选中' + list.length + '个项目，确认批量删除吗？'
        data = list.map((item) => item.id)
      }

      // 弹出提示框
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/costItems/batchDelete'),
            method: 'post',
            data: data
          }).then(({ data }) => {
            if (data.success) {
              this.$message.success('删除成功')
              this.queryProjectList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
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
  height: 30px;
  line-height: 30px;
  margin: 10px auto;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
}

.chooseResultStr {
  margin-left: 10px;
}

.el-button {
  margin-left: 0;
  width: auto;
}
</style>
