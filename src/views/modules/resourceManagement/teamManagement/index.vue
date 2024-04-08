<template>
  <div style="height: 100%">
    <el-container>
      <el-header style="height: 130px">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist">
            <el-form-item label="团队名称:" prop="teamName">
              <el-input v-model="dataForm.teamName" placeholder="输入关键字" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="团队负责人:" prop="managerIds">
              <el-select v-model="dataForm.managerIds" placeholder="请选择" multiple>
                <el-option v-for="manager in managerList" :key="manager.id" :label="manager.name + '(' + manager.id + ')'" :value="manager.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="团队编码:" prop="teamId">
              <el-input v-model="dataForm.teamId" placeholder="输入关键字" clearable maxlength="50"></el-input>
            </el-form-item>

            <el-form-item label="驻地:" prop="stationIds">
              <el-select v-model="dataForm.stationIds" filterable clearable placeholder="请选择" multiple :collapse-tags="true">
                <el-option v-for="item in empLocations" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptIds">
              <el-select v-model="dataForm.deptIds" placeholder="请选择" multiple :collapse-tags="true">
                <el-option
                  v-for="dept in deptList"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                  multiple
                  :disabled="dept.name == '新讯数字科技有限公司'"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态:" prop="state">
              <el-select clearable v-model="dataForm.state" placeholder="请选择">
                <el-option key="0" label="正常" value="0"></el-option>
                <el-option key="1" label="解散" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间:" prop="createTime" style="width: 290px !important">
              <el-date-picker
                style="width: 220px"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="createTime"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <div style="display: contents">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px; margin-left: 100px">查询</el-button>
              <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
            </div>
          </div>
        </el-form>
        <div class="chooseResult">
          <span class="chooseResultStr" v-text="chooseStr"></span>
          <el-button type="text" @click="batchDelete()" v-auth="'team:deletes'">批量删除</el-button>
          <!-- <span style="color: blue; margin-left: 100px" @click="batchDelete()" v-auth="'team:deletes'">批量删除</span>
          <span style="color: blue; margin-left: 20px" @click="download()" v-auth="'team:export'">批量下载</span>
          <span style="color: blue; margin-left: 20px" @click="add()" v-auth="'team:add'">新建团队</span> -->
        </div>
      </el-header>
      <div style="margin: 0 0 10px 13px">
        <el-button
          style="width: 110px"
          icon="
          el-icon-download"
          type="primary"
          @click="download()"
          v-auth="'team:export'"
        >
          批量下载
        </el-button>
        <el-button
          style="width: 110px"
          icon="
          el-icon-circle-plus-outline"
          type="primary"
          @click="add()"
          v-auth="'team:add'"
        >
          新建团队
        </el-button>
      </div>

      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteList(row)" v-auth="'team:delete'" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em" @click="alter(row)" v-auth="'team:update'" />
            </el-tooltip>
            <!-- <svg-icon :icon-class="'delete'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteList(row)" v-auth="'team:delete'" />
            <svg-icon :icon-class="'amend'" style="height: 1.5em; width: 1.5em" @click="alter(row)" v-auth="'team:update'" /> -->
          </template>
        </template>
      </baseTable>

      <el-drawer class="drawer" :title="title" :visible.sync="drawer" :direction="direction" size="23%">
        <div style="padding-left: 20px">
          <el-form :inline="true" :model="editDataForm" ref="editdataForm" class="editForm">
            <el-form-item label="团队名称:" prop="teamName" :rules="[{ required: true, message: '团队不能为空' }]">
              <el-input v-model="editDataForm.teamName" clearable maxlength="50"></el-input>
            </el-form-item>

            <!--            <el-form-item label="团队级别:" prop="teamLevel" :rules="[ { required: true, message: '团队级别不能为空'}]">-->
            <!--              <el-select  v-model="editDataForm.teamLevel" placeholder="请选择" @change="showParentStatus">-->
            <!--                <el-option key="1" label="一级团队" :value="1"></el-option>-->
            <!--                <el-option key="2" label="二级团队" :value='2'></el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item label="父团队:" prop="parentId" v-if="showParent">
              <el-select v-model="editDataForm.parentId" placeholder="请选择" clearable>
                <el-option v-for="team in parentTeam" :key="team.id" :label="team.name" :value="team.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="归属部门:" prop="deptId" :rules="[{ required: true, message: '归属部门不能为空' }]">
              <el-select clearable v-model="editDataForm.deptId" placeholder="请选择" @change="changeManagerList">
                <el-option
                  v-for="dept in onwerDeptList"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                  :disabled="dept.name == '新讯数字科技有限公司'"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="团队负责人:" prop="managerId" :rules="[{ required: true, message: '不能为空，请先选择归属部门' }]">
              <el-select clearable v-model="editDataForm.managerId" placeholder="请先选择归属部门">
                <el-option v-for="manager in teamManagerList" :key="manager.id" :label="manager.name + '(' + manager.id + ')'" :value="manager.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="团队驻地:" prop="stationId" :rules="[{ required: true, message: '驻地不能为空' }]">
              <el-select v-model="editDataForm.stationId" filterable clearable placeholder="请选择" @change="getTeamId">
                <el-option v-for="location in empLocations" :key="location.id" :label="location.name" :value="location.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="团队编码:" prop="teamId">
              <el-input v-model="editDataForm.teamId" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-row>
              <el-form-item label="团队成员:" prop="teamMembers">
                <el-button type="primary" style="width: 120px" plain @click="chooseTeamMember">选择团队成员</el-button>
                <!-- <el-transfer
                :titles="['所有成员', '团队成员']"
                filterable
                filter-placeholder="请输入团队成员姓名"
                v-model="value"
                :data="teamMembers"
              ></el-transfer> -->
                <!-- <el-select  clearable v-model="editDataForm.teamMembers"
                         filterable
                         placeholder="请选择" multiple
                         :collapse-tags="true"
              >
                <el-option
                  v-for="item in members"
                  :key="item.id"
                  :label='item.name+""+item.id+""'
                  :value="item.id">
                </el-option>
              </el-select> -->
              </el-form-item>
            </el-row>
            <el-form-item label="创建时间:" prop="createTime" :rules="[{ required: true, message: '创建不能为空' }]">
              <el-date-picker
                style="width: 130px"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="editDataForm.createTime"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="状态:" prop="state" v-if="departStatusNameShow">
              <el-select clearable v-model="editDataForm.state" placeholder="请选择">
                <el-option key="0" label="正常" value="0"></el-option>
                <el-option key="1" label="解散" value="1"></el-option>
              </el-select>
            </el-form-item>

            <br />

            <div style="display: flex; justify-content: flex-end; margin-right: 10px; margin-top: 30px">
              <el-button type="primary" style="margin-right: 20px" @click="editSubmit()">确定</el-button>
              <el-button type="primary" @click="drawer = false">取消</el-button>
            </div>
          </el-form>
        </div>
      </el-drawer>
    </el-container>
    <base-dialog ref="transferDialog" title="选择团队成员" :width="'700px'">
      <template>
        <el-transfer
          style="margin-bottom: 20px"
          :titles="['未分配团队成员', '团队成员']"
          filterable
          filter-placeholder="请输入成员姓名或工号"
          v-model="value"
          :data="teamMembers"
        ></el-transfer>
        <div style="width: 100%; margin-bottom: 20px; display: flex; justify-content: flex-end">
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </template>
    </base-dialog>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog'
