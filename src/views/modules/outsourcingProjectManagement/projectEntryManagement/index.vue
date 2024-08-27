<template>
  <div>
    <el-container>
      <el-header style="height: auto">
        <el-form :inline="true" label-width="auto" label-position="right" :model="dataForm" ref="dataForm">
          <el-form-item label="学历:" prop="education">
            <el-input v-model="dataForm.education" placeholder="请输入学历" clearable></el-input>
          </el-form-item>
          <el-form-item label="专业:" prop="speciality">
            <el-input v-model="dataForm.speciality" placeholder="请输入专业" clearable></el-input>
          </el-form-item>
          <el-form-item label="工龄:" prop="seniorityIds">
            <el-select v-model="dataForm.seniorityIds" multiple placeholder="请选择工龄" clearable>
              <el-option v-for="item in seniorities" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="司龄:" prop="siLingIds">
            <el-select v-model="dataForm.siLingIds" multiple placeholder="请选择司龄" clearable>
              <el-option v-for="item in siLings" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属部门:" prop="deptIds">
            <el-select v-model="dataForm.deptIds" multiple placeholder="请选择归属部门" clearable>
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <div v-if="showFlag" style="display: contents">
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder="请输入工号" clearable />
            </el-form-item>
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item label="毕业时间:" prop="graduationDate">
              <el-date-picker
                style="width: 200px"
                v-model="dataForm.graduationDate"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              />
            </el-form-item>
            <el-form-item label="入职时间:" prop="entryTime">
              <el-date-picker
                style="width: 200px"
                v-model="dataForm.entryTime"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              />
            </el-form-item>
            <el-form-item label="不看所选项目:" prop="chooseProject">
              <el-select v-model="dataForm.chooseProject" multiple placeholder="请选择项目" clearable>
                <el-option v-for="item in chooseProjectList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
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
      </el-header>
      <div class="chooseResult">
        <span>已选中 {{ count }} 项</span>
      </div>
      <div class="operate-button">
        <el-button class="btn-download" icon="el-icon-download" type="primary" @click="download()">批量下载</el-button>
      </div>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @selectData="selectData">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="新建" placement="bottom">
              <svg-icon :icon-class="'add-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="addProject(row.item)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="全部记录" placement="bottom">
              <svg-icon :icon-class="'detials-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="recordAll(row.item)" />
            </el-tooltip>
          </template>
        </template>
      </baseTable>
    </el-container>
    <!-- 添加入场项目 -->
    <base-dialog ref="addProjectDialog" :title="title" :width="'500px'">
      <template>
        <addProject @selectTableData="refresh" ref="addProject"></addProject>
      </template>
    </base-dialog>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addProject from '@/views/modules/outsourcingProjectManagement/projectEntryManagement/addProject.vue'
export default {
  components: {
    baseTable,
    baseDialog,
    addProject
  },
  data() {
    return {
      title: '添加',
      showFlag: false,
      count: 0,
      //选中的数据
      checkedIds: [],
      dataForm: {
        //学历
        education: '',
        //专业
        speciality: '',
        //工龄
        seniorityIds: [],
        //司龄
        siLingIds: [],
        //部门
        deptIds: [],
        //工号
        empId: '',
        //姓名
        name: '',
        //毕业时间
        graduationDate: [],
        //入职时间
        entryTime: [],
        //不看所选项目
        chooseProject: []
      },
      seniorities: [],
      siLings: [],
      deptList: [],
      chooseProjectList: [],
      tableData: {
        theads: [
          { label: '工号', prop: 'empId' },
          { label: '姓名', prop: 'name' },
          { label: '专业', prop: 'speciality' },
          { label: '学历', prop: 'education' },
          { label: '毕业日期', prop: 'graduationDate' },
          { label: '工龄', prop: 'seniority' },
          { label: '入职日期', prop: 'entryTime' },
          { label: '司龄', prop: 'siLing' },
          { label: '部门', prop: 'deptName' },
          { label: '在离职状态', prop: 'status' },
          { label: '入场外协项目', prop: 'projectList' },
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
    //查询表格
    refresh() {
      this.$refs.table.refresh(this.dataConversion(this.dataForm))
    },

    //查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.graduationDate.length > 0) {
        params.graduationStartDate = params.graduationDate[0]
        params.graduationEndDate = params.graduationDate[1]
      }
      if (params.entryTime.length > 0) {
        params.entryStartDate = params.entryTime[0]
        params.entryEndDate = params.entryTime[1]
      }
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].toString()
        }
      })
      delete params.graduationDate
      delete params.entryTime
      return params
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
    //添加项目
    addProject(row) {
      this.title = '添加'
      this.$refs.addProjectDialog.show(row)
    },
    //全部记录
    recordAll(row) {}
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
