<template>
  <div class="container">
    <div v-if="activeName == 'first'" class="first-header">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="项目信息" name="first"></el-tab-pane>
        <el-tab-pane label="入场人员" name="second"></el-tab-pane>
        <el-tab-pane label="离场人员" name="third"></el-tab-pane>
        <el-tab-pane label="结算信息" name="fourth"></el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="second-header" :style="showFlag?'height:165px;':'height:124px;'">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
        <el-tab-pane label="项目信息" name="first"></el-tab-pane>
        <el-tab-pane label="入场人员" name="second"></el-tab-pane>
        <el-tab-pane label="离场人员" name="third"></el-tab-pane>
        <el-tab-pane label="结算信息" name="fourth"></el-tab-pane>
      </el-tabs>
      <div v-if="activeName == 'second' || activeName == 'third'" class="search-form">
        <el-form :inline="true" label-width="auto" label-position="left" :model="personnelDataForm" ref="entryPersonnelForm">
          <el-form-item label="工号:" prop="empId">
            <el-input v-model="personnelDataForm.empId" placeholder="请输入工号" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="personnelDataForm.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="归属部门:" prop="deptId">
            <el-select v-model="personnelDataForm.deptId" placeholder="请选择归属部门" clearable>
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位:" prop="jobId">
            <el-select v-model="personnelDataForm.jobId" placeholder="请选择岗位" clearable>
              <el-option v-for="item in jobList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <div v-if="showFlag" style="display: contents">
            <el-form-item label="级别:" prop="level">
              <el-select v-model="personnelDataForm.level"  placeholder="请选择级别" clearable>
                <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入场标记:" prop="entryMark">
              <el-select v-model="personnelDataForm.entryMark"  placeholder="请选择入场标记" clearable>
                <el-option v-for="item in entryMarks" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入场时间:" prop="entryTime">
              <el-date-picker
                style="width: 200px"
                v-model="personnelDataForm.entryTime"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              />
            </el-form-item>
            <el-form-item label="离场时间:" prop="departureTime">
              <el-date-picker
                style="width: 200px"
                v-model="personnelDataForm.departureTime"
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
          </el-form-item>
        </el-form>
        </el-form>
      </div>
    </div>
    <div v-if="activeName == 'first'" class="main">
      <projectInfo />
    </div>
    <div v-if="activeName == 'second'" class="main">
      <entryPersonnel ref="entryPersonnel" />
    </div>
    <div v-if="activeName == 'third'" class="main">
      <departurePersonnel ref="departurePersonnel" />
    </div>
    <div class="bottom-btn">
        <el-button type="primary" style="margin-right: 10px" @click="returnIndexPage">确定</el-button>
        <el-button @click="returnIndexPage">取消</el-button>
      </div>
  </div>
</template>
<script>
import projectInfo from './projectInfo'
import entryPersonnel from './entryPersonnel'
import departurePersonnel from './departurePersonnel'
export default {
  components: { projectInfo, entryPersonnel, departurePersonnel },
  data() {
    return {
      activeName: 'first',
      showFlag:false,
      personnelDataForm: {
        empId: '',
        name: '',
        deptId: '',
        jobId: '',
        level:'',
        entryMark:'',
        entryTime:[],
        departureTime:[]
      },
      deptList: [],
      jobList: [],
      levels:[],
      entryMarks:[]
    }
  },
  mounted() {
    this.getDept()
  },
  methods: {
     //初始化
    init(initData){
     
    },
    //返回主页面
    returnIndexPage() {
      this.$emit('changePageFlag',1)
    },
    //获取项目基本信息
    getProjectInfo(){

    },
    //获取所属部门
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
    //获取岗位信息
    getJob() {
      this.$http({
        url: this.$http.adornUrl(''),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.jobList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //查询列表数据
    searchTableData(activeName) {
      if (activeName == 'second') {
        this.$refs.entryPersonnel.refreshTable(this.personnelDataForm)
      } else if (activeName == 'third') {
        this.$refs.departurePersonnel.refreshTable(this.personnelDataForm)
      }
    },
    //tab切换
    tabClick() {
     if (this.activeName == 'second') {
      this.showFlag=false
      this.$nextTick(()=>{
        this.$refs.entryPersonnelForm.resetFields()
        this.$refs.entryPersonnel.refreshTable(this.personnelDataForm)
      })
      } else if (this.activeName == 'third') {
       this.showFlag=false
        this.$nextTick(()=>{
          this.$refs.entryPersonnelForm.resetFields()
          this.$refs.departurePersonnel.refreshTable(this.personnelDataForm)
        })
       
      }
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  .first-header {
    padding: 24px;
    height: 80px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
  }
  .second-header {
    padding: 24px 0 0 24px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
  }
  .search-form {
    margin-top: 20px;
  }
}
.el-input{
  width:200px;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border-bottom: none;
}
::v-deep .el-tabs--border-card {
  border: none;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  height: 32px;
  line-height: 22px;
}
.bottom-btn {
    height: 60px;
    padding-right: 20px;
    margin-top:20px;
    background:#fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1);
  }
</style>
