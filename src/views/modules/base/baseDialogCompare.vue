<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="title"
      :modal="true"
      :close-on-click-modal="false"
      :visible.sync="visible"
      :width="__reCalcWidth()"
      :top="__reCalcTop()"
      :append-to-body="true"
      @close="__dialogClose"
    >
      <div style="width: 50%;height: 100%; " >
        <img :src="modelImg" class="modelInvoice">
        <span class="invoiceCode">{{ invoiceCode }}</span>
        <span class="invoiceNumber">{{ invoiceNumber }}</span>
        <span class="invoiceAmountExcludeTax">￥{{ invoiceAmountExcludeTax }}</span>
        <span class="invoiceAmountIncludeTax">￥{{ invoiceAmountIncludeTax }}</span>
        <span class="invoiceDate">{{ invoiceDate }}</span>
      </div>
      <transition name="el-fade-in-linear">
        <div  v-if="this.visible" class="el-card__mdgView" style="overflow-x: hidden" v-bind:style="{'max-height': __reCalcHeight() }">
          <slot></slot>
        </div>
      </transition>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      invoiceCode: '',
      invoiceNumber: '',
      invoiceAmountExcludeTax: '',
      invoiceAmountIncludeTax: '',
      invoiceDate:'',
      modelImg:require('@/assets/InvoiceModel.jpg'),
    }
  },
  props: {
    title: {
      type: String,
      default: ' '
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      // default: this.__reCalcWidth
    },
    height: {
      type: String,
      // default: this.__reCalcHeight
    },
    // top: {
    //   type: String,
    //   default: this.__reCalcTop
    // }
  },
  methods: {
    init(row) {
      this.invoiceCode = row.invoiceCode
      this.invoiceNumber = row.invoiceNumber
      this.invoiceAmountExcludeTax = row.invoiceAmountExcludeTax
      this.invoiceAmountIncludeTax = row.invoiceAmountIncludeTax
      this.invoiceDate = row.invoiceDate
    },
    __reCalcWidth() {
      return '1366px'
    },
    __reCalcHeight() {
      return 400+'px';
      // if (this.height) {
      //   return this.height
      // }
      // return window.innerHeight * 0.7 + 'px'
    },
    __reCalcTop() {
      if (this.top) {
        return this.top
      }
      return window.innerHeight * 0.10 + 'px'
    },
    __dialogClose() {
      if (this.$listeners['dialogClose']) {
        this.$emit('dialogClose')
      }
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    getVisible() {
      return this.visible
    }
  }
}
</script>
<style scoped>
  .el-dialog__body{
  padding-left: 50px;
  padding-right: 40px;
}
.el-dialog__header{
  height: 50px;
  line-height: 30px;
  background: #5eafff;
  border-radius: 10px 10px 0px 0px;
}
.el-dialog__title{
  font-size: 18px !important;
  color: #fff;
}
.el-form-item__label{
  padding-right: 20px;
  width: 110px;
}

.el-card__mdgView{
 width: 50%;
}
.modelInvoice{
  width: 100%;
  height: 400px;
  float: left;
}
.invoiceCode{
  position: absolute;
  left: 130px;
  top: 102px;
  font-size: 18px;
  font-weight: bold;
  color: red;
  border: 3px solid #00ef00;
  padding: 2px;
}
.invoiceNumber{
  position: absolute;
  left: 500px;
  top: 102px;
  font-size: 18px;
  font-weight: bold;
  color: red;
  border: 3px solid #00ef00;
  padding: 2px;
}
  .invoiceAmountExcludeTax{
    position: absolute;
    left: 454px;
    top: 320px;
    font-size: 14px;
    font-weight: bold;
    color: red;
    border: 3px solid #00ef00;
    padding: 2px;
  }
  .invoiceAmountIncludeTax{
    position: absolute;
    left: 528px;
    top: 346px;
    font-size: 14px;
    font-weight: bold;
    color: red;
    border: 3px solid #00ef00;
    padding: 2px;
  }
  .invoiceDate{
    position: absolute;
    left: 541px;
    top: 134px;
    font-size: 14px;
    font-weight: bold;
    color: red;
    border: 3px solid #00ef00;
    padding: 2px;
    height: 20px;
    line-height: 13px;
  }
</style>
