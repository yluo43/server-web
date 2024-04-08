<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-descriptions>
        <template v-slot:title>
          <span class="title">● {{ order.name }}</span>
        </template>
        <el-descriptions-item label="项目编码">{{ order.projectId }}</el-descriptions-item>
        <el-descriptions-item label="项目经理">{{ order.managerName }}</el-descriptions-item>
        <el-descriptions-item label="立项时间">{{ order.approvalDate }}</el-descriptions-item>
        <el-descriptions-item label="合同类型">{{ order.contractTypeName }}</el-descriptions-item>
        <el-descriptions-item label="结算周期">{{ order.settlementCycle }}</el-descriptions-item>
        <el-descriptions-item label="计划交付时间">{{ order.deliveryDate }}</el-descriptions-item>
        <el-descriptions-item label="项目状态">
          <div style="width: 80%">
            <!--            0交付中 1已交付 2关闭 3已回款-->
            <el-steps :active="order.state" finish-status="success">
              <el-step title="交付中"></el-step>
              <el-step title="已交付"></el-step>
              <el-step title="关闭"></el-step>
              <el-step title="已回款"></el-step>
            </el-steps>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <el-button
        class="el-button-func"
        style="width: 500px; background-color: #f5fbff; margin: 30px auto; border: solid 1px #008aff"
        @click="addOrder()"
        icon="el-icon-circle-plus-outline"
        :disabled="viewDisabled"
      >
        添加订单
      </el-button>
      <el-collapse v-model="activeNames" @change="handleChange">
        <template v-for="(item, index) in orderList">
          <div style="display: flex; justify-content: right">
            <el-link type="primary" @click="viewOrder(item)">查看详情 |</el-link>
            <el-link type="primary" @click="updateOrder(item)" :disabled="viewDisabled">编辑 |</el-link>
            <el-link type="primary" @click="deleteOrder(item)" :disabled="viewDisabled" style="margin-right: 30px">删除</el-link>
          </div>
          <el-collapse-item :title="item.orderName" :name="index">
            <span style="font-weight: bold; font-size: medium">结算回款</span>
            <div class="chooseResult">
              <i class="el-icon-info" style="color: #108ee9"></i>
              <span class="chooseResultStr" v-html="chooseStr"></span>
            </div>
            <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect" :hidePage="true">
              <template v-slot:settlementDate="scope">
                <el-date-picker
                  v-model="scope.item.row.settlementDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  style="width: 100%"
                  placeholder="选择日期"
                  :disabled="scope.item.row.clientTypeShow"
                ></el-date-picker>
              </template>
              <template v-slot:settlementAcount="scope">
                <el-input v-model="scope.item.row.settlementAcount" :disabled="scope.item.row.clientTypeShow" placeholder="请输入"></el-input>
              </template>
              <template v-slot:settlementFile="scope">
                <el-upload
                  :disabled="scope.item.row.clientTypeShow"
                  class="upload-demo"
                  action="#"
                  :limit="1"
                  :accept="'.pdf,.PDF'"
                  :auto-upload="false"
                  :on-remove="(file, fileList) => handleFirstRemove(file, fileList, scope, index)"
                  :on-change="
                    (file, fileList) => {
                      handleFileChange(file, fileList, scope, index)
                    }
                  "
                  :file-list="scope.item.row.settlementFileList"
                >
                  <el-button icon="el-icon-upload2" :disabled="scope.item.row.clientTypeShow" style="width: 100px">上传文件</el-button>
                  <div v-if="scope.item.row.settlementFileShow" slot="tip" class="el-upload__tip">支持扩展名：.pdf</div>
                </el-upload>
              </template>
              <template v-slot:expectReturnDate="scope">
                <el-date-picker
                  v-model="scope.item.row.expectReturnDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  style="width: 100%"
                  placeholder="选择日期"
                  :disabled="scope.item.row.clientTypeShow"
                ></el-date-picker>
              </template>
              <template v-slot:state="scope">
                <el-select v-model="scope.item.row.state" placeholder="请选择" :disabled="scope.item.row.clientTypeShow" @change="stateChange(scope)">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
              <template v-slot:returnDate="scope">
                <el-date-picker
                  v-model="scope.item.row.returnDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  style="width: 100%"
                  placeholder="选择日期"
                  :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow"
                ></el-date-picker>
              </template>
              <template v-slot:returnAcount="scope">
                <el-input
                  v-model="scope.item.row.returnAcount"
                  placeholder="请输入"
                  clearable
                  :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow"
                ></el-input>
              </template>
              <template v-slot:returnFile="scope">
                <el-upload
                  :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow"
                  class="upload-demo"
                  action="#"
                  :limit="1"
                  :accept="'.pdf,.PDF'"
                  :auto-upload="false"
                  :on-remove="(file, fileList) => handleSecondRemove(file, fileList, scope, index)"
                  :on-change="
                    (file, fileList) => {
                      returnFileShowChange(file, fileList, scope, index)
                    }
                  "
                  :file-list="scope.item.row.returnFileList"
                >
                  <el-button icon="el-icon-upload2" :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow" style="width: 100px">
                    上传文件
                  </el-button>
                  <div slot="tip" v-if="scope.item.row.returnFileShow" class="el-upload__tip">支持扩展名：.pdf</div>
                </el-upload>
              </template>
              <template v-slot:clientType="scope">
                <!--类型插槽-->
                <template v-if="scope.item.row.clientTypeShow">
                  <el-link type="primary" @click="editSettlement(scope, index)" :disabled="viewDisabled">编辑 |</el-link>
                  <el-link type="primary" @click="deleteSettlement(scope, index)" :disabled="viewDisabled">删除</el-link>
                </template>
                <template v-else>
                  <el-link type="primary" @click="updateSettlement(scope, item, index)" :disabled="viewDisabled">保存 |</el-link>
                  <el-link type="primary" @click="cancelSettlement(scope, index)" :disabled="viewDisabled">取消</el-link>
                </template>
              </template>
            </baseTable>
            <div class="center-button-container">
              <el-button
                class="el-button-func"
                style="width: 500px; background-color: #f5fbff; border: solid 1px #008aff"
                @click="addSettlement(index)"
                icon="el-icon-circle-plus-outline"
                :disabled="viewDisabled"
              >
                添加结算回款
              </el-button>
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
    </el-container>
    <base-dialog :title="title" ref="addOrUpdateDrawer" :width="'40%'">
      <template>
        <add-order @refreshDataList="refresh" ref="addOrderRef"></add-order>
      </template>
    </base-dialog>
    <base-dialog :title="title" ref="viewOrderDialog" :width="'40%'">
      <template>
        <view-order @refreshDataList="refresh" ref="viewOrderRef"></view-order>
      </template>
    </base-dialog>
  </div>
