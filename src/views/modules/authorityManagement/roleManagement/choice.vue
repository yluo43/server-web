<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <el-form :inline="true" :model="dataForm" ref="dataForm" style="width: 100%">
        <div v-for="(item,index) in choiceList" :key="index">
          <el-form-item :label="item.menuName">
            <el-checkbox-group v-model="choiceLists">
              <el-checkbox v-for="(items,indexs) in item.sons"
                v-model="items.hasPermission"
                :checked="items.hasPermission"
                :key="indexs" :label="items" @change="checkTitle(items, items.menuId,$event)"
                >{{items.menuName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div style="margin-top:20px;text-align:center;">
          <el-form-item>
            <el-button type="primary" @click="addOrUpdateHandle()">确定</el-button>
            <el-button  @click="cancelDialog()">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      choiceList: [],
      choiceLists: [],
      ids: '',
      dataForm: {
      },
      tableData: {
        theads: [
          { label: '用户账号', prop: 'account' },
          { label: '手机号', prop: 'isbn' },
          { label: '邮箱', prop: 'paperBookId' },
          { label: '开通时间', prop: 'brandPriceYuan' },
          { label: '账号状态', prop: 'status', slotName: 'status' }
        ],
        url: '/userRole/permission/list'
        // dataList: [{ account: '123456', isbn: '654321', paperBookName: 'firstBookName', paperBookName: 'thirdBookName', status: '2', modifyTime: 'seventhBookName', paperBookName: 'ninthBookName' }]
      }
    }
  },
  components: {
  },
  mounted() {
    // this.$refs.table.refresh(this.dataForm)
  },
  methods: {
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },
    init(id) {
      this.ids = id
      this.$http({
        url: this.$http.adornUrl('/userRole/permission/list'),
        method: 'get',
        params: this.$http.adornParams({
          'roleId': this.ids
        })
      }).then(({ data }) => {
        this.choiceList = data.payload
      })
    },
    // 修改
    addOrUpdateHandle() {
      this.$http({
        url: this.$http.adornUrl('/userRole/permission/update'),
        method: 'post',
        data: this.$http.adornData({
          'roleId': this.ids,
          'permissions': this.choiceLists
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$emit('refreshDataList')
          this.$parent.hide()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    // 取消
    cancelDialog() {
      this.$parent.hide()
    },
    checkTitle(val, index, e) {
      val.hasPermission = !val.hasPermission
    }
  }
}
</script>
<style scoped>
</style>
