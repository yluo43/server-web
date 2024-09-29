<template>
  <div>
    <div v-show="isList && !isProject">
      <el-container>
        <el-header style="height: auto">
          <el-form ref="dataForm" :inline="true" label-width="auto" label-position="right" :model="dataForm">
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptId">
              <el-select v-model="dataForm.deptId" placeholder="请选择归属部门" clearable>
                <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="工龄:" prop="jobAge">
              <el-input
                ref="jobAgeStart"
                v-model="dataForm.jobAgeStart"
                style="width:50px;display: inline-block"
                @input="handleInput0"
              ></el-input>
              <span> - </span>
              <el-input
                ref="jobAgeEnd"
                v-model="dataForm.jobAgeEnd"
                style="width:50px; display: inline-block"
                @input="handleInput1"
              ></el-input>
            </el-form-item>
            <el-form-item label="在离职状态:" prop="departStatus">
              <el-select v-model="dataForm.departStatus" placeholder="请选择在离职状态" clearable>
                <el-option v-for="item in depart" :key="item.status" :label="item.name" :value="item.status" />
              </el-select>
            </el-form-item>
            <el-form-item label="入场项目:" prop="projectIds">
              <el-select v-model="dataForm.projectIds" multiple placeholder="请选择入场项目" clearable>
                <el-option v-for="item in chooseProjectList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>

            <div v-if="showFlag" style="display: contents">
              <el-form-item label="工号:" prop="empId">
                <el-input
                  v-model="dataForm.empId"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  placeholder="请输入工号"
                  clearable
                />
              </el-form-item>
              <el-form-item label="学历:" prop="education">
                <el-input v-model="dataForm.education" placeholder="请输入学历" clearable></el-input>
              </el-form-item>
              <el-form-item label="专业:" prop="speciality">
                <el-input v-model="dataForm.speciality" placeholder="请输入专业" clearable></el-input>
              </el-form-item>
              <el-form-item label="司龄:" prop="departAge">
                <el-input
                  ref="departAgeStart"
                  v-model="dataForm.departAgeStart"
                  style="width:50px;display: inline-block"
                  @input="handleInput2"
                ></el-input>
                <span> - </span>
                <el-input
                  ref="departAgeEnd"
                  v-model="dataForm.departAgeEnd"
                  style="width:50px; display: inline-block"
                  @input="handleInput3"
                ></el-input>
              </el-form-item>
              <el-form-item label="毕业时间:" prop="graduationDate">
                <el-date-picker
                  v-model="dataForm.graduationDate"
                  style="width: 200px"
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
                  v-model="dataForm.entryTime"
                  style="width: 200px"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="年/月/日"
                  end-placeholder="年/月/日"
                />
              </el-form-item>
              <el-form-item label="不看所选项目:" prop="unProjectIds">
                <el-select v-model="dataForm.unProjectIds" multiple placeholder="请选择项目" clearable>
                  <el-option v-for="item in chooseProjectList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
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
        </el-header>
        <div class="chooseResult">
          <span>已选中 {{ count }} 项</span>
        </div>
        <div class="operate-button">
          <el-button class="btn-download" icon="el-icon-download" type="primary" @click="download()">批量下载</el-button>
        </div>
        <baseTable
          ref="table"
          :table-data="tableData"
          :multi-select="true"
          prop-name="entryProjectList"
          :html = "html"
          @selectData="selectData"
        >
          <template v-slot:projectList="row">
            <div style="display: flex">

              <el-tooltip v-for="item in row.item.entryProjectList" class="item" :effect="!!item.belongSelf?'dark':'light'" placement="bottom">
                <div slot="content">
                  项目名称：{{ item.name }}
                  <br />
                  项目经理：{{ item.managerName }}
                  <br />
                  项目客户：{{ item.customerName }}
                  <br />
                  所属集团：{{ item.belongGroup }}
                  <br />
                  入场时间：{{ item.entryTime }}
                  <br />
                  计划离场时间：{{ item.planExitTime }}
                  <br />
                  岗位：{{ item.postName }}
                  <br />
                  <div v-if="item.belongSelf">
                    （项目归属于您，可以点击查看项目详情）
                  </div>
                  <div v-else>
                    （项目不归属于您，不能查看项目详情）
                  </div>
                </div>
                <div :class="(!!item.belongSelf?'toolbar0 ':'toolbar1 ')+(!!item.entryMark?'notOwnBar':'ownBar')">
                  <!--                  <svg-icon v-if="!!item.belongSelf" :icon-class="'star'" style="height: 1.5em; width: 1.5em;"-->
                  <!--                            @click="addProject(row.item)"/>-->
                  <img
                    v-if="!!item.belongSelf"
                    style="width: 14px;height: 14px;margin-top: 5px"
                    :src="require(!!item.entryMark ? '@/assets/star-orange.png' : '@/assets/star-blue.png')"
                    @click="addProject(row.item)"
                  />
                  <a v-if="item.belongSelf" @click="openProject(item.projectId)">
                    {{ item.belongGroup }}
                  </a>
                  <div v-else>
                    {{ item.belongGroup }}
                  </div>
                </div>
              </el-tooltip>

            </div>
          </template>
          <template v-slot:clientType="row">
            <!--类型插槽-->
            <template>
              <el-tooltip
                v-if="row.item.departStatusName==='在职'"
                class="item"
                effect="dark"
                content="标记入场"
                placement="bottom"
              >
                <svg-icon
                  :icon-class="'add-icon'"
                  style="height: 18px; width: 18px; margin-right:20px"
                  @click="addProject(row.item)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="全部记录" placement="bottom">
                <svg-icon
                  :icon-class="'detials-icon'"
                  style="height: 1.5em; width: 1.5em; margin-right: 2em"
                  @click="recordAll(row.item)"
                />
              </el-tooltip>
            </template>
          </template>
          <template v-slot:departStatusName="row">
            <!--类型插槽-->
            <template>
              <div
                v-if="row.item.departStatusName==='在职'"
                style="background-color: #E8FFEA ;color: #00B42A;display: inline-block;width: 50px"
              >
                <div
                  style="display:inline-block; width: 5px;height: 5px;border-radius: 50%;background-color: #00B42A;margin-right: 5px;vertical-align: middle;"
                />
                <div style="display:inline-block; ">{{ row.item.departStatusName }}</div>
              </div>
              <div v-else style="background-color: #FFF0ED ;color: #D54941;display: inline-block;width: 50px">
                <div
                  style="display:inline-block; width: 5px;height: 5px;border-radius: 50%;background-color: #D54941;margin-right: 5px;vertical-align: middle;"
                />
                <div style="display:inline-block; ">{{ row.item.departStatusName }}</div>
              </div>
            </template>
          </template>
        </baseTable>
      </el-container>
      <!-- 添加入场项目 -->
      <base-dialog ref="addProjectDialog" :title="title" :width="'500px'">
        <template>
          <addProject ref="addProject" @close="closeAddProject"></addProject>
        </template>
      </base-dialog>
    </div>
    <div v-show="!isList">
      <record ref="record" :sync-is-list.sync="isList"></record>
    </div>
    <div v-if="isProject">
      <projectDetail ref="projectDetail" @changePageFlag="changePageFlag" />
    </div>
  </div>
