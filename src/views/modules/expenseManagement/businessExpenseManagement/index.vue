<template>
  <div style="height: 100%">
    <el-container>
      <el-header style="height: 100%">
        <el-form :inline="true" label-width="60px" label-position="right" :model="dataForm" ref="dataForm">
          <div class="inputlist">
            <el-form-item label="用户姓名:" prop="account" class="name">
              <el-input v-model="dataForm.account" placeholder="请输入用户姓名" clearable maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamNames">
              <el-select v-model="dataForm.teamNames" placeholder="请选择归属团队" :multiple="true" :collapse-tags="true">
                <el-option v-for="team in teamNames" :key="team.id" :label="team.name" :value="team.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="事由:" prop="reason">
              <el-select v-model="dataForm.reason" placeholder="请选择事由" :multiple="true" :collapse-tags="true">
                <el-option v-for="item in reason" :key="item.id" :label="item.name + '(' + item.deptName + ')'" :value="item.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目的城市:" prop="backCitys">
              <el-select v-model="dataForm.backCitys" filterable clearable placeholder="请选择目的城市" :multiple="true" :collapse-tags="true">
                <el-option v-for="location in empLocations" :key="location.name" :label="location.name" :value="location.name"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="showFlag" style="display: contents">
              <el-form-item label="成本中心:" prop="costCenters">
                <el-select v-model="dataForm.costCenters" placeholder="请选择成本中心" :multiple="true" :collapse-tags="true">
                  <el-option
                    v-for="costCenter in costCenters"
                    :key="costCenter.id"
                    :label="costCenter.deptName"
                    :value="costCenter.id"
                    multiple="true"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工号:" prop="empId" class="empId">
                <el-input
                  v-model="dataForm.empId"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                  placeholder="请输入工号"
                  clearable
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="归属部门:" prop="deptNames">
                <el-select v-model="dataForm.deptNames" placeholder="请选择归属部门" :multiple="true" :collapse-tags="true">
                  <el-option v-for="dept in deptNames" :key="dept.id" :label="dept.deptName" :value="dept.id" multiple="true"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="出发日期:" prop="startDate">
                <el-date-picker
                  style="width: 200px"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  v-model="startDate"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="返回日期:" prop="backDate">
                <el-date-picker
                  style="width: 200px"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  v-model="backDate"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="导入日期:" prop="createTime">
                <el-date-picker
                  style="width: 200px"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  v-model="createTime"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
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
          </div>
        </el-form>
        <div class="chooseResult">
          <span v-text="chooseStr"></span>
          <el-button type="text" @click="batchDelete()" v-auth="'tripCost:deletes'">批量删除</el-button>
        </div>
      </el-header>
      <div class="operate-button">
        <el-button class="btn-download" icon="el-icon-download" type="primary" @click="download()" v-auth="'tripCost:export'">批量下载</el-button>
      </div>
      <!-- @select="onSelect" -->
      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @selectData="selectData">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="alter(row)" v-auth="'tripCost:update'" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <svg-icon
                :icon-class="'delete-icon'"
                style="height: 1.5em; width: 1.5em; margin-right: 2em"
                @click="deleteList(row.item)"
                v-auth="'tripCost:delete'"
              />
            </el-tooltip>

            <!-- <svg-icon :icon-class="'delete'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteList(row)" v-auth="'tripCost:delete'" />
            <svg-icon :icon-class="'amend'" style="height: 1.5em; width: 1.5em" @click="alter(row)" v-auth="'tripCost:update'" /> -->
          </template>
        </template>

        <template v-slot:totalMoney="row">
          <template>
            <el-popover placement="top-start" width="200" trigger="hover">
              <!--              :content='getHoverContent(row)'-->
              <div class="custom-content">
                <el-tooltip class="item" effect="dark" :content="'住宿费:' + row.item.hotelTotalMoney + '元'" placement="left">
                  <div class="ellipsis">住宿费:{{ row.item.hotelTotalMoney }}元</div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="'出租车费:' + row.item.taxiMoney + '元'" placement="left">
                  <div class="ellipsis">出租车费:{{ row.item.taxiMoney }}元</div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="'交通费:' + row.item.trafficTotalMoney + '元'" placement="left">
                  <div class="ellipsis">交通费:{{ row.item.trafficTotalMoney }}元</div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="'夜间火车宾馆差额:' + row.item.marginMoney + '元'" placement="left">
                  <div class="ellipsis">夜间火车宾馆差额:{{ row.item.marginMoney }}元</div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="'日常补贴:' + row.item.dailySubsidyMoney + '元'" placement="left">
                  <div class="ellipsis">日常补贴:{{ row.item.dailySubsidyMoney }}元</div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="'资金补贴:' + row.item.moneySubsidy + '元'" placement="left">
                  <div class="ellipsis">资金补贴:{{ row.item.moneySubsidy }}元</div>
                </el-tooltip>
                <!-- 住宿费:{{ row.item.hotelTotalMoney }}元
                <br />
                出租车费:{{ row.item.taxiMoney }}元
                <br />
                交通费:{{ row.item.trafficTotalMoney }}元
                <br />
                夜间火车宾馆差额:{{ row.item.marginMoney }}元
                <br />
                日常补贴:{{ row.item.dailySubsidyMoney }}元
                <br />
                资金补贴:{{ row.item.moneySubsidy }}元 -->
              </div>
              <span slot="reference">{{ row.item.totalMoney }}</span>
            </el-popover>
          </template>
        </template>
      </baseTable>

      <el-drawer title="编辑" :visible.sync="drawer" :direction="direction" size="23%">
        <div style="padding: 0 50px">
          <el-form :inline="true" :model="editDataForm" ref="editdataForm" class="drawerForm">
            <el-form-item label="姓名:" prop="account">
              <el-input v-model="editDataForm.account" clearable disabled="disabled" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input
                v-model="editDataForm.empId"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                clearable
                disabled="disabled"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptName">
              <el-input v-model="editDataForm.deptName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamName">
              <el-input v-model="editDataForm.teamName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="成本中心:" prop="costCenters">
              <el-select v-model="editDataForm.centerId" @change="freshReason">
                <el-option
                  v-for="costCenter in costCenters"
                  :key="costCenter.id"
                  :label="costCenter.deptName"
                  :value="costCenter.id"
                  multiple="true"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出发日期:" prop="empId" disabled="disabled">
              <el-input v-model="editDataForm.startDate" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="返回日期:" prop="empId">
              <el-input v-model="editDataForm.backDate" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="目的城市:" prop="backCity">
              <el-input v-model="editDataForm.backCity" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="事由:" prop="reason">
              <el-select v-model="editDataForm.reason">
                <el-option v-for="item in reasonByDept" :key="item.id" :label="item.name" :value="item.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="宾馆名称:" prop="hotelName">
              <el-input v-model="editDataForm.hotelName" clearable disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="商旅100:" prop="businesTravel">
              <el-input v-model="editDataForm.businesTravel" clearable disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="出差合计:" prop="totalMoney">
              <el-input v-model="editDataForm.totalMoney" clearable disabled="disabled"></el-input>
            </el-form-item>

            <div style="display: flex; justify-content: flex-end; margin-top: 60px">
              <el-button type="primary" style="margin-right: 20px" @click="editSubmit()">确定</el-button>
              <el-button @click="drawer = false">取消</el-button>
            </div>
          </el-form>
        </div>
      </el-drawer>
    </el-container>
  </div>
