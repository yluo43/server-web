<template>
  <div>
    <div v-if="flag===0" class="main-box">
      <el-form
        ref="orderForm"
        :inline="true"
        label-width="auto"
        label-position="left"
        :model="queryParams"
      >
        <el-form-item label="订单名称:" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入订单名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单编号:" prop="code">
          <el-input v-model="queryParams.code" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单周期:" prop="deptId">
          <el-input v-model="queryParams.name" placeholder="请输入订单周期" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单开始日期:" prop="startTime">
          <el-date-picker
            v-model="startTime"
            style="width: 200px"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="年/月/日"
            end-placeholder="年/月/日"
          />
        </el-form-item>
        <el-form-item label="订单结束日期" prop="endTime">
          <el-date-picker
            v-model="endTime"
            style="width: 200px"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="年/月/日"
            end-placeholder="年/月/日"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" style="margin-right: 10px" @click="refresh()">查询
          </el-button>
          <el-button icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 16px">
        <el-button
          class="btn-download"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addOrEditOrder(undefined)"
        >添加订单
        </el-button>
      </div>
      <baseTable ref="table" :table-data="tableData">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-button type="text" @click="addOrEditOrder(row.item)">编辑</el-button>
            <el-button type="text" @click="openPersonnel(row.item)">人员管理</el-button>
            <el-button style="width: 80px" type="text" @click="makeConfirmDoc(row.item)">生成结算单</el-button>
            <el-button style="width: 80px" type="text" @click="applyDocPage(row.item)">客户侧结算单</el-button>
            <el-button type="text" @click="remove(row.item)">删除</el-button>
          </template>
        </template>
      </baseTable>

      <baseDialog ref="addOrderDialog" :title="title" width="500px">
        <template>
          <addOrder ref="addOrder" @refreshTableData="refresh"></addOrder>
        </template>
      </baseDialog>

      <baseDialog ref="applyDocDialog" title="客户侧结算单" width="1200px">
        <template>
          <el-upload
            class="upload-demo"
            multiple
            :limit="10"
            :action="url"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :show-file-list="false"
            :on-success="getApplyDocData"
            :on-exceed="handleExceed"
            :data="row"
            :file-list="fileList"
            :accept="'.xlsx,.pdf,.docx'"
          >
            <el-button style="margin-bottom: 20px" size="small" type="primary">上传</el-button>
          </el-upload>
          <baseTable ref="applyDocTable" :hide-page="true" :show-num="true" :table-data="applyDocData">
            <template v-slot:clientType="row">
              <!--类型插槽-->
              <template>
                <el-button type="text" @click="look(row.item)">预览</el-button>
                <el-button type="text" @click="download(row.item)">下载</el-button>
                <el-button type="text" @click="removeFile(row.item)">删除</el-button>
              </template>
            </template>
          </baseTable>
        </template>
      </baseDialog>
    </div>
    <div v-if="flag ===1" style="height: 100%">
      <personnel ref="personnel" @changeFlag="handlerFlag"></personnel>
    </div>
    <div v-if="flag ===2" style="height: 100%">
      <applyDoc ref="personnel" @changeFlag="handlerFlag"></applyDoc>
    </div>
  </div>
</template>

<script>
import baseTable from '@/views/modules/base/baseTableNoSelect.vue'
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addOrder from './addOrder.vue'
import personnel from './personnel.vue'
import applyDoc from './applyDoc.vue'

