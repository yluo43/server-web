<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%; border: 1px solid #eee">
      <el-header style="height: auto">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入关键字" clearable></el-input>
          </el-form-item>
          <el-form-item label="归属团队:">
            <el-select v-model="teamIdList" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目经理:">
            <el-select v-model="managerIdList" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in managerList"
                         :key="item.id"
                         :label='item.name+"("+item.id+")"'
                         :value="item.id">

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="立项时间:">
            <el-date-picker
              v-model="approvalDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型:">
            <el-select v-model="contractTypeList" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in contractTypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="stateList" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属项目集:">
            <el-select v-model="psIdsList" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in psIdOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属部门:">
            <el-select v-model="deptIdList" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算周期:">
            <el-select v-model="settlementCyclesList" multiple collapse-tags placeholder="请选择">
              <el-option v-for="item in 12" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交付时间:">
            <el-date-picker
              v-model="deliveryDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            ></el-date-picker>
          </el-form-item>
          <div style="display: contents; float: right">
            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
            <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
          </div>
        </el-form>
      </el-header>
      <el-main>
        <baseTable :tableData="tableData" ref="table" :multiSelect="true">
          <template v-slot:clientType="row">
            <!--类型插槽-->
            <template>
              <el-tooltip class="item" effect="dark" content="订单提交" placement="bottom" v-auth="'costItems:order'">
                <i class="el-icon-document" style="font-size: 1.5em; margin-right: 1em" @click="add(row)"></i>
              </el-tooltip>
            </template>
          </template>
        </baseTable>
      </el-main>
    </el-container>
    <base-dialog :title="title" ref="addOrUpdateDrawer">
      <template>
        <addOrUpdate @refreshDataList="refresh" ref="addOrUpdate"></addOrUpdate>
      </template>
    </base-dialog>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog.vue'
import addOrUpdate from './addOrUpdata.vue'

export default {
  data() {
    return {
      title: '',
      managerIdList: [],
      deptIdList: [],
      teamIdList: [],
      approvalDate: [],
      deliveryDate: [],
      contractTypeList: [],
      psIdsList: [],
      settlementCyclesList: [],
      stateList: [],
      dataForm: {
        psName: '',
        psId: '',
        managerIds: '',
        deptIds: '',
        teamIds: '',
        psIds: '',
        settlementCycles: '',
        contractTypes: '',
        approvalDateStart: '',
        approvalDateEnd: '',
        deliveryDateStart: '',
        deliveryDateEnd: '',
        states: '',
        projectTypes: 0
      },
      tableData: {
        theads: [
          { label: '项目名称', prop: 'name', width: '100px' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '归属项目集', prop: 'psName' },
          { label: '项目经理', prop: 'mannagerName' },
          { label: '合同类型', prop: 'contractTypeName' },
          { label: '结算周期', prop: 'settlementCycle' },
          { label: '合同金额（元）', prop: 'contractAmount' },
          { label: '订单金额（元）', prop: 'orderAmount' },
          { label: '结算金额（元）', prop: 'settlementAmount' },
          { label: '回款金额（元）', prop: 'returnAmount' },
          { label: '状态', prop: 'stateName' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '80px' }
        ],
        url: '/costItems/list'
      },
      managerList: [],
      deptList: [],
      teamList: [],
      psIdOptions: [],
      settlementCyclesOptions: [],
      contractTypeOptions: [
        {
          id: 0,
          name: '自研-单价'
        },
        {
          id: 1,
          name: '自研-总价'
        },
        {
          id: 2,
          name: '外协-单价'
        }
      ],
      stateOptions: [
        { value: 0, label: '交付中' },
        { value: 1, label: '已交付' },
        { value: 2, label: '关闭' },
        { value: 3, label: '已回款' }
      ]
    }
  },
  components: {
    baseTable,
    addOrUpdate,
    baseDialog
  },
  watch: {
    deptIdList(newName, oldName) {
      if (newName) {
        this.dataForm.deptIds = newName.join(',')
      }
    },
    managerIdList(newName, oldName) {
      if (typeof newName === 'number') {
        this.dataForm.managerIds = newName.toString()
      } else if (newName) {
        this.dataForm.managerIds = newName.join(',')
      }
    },
    teamIdList(newName, oldName) {
      if (newName) {
        this.dataForm.teamIds = Object(newName).join(',')
      }
    },
    approvalDate(newName, oldName) {
      this.dataForm.approvalDateStart = newName[0]
      this.dataForm.approvalDateEnd = newName[1]
    },
    deliveryDate(newName, oldName) {
      this.dataForm.deliveryDateStart = newName[0]
      this.dataForm.deliveryDateEnd = newName[1]
    },
    contractTypeList(newName, oldName) {
      this.dataForm.contractTypes = newName.join(',')
    },
    stateList(newName, oldName) {
      this.dataForm.states = newName.join(',')
    },
    psIdsList(newName, oldName) {
      this.dataForm.psIds = newName.join(',')
    },
    settlementCyclesList(newName, oldName) {
      if (typeof newName === 'number') {
        this.dataForm.settlementCycles = newName.toString()
      } else if (newName) {
        this.dataForm.settlementCycles = newName.join(',')
      }
    }
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    this.$http({
      url: this.$http.adornUrl('/common/getManagerUp'),
      params: { pid: 4 },
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.managerList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    this.$http({
      url: this.$http.adornUrl('/common/getDept'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.deptList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
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
    this.$http({
      url: this.$http.adornUrl('/common/getProjectSet'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.psIdOptions = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },
    add(row) {
      this.title = '项目订单'
      this.$refs.addOrUpdateDrawer.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row.item)
      })
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
      this.managerIdList = []
      this.deptIdList = []
      this.teamIdList = []
      this.approvalDate = []
      this.contractTypeList = []
      this.stateList = []
      this.deliveryDate = []
      this.settlementCyclesList = []
      this.psIdsList = []
    }
  }
}
</script>
<style scoped>
.el-button {
  margin-left: 0;
  width: auto;
}

.el-icon-document:hover,
.el-icon-circle-plus:hover {
  cursor: pointer;
  /* 添加其他想要的样式 */
}
</style>