</template>
<script>
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addOrder from './addOrder.vue'
import viewOrder from './viewOrder.vue'
import baseTable from '@/views/modules/base/baseTableScope.vue'

export default {
  components: { baseTable, addOrder, baseDialog, viewOrder },
  data() {
    return {
      chooseStr: '已选择 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已回款 0.00',
      title: '',
      order: {
        name: '',
        projectId: '',
        mannagerName: '',
        approvalDate: null,
        contractTypeName: '',
        settlementCycle: ''
      },
      flag: true,
      orderData: { settlementDate: '' },
      tableData: {
        theads: [
          { label: '结算时间', prop: 'settlementDate', slotName: 'settlementDate', width: '112px' },
          { label: '结算金额', prop: 'settlementAcount', slotName: 'settlementAcount', width: '50px' },
          { label: '结算单', prop: 'settlementFile', slotName: 'settlementFile', width: '80px' },
          { label: '预计回款时间', prop: 'expectReturnDate', slotName: 'expectReturnDate', width: '112px' },
          { label: '状态', prop: 'state', slotName: 'state', width: '80px' },
          { label: '回款时间', prop: 'returnDate', slotName: 'returnDate', width: '112px' },
          { label: '回款金额', prop: 'returnAcount', slotName: 'returnAcount', width: '80px' },
          { label: '回款单', prop: 'returnFile', slotName: 'returnFile', width: '80px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '80px' }
        ],
        height: '150px',
        minHeight: '180px',
        maxHeight: '300px'
      },
      orderList: [],
      activeNames: [],
      // 结算单状态 状态（0实施中、1 提交材料、2 提交开票、3 已收款）
      options: [
        {
          value: 0,
          label: '实施中'
        },
        {
          value: 1,
          label: '提交材料'
        },
        {
          value: 2,
          label: '提交开票'
        },
        {
          value: 3,
          label: '已收款'
        }
      ],
      viewDisabled: false
    }
  },
  methods: {
    init(data) {
      if (data) {
        Object.assign(this.order, data)
      }
      if (this.order.state === 2 || this.order.state === 3) {
        this.viewDisabled = true
      }
      this.refresh()
    },
    addOrder() {
      this.title = '添加订单'
      this.$refs.addOrUpdateDrawer.show()
      this.$nextTick(() => {
        this.$refs.addOrderRef.init('add', this.order.id)
      })
    },
    refresh() {
      this.$http({
        url: this.$http.adornUrl('/costItems/order/list'),
        params: { projectId: this.order.id },
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.orderList = data.payload
          if (this.orderList) {
            for (let i = 0; i < this.orderList.length; i++) {
              this.activeNames.push(i)
              this.$nextTick(() => {
                let settlementDtos = this.orderList[i].settlementDtos
                settlementDtos.forEach((item) => {
                  this.$set(item, 'clientTypeShow', true)
                  this.$set(item, 'settlementFileShow', true)
                  this.$set(item, 'returnFileShow', true)
                  this.$set(item, 'returnShow', true)
                  //item.clientTypeShow = true
                  // item.settlementFileShow = true
                  //item.returnFileShow = true
                  //item.returnShow = true
                  item.settlementFileList = []
                  item.returnFileList = []
                  if (item.settlementFilePath) {
                    item.settlementFileList = [{ name: item.settlementFilePath.match(/\/([^/]+)$/)[1] }]
                    item.settlementFileShow = false
                  }
                  if (item.state === 0) {
                    item.returnFileList = []
                  } else {
                    if (item.returnFilePath) {
                      item.returnFileList = [{ name: item.returnFilePath.match(/\/([^/]+)$/)[1] }]
                      item.returnFileShow = false
                    }
                  }
                  if (item.state === 3) {
                    item.returnShow = false
                  }
                })
                this.$refs.table[i].options.dataList = settlementDtos
              })
            }
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleChange() {},
    viewOrder(item) {
      this.title = '订单详情'
      this.$refs.viewOrderDialog.show()
      this.$nextTick(() => {
        this.$refs.viewOrderRef.init(item)
      })
    },

    updateOrder(item) {
      this.title = '编辑订单'
      this.$refs.addOrUpdateDrawer.show()
      this.$nextTick(() => {
        this.$refs.addOrderRef.init('update', item)
      })
    },
    deleteOrder(item) {
      this.$confirm('确定删除该订单信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/costItems/order/delete'),
            method: 'delete',
            params: { id: item.id }
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
    onSelect(selection) {
      if (selection.length > 0) {
        let returnAcount = 0
        let settlementAcount = 0
        selection.forEach((a) => {
          if (a.returnAcount) {
            returnAcount += parseFloat(a.returnAcount)
          }
          if (a.settlementAcount) {
            settlementAcount += parseFloat(a.settlementAcount)
          }
        })
        this.chooseStr = '已选中' + selection.length + '项&nbsp;&nbsp;&nbsp;&nbsp;合计：' + settlementAcount.toFixed(2) + '，已回款：' + returnAcount.toFixed(2)
      } else {
        this.chooseStr = '已选择 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已回款：0.00'
      }
    },
    addSettlement(index) {
      this.$refs.table[index].options.dataList.push({
        settlementDate: '',
        settlementAcount: null,
        settlementFileList: [],
        settlementFile: null,
        expectReturnDate: '',
        state: 0,
        returnDate: '',
        returnAcount: null,
        returnFileList: [],
        returnFile: null,
        settlementFileShow: true,
        returnFileShow: true,
        clientTypeShow: false,
        returnShow: true
      })
    },
    stateChange(scope) {
      if (scope.item.row.state === 3) {
        scope.item.row.returnShow = false
      } else {
        scope.item.row.returnShow = true
        scope.item.row.returnAcount = ''
        scope.item.row.returnDate = ''
        scope.item.row.returnFile = ''
        scope.item.row.returnFileList = []
        scope.item.row.returnFilePath = ''
        scope.item.row.returnFileShow = true
      }
    },
    editSettlement(scope, index) {
      scope.item.row.clientTypeShow = false
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table[index].__rowClick(scope.item.row)
      })
    },
    handleFirstRemove(file, fileList, scope, index) {
      scope.item.row.settlementFileShow = true
      scope.item.row.settlementFileList = fileList
      scope.item.row.settlementFilePath = ''
      scope.item.row.settlementFile = ''
    },
    handleSecondRemove(file, fileList, scope, index) {
      scope.item.row.returnFileShow = true
      scope.item.row.returnFileList = fileList
      scope.item.row.returnFilePath = ''
      scope.item.returnFile = ''
    },
    handleFileChange(file, fileList, scope, index) {
      if (file) {
        scope.item.row.settlementFileShow = false
        scope.item.row.settlementFile = file.raw
      }
      this.$refs.table[index].options.dataList[scope.item.$index] = scope.item.row
    },
    returnFileShowChange(file, fileList, scope, index) {
      if (file) {
        scope.item.row.returnFileShow = false
        scope.item.row.returnFile = file.raw
        console.log(scope.item.row)
      }
      this.$refs.table[index].options.dataList[scope.item.$index] = scope.item.row
    },
    deleteSettlement(scope, index) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (scope.item.row.id) {
            this.$http({
              url: this.$http.adornUrl('/costItems/settlement/delete'),
              method: 'delete',
              params: { id: scope.item.row.id }
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
          } else {
            this.$refs.table[index].options.dataList.splice(scope.item.$index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    updateSettlement(scope, item, index) {
      let obj = scope.item.row
      const regex = /^[0-9-.]*$/
      if (!obj.settlementAcount || obj.settlementAcount == '0.00' || obj.settlementAcount == '0') {
        this.$message.warning('结算金额不能为空和0')
        return
      }
      if (!regex.test(obj.settlementAcount)) {
        this.$message.warning('结算金额须为数字')
        return
      }
      if (obj.settlementDate && obj.expectReturnDate && obj.expectReturnDate < obj.settlementDate) {
        this.$message.warning('预计回款时间要大于等于结算时间')
        return
      }

      if (obj.state === 3) {
        if (!obj.returnDate || !obj.returnAcount || (!obj.returnFile && !obj.returnFilePath)) {
          this.$message.warning('当状态为“已收款”时，列表中回款时间、回款金额、回款单信息必须填写上传！')
          return
        }
        if (!obj.returnAcount || obj.returnAcount == '0.00' || obj.returnAcount == '0') {
          this.$message.warning('回款金额不能为空和0')
          return
        }
        if (!regex.test(obj.returnAcount)) {
          this.$message.warning('结算金额须为数字')
          return
        }
        if (obj.settlementDate && obj.returnDate && obj.returnDate < obj.settlementDate) {
          this.$message.warning('回款时间要大于等于结算时间')
          return
        }
        if (obj.returnAcount > obj.settlementAcount) {
          this.$message.warning('回款金额要小于等于结算金额')
          return
        }
      } else {
        if (obj.returnDate || (obj.returnAcount && obj.returnAcount !== '0.00') || obj.returnFile) {
          this.$message.warning('当状态为“实施中、提交材料、提交开票”时，列表中回款时间、回款金额、回款单信息无需填写上传！')
          return
        }
        if (!obj.settlementFile && !obj.settlementFilePath) {
          this.$message.warning('当状态为"实施中、提交材料、提交开票”时，结算单为必填项!')
          return
        }
      }
      let formData = new FormData()
      for (let key in obj) {
        if (obj[key] || obj[key] === 0) {
          formData.set(key, obj[key])
        }
      }
      formData.set('orderId', item.id)
      formData.set('projectId', this.order.id)
      if (this.flag) {
        this.flag = false
        this.$http({
          url: this.$http.adornUrl('/costItems/settlement/update'),
          method: 'put',
          data: formData
        })
          .then(({ data }) => {
            this.flag = true
            if (data.success) {
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.cancelSettlement(scope, index)
            } else {
              this.$message.error(data.msg)
              this.dataForm.orderFile = data.orderFilePath
            }
          })
          .catch(() => {
            this.flag = true
          })
      }
    },
    cancelSettlement(scope, index) {
      scope.item.row.clientTypeShow = true
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table[index].__rowClick(scope.item.row)
      })
      this.refresh()
    },
    // 取消
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
::v-deep .el-step__head.is-success {
  color: #008aff;
  border-color: #008aff;
}
::v-deep .el-step__title.is-success {
  color: #c0c4cc;
}
::v-deep .el-step__head.is-process {
  color: #008aff;
  border-color: #008aff;
}
::v-deep .el-input__icon {
  line-height: 30px;
}
.title {
  color: #008aff; /* 设置标题字体颜色为红色 */
  font-size: 20px;
}

::v-deep .el-descriptions-item__label {
  color: #008aff; /* 设置描述项label字体颜色为绿色 */
}

.el-link {
  margin-right: 10px;
}

.chooseResult {
  height: 30px;
  line-height: 30px;
  margin: 10px auto;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
}

.center-button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.el-select {
  width: 100px !important;
}
</style>