export default {
  components: { baseTable, baseDialog, addOrder, personnel, applyDoc},
  props: {},
  data() {
    return {
      url: '',
      initData: {},
      title: '',
      flag: 0,
      fileList: [],
      orderForm: {},
      entryMarks: [{ id: 0, name: '真实入场' }, { id: 1, name: '虚拟入场' }],
      tableData: {
        theads: [
          { label: '订单名称', prop: 'name' },
          { label: '订单编号', prop: 'code' },
          { label: '订单周期', prop: 'period' },
          { label: '订单开始日期', prop: 'startTime' },
          { label: '订单结束日期', prop: 'endTime' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/externalProject/listProjectOrder'
      },
      applyDocData: {
        theads: [
          { label: '文件名', prop: 'fileName' },
          { label: '上传用户', prop: 'uploadUser' },
          { label: '上传时间', prop: 'uploadTime' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '200px' }
        ],
        url: '/externalProject/listProjectEntryPage'
      },
      jobListDetail: {},
      postLevelSet: [],
      startTime: [],
      endTime: [],
      exitTime: [],
      queryParams: {
        projectId: '',
        name: '',
        code: '',
        deptId: '',
        postId: '',
        level: '',
        postNameList: [],
        levelList: [],
        entryMark: ''
      },
      fakeApplyData: {
        page: {
          curPage: 1,
          pageSize: 10,
          totalPage: 1,
          list: [
            { fileName: '文件名.docx', user: '用户', uploadTime: '上传时间' },
            { fileName: '文件名.xlsx', user: '用户', uploadTime: '上传时间' },
            { fileName: '文件名.pdf', user: '用户', uploadTime: '上传时间' }
          ],
          totalCount: 1
        }
      },
      row: {}
    }
  },
  mounted() {
    this.url = this.$http.adornUrl('/externalProject/uploadCustomerStatement')
  },
  methods: {
    look(row) {
      if (row.fileName.endsWith('.docx') || row.fileName.endsWith('.doc') || row.fileName.endsWith('.docm')) {
        // row.filePath = 'http://static.shanhuxueyuan.com/test6.docx'
        let src = encodeURIComponent(row.filePath)
        window.open('/office?type=docx&src=' + src, '_blank')
      } else if (row.fileName.endsWith('.xlsx') || row.fileName.endsWith('.xls') || row.fileName.endsWith('.xlt')) {
        // row.filePath = 'http://static.shanhuxueyuan.com/demo/excel.xlsx'
        let src = encodeURIComponent(row.filePath)
        window.open('/office?type=xlsx&src='+src, '_blank')
      } else if (row.fileName.endsWith('.pdf')) {
        // row.filePath = 'http://static.shanhuxueyuan.com/demo/test.pdf'
        let src = encodeURIComponent(row.filePath)
        window.open('/office?type=pdf&src='+src, '_blank')
      }
    },
    download(row) {
      this.$http.download(row.filePath, {}, this,row.fileName)
    },
    refresh() {
      this.$refs.table.refresh(this.dataConversion(this.queryParams))
      if (this.isEntry) {
        this.initProject()
      }
    },
    handlerFlag() {
      this.$emit('changeName', this.initData.name)
      this.flag = 0
      this.$nextTick(function () {
        this.refresh()
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
    removeFile(row) {
      this.$confirm(` 您确定要删除此文件吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/externalProject/deleteOrderCustomerStatement?id='+row.id),
            method: 'delete'
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getApplyDocData()
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
    remove(row) {
      this.$confirm(`确定删除此订单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/externalProject/deleteProjectOrder?id='+row.id),
            method: 'delete'
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
    jobChange(postIndex) {
      this.postLevelSet.length = 0
      this.postLevelSet = [...this.jobListDetail[postIndex].levels]
    },
    // 查询条件数据转换
    dataConversion(form) {
      let params = JSON.parse(JSON.stringify(form))
      params.projectId = this.initData.id
      if (this.startTime.length > 0) {
        params.startTimeBegin = this.startTime[0]
        params.startTimeOver = this.startTime[1]
      }
      if (this.endTime.length > 0) {
        params.endTimeBegin = this.endTime[0]
        params.endTimeOver = this.endTime[1]
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
      Object.assign(this.initData, initData)
      this.queryParams.projectId = initData.id
      this.refresh()
    },
    addOrEditOrder(row) {
      if (row) {
        this.title = '编辑订单'
      } else {
        this.title = '添加订单'
      }
      this.$refs.addOrderDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrder.init(row, this.initData)
      })
    },
    applyDocPage(row) {
      this.row = { orderId: row.id}
      this.$refs.applyDocDialog.show()
      this.$nextTick(() => {
        this.getApplyDocData()
      })
    },
    getApplyDocData(){
      this.$http({
        url: this.$http.adornUrl('/externalProject/listOrderCustomerStatement?orderId=' + this.row.orderId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.fakeApplyData.page.list = data.payload
          this.$refs.applyDocTable.fakeData(this.fakeApplyData)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    openPersonnel(row) {
      this.flag = 1
      this.$emit('changeName', this.initData.name, row.name + '-人员管理')
      this.$nextTick(() => {
        this.$refs.personnel.init(row, this.initData)
      })
    },
    makeConfirmDoc(row) {
      this.flag = 2
      this.$emit('changeName', this.initData.name, row.name + '-生成结算单')
      this.$nextTick(() => {
        this.$refs.personnel.init(row, this.initData)
      })
    },
    resetForm() {
      this.$refs.orderForm.resetFields()
      this.queryParams.projectId = this.initData.id
      this.endTime = []
      this.startTime = []
      this.refresh()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
<style scoped lang="scss">
.main-box {
  height: 100%;
  padding: 0 24px 0 16px;
  background: #fff;
}

.ownBar {
  color: #2462F9;
  background-color: #EEF3FF;
  display: inline-block;
  border-radius: 3px;
  width: 65px;
}

.notOwnBar {
  color: #E37318;
  background-color: #FDF4ED;
  display: inline-block;
  border-radius: 3px;
  width: 65px;
}
</style>
