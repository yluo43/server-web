<template>
  <div class="container-box">
    <el-container>
      <el-header style="height: auto; padding: 0">
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
            <el-input v-model="queryParams.empName" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="归属部门:" prop="deptId">
            <el-select v-model="queryParams.deptId" placeholder="请选择归属部门" clearable>
              <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位:" prop="postNames">
            <el-select v-model="queryParams.postNames" placeholder="请选择岗位" clearable multiple>
              <el-option v-for="item in jobList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="级别:" prop="levels">
            <el-select v-model="queryParams.levels" placeholder="请选择级别" clearable multiple>
              <el-option v-for="item in levelNameList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <div v-if="showFlag" style="display: contents">
            <el-form-item label="投入开始日期:" prop="intoStartTime">
              <el-date-picker
                v-model="intoStartTime"
                style="width: 430px"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              />
            </el-form-item>
            <el-form-item label="投入结束日期:" prop="intoEndTime">
              <el-date-picker
                v-model="intoEndTime"
                style="width: 430px"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              />
            </el-form-item>
          </div>
          <el-form-item>
            <div style="display: inline-block; margin-right: 15px" @click="showFlag = !showFlag">
              <svg-icon :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'" style="height: 1.3em; width: 1.3em; position: relative; top: 3px" />
              <span v-if="showFlag" class="btn-font-size" style="color: #2462f9">收起</span>
              <span v-else class="btn-font-size" style="color: #2462f9">展开</span>
            </div>
            <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="refresh()">查询
            </el-button>
            <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="chooseResult">
          <span v-text="chooseStr"></span>
          <el-button type="text" @click="batchDelete()">批量删除</el-button>
        </div>
        <div style="margin-bottom: 16px">
          <el-button
            class="btn-download"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="addPerson"
          >添加人员
          </el-button>
          <el-button
            class="btn-download"
            type="primary"
            style="width: 150px"
            @click="importPerson"
          >导入其他订单人员
          </el-button>
        </div>
      </el-header>
      <baseTable ref="table" :table-data="tableData" :multi-select="true" @selectData="selectData">
        <template v-slot:exitTime="row">
          <!--类型插槽-->
            <div v-if="!!row.item.exitTime">{{row.item.exitTime}}</div>
            <div v-else>-</div>
        </template>
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-button type="text" @click="edit(row.item)">编辑</el-button>
            <el-button type="text" @click="remove(row.item)">删除</el-button>
          </template>
        </template>
      </baseTable>
    </el-container>
    <baseDialog ref="addPersonDialog" title="添加人员" width="800px">
      <addPerson ref="addPerson" @cancel="cancel" @refreshTableData="refresh"/>
    </baseDialog>
    <baseDialog ref="importDialog" title="导入其他订单人员" width="500px">
      <el-form label-width="100px" :rules="importRules" :model="importData" ref="importForm">
        <el-form-item label="订单名称:" prop="otherOrderId">
          <el-select v-model="importData.otherOrderId" style="width: 300px" placeholder="请输入订单名称" clearable>
              <el-option v-for="item in otherOrders" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="投入开始日期:" prop="intoStartTime">
          <el-date-picker
            v-model="importData.intoStartTime"
            style="width: 300px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择投入开始日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="投入结束日期:" prop="intoEndTime">
          <el-date-picker
            v-model="importData.intoEndTime"
            style="width: 300px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择投入结束日期"
            clearable
          />
        </el-form-item>
        <div style="width: 100%; margin-bottom: 20px; display: flex; justify-content: center">
          <el-button type="primary" @click="confirmImport">确定</el-button>
          <el-button style="margin-left: 7px" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </baseDialog>
    <baseDialog ref="editDialog" title="编辑订单人员信息" width="500px">
      <el-form label-width="100px" :rules="editRules" :model="editData" ref="editForm">
        <el-form-item label="投入开始日期:" prop="intoStartTime">
          <el-date-picker
            v-model="editData.intoStartTime"
            style="width: 300px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择投入开始日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="投入结束日期:" prop="intoEndTime">
          <el-date-picker
            v-model="editData.intoEndTime"
            style="width: 300px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择投入结束日期"
            clearable
          />
        </el-form-item>
        <el-form-item label="离场日期:" prop="exitTime">
          <el-input v-model="editData.exitTime" style="width: 300px" placeholder="请输入离场日期" disabled="disabled" />
        </el-form-item>
        <el-form-item label="人员岗位:" prop="postIndex">
          <el-select @change="jobChange" v-model="editData.postIndex" style="width: 300px" placeholder="请选择人员岗位" clearable>
            <el-option v-for="item in jobList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="人员等级:" prop="postId">
          <el-select v-model="editData.postId" style="width: 300px">
            <el-option v-for="item in postLevelSet" :key="item.postId" :label="item.level" :value="item.postId"/>
          </el-select>
        </el-form-item>
        <div style="width: 100%; margin-bottom: 20px; display: flex; justify-content: center">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button style="margin-left: 7px" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </baseDialog>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addPerson from './addPerson.vue'

