<template>
  <div>
    <base-dialog :title="obj.dialogTitle" ref="dialog" :modal="false" :width="'450px'">
      <template>
        <div>
          <p v-for="(item,index) in obj.messageInfo" v-text="item"></p>
          <div style="text-align: center; padding: 10px 7px">
            <el-button type="primary" @click="onSubmit()">{{obj.btnSuccess}}</el-button>
            <el-button @click="cancelDialog()">{{obj.btnCancel}}</el-button>
          </div>
        </div>
      </template>
    </base-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        messageInfo: '',
        dialogTitle: '',
        callback: null,
        cancelCallback: null,
        btnSuccess: '提交',
        btnCancel: '取消',
        inputErrorMessage: ''
      }
    }
  },
  methods: {
    openByOption(label, title, option) {
      this.obj.messageInfo = label
      this.obj.dialogTitle = title
      this.obj.callback = option.btnSuccessCallback
      this.obj.cancelCallback = option.btnCancelCallback
      this.obj.inputErrorMessage = option.inputErrorMessage
      this.obj.btnCancel = option.btnCancel
      this.$refs.dialog.show()
    },
    open(label, title, callback) {
      this.obj = {}
      this.obj.dialogTitle = title
      this.obj.callback = callback
      this.$refs.dialog.show()
    },
    onSubmit() {
      if (this.obj.callback == null) {
        this.$refs.dialog.hide()
        return
      }
      this.obj.callback()
    },
    cancelDialog() {
      this.$refs.dialog.hide()
    }
  }
}
</script>
