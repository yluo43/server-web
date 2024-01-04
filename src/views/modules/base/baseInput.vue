<template>
  <div class="countries-select">
    <el-select
      style="width:100%;height: 50px"
      :value="value"
      multiple
      filterable
      allow-create
      :class="value.length>0?'overflow':''"
      default-first-option
      @change="changeValue"
      ref="elSelect"
      placeholder="请输入页码，回车确认">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {

    props: {
      value: {
        type: Array,
        default:()=>[]
      },
    },
    data() {
      return {
        options: [],
        // value: []
      }
    },
    mounted() {
      // this.filterData()
    },
    methods:{
      changeValue(value){
        console.log(value)
        if(value){
          var numReg = /^[0-9]*$/
          var numRe = new RegExp(numReg)
          if (!numRe.test(value[value.length-1])){
            value=value.slice(0,-1)
          }
        }
        this.$emit('input',value)
      },
      filterData(){
        const countriesSelect = document.querySelector('.countries-select input');
        countriesSelect.readOnly = false;
        countriesSelect.addEventListener('input', (val) => {
          console.log(val,val.target.value.search(/[^\d]/g,''))
          if (val.target.value.search(/[^\d]/g,'') !== -1) {
            val.target.value = ""
          }
        })
      }
    }
  }
</script>

<style scoped>
  .countries-select /deep/ .overflow  .el-select__tags {
    flex-wrap: unset;
    overflow-x:scroll;
  }
  .countries-select /deep/ .el-select .el-input {
    border-color: #409eff;
    width: 100%;
  }
  .countries-select /deep/ .el-input--small .el-input__inner{
    height: 40px;
    width: 100%;
  }
  .countries-select /deep/ .el-input--suffix .el-input__inner{
    height: 40px;
  }


</style>
