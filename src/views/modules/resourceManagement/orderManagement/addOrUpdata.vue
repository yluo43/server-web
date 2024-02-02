<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-descriptions>
        <template v-slot:title>
          <span class="title">● {{ order.name }}</span>
        </template>
        <el-descriptions-item label="项目编码">{{ order.projectId }}</el-descriptions-item>
        <el-descriptions-item label="项目经理">{{ order.mannagerName }}</el-descriptions-item>
        <el-descriptions-item label="立项时间">{{ order.approvalDate }}</el-descriptions-item>
        <el-descriptions-item label="合同类型">{{ order.contractTypeName }}</el-descriptions-item>
        <el-descriptions-item label="结算周期">{{ order.settlementCycle }}</el-descriptions-item>
        <el-descriptions-item label="计划交付时间">{{ order.deliveryDate }}</el-descriptions-item>
        <el-descriptions-item label="项目状态">
          <div style="width: 80%">
            <!--            0交付中 1已交付 2关闭 3已回款-->
            <el-steps :active="order.state + 1">
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
      >
        添加订单
      </el-button>
      <el-collapse v-model="activeNames" @change="handleChange">
        <template v-for="(item, index) in orderList">
          <div style="display: flex; justify-content: right">
            <el-link type="primary" @click="viewOrder(item)">查看详情 |</el-link>
            <el-link type="primary" @click="updateOrder(item)">编辑 |</el-link>
            <el-link type="primary" @click="deleteOrder(item)" style="margin-right: 30px">删除</el-link>
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
                  class="upload-demo"
                  action="#"
                  :limit="1"
                  :accept="'.pdf,.PDF'"
                  :auto-upload="false"
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
                <el-select v-model="scope.item.row.state" placeholder="请选择" :disabled="scope.item.row.clientTypeShow">
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
                  :disabled="scope.item.row.clientTypeShow"
                ></el-date-picker>
              </template>
              <template v-slot:returnAcount="scope">
                <el-input v-model="scope.item.row.returnAcount" placeholder="请输入" :disabled="scope.item.row.clientTypeShow"></el-input>
              </template>
              <template v-slot:returnFile="scope">
                <el-upload
                  class="upload-demo"
                  action="#"
                  :limit="1"
                  :accept="'.pdf,.PDF'"
                  :auto-upload="false"
                  :on-change="
                    (file, fileList) => {
                      returnFileShowChange(file, fileList, scope, index)
                    }
                  "
                  :file-list="scope.item.row.returnFileList"
                >
                  <el-button icon="el-icon-upload2" :disabled="scope.item.row.clientTypeShow" style="width: 100px">上传文件</el-button>
                  <div v-if="scope.item.row.returnFileShow" slot="tip" class="el-upload__tip">支持扩展名：.pdf</div>
                </el-upload>
              </template>
              <template v-slot:clientType="scope">
                <!--类型插槽-->
                <template v-if="scope.item.row.clientTypeShow">
                  <el-link type="primary" @click="editSettlement(scope, index)">编辑 |</el-link>
                  <el-link type="primary" @click="deleteSettlement(scope, index)">删除</el-link>
                </template>
                <template v-else>
                  <el-link type="primary" @click="updateSettlement(scope, item)">保存 |</el-link>
                  <el-link type="primary" @click="cancelSettlement(scope, index)">取消</el-link>
                </template>
              </template>
            </baseTable>
          </el-collapse-item>
          <div class="center-button-container">
            <el-button
              class="el-button-func"
              style="width: 500px; background-color: #f5fbff; border: solid 1px #008aff"
              @click="addSettlement(index)"
              icon="el-icon-circle-plus-outline"
            >
              添加结算回款
            </el-button>
          </div>
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
      orderData: { settlementDate: '' },
      tableData: {
        theads: [
          { label: '结算时间', prop: 'settlementDate', slotName: 'settlementDate', width: '112px' },
          { label: '结算金额', prop: 'settlementAcount', slotName: 'settlementAcount', width: '50px' },
          { label: '结算单', prop: 'settlementFile', slotName: 'settlementFile', width: '80px' },
          { label: '预计回款时间', prop: 'expectReturnDate', slotName: 'expectReturnDate', width: '112px' },
          { label: '状态', prop: 'state', slotName: 'state', width: '80px' },
          { label: '回款时间', prop: 'returnDate', slotName: 'returnDate', width: '112px' },
          { label: '回款金额', prop: 'returnAcount', slotName: 'returnAcount', width: '50px' },
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
      ]
    }
  },
  methods: {
    init(data) {
      if (data) {
        Object.assign(this.order, data)
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
                  item.clientTypeShow = true
                  if (item.settlementFilePath) {
                    item.settlementFileList = [{ name: item.settlementFilePath.match(/\/([^/]+)$/)[1] }]
                  }
                  if (item.returnFilePath) {
                    item.returnFileList = [{ name: item.returnFilePath.match(/\/([^/]+)$/)[1] }]
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
          returnAcount += parseFloat(a.returnAcount)
          settlementAcount += parseFloat(a.settlementAcount)
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
        state: null,
        returnDate: '',
        returnAcount: null,
        returnFileList: [],
        returnFile: null,
        settlementFileShow: true,
        returnFileShow: true,
        clientTypeShow: true
      })
    },
    editSettlement(scope, index) {
      scope.item.row.clientTypeShow = false
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table[index].__rowClick(scope.item.row)
      })
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
    updateSettlement(scope, item) {
      let obj = scope.item.row
      if (obj.state === 3) {
        if (!obj.returnDate || !obj.returnAcount || !obj.returnFile) {
          this.$message.warning('当状态为“已收款”时，列表中回款时间、回款金额、回款单信息必须填写上传！')
          return
        }
      } else {
        if (obj.returnDate || (obj.returnAcount && obj.returnAcount !== '0.00') || obj.returnFile) {
          this.$message.warning('当状态为“实施中、提交材料、提交开票”时，列表中回款时间、回款金额、回款单信息无需填写上传！')
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
      this.$http({
        url: this.$http.adornUrl('/costItems/settlement/update'),
        method: 'put',
        data: formData
      }).then(({ data }) => {
        if (data.success) {
          this.refresh()
          this.$emit('refreshDataList')
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.dataForm.orderFile = data.orderFilePath
          this.$message.error(data.msg)
        }
      })
    },
    cancelSettlement(scope, index) {
      scope.item.row.clientTypeShow = true
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table[index].__rowClick(scope.item.row)
      })
    },
    // 取消
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
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