</template>
<script>
//import baseTable from '../../base/baseTable.vue'
import baseTable from '@/views/modules/base/baseTableSelectAll.vue'
import baseDialog from '../../base/baseDialog'
import { getCName } from '@/utils/auth'

export default {
  data() {
    return {
      showFlag: false,
      chooseStr: '已选中 0 项',
      deleteIds: [],
      drawer: false,
      direction: 'rtl',
      createTime: '',
      startDate: '',
      backDate: '',
      dataForm: {
        account: '' || undefined,
        backDateStart: '' || undefined,
        backDateEnd: '' || undefined,
        costCenters: [] || undefined,
        createTimeStart: '' || undefined,
        createTimeEnd: '' || undefined,

        deptNames: [] || undefined,
        empId: '' || undefined,
        reason: [] || undefined,
        startDateStart: '' || undefined,
        startDateEnd: '' || undefined,

        teamNames: [] || undefined,
        ids: '' || undefined,
        backCitys: [] || undefined
      },

      editDataForm: {
        id: '',
        account: '',
        backDate: '',
        costCenter: '',
        createTime: '',
        deptName: '',
        empId: '',
        reason: '',
        startDate: '',
        teamNames: '',
        hotelName: '',
        totalMoney: '',
        updateUser: '',
        backCity: '',
        businesTravel: '',
        centerId: ''
      },
      costCenters: [],
      deptNames: [],
      teamNames: [],
      empLocations: [],
      reason: [],
      reasonByDept: [],
      tableData: {
        theads: [
          { label: '用户姓名', prop: 'account', width: '70px' },
          { label: '工号', prop: 'empId', width: '70px' },
          { label: '归属部门', prop: 'deptName' },
          { label: '归属团队', prop: 'teamName' },
          { label: '成本中心', prop: 'costCenter' },
          { label: '出发日期', prop: 'startDate', width: '90px' },
          { label: '返回日期', prop: 'backDate', width: '90px' },
          { label: '目的城市', prop: 'backCity', width: '70px' },
          { label: '事由', prop: 'reasonName' },
          { label: '商旅100', prop: 'businesTravel', width: '80px' },
          { label: '宾馆名称', prop: 'hotelName' },
          { label: '出差合计(元)', prop: 'totalMoney', slotName: 'totalMoney' },
          { label: '导入时间', prop: 'createTime', width: '140px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: '/tripCost/tripCostListPage'
      }
    }
  },
  components: {
    baseTable,
    baseDialog
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    //初始化成本中心
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllDept'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.costCenters = data.payload.filter((item) => item.id != 0)
        this.deptNames = data.payload.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })

    //初始化团队
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllTeam'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.teamNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    //初始化事由
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllReasonFromStatic'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.reason = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })

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
  },
  methods: {
    freshReason() {
      var deptId = this.editDataForm.deptId
      //根据部门加载事由
      this.$http({
        url: this.$http.adornUrl('/report/amount/getAllReasonFromStaticByDept?deptId=' + deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.reasonByDept = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
      this.editDataForm.reason = ''
    },

    alter(row) {
      let data = row.item

      //根据部门加载事由
      this.$http({
        url: this.$http.adornUrl('/report/amount/getAllReasonFromStaticByDept?deptId=' + data.deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.reasonByDept = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })

      this.drawer = true
      this.editDataForm = { ...data }
    },
    editSubmit() {
      let user = getCName()
      this.editDataForm.updateUser = user

      this.$http({
        url: this.$http.adornUrl('/tripCost/update'),
        method: 'put',
        data: this.$http.adornData(this.editDataForm)
      }).then(({ data }) => {
        if (data.success) {
          this.refresh()
          this.$message({
            message: '编辑成功！',
            type: 'success'
          })
          this.drawer = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (this.startDate != null && this.startDate != '') {
          this.dataForm.startDateStart = this.startDate[0]
          this.dataForm.startDateEnd = this.startDate[1]
        }
        if (this.backDate != null && this.backDate != '') {
          this.dataForm.backDateStart = this.backDate[0]
          this.dataForm.backDateEnd = this.backDate[1]
        }
        if (this.createTime != null && this.createTime != '') {
          this.dataForm.createTimeStart = this.createTime[0] + ' 00:00:00'
          this.dataForm.createTimeEnd = this.createTime[1] + ' 23:59:59'
        }

        let form = { ...this.dataForm }
        if (form.costCenters.length > 0) {
          form.costCenters = form.costCenters + ''
        }

        if (form.deptNames.length > 0) {
          form.deptNames = form.deptNames + ''
        }
        if (form.teamNames.length > 0) {
          form.teamNames = form.teamNames + ''
        }
        if (form.backCitys.length > 0) {
          form.backCitys = form.backCitys + ''
        }
        if (form.reason.length > 0) {
          form.reason = form.reason + ''
        }
        this.$refs.table.refresh(form)
      })
    },

    batchDelete() {
      if (this.deleteIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      this.$confirm('已选中' + this.deleteIds.length + '条报销数据,您确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/tripCost/deleteTripCost'),
            method: 'post',
            data: this.deleteIds
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
    download() {
      if (this.deleteIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }

      let form = { ...this.dataForm }
      form.ids = this.deleteIds
      this.$http.downloadPost(this.$http.adornUrl('/tripCost/export'), this.$http.adornParams(form), this)
    },
    // onSelect(selection) {
    //   this.deleteIds = []
    //   let totalMoney = 0
    //   if (selection.length > 0) {
    //     selection.forEach((a) => {
    //       this.deleteIds.push(a.id)
    //       totalMoney += parseFloat(a.totalMoney)
    //     })
    //     this.chooseStr = '已选中' + this.deleteIds.length + '项，合计：' + totalMoney.toFixed(2) + '元'
    //   } else {
    //     this.chooseStr = '已选中 0 项'
    //   }
    // },
    selectData(selection) {
      this.deleteIds = []
      let totalMoney = 0
      if (selection.length > 0) {
        selection.forEach((a) => {
          this.deleteIds.push(a.id)
          totalMoney += parseFloat(a.totalMoney)
        })
        this.chooseStr = '已选中' + this.deleteIds.length + '项，合计：' + totalMoney.toFixed(2) + '元'
      } else {
        this.chooseStr = '已选中 0 项'
      }
    },
    deleteList(row) {
      this.deleteIds = []
      this.deleteIds.push(row.id)
      const message = `确定删除[${row.deptName}-${row.account}]${row.startDate}至${row.backDate}前往${row.backCity}的出差记录吗？删除后将无法恢复!`
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/tripCost/deleteTripCost'),
            method: 'post',
            data: this.deleteIds
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
      this.createTime = ''
      this.dataForm.createTimeStart = ''
      this.dataForm.createTimeEnd = ''
      this.startDate = ''
      this.dataForm.startDateStart = ''
      this.dataForm.startDateEnd = ''
      this.backDate = ''
      this.dataForm.backDateStart = ''
      this.dataForm.backDateStart = ''
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
.ellipsis {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
