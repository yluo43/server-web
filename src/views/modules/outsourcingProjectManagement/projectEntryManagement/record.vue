<template>
  <div class="container">
    <el-button @click="back">返回</el-button>
    <div class="main-box">
      <el-header class="projectName-header">基本信息</el-header>
      <el-form ref="projectForm" class="form-info" :inline="true" :model="baseData" label-width="100px">
        <el-form-item label="工号:" prop="empId">
          {{ baseData.empId }}
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          {{ baseData.name }}
        </el-form-item>
        <el-form-item label="专业:" prop="major">
          {{ baseData.major }}
        </el-form-item>
        <el-form-item label="毕业时间:" prop="graduateDate">
          {{ baseData.graduateDate }}
        </el-form-item>
        <el-form-item label="司龄:" prop="departAge">
          {{ baseData.departAge }}
        </el-form-item>
        <el-form-item label="工龄:" prop="jobAge">
          {{ baseData.jobAge }}
        </el-form-item>
        <el-form-item label="入职日期:" prop="entryTime">
          {{ baseData.entryTime }}
        </el-form-item>
        <el-form-item label="部门:" prop="department">
          {{ baseData.department }}
        </el-form-item>
        <el-form-item label="在离职状态" prop="departStatusName">
          {{ baseData.departStatusName }}
        </el-form-item>
      </el-form>
    </div>
    <div class="main-box">
      <el-header class="projectName-header">入离场记录</el-header>
      <el-form
        ref="entryPersonnelForm"
        class="form-info"
        :inline="true"
        label-width="auto"
        label-position="left"
        :model="queryParams"
      >
        <el-form-item label="项目名称:" prop="projectName">
          <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目经理:" prop="managerName">
          <el-input v-model="queryParams.managerName" placeholder="请输入项目经理" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目客户:" prop="relCustomers">
          <el-select v-model="queryParams.relCustomers" multiple placeholder="请选择项目客户" clearable>
            <el-option v-for="item in customerNames" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户所属集团:" prop="relBelongGroups">
          <el-select v-model="queryParams.relBelongGroups" multiple placeholder="请选择客户所属集团" clearable>
            <el-option v-for="item in membershipGroups" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <div v-if="showFlag" style="display: contents">
          <el-form-item label="状态:" prop="entryIs">
            <el-select v-model="queryParams.entryIs" placeholder="请选择状态" clearable>
              <el-option  key="" label="全部" value="" />
              <el-option  key="0" label="离场" value="0" />
              <el-option  key="1" label="在场" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="入场标记:" prop="entryMark">
            <el-select v-model="queryParams.entryMark" placeholder="请选择入场标记" clearable>
              <el-option v-for="item in entryMarks" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入场时间:" prop="entryTime">
            <el-date-picker
              v-model="entryTime"
              style="width: 200px"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            />
          </el-form-item>
          <el-form-item label="离场时间:" prop="planExitTime">
            <el-date-picker
              v-model="planExitTime"
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
              style="height: 1.3em; width: 1.3em; position: relative; top: 3px"
            />
            <span v-if="showFlag" class="btn-font-size" style="color: #2462f9">收起</span>
            <span v-else class="btn-font-size" style="color: #2462f9">展开</span>
          </div>
          <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="refreshTable()">查询
          </el-button>
          <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 16px">
        <el-button
          v-auth="'costItems:export'"
          class="btn-download"
          type="primary"
          icon="el-icon-download"
          @click="batchDownload"
        >批量下载
        </el-button>
      </div>
      <baseTable ref="table" :table-data="tableData" :multi-select="true" @selectData="selectData">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-button type="text" @click="departure(row.item)">离场</el-button>

          </template>
        </template>

        <template v-slot:entryMark="row">
          <div :class="row.item.entryMark===0?'ownBar':'notOwnBar'">
            {{ row.item.entryMark === 0 ? '真实入场' : '虚拟入场' }}
          </div>
        </template>
        <template v-slot:entryIsName="row">
          <!--类型插槽-->
          <template>
            <div v-if="row.item.entryIsName==='在场'" style="background-color: #E8FFEA ;color: #00B42A;display: flex">
              <div style="width: 5px;height: 5px;border-radius: 5px;background-color: #00B42A;margin-top: 8.5px;margin-right: 5px"/>
              <div>{{row.item.entryIsName}}</div>
            </div>
            <div v-else style="background-color: #FFF0ED ;color: #D54941;display: flex">
              <div style="width: 5px;height: 5px;border-radius: 5px;background-color: #D54941;margin-top: 8.5px;margin-right: 5px"/>
              <div>{{row.item.entryIsName}}</div>
            </div>
          </template>
        </template>
      </baseTable>

    </div>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'

