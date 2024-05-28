<template>
  <div class="container-box">
    <el-container>
      <div class="header-box">
        <div class="header-title">人员信息</div>
        <i class="el-icon-close" @click="handlerFlag"></i>
      </div>
      <el-header style="height: auto; padding: 0">
        <el-descriptions>
          <template v-slot:title>
            <div style="display: flex; align-items: center; padding: 16px 0 0 20px">
              <div class="circular"></div>
              <span class="title">{{ projectInfo.name }}</span>
            </div>
          </template>
          <el-descriptions-item label="项目编码">{{ projectInfo.projectId }}</el-descriptions-item>
          <el-descriptions-item label="项目经理">{{ projectInfo.managerName }}</el-descriptions-item>
          <el-descriptions-item label="立项时间">{{ projectInfo.approvalDate }}</el-descriptions-item>
          <el-descriptions-item label="合同类型">{{ projectInfo.contractTypeName }}</el-descriptions-item>
          <el-descriptions-item label="参与人数">{{ projectInfo.personnelCount }}</el-descriptions-item>
          <el-descriptions-item label="计划交付时间">{{ projectInfo.deliveryDate }}</el-descriptions-item>
          <el-descriptions-item label="项目状态">
            <div style="width: 80%">
              <el-steps :active="activeIndex" finish-status="success">
                <el-step v-for="item in stepTitleList" :key="item.id" :title="item.name"></el-step>
              </el-steps>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-form
          style="padding-left: 42px"
          ref="personnelManagementForm"
          :inline="true"
          label-width="82px"
          label-position="right"
          :model="personnelManagementFormData"
        >
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="personnelManagementFormData.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="工号:" prop="empId">
            <el-input v-model="personnelManagementFormData.empId" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder="请输入工号" clearable />
          </el-form-item>
          <el-form-item label="归属团队:" prop="teamIds">
            <el-select v-model="personnelManagementFormData.teamIds" multiple collapse-tags placeholder="请选择归属团队" clearable>
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="驻地:" prop="stationIds">
            <el-select v-model="personnelManagementFormData.stationIds" placeholder="请选择驻地" multiple collapse-tags clearable>
              <el-option v-for="item in stationList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="states">
            <el-select v-model="personnelManagementFormData.states" placeholder="请选择状态" multiple collapse-tags clearable>
              <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="技术级别:" prop="empLevels">
            <el-select v-model="personnelManagementFormData.empLevels" placeholder="请选择技术级别" multiple collapse-tags clearable>
              <el-option v-for="item in empLevelList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位类型:" prop="positionTypes">
            <el-select v-model="personnelManagementFormData.positionTypes" placeholder="请选择岗位类型" multiple collapse-tags clearable>
              <el-option v-for="item in positionTypeList" :key="item.id" :label="item.positionName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始支撑时间:" prop="supportDate">
            <el-date-picker
              style="width: 200px"
              v-model="personnelManagementFormData.supportDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
              clearable
            />
          </el-form-item>
          <el-form-item label="结束支撑时间:" prop="endSupportDate">
            <el-date-picker
              style="width: 200px"
              v-model="personnelManagementFormData.endSupportDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="queryPersonnelList">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>

      <el-main style="padding: 0 20px 20px 20px">
        <div class="chooseResult">
          <span v-text="chooseStr" />
          <el-button type="text" @click="deletePersonnelInfo()">批量删除</el-button>
          <!-- <span style="color: blue; margin-left: 50px" @click="deletePersonnelInfo()">批量删除</span> -->
        </div>

        <!-- toolBar -->
        <div class="operate-button">
          <el-button class="btn-download" type="primary" icon="el-icon-download" @click="batchDownload">批量下载</el-button>
          <el-button class="btn-download" type="primary" icon="el-icon-circle-plus-outline" @click="addPersonnelInfo">添加人员</el-button>
        </div>
        <!-- @select="onSelectTableItem" -->
        <baseTable ref="personnelManagementTable" :table-data="personnelManagementTableData" :multi-select="true" @selectData="selectData">
          <template v-slot:clientType1="row">
            <!--类型插槽-->
            <template>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="updatePersonnelInfo(row.item)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em" @click="deletePersonnelInfo(row.item)" />
              </el-tooltip>
              <!-- <el-link type="primary" style="margin-left: 10px" icon="el-icon-edit" @click="updatePersonnelInfo(row.item)">编辑</el-link>
              <el-link type="primary" style="margin-left: 10px" @click="deletePersonnelInfo(row.item)">删除</el-link> -->
            </template>
          </template>
        </baseTable>
      </el-main>
      <div class="bottom-btn">
        <el-button type="primary" style="margin-right: 10px" @click="handlerFlag">确定</el-button>
        <el-button @click="handlerFlag">取消</el-button>
      </div>
    </el-container>

    <base-dialog ref="editPersonnelInfoDialog" :title="personnelInfoDialogTitle" :width="'500px'">
      <template>
        <edit-personnel-info ref="editPersonnelInfo" @closeDialog="closeEditPersonnelInfoDialog"></edit-personnel-info>
      </template>
    </base-dialog>
  </div>
