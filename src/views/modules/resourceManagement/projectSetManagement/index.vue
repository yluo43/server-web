<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%; border: 1px solid #eee">
      <el-header style="height: auto">
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <el-form-item label="项目集名称:" prop="psName">
            <el-input v-model="dataForm.psName" placeholder="请输入项目集名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目集ID:" prop="psId">
            <el-input v-model="dataForm.psId" placeholder="请输入项目集ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="负责人:">
            <el-select v-model="managerIdList" multiple collapse-tags placeholder="请选择负责人">
              <el-option v-for="item in managerList" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属部门:">
            <el-select v-model="deptIdList" multiple collapse-tags placeholder="请选择归属部门">
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.name == '新讯数字科技有限公司'"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属团队:">
            <el-select v-model="teamIdList" multiple collapse-tags placeholder="请选择归属团队">
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启动时间:">
            <el-date-picker
              v-model="startDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:">
            <el-date-picker
              v-model="endDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="状态:" prop="state">
            <el-select clearable v-model="state" multiple collapse-tags placeholder="请选择状态">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <div style="display: contents; float: right">
            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
            <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
          </div>
        </el-form>
      </el-header>
      <el-main>
        <div class="chooseResult">
          <span class="chooseResultStr" v-text="chooseStr"></span>
          <el-button type="text" @click="deleteList()" v-auth="'projectSet:deletes'">批量删除</el-button>
          <!-- <span style="color: blue; margin-left: 50px" @click="deleteList()" v-auth="'projectSet:deletes'">批量删除</span> -->
        </div>
        <div style="margin: 15px 0 10px 0">
          <el-button class="el-button-func" type="primary" @click="download()" icon="el-icon-download" style="margin-right: 10px" v-auth="'projectSet:export'">
            批量下载
          </el-button>
          <el-button class="el-button-func" type="primary" @click="add()" icon="el-icon-circle-plus-outline" v-auth="'projectSet:add'">新建项目集</el-button>
        </div>
        <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect">
          <template v-slot:endDate="row">
            <div v-if="!row.item.endDate">-</div>
            <div v-else>{{ row.item.endDate }}</div>
          </template>
          <template v-slot:clientType="row">
            <!--类型插槽-->
            <template>
              <el-tooltip class="item" effect="dark" content="查看项目" placement="bottom" v-auth="'projectSet:showProject'">
                <i class="el-icon-document" style="font-size: 1.5em; margin-right: 1em" @click="view(row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加项目" placement="bottom" v-auth="'projectSet:addProject'">
                <i class="el-icon-circle-plus" style="font-size: 1.5em; margin-right: 1em" @click="addProject(row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom" v-auth="'projectSet:delete'">
                <svg-icon :icon-class="'delete'" style="height: 1.5em; width: 1.5em; margin-right: 1em" @click="deleteList(row)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" v-auth="'projectSet:update'">
                <svg-icon :icon-class="'amend'" style="height: 1.5em; width: 1.5em; margin-right: 1em" @click="update(row)" />
              </el-tooltip>
            </template>
          </template>
        </baseTable>
      </el-main>
    </el-container>
    <base-drawer :title="title" ref="addOrUpdateDrawer">
      <template>
        <addOrUpdate @refreshDataList="refresh" ref="addOrUpdate"></addOrUpdate>
      </template>
    </base-drawer>
    <base-drawer :title="title" ref="showProjectDrawer">
      <template>
        <showProject @refreshDataList="refresh" ref="showProject"></showProject>
      </template>
    </base-drawer>
    <base-drawer :title="title" ref="addProjectDrawer">
      <template>
        <addProject @refreshDataList="refresh" ref="addProject"></addProject>
      </template>
    </base-drawer>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDrawer from '../../base/baseDrawer.vue'
import addOrUpdate from './addOrUpdata.vue'
import showProject from '@/views/modules/resourceManagement/projectSetManagement/showProject.vue'
import addProject from '@/views/modules/resourceManagement/projectSetManagement/addProject.vue'