export default {
  components: { baseTable },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      count: 0,
      checkedIds: [],
      entryPersonnelForm: {},
      entryMarks: [{ id: '', name: '全部' },{ id: 0, name: '真实入场' }, { id: 1, name: '虚拟入场' }],
      tableData: {
        theads: [
          { label: '项目名称', prop: 'projectName' },
          { label: '项目经理', prop: 'managerName' },
          { label: '项目客户', prop: 'customerName' },
          { label: '客户所属集团', prop: 'belongGroup' },
          { label: '入场日期', prop: 'entryTime' },
          { label: '入场标记', slotName: 'entryMark' },
          { label: '入场原因', prop: 'entryReason' },
          { label: '岗位', prop: 'postName' },
          { label: '级别', prop: 'postLevel' },
          { label: '离场日期', prop: 'exitTime' },
          { label: '离场原因', prop: 'exitReason' },
          { label: '状态', prop: 'entryIsName',slotName: 'entryIsName'},
        ],
        url: '/externalProject/listEntryExitRecord'
      },
      deptList: [],
      jobList: [],
      showFlag: false,
      entryTime: [],
      planExitTime: [],
      customers:[],
      customerNames: [],
      membershipGroups:[],
      queryParams: {
        projectName: '',
        managerName: '',
        relCustomers: [],
        relBelongGroups: [],
        entryIs: '',
        entryMark: ''
      },
      baseData: {
        empId: '',
        name: '',
        major: '',
        departAge: '',
        graduateDate: '',
        jobAge: '',
        entryTime: '',
        department: '',
        departStatusName: ''
      }
    }
  },

  mounted() {
    this.getDept()
    this.getCustomers()
  },
  methods: {
    refreshTable() {
      this.queryParams.empId = this.baseData.empId
      this.$refs.table.refresh(this.dataConversion(this.queryParams))
    },

    // 查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (this.planExitTime.length > 0) {
        params.exitTimeStart = this.planExitTime[0]
        params.exitTimeEnd = this.planExitTime[1]
      }
      if (this.entryTime.length > 0) {
        params.entryTimeStart = this.entryTime[0]
        params.entryTimeEnd = this.entryTime[1]
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
    selectTableData() {
      this.$nextTick(() => {
        this.$refs.table.refresh(this.queryParams)
      })
    },
    init(baseData) {
      this.baseData = baseData
      this.getJob()
      this.refreshTable()
    },

    getCustomers(){
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
    // 获取所属部门
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
    // 获取岗位信息
    getJob() {
      this.$http({
        url: this.$http.adornUrl('/externalProject/listProjectUnitPrice?projectId=' + this.baseData.id),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.jobList = data.payload.list
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 选中的数据
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
    batchDownload() {
      if (this.count === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      this.$http.downloadPost(this.$http.adornUrl('/externalProject/exportEntryExitRecord'), {ids: this.checkedIds}, this)
    },
    // 添加人员 跳转到外协项目入场管理页面
    addProjectInfo() {
      this.$router.push({
        path: '/projectEntryManagement?projectId=' + this.baseData.id
      })
    },
    // 离场
    departure(row) {
    },
    resetForm() {
      this.$refs.entryPersonnelForm.resetFields()
      this.queryParams.projectId = this.baseData.id
      this.planExitTime = []
      this.entryTime = []
    },
    back(){
      this.$emit('update:syncIsList', true);
    }
  }
}
</script>
<style scoped lang="scss">
.main-box {
  height: 100%;
  margin-top: 24px;
  background-color: white;
}

.ownBar {
  color: #666EE8;
  background-color: #F0F1FD;
}

.notOwnBar {
  color: #666EE8;
  background-color: #FBD4A1;
}

.left-right-header {
  height: 64px;
  padding: 0 24px 0 16px;
  display: flex;
  justify-content: space-between;

}

.header-title {
  font-size: 16px;
}

.projectName-header {
  padding: 24px;
  height: 80px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  font-weight: 650;
  font-style: normal;
  font-size: 20px;
}

.container {
  height: 100%;

  .form-info {
    padding: 20px 60px 20px 12px;
  }
}
</style>