</template>

<script>
//import baseTable from '@/views/modules/base/baseTable.vue'
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import editPersonnelInfo from '@/views/modules/projectManagement/projectConfig/editPersonnelInfo.vue'
import * as ArrUtil from '@/views/modules/common/arrUtil'
import * as ProjectConstants from '@/views/modules/projectManagement/projectConstants'
import baseDialog from '@/views/modules/base/baseDialog.vue'

export default {
  components: { baseDialog, baseTable, editPersonnelInfo },
  props: {},
  data() {
    return {
      operateType: 'add',
      personnelInfoDialogTitle: '',
      chooseStr: '已选中 0 项',
      projectInfo: {
        name: '',
        projectId: '',
        projectType: '',
        state: '',
        mannagerName: '',
        approvalDate: '',
        contractTypeName: '',
        personnelCount: '',
        deliveryDate: ''
      },
      activeIndex: 0,
      stepTitleList: [],
      personnelManagementFormData: {
        projectId: '',
        name: '',
        empId: '',
        teamIds: [],
        stationIds: [],
        states: [],
        empLevels: [],
        positionTypes: [],
        supportDate: '',
        endSupportDate: ''
      },
      teamList: [],
      stationList: [],
      stateList: [...ProjectConstants.personnelState],
      empLevelList: [...ProjectConstants.empLevel],
      //  positionTypeList: [...ProjectConstants.positionType],
      positionTypeList: [],
      personnelManagementTableData: {
        theads: [
          { label: '姓名', prop: 'name' },
          { label: '工号', prop: 'empId' },
          { label: '邮箱', prop: 'mailbox' },
          { label: '驻地', prop: 'stationName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '技术级别', prop: 'empLevel' },
          { label: '岗位类型', prop: 'positionTypeName' },
          { label: '开始支撑时间', prop: 'supportDate', width: '100px' },
          { label: '结束支撑时间', prop: 'endSupportDate', width: '100px' },
          { label: '投入占比(%)', prop: 'investRate' },
          { label: '状态', prop: 'stateName', width: '100px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType1', width: '130px', fixed: 'right' }
        ],
        url: '/costItems/member/page'
      },
      checkData: []
    }
  },
  computed: {},
  mounted() {
    //获取岗位类型
    this.getPosition()
  },
  created() {},
  methods: {
    //获取岗位类型
    getPosition() {
      this.$http({
        url: this.$http.adornUrl('/common/getPosition'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.positionTypeList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //返回上一级页面
    handlerFlag() {
      this.$emit('changeFlag', true)
    },
    // 初始化
    initPersonnelList(initData) {
      this.personnelManagementFormData.projectId = initData.id
      Object.assign(this.projectInfo, initData)
      this.stepTitleList = JSON.parse(JSON.stringify(ProjectConstants.stateName))
      if (this.projectInfo.projectType === 1) {
        this.stepTitleList.splice(2, 1)
      }
      if (this.projectInfo.state === 2) {
        this.activeIndex = this.stepTitleList.length
      } else {
        this.activeIndex = this.stepTitleList.findIndex((item) => item.id === Number(this.projectInfo.state))
      }

      this.queryEnumList()
      this.queryPersonnelList()
    },

    // 查询相关枚举列表
    queryEnumList() {
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
        url: this.$http.adornUrl('/common/getStation'),
        method: 'get'
      }).then(({ data }) => {
        if (data.success) {
          this.stationList = [...data.payload]
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 查询列表信息
    queryPersonnelList() {
      let params = JSON.parse(JSON.stringify(this.personnelManagementFormData))
      if (ArrUtil.isNotEmpty(params.supportDate)) {
        params.supportDateStart = params.supportDate[0]
        params.supportDateEnd = params.supportDate[1]
      }
      if (ArrUtil.isNotEmpty(params.endSupportDate)) {
        params.endSupportDateStart = params.endSupportDate[0]
        params.endSupportDateEnd = params.endSupportDate[1]
      }
      ArrUtil.changeDataAllArrEntriesToStr(params)
      this.$refs.personnelManagementTable.refresh(params)
      this.getTableTotalCount()
    },

    // 重置查询条件
    resetForm() {
      this.$refs.personnelManagementForm.resetFields()
    },

    // 打开添加弹窗
    addPersonnelInfo() {
      this.personnelInfoDialogTitle = '添加人员'
      this.operateType = 'add'
      this.editPersonnelInfo()
    },

    // 批量下载
    batchDownload() {
      let params = JSON.parse(JSON.stringify(this.personnelManagementFormData))
      if (ArrUtil.isNotEmpty(params.supportDate)) {
        params.supportDateStart = params.supportDate[0]
        params.supportDateEnd = params.supportDate[1]
      }
      if (ArrUtil.isNotEmpty(params.endSupportDate)) {
        params.endSupportDateStart = params.endSupportDate[0]
        params.endSupportDateEnd = params.endSupportDate[1]
      }
      let data = []
      // const list = this.$refs.personnelManagementTable.getSelectRow()
      const list = this.checkData
      if (list.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      data = list.map((item) => item.id)
      this.$http.downloadPost(this.$http.adornUrl('/costItems/member/export'), { ids: data }, this)
    },

    // 表格勾选时
    // onSelectTableItem(selection) {
    //   if (selection.length > 0) {
    //     this.chooseStr = '已选中' + selection.length + '项'
    //   } else {
    //     this.chooseStr = '已选中 0 项'
    //   }
    // },
    selectData(selection) {
      if (selection.length > 0) {
        this.chooseStr = '已选中 ' + selection.length + ' 项'
      } else {
        this.chooseStr = '已选中 0 项'
      }
      this.checkData = [...selection]
    },
    // 查询总数
    // getTableTotalCount() {
    //   this.$http({
    //     url: this.$http.adornUrl('/costItems/member/page'),
    //     method: 'get',
    //     params: this.$http.adornParams({ projectId: this.personnelManagementFormData.projectId })
    //   }).then(({ data }) => {
    //     if (data.success) {
    //       this.projectInfo.personnelCount = data.payload.totalCount
    //     } else {
    //       this.$message.error('获取项目参与人数失败，请刷新后重试')
    //     }
    //   })
    // },
    getTableTotalCount() {
      this.$http({
        url: this.$http.adornUrl('/costItems/member/memberCount'),
        method: 'get',
        params: this.$http.adornParams({ projectId: this.personnelManagementFormData.projectId })
      }).then(({ data }) => {
        if (data.success) {
          this.projectInfo.personnelCount = data.payload.memberCount
        } else {
          this.$message.error('获取项目参与人数失败，请刷新后重试')
        }
      })
    },

    // 修改人员信息
    updatePersonnelInfo(row) {
      this.personnelInfoDialogTitle = '编辑'
      this.operateType = 'update'
      this.editPersonnelInfo({ rowData: row })
    },

    // 打开编辑人员弹窗
    editPersonnelInfo(initData = {}) {
      this.$refs.editPersonnelInfoDialog.show()
      this.$nextTick(() => {
        initData.operateType = this.operateType
        initData.projectId = this.personnelManagementFormData.projectId
        this.$refs.editPersonnelInfo.initPersonnelInfo(initData)
      })
    },

    // 关闭编辑人员弹窗
    closeEditPersonnelInfoDialog() {
      this.$refs.editPersonnelInfoDialog.hide()
      this.queryPersonnelList()
      //  this.getTableTotalCount()
    },

    // 删除所选人员-单条/批量
    deletePersonnelInfo(row) {
      let message = ''
      let data = []
      if (row) {
        // 删除单条数据时
        data = [row.id]
        let supportState = ''
        switch (row.state) {
          case 1:
            supportState = '正在支撑中'
            break
          case 2:
            supportState = '待开始支撑'
            break
          case 3:
            supportState = '已结束支撑'
            break
        }
        message = `"${row.name}"${supportState},确定删除吗?删除后将无法恢复!`
      } else {
        // 批量删除时
        // const list = this.$refs.personnelManagementTable.getSelectRow()
        const list = this.checkData
        if (list.length === 0) {
          this.$message.warning('请至少选择一条数据!')
          return
        }
        message = '已选中' + list.length + '个人员，确认批量删除吗？'
        data = list.map((item) => item.id)
      }

      // 弹出提示框
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/costItems/member/delete'),
            method: 'post',
            data: data
          }).then(({ data }) => {
            if (data.success) {
              this.$message.success('删除成功')
              this.queryPersonnelList()
              //this.getTableTotalCount()
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

<style lang="scss" scoped>
.container-box {
  height: 100%;
  background: white;
  .header-box {
    height: 60px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0f1f3;
    .header-title {
      font-size: 16px;
    }
  }
  .circular {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(311deg, #3d6ce1 0%, #4d82ff 100%);
  }
  .bottom-btn {
    height: 60px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1);
  }
}
.title {
  /* color: #409eff;*/ /* 设置标题字体颜色为蓝色 */
  font-size: 20px;
  margin-left: 10px;
}
::v-deep .el-descriptions__body {
  padding-left: 42px;
}
::v-deep .is-success {
  .el-step__line {
    background-color: #2462f9;
  }
}
::v-deep .el-step__head.is-success {
  color: #2462f9;
  border-color: #2462f9;
}
::v-deep .el-step__title.is-success {
  color: #262b39;
}
::v-deep .el-step__title.is-process {
  color: #2462f9;
}
::v-deep .el-step__head.is-process {
  color: #2462f9;
  border-color: #2462f9;
}
::v-deep .el-step__head.is-process .el-step__icon.is-text {
  border-color: #2462f9;
  background: #2462f9;
  color: white;
}

::v-deep .el-descriptions-item__label {
  color: #4e5969;
  font-size: 14px;
  /*color: #409eff; */ /* 设置描述项label字体颜色为绿色 */
}

.el-input {
  width: 200px;
}
</style>