</template>
<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addProject from '@/views/modules/outsourcingProjectManagement/projectEntryManagement/addProject.vue'
import projectDetail from '../projectConfiguration/projectDetail'
import record from './record'

export default {
  components: {
    projectDetail,
    baseTable,
    baseDialog,
    addProject,
    record
  },
  data() {
    return {
      title: '添加',
      showFlag: false,
      isList: true,
      isProject: false,
      html: ' <div style="background: rgba(238, 243, 255, 0.9);border: 1px solid #ccc !important;border-radius: 5px;">\n' +
          '          <h3 style="margin: 10px">一个标签代表当前或即将要驻场的一个项目</h3>\n' +
          '          <div style="display: flex;margin:2px 10px">\n' +
          '            <div style="width: 80px;height: 20px; background-color: #D8E0FA;"></div><span style="margin-left: 10px;line-height: 20px">蓝色底色标签代表该用户在此项目中真实入场</span>\n' +
          '          </div>\n' +
          '          <div style="display: flex;margin:2px 10px">\n' +
          '            <div style="width: 80px;height: 20px; background-color: #EABD7F;"></div><span style="margin-left: 10px;line-height: 20px">橙色底色标签代表该用户在此项目中虚拟入场</span>\n' +
          '          </div>\n' +
          '          <div style="display: flex;margin: 10px">\n' +
          '            <div style="width: 80px">\n' +
          '            <img\n' +
          '                style="width: 14px;height: 14px;margin-top: 5px"\n' +
          '                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAATNJREFUOE+dkr9Kw1AUxr/jnyZ1sYUO4qRJBgd9ACcFB32ALoJgUxedKvgcDk62IE0GR1/ASV9AEHQzkWwWFPyDyG0b7pGbSk1igtYz3nN+53znu4fwz6A8bq72XFK5wC2/ZNXkgkZNNBRw7+pHI4FWXdwxSPhtbenPoGX3V0DyMgKYNzxHP0/DkVRz69VCQTsAqETMMyAsAlQZcNwBwSOmDhM/odc99E+nveGOpt3bBnGTAD1LGgMCTPu+U2ipfMIcY6e/RlKeESFyNBbvIY9VA2dyKPmHq2ZdHBNoN04xuOm39b34WwbYvSGoHb+Dgdu0uwlwdvOtMlXUHsG4Dr+mjhOfqEah/CjHjyEBWrZYl4wFiYdW4M6LaObqxYRpLDdI8pXnFgdflDZnlLPNPbnfmnwC3V5mDyDwno8AAAAASUVORK5CYII="\n' +
          '            />\n' +
          '            <img\n' +
          '                style="width: 14px;height: 14px;margin-top: 5px;margin-left: 20px"\n' +
          '                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAATRJREFUOE+dks9Kw0AQxr9JRUQRIrRNDjYQqOBBTz6Aggd9AO9e9dQ/+xyr9WQLHnwAX8CTvoAg6EUsCE0PSavQg4egTUY3FUmaBP/MbWf2N/Ptt0P4Z1Ae91TXdVWzW6NR1p1c0BFGTQEV6Z38DWwaj0zwLemt/xp0GuYmNFwrgBHuWnJwOQ1HUruNUnVWKwiAdQKZANYAFCcguwB1CXAZeH4LA1k9HqrzJPqitB+i0CZgLksaA77GYX35aNBR9YQ5/aaxHQIXRBQ5+h3Mr0y8F5eccrUnzNNPWQcJDmhb0j2M51KgI4w7gNQb4yPvK1PuJsAHsVicx8IQ4FvQ11TGmWo0Dvyl+DIkwJ4o7xBodfzidexz+Grk1RZmVjbKtfdAu7FbbvRFKXOy3MzL5a7cT00+ANLSYA9TuuAZAAAAAElFTkSuQmCC"\n' +
          '            />\n' +
          '            </div>\n' +
          '            <span span style="margin-left: 10px;line-height: 20px">\n' +
          '              标签带星号代表项目归属当前登录用户，可以点击跳转项目详情\n' +
          '            </span>\n' +
          '          </div>\n' +
          '        </div>',
      count: 0,
      // 选中的数据
      checkedIds: [],
      depart: [{ name: '全部', status: '' }, { name: '在职', status: '1' }, { name: '离职', status: '0' }],
      dataForm: {
        // 学历
        education: '',
        // 专业
        speciality: '',
        entryProjectList: '',
        // 工龄
        jobAge: [],
        jobAgeStart: '',
        jobAgeEnd: '',
        departAgeStart: '',
        departAgeEnd: '',
        // 司龄
        departAge: [],
        departStatus: '',
        // 部门
        deptId: '',
        // 工号
        empId: '',
        // 姓名
        name: '',
        // 毕业时间
        graduationDate: [],
        // 入职时间
        entryTime: [],
        // 不看所选项目
        unProjectIds: [],
        projectIds: []
      },
      seniorities: [],
      siLings: [],
      deptList: [],
      chooseProjectList: [],
      tableData: {
        theads: [
          { label: '工号', prop: 'empId' },
          { label: '姓名', prop: 'name' },
          { label: '专业', prop: 'major', width: '150px' },
          { label: '学历', prop: 'education' },
          { label: '毕业日期', prop: 'graduateDate' },
          { label: '工龄', prop: 'jobAge' },
          { label: '入职日期', prop: 'entryTime' },
          { label: '司龄', prop: 'departAge' },
          { label: '部门', prop: 'department' },
          { label: '在离职状态', prop: 'departStatusName', slotName: 'departStatusName' },
          { label: '入场外协项目', prop: 'entryProjectList', slotName: 'projectList', width: '100px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: '/externalProject/listEmpProjectEntry'
      }
    }
  },

  mounted() {
    this.getDept()
    this.getProject()
    this.getQueryParam()
    this.refresh()
  },
  methods: {
    changePageFlag() {
      this.isProject = false
      this.refresh()
    },
    openProject(projectId) {
      this.isProject = true
      this.$http({
        url: this.$http.adornUrl('/externalProject/getExternalProjectDetail?id=' + projectId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$refs.projectDetail.init(data.payload)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 查询表格
    refresh() {
      this.$refs.table.refresh(this.dataConversion(this.dataForm))
    },
    handleInput0(value) {
      const regex = /^\d*(\.\d{0,2})?$/
      // 如果不匹配，处理输入
      if (!regex.test(value)) {
        this.$nextTick(() => {
          // 找到最后一个有效的数字部分并更新输入框的值
          const validValue = value.match(/^\d*(\.\d{0,2})?/)[0] || ''
          this.dataForm.jobAgeStart = validValue
        })
      }
    },
    getQueryParam() {
      // 获取当前页面的URL
      const url = window.location.href
      // 获取查询字符串（URL中"?"符后的部分）
      const queryString = url.split('?')[1]
      // 将查询字符串分割成键值对数组
      const params = new URLSearchParams(queryString)
      // 返回指定参数的值
      let projectId = params.get('projectId')
      if (projectId) {
        this.dataForm.unProjectIds.push(parseInt(projectId))
      }
    },
    handleInput1(value) {
      const regex = /^\d*(\.\d{0,2})?$/
      // 如果不匹配，处理输入
      if (!regex.test(value)) {
        this.$nextTick(() => {
          // 找到最后一个有效的数字部分并更新输入框的值
          const validValue = value.match(/^\d*(\.\d{0,2})?/)[0] || ''
          this.dataForm.jobAgeEnd = validValue
        })
      }
    },
    handleInput2(value) {
      const regex = /^\d*(\.\d{0,2})?$/
      // 如果不匹配，处理输入
      if (!regex.test(value)) {
        this.$nextTick(() => {
          // 找到最后一个有效的数字部分并更新输入框的值
          const validValue = value.match(/^\d*(\.\d{0,2})?/)[0] || ''
          this.dataForm.departAgeStart = validValue
        })
      }
    },
    handleInput3(value) {
      const regex = /^\d*(\.\d{0,2})?$/
      // 如果不匹配，处理输入
      if (!regex.test(value)) {
        this.$nextTick(() => {
          // 找到最后一个有效的数字部分并更新输入框的值
          const validValue = value.match(/^\d*(\.\d{0,2})?/)[0] || ''
          this.dataForm.departAgeEnd = validValue
        })
      }
    },
    // 查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      if (params.graduationDate.length > 0) {
        params.graduateDateStart = params.graduationDate[0]
        params.graduateDateEnd = params.graduationDate[1]
      }
      if (params.entryTime.length > 0) {
        params.entryTimeStart = params.entryTime[0]
        params.entryTimeEnd = params.entryTime[1]
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
    // 获取所属部门
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
    // 不看所选项目
    getProject() {
      this.$http({
        url: this.$http.adornUrl('/externalProject/listExternalProjectData'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.chooseProjectList = data.payload.filter((item) => item.id !== 0)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 重置表格
    resetForm() {
      this.$refs.dataForm.resetFields()
      this.dataForm.jobAgeStart = ''
      this.dataForm.jobAgeEnd = ''
      this.dataForm.departAgeStart = ''
      this.dataForm.departAgeEnd = ''
      this.dataForm.unProjectIds = []
      this.dataForm.projectIds = []
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
      let form = {}
      form.ids = this.checkedIds
      this.$http.downloadPost(this.$http.adornUrl('/externalProject/exportEmpProjectEntry'), this.$http.adornParams(form), this)
    },
    // 添加项目
    addProject(row) {
      this.title = '添加'
      this.$refs.addProjectDialog.show()
      this.$nextTick(function () {
        this.$refs.addProject.init(row)
      })
    },
    closeAddProject() {
      this.$refs.addProjectDialog.hide()
      this.refresh()
    },
    // 全部记录
    recordAll(row) {
      this.isList = false
      this.$refs.record.init(row)
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

.toolbar0 {
  display: flex;
  line-height: 24px;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
  margin-right: 10px;
}

.toolbar1 {
  display: inline;
  line-height: 24px;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
  margin-right: 20px;
}

.ownBar {
  color: #2462F9;
  background-color: #F0F1FD;
  min-width: 80px;
}

// .ownBar:hover {
//   color: white;
//   background-color: #F0F1FD;
// }

.notOwnBar {
  color: #E37318;
  background-color: #EABD7F;
  min-width: 80px;
}

.add {
  border: 2px solid black;
}

</style>
