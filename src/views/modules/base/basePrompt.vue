<template>
  <div>
    <base-dialog :title="obj.dialogTitle" ref="dialog" :modal="false">
      <template>
        <div>
          <el-form size="small" label-width="150px" label-position="left" ref='dataForm'>
            <slot></slot>
            <el-form-item :label="obj.dialogLabel">
              <el-input
                type="textarea"
                rows="4"
                v-model="obj.propmtText"
                :maxlength="obj.maxlength" :show-word-limit="obj.maxlength > 0"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right; padding: 10px 7px">
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
        dialogTitle: '',
        dialogLabel: null,
        propmtText: '',
        callback: null,
        cancelCallback: null,
        btnSuccess: '提交',
        btnCancel: '取消',
        inputErrorMessage: '',
        maxlength: 0
      }
    }
  },
  methods: {
    openByOption(label, title, option) {
      this.obj.dialogTitle = title
      this.obj.dialogLabel = label
      this.obj.callback = option.btnSuccessCallback
      this.obj.cancelCallback = option.btnCancelCallback
      this.obj.inputErrorMessage = option.inputErrorMessage
      this.obj.btnCancel = option.btnCancel
      this.obj.propmtText = ''
      this.obj.maxlength = option.maxlength || 0
      this.$refs.dialog.show()
    },
    open(label, title, callback) {
      this.obj = {}
      this.obj.dialogTitle = title
      this.obj.dialogLabel = label
      this.obj.callback = callback
      this.$refs.dialog.show()
    },
    onSubmit() {
      if (this.obj.callback == null) {
        this.$refs.dialog.hide()
        return
      }
      let message = this.obj.callback(this.obj.propmtText)
      if (message != null && message.length > 0) {
        this.$message.error(message)
        return
      }
      if (!message) {
        this.$refs.dialog.hide()
      }
    },
    cancelDialog() {
      if (this.obj.cancelCallback == null) {
        this.$refs.dialog.hide()
        return
      }
      let message = this.obj.cancelCallback(this.obj.propmtText)
      if (message != null && message.length > 0) {
        this.$message.error(message)
        return
      }
      if (!message) {
        this.$refs.dialog.hide()
      }
    }
  }
}
</script>