export default {
  data() {
    return {
      chooseStr: '已选择 0 项',
      title: '',
      managerIdList: [],
      deptIdList: [],
      teamIdList: [],
      startDate: [],
      endDate: [],
      state: [],
      dataForm: {
        psName: '',
        psId: '',
        managerIds: '',
        deptIds: '',
        teamIds: '',
        startDateStart: '',
        startDateEnd: '',
        endDateStart: '',
        endDateEnd: '',
        state: ''
      },
      tableData: {
        theads: [
          { label: '项目集名称', prop: 'psName' },
          { label: '项目集ID', prop: 'psId' },
          { label: '负责人', prop: 'managerName' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '项目数量', prop: 'projectNum' },
          { label: '已完成项目数', prop: 'completeNum' },
          { label: '简介', prop: 'remarks' },
          { label: '启动时间', prop: 'startDate' },
          { label: '结束时间', prop: 'endDate', slotName: 'endDate' },
          { label: '状态', prop: 'stateName' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '130px' }
        ],
        url: '/projectSet/projectSetPage'
      },
      managerList: [],
      deptList: [],
      teamList: [],
      stateOptions: [
        { value: 0, label: '交付中' },
        { value: 1, label: '已交付' },
        { value: 2, label: '关闭' }
      ]
    }
  },
  components: {
    showProject,
    addProject,
    baseTable,
    addOrUpdate,
    baseDrawer
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
        this.dataForm.teamIds = newName.join(',')
      }
    },
    startDate(newName, oldName) {
      this.dataForm.startDateStart = newName[0]
      this.dataForm.startDateEnd = newName[1]
    },
    endDate(newName, oldName) {
      this.dataForm.endDateStart = newName[0]
      this.dataForm.endDateEnd = newName[1]
    }
  },
  mounted() {
    this.dataForm.state = this.state.toString()
    this.$refs.table.refresh(this.dataForm)
    this.$http({
      url: this.$http.adornUrl('/common/getManager'),
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
        this.deptList = data.payload.filter((item) => item.id !== 0)
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
  },
  methods: {
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.dataForm.state = this.state.toString()
        this.$refs.table.refresh(this.dataForm)
      })
    },
    download() {
      const list = this.$refs.table.getSelectRow()
      if (list.length === 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let data = list.map((obj) => obj.id)
      this.$http.downloadPost(this.$http.adornUrl('/projectSet/export'), { ids: data }, this)
    },
    add() {
      this.title = '新建项目集'
      this.$refs.addOrUpdateDrawer.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('add', false, {
          managerList: this.managerList,
          deptList: this.deptList,
          teamList: this.teamList
        })
      })
    },
    update(row) {
      this.title = '编辑项目集'
      this.$refs.addOrUpdateDrawer.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('update', false, {
          managerList: this.managerList,
          deptList: this.deptList,
          teamList: this.teamList,
          dataRow: row.item
        })
      })
    },
    view(row) {
      this.title = '查看项目'
      this.$refs.showProjectDrawer.show()
      this.$nextTick(() => {
        this.$refs.showProject.init(row.item.id)
      })
    },
    addProject(row) {
      this.title = '添加项目'
      this.$refs.addProjectDrawer.show()
      this.$nextTick(() => {
        this.$refs.addProject.init({
          deptList: this.deptList,
          teamList: this.teamList,
          dataRow: row.item
        })
      })
    },
    onSelect(selection) {
      if (selection.length > 0) {
        this.chooseStr = '已选中' + selection.length + '项'
      } else {
        this.chooseStr = '已选中 0 项'
      }
    },
    deleteList(row) {
      let message = ''
      let data = []
      if (row) {
        data = [row.item.id]
        switch (row.item.state) {
          case 0:
            message = '该项目集正在交付中,您确定删除吗?'
            break
          case 1:
            message = '该项目集已交付,您确定删除吗?'
            break
          case 2:
            message = '该项目集已关闭,您确定删除吗?'
            break
        }
      } else {
        const list = this.$refs.table.getSelectRow()
        if (list.length === 0) {
          this.$message.warning('请至少选择一条数据！')
          return
        }
        message = '已选中' + list.length + '个项目集，确认批量删除吗？'
        list.forEach((item) => {
          data.push(item.id)
        })
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/projectSet/delete'),
            method: 'post',
            data: data
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
    resetForm() {
      this.$refs.dataForm.resetFields()
      this.managerIdList = []
      this.deptIdList = []
      this.teamIdList = []
      this.startDate = []
      this.endDate = []
      this.state = []
    }
  }
}
</script>
<style scoped>
.el-button {
  margin-left: 0;
  width: auto;
}

.chooseResult {
  height: 30px;
  line-height: 30px;
  margin: 10px auto;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
}

.el-icon-document:hover,
.el-icon-circle-plus:hover {
  cursor: pointer;
  /* 添加其他想要的样式 */
}
</style>