import { getCName } from '@/utils/auth'

export default {
  data() {
    return {
      teamMembers: [],
      value: [],
      showParentRule: false,
      url: '',
      showParent: true,
      departStatusNameShow: false,
      chooseStr: '已选择 0 项',
      deleteIds: [],
      empLocations: [],
      managerList: [],
      teamManagerList: [],
      onwerDeptList: [],
      deptList: [],
      parentTeam: [],
      members: [],
      drawer: false,
      direction: 'rtl',
      title: '',
      createTime: '',
      dataForm: {
        managerIds: '' || undefined,
        teamName: '' || undefined,
        teamId: '' || undefined,
        stationIds: '' || undefined,
        createTimeEnd: '' || undefined,
        createTimeStart: '' || undefined,
        state: '' || undefined,
        deptIds: [] || undefined
      },
      editDataForm: {
        id: '' || undefined,
        createTime: '' || undefined,
        createUser: '' || undefined,
        managerId: '' || undefined,
        state: '' || undefined,
        stationId: '' || undefined,
        teamId: '' || undefined,
        teamMembers: [],
        teamName: '' || undefined,
        state: '' || undefined,
        deptId: '' || undefined,
        teamLevel: '' || undefined,
        parentId: '' || undefined
      },

      tableData: {
        theads: [
          { label: '团队名称', prop: 'teamName', width: '100px' },
          { label: '团队负责人', prop: 'managerName' },
          { label: '团队编码', prop: 'teamId' },
          // {label: '团队级别', prop: 'teamLevelName'},
          { label: '上级团队', prop: 'parentName' },
          { label: '驻地', prop: 'stationName' },
          { label: '归属部门', prop: 'deptName' },
          { label: '团队成员', prop: 'teamNum' },
          { label: '创建时间', prop: 'createTime' },
          { label: '状态', prop: 'stateName' },
          { label: '操作', prop: 'clientType', slotName: 'clientType' }
        ],
        url: '/team/selectTeamPage'
      }
    }
  },
  components: {
    baseTable,
    baseDialog
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    this.freshParentTeam()
    //初始化驻地
    this.$http({
      url: this.$http.adornUrl('/common/getStation'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.empLocations = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    //初始化deptList
    this.$http({
      url: this.$http.adornUrl('/common/getDept'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.deptList = data.payload.filter((item) => item.id !== 0)

        // this.deptList.
      } else {
        this.$message.error(data.msg)
      }
    })

    this.$http({
      url: this.$http.adornUrl('/common/getDeptByRole'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.onwerDeptList = data.payload.filter((item) => item.id !== 0)
      } else {
        this.$message.error(data.msg)
      }
    })

    //初始化managerList
    this.$http({
      url: this.$http.adornUrl('/common/getManager?pid=3'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.managerList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    chooseTeamMember() {
      this.$refs.transferDialog.show()
    },
    confirm() {
      this.$refs.transferDialog.hide()
    },
    changeManagerList() {
      if (this.editDataForm.deptId == '' || this.editDataForm.deptId == null) {
        alert('请先选择部门，再选择团队负责人')
        return false
      }
      let deptId = this.editDataForm.deptId

      this.$http({
        url: this.$http.adornUrl('/common/getTeamManagerUp?pid=3&deptId=' + deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamManagerList = data.payload
          this.editDataForm.managerId = ''
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    showParentStatus() {
      if (this.editDataForm.teamLevel == '2') {
        this.showParent = true
      } else {
        this.showParent = false
      }
    },

    freshMembers() {
      //初始化没有团队的人员
      this.$http({
        url: this.$http.adornUrl('/common/getNotTeamEmp'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamMembers = []
          data.payload.map((item) => {
            this.teamMembers.push({
              key: item.id,
              label: item.name + '(' + item.id + ')',
              disabled: false
            })
          })
          //this.members = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    freshMembersWithEdit(id, deptId) {
      //初始化没有团队的人员
      this.$http({
        url: this.$http.adornUrl('/common/getTeamEmpById?teamId=' + id + '&deptId=' + deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamMembers = []
          data.payload.map((item) => {
            this.teamMembers.push({
              key: item.id,
              label: item.name + '(' + item.id + ')',
              disabled: false
            })
          })
          // this.members = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //生成团队编码
    getTeamId() {
      let stationId = this.editDataForm.stationId
      let stationName = ''
      this.empLocations.forEach((location) => {
        if (stationId == location.id) {
          stationName = location.name
        }
      })
      this.$http({
        url: this.$http.adornUrl('/team/getTeamIdByStation?stationId=' + stationId + '&stationName=' + stationName),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.editDataForm.teamId = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    editSubmit() {
      let go
      this.$refs['editdataForm'].validate((valid) => {
        go = valid
      })

      if (!go) {
        return
      }
      let user = getCName()
      this.editDataForm.createUser = user
      if (this.editDataForm.departDate == '-') {
        this.editDataForm.departDate = ''
      }
      // 过滤空值参数
      console.log(this.value)
      const params = Object.assign({}, this.editDataForm)
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      params.teamMembers = this.value
      console.log(params)
      this.$http({
        url: this.$http.adornUrl(this.url),
        method: 'post',
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data.success) {
          this.refresh()
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          this.drawer = false
          this.freshParentTeam()
          this.freshMembers()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    refresh() {
      if (this.createTime != null && this.createTime != '') {
        this.dataForm.createTimeStart = this.createTime[0]
        this.dataForm.createTimeEnd = this.createTime[1]
      }

      let form = { ...this.dataForm }
      if (form.deptIds.length > 0) {
        form.deptIds = form.deptIds + ''
      }

      if (form.stationIds.length > 0) {
        form.stationIds = form.stationIds + ''
      }

      if (form.managerIds.length > 0) {
        form.managerIds = form.managerIds + ''
      }
      this.$refs.table.refresh(form)
    },
    add() {
      this.freshMembers()
      this.title = '新建团队'
      this.drawer = true
      this.departStatusNameShow = false
      this.clear(this.editDataForm)
      this.value = []
      this.url = '/team/add'
      this.teamManagerList = {}
    },
    alter(row) {
      this.$http({
        url: this.$http.adornUrl('/common/getTeamManagerUp?pid=3&deptId=' + row.item.deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamManagerList = data.payload
          this.freshMembersWithEdit(row.item.id, row.item.deptId)
          this.editDataForm = { ...row.item }
          this.value = this.editDataForm.teamMembers
          console.log(this.editDataForm)
          if (row.item.parentId == 0) {
            this.editDataForm.parentId = ''
          }
          this.title = '编辑团队'
          this.drawer = true
          this.url = '/team/update'
          this.departStatusNameShow = true

          if (row.item.teamLevel == 1) {
            this.showParent = false
          } else {
            this.showParent = true
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    onSelect(selection) {
      this.deleteIds = []
      let totalMoney = 0
      if (selection.length > 0) {
        selection.forEach((a) => {
          this.deleteIds.push(a.id)
          totalMoney += a.totalMoney
        })
        this.chooseStr = '已选中' + this.deleteIds.length + '个团队'
      } else {
        this.chooseStr = '已选中 0 个团队'
      }
    },
    clear(form) {
      Object.keys(form).forEach((key) => (form[key] = ''))
    },
    deleteList(row) {
      this.deleteIds = []
      this.deleteIds.push(row.item.id)

      this.$confirm('确定删除' + row.item.teamName + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/team/delete'),
            method: 'post',
            data: this.deleteIds
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
              this.freshParentTeam()
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

    download() {
      if (this.deleteIds.length <= 0) {
        this.$message.error('当前未选中任何团队数据！')
        return
      }
      let form = { ...this.dataForm }
      form.ids = this.deleteIds

      this.$http.downloadPost(this.$http.adornUrl('/team/export'), this.$http.adornParams(form), this)
    },

    batchDelete() {
      if (this.deleteIds.length <= 0) {
        this.$message.error('当前未选中任何团队！')
        return
      }
      this.$confirm('已选中' + this.deleteIds.length + '个团队,确认批量删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/team/delete'),
            method: 'post',
            data: this.deleteIds
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
              this.freshParentTeam()
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
    resetForm() {
      this.$refs.dataForm.resetFields()
      this.dataForm.createTimeStart = ''
      this.dataForm.createTimeEnd = ''
      this.createTime = ''
    },
    freshParentTeam() {
      //初始化parentTeam
      this.$http({
        url: this.$http.adornUrl('/common/getTeam'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.parentTeam = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
.el-header {
  color: #333;
  padding: 0 0;
}

.el-form--inline > .inputlist {
  /*padding-top: 20px;*/
  padding-left: 20px;
  /*display: flex;*/
}

.el-button-func {
  width: 86px;
  height: 30px;
  text-align: center;
}
::v-deep .el-table__cell {
  text-align: center;
}

.chooseResult {
  width: 98%;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
  padding-left: 20px;
}

::v-deep .drawer .el-form--inline .el-form-item__label {
  width: 85px !important;
}

::v-deep .drawer .el-form-item {
  margin-bottom: 2px !important;
}

::v-deep .el-date-editor .el-input__inner {
  padding-left: 30px !important;
}

::v-deep .drawer .el-input__inner {
}
</style>
