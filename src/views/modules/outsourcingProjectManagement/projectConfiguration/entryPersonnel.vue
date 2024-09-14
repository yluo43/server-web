<template>
  <div class="main-box">
    <el-form
      ref="entryPersonnelForm"
      :inline="true"
      label-width="auto"
      label-position="left"
      :model="queryParams"
    >
      <el-form-item label="工号:" prop="empId">
        <el-input v-model="queryParams.empId" placeholder="请输入工号" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="归属部门:" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择归属部门" clearable>
          <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位:" prop="postNameList">
        <el-select v-model="queryParams.postNameList" placeholder="请选择岗位" clearable multiple>
          <el-option v-for="item in jobList" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
      </el-form-item>
      <div v-if="showFlag" style="display: contents">
        <el-form-item label="级别:" prop="levelList">
          <el-select v-model="queryParams.levelList" placeholder="请选择岗位" clearable multiple>
            <el-option v-for="item in levelNameList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="入场标记:" prop="entryMark">
          <el-select v-model="queryParams.entryMark" placeholder="请选择入场标记" clearable>
            <el-option v-for="item in entryMarks" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入场日期:" prop="entryTime">
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
        <el-form-item v-if="isEntry" :label="'计划离场日期'" prop="planExitTime">
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
        <el-form-item v-if="!isEntry" :label="'离场日期:'" prop="planExitTime">
          <el-date-picker
              v-model="exitTime"
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
        <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="refresh()">查询
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
      <el-button
        v-if="isEntry"
        v-auth="'costItems:add'"
        class="btn-download"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="addProjectInfo"
      >添加人员
      </el-button>
    </div>
    <baseTable ref="table" :table-data="tableData" :multi-select="true" @selectData="selectData">
      <template  v-slot:clientType="row">
        <!--类型插槽-->
        <template>
          <el-button type="text" @click="departure(row.item)">离场</el-button>
        </template>
      </template>
      <template v-slot:departStatusName="row">
        <!--类型插槽-->
        <template>
          <div v-if="row.item.departStatusName==='在职'" style="background-color: #E8FFEA ;color: #00B42A;display: inline-block;width: 50px;">
            <div style="display:inline-block; width: 5px;height: 5px;border-radius: 50%;background-color: #00B42A;margin-right: 5px;vertical-align: middle;"/>
            <div style="display:inline-block; ">{{row.item.departStatusName}}</div>
          </div>
          <div v-else style="background-color: #FFF0ED ;color: #D54941;display: inline-block;width: 50px;">
            <div style="display:inline-block;width: 5px;height: 5px;border-radius: 50%;background-color: #D54941;margin-right: 5px;vertical-align: middle;"/>
            <div style="display:inline-block; ">{{row.item.departStatusName}}</div>
          </div>
        </template>
      </template>
      <template v-slot:entryMark="row">
        <div :class="row.item.entryMark===0?'ownBar':'notOwnBar'">
          {{ row.item.entryMark === 0 ? '真实入场' : '虚拟入场' }}
        </div>
      </template>
    </baseTable>
    <baseDialog ref="departureDialog" title="离场" width="500px">
      <template>
        <departure ref="departure" @refreshTableData="refresh"></departure>
      </template>
    </baseDialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import departure from './departure.vue'

export default {
  components: { baseTable, baseDialog, departure },
  props: {
    isEntry: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      count: 0,
      checkedIds: [],
      entryPersonnelForm: {},
      entryMarks: [{ id: 0, name: '真实入场' }, { id: 1, name: '虚拟入场' }],
      tableData: this.isEntry?{
        theads: [
          { label: '工号', prop: 'empId' },
          { label: '姓名', prop: 'name' },
          { label: '部门', prop: 'deptName' },
          { label: '岗位', prop: 'postName' },
          { label: '级别', prop: 'level' },
          { label: '入场日期', prop: 'entryTime' },
          { label: '计划离场日期', prop: 'planExitTime' },
          { label: '入场标记', slotName: 'entryMark' },
          { label: '入场原因', prop: 'entryReason' },
          { label: '在离职状态', prop: 'departStatusName',slotName: 'departStatusName'},
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: '/externalProject/listProjectEntryPage'
      } :{
        theads: [
          { label: '工号', prop: 'empId' },
          { label: '姓名', prop: 'name' },
          { label: '部门', prop: 'deptName' },
          { label: '岗位', prop: 'postName' },
          { label: '级别', prop: 'level' },
          { label: '入场日期', prop: 'entryTime' },
          { label: '入场标记', slotName: 'entryMark' },
          { label: '入场原因', prop: 'entryReason' },
          { label: '离场日期', prop: 'exitTime' },
          { label: '离场原因', prop: 'exitReason' },
          { label: '在离职状态', prop: 'departStatusName',slotName: 'departStatusName'}
        ],
        url: '/externalProject/listProjectExitPage'
      },
      deptList: [],
      jobList: [],
      levelNameList: [],
      showFlag: false,
      entryTime: [],
      planExitTime: [],
      exitTime: [],
      queryParams: {
        empId: '',
        name: '',
        deptId: '',
        postId: '',
        level: '',
        postNameList: [],
        levelList: [],
        entryMark: ''
      },
      initData: {}
    }
  },

  mounted() {
    this.getDept()
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(this.dataConversion(this.queryParams))
    },
    // 查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      params.projectId = this.initData.id
      params.entryIs = this.isEntry ? 1 : 0
      if (this.planExitTime.length > 0) {
        params.planExitTimeStart = this.planExitTime[0]
        params.planExitTimeEnd = this.planExitTime[1]
      }
      if (this.exitTime.length > 0) {
        params.exitTimeStart = this.exitTime[0]
        params.exitTimeEnd = this.exitTime[1]
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
    init(initData) {
      this.initData = initData
      this.getJob()
      this.refresh()
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
        url: this.$http.adornUrl('/externalProject/listProjectUnitPrice?projectId=' + this.initData.id),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.jobList = data.payload.list
          this.levelNameList = [...new Set(data.payload.list.map(item => item.level))];
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
      let data = { ...this.queryParams, ids: this.checkedIds }
      Object.keys(data).map((key) => {
        if (!data[key]) {
          delete data[key]
        }
      })
      this.$http.downloadPost(this.$http.adornUrl('/externalProject/'+(this.isEntry?'exportProjectEntry':'exportProjectExit')), this.$http.adornParams(data), this)
    },
    // 添加人员 跳转到外协项目入场管理页面
    addProjectInfo() {
      this.$router.push({
        path: '/projectEntryManagement?projectId=' + this.initData.id
      })
    },
    // 离场
    departure(row) {
      this.$refs.departureDialog.show()
      this.$nextTick(() => {
        this.$refs.departure.init(row)
      })
    },
    resetForm() {
      this.$refs.entryPersonnelForm.resetFields()
      this.queryParams.projectId = this.initData.id
      this.queryParams.entryIs = this.isEntry ? 1 : 0
      this.planExitTime = []
      this.entryTime = []
      this.exitTime = []
      this.refresh()
    }
  }
}
</script>
<style scoped lang="scss">
.main-box {
  height: 100%;
  margin-top: 24px;
}

.ownBar {
  color: #666EE8;
  background-color: #F0F1FD;
  display: inline-block;
  border-radius: 3px;
  width: 65px;
}

.notOwnBar {
  color: #666EE8;
  background-color: #FBD4A1;
  display: inline-block;
  border-radius: 3px;
  width: 65px;
}
</style>