export default {
  components: { baseTable, baseDialog, addPerson },
  props: {},
  data() {
    return {
      editRules: {
        intoStartTime: [{ required: true, message: '请选择投入开始日期', trigger: ['blur', 'change'] }],
        postIndex: [{ required: true, message: '请选择人员岗位', trigger: ['blur', 'change'] }],
        postId: [{ required: true, message: '请选择人员等级', trigger: ['blur', 'change'] }]
      },
      importRules: {
        intoStartTime: [{ required: true, message: '请选择投入开始日期', trigger: ['blur', 'change'] }],
        otherOrderId: [{ required: true, message: '请选择订单', trigger: ['blur', 'change'] }],
      },
      showFlag: false,
      chooseStr: '已选中 0 项',
      teamMembers: [],
      intoStartTime: [],
      intoEndTime: [],
      postLevelSet: [],
      importData: {
        orderId: '',
        otherOrderId: '',
        intoStartTime: '',
        intoEndTime: ''
      },
      editData: {
        intoStartTime: '',
        intoEndTime: '',
        exitTime: '',
        postIndex: '',
        postName: '',
        level: ''
      },
      tableData: {
        theads: [
          { label: '工号', prop: 'empId' },
          { label: '姓名', prop: 'empName' },
          { label: '部门', prop: 'deptName' },
          { label: '投入开始日期', prop: 'intoStartTime' },
          { label: '投入结束日期', prop: 'intoEndTime' },
          { label: '离场日期', prop: 'exitTime',slotName: 'exitTime'},
          { label: '岗位', prop: 'postName' },
          { label: '级别', prop: 'level' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/externalProject/listProjectOrderEmp'
      },
      jobListDetail: {},
      planExitTime: [],
      deptList: [],
      jobList: [],
      levelNameList: [],
      deleteIds: [],
      queryParams: {
        empId: '',
        empName: '',
        deptId: '',
        postNames: '',
        levels: '',
        entryMark: ''
      },
      fakeData: {
        page: {
          curPage: 1,
          pageSize: 10,
          totalPage: 1,
          list: [{ empId: '3276', empName: '陈小明', deptName: '产品拓展部', intoStartTime: '2024-04-01', intoEndTime: '2024-06-30', exitTime: '', postName: 'java开发',postId: 25, level: '初级' }],
          totalCount: 1
        }
      },
      initData: {},
      otherOrders: [],
      row: {}
    }
  },
  mounted() {
    this.getDept()
  },
  methods: {
    // 返回上一级页面
    handlerFlag() {
      this.$emit('changeFlag')
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
          this.jobList = [...new Set(data.payload.list.map(item => item.name))]
          this.levelNameList = [...new Set(data.payload.list.map(item => item.level))]
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    confirm() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) {
          return false
        }
        // 发起请求
        this.$http({
          url: this.$http.adornUrl('/externalProject/updateProjectOrderEmp'),
          method: 'put',
          data: this.editData
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success(data.msg)
            this.$refs.editDialog.hide()
            this.refresh()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    confirmImport(){
      this.$refs.importForm.validate((valid) => {
        if (!valid) {
          return false
        }
        // 发起请求
        this.$http({
          url: this.$http.adornUrl('/externalProject/insertProjectOrderEmp'),
          method: 'post',
          data: this.importData
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success('导入其他订单人员成功')
            this.$refs.importDialog.hide()
            this.refresh()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    refresh() {
      this.$refs.table.refresh(this.dataConversion(this.queryParams))
      this.chooseStr = '已选中 0 项'
    },
    selectData(selection) {
      this.deleteIds = []
      if (selection.length > 0) {
        selection.forEach((a) => {
          this.deleteIds.push(a.id)
        })
        this.chooseStr = '已选中 ' + this.deleteIds.length + ' 项'
      } else {
        this.chooseStr = '已选中 0 项'
      }
    },
    batchDelete() {
      if (this.deleteIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      this.$confirm('已选中' + this.deleteIds.length + '条订单人员,确认批量删除订单人员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/externalProject/deleteProjectOrderEmp'),
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
    initProject() {
      // 人员岗位和level
      this.$http({
        url: this.$http.adornUrl('/externalProject/listProjectUnitPrice?projectId=' + this.initData.id),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          Object.assign(this.jobListDetail, data.payload.list.reduce((acc, item) => {
            // 如果acc中还没有这个name，就添加一个新对象
            if (!acc[item.name]) {
              acc[item.name] = { name: item.name, levels: [{ postId: item.id, level: item.level }] }
            } else {
              // 如果已经有了，就把level添加到levels数组中
              acc[item.name].levels.push({ postId: item.id, level: item.level })
            }
            return acc
          }, {}))
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    initOtherOrder() {
      // 人员岗位和level
      this.$http({
        url: this.$http.adornUrl('/externalProject/listOtherOrderData?orderId=' + this.initData.orderId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          console.log(data.payload)
          Object.assign(this.otherOrders, data.payload)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      params.projectId = this.initData.id
      params.orderId = this.initData.orderId
      if (this.intoStartTime.length > 0) {
        params.intoStartTimeBegin = this.intoStartTime[0]
        params.intoStartTimeOver = this.intoStartTime[1]
      }
      if (this.intoEndTime.length > 0) {
        params.intoEndTimeBegin = this.intoEndTime[0]
        params.intoEndTimeOver = this.intoEndTime[1]
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
    init(row, initData) {
      Object.assign(this.row, row)
      initData.orderId = row.id
      Object.assign(this.initData, initData)
      this.getJob()
      this.initProject()
      this.initOtherOrder()
      // 塞假数据
      // this.$refs.table.fakeData(this.fakeData)
      this.refresh()
    },
    // 添加人员
    addPerson() {
      this.$refs.addPersonDialog.show()
      this.$nextTick(() => {
        this.$refs.addPerson.init(this.row,this.initData.id)
      })
    },
    jobChange(postIndex) {
      this.postLevelSet.length = 0
      this.postLevelSet = [...this.jobListDetail[postIndex].levels]
      delete this.editData.postId
    },
    edit(row) {
      Object.keys(this.jobListDetail).forEach(e => {
        if (e === row.postName) {
          row.postIndex = e
          this.jobChange(e)
        }
      })
      this.$refs.editDialog.show()
      Object.assign(this.editData,row)
      this.editData.orderId = this.initData.orderId
    },
    importPerson() {
      this.$refs.importDialog.show()
      this.importData.orderId = this.row.id
      this.importData.intoStartTime = this.row.startTime
      this.importData.intoEndTime = this.row.endTime
    },
    cancel() {
      this.$refs.addPersonDialog.hide()
      this.$refs.importDialog.hide()
      this.$refs.editDialog.hide()
    },
    remove(row) {
      this.$confirm(`确定删除此订单人员吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/externalProject/deleteProjectOrderEmp'),
            method: 'post',
            data: [row.id]
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(data.msg)
            }
          })
          this.refresh()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetForm() {
      this.$refs.entryPersonnelForm.resetFields()
      this.queryParams.projectId = this.initData.id
      this.queryParams.orderId = this.initData.orderId
      this.startDate = []
      this.endDate = []
      this.refresh()
    }
  }
}
</script>
<style scoped lang="scss">
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
}

</style>
