<!-- 一个标题样式的公共组件  -->
<template>
  <div class="in-div-top title-font title-component" :style="{'--color':textColor}">
    {{ this.text }}
  </div>
</template>

<script>
export default {
  name: 'titleComponent',
  data() {
    return {
      titleMap: new Map([]),
      textColor: null
    }
  },
  props: {
    // color: {  //删除
    //   type: String,
    // },
    text: {
      type: String
    },
    keyText: {
      type: String
    }
  },
  mounted() {
    if (this.titleMap.get(this.keyText) != undefined) {
      this.textColor = this.titleMap.get(this.keyText).color
    }
  }
}
</script>

<style scoped>
.title-font {
  line-height: 30px;
  text-align: left;
}

.title-component {
  position: relative;
}

.title-component::before {
  content: "";
  position: absolute;
  width: 8px;
  height: 12px;
  top: 45%;
  transform: translateY(-50%);
  left: -15px;
  background: linear-gradient(90deg, #68EAE8 0%, #296DFF 100%);
}

.in-div-cont {
  border: 2px solid #e8edf4;
  height: 100%;
  border-radius: 3px;
}

.in-div-top {
  height: 30px;
  border-bottom: #5a5e66;
  position: relative;
  margin-bottom: 15px;
}

/*标题下方的横线*/
.in-div-top::after {
  content: '';
  top: 35px;
  position: absolute;
  height: 1px;
  width: 102%;
  left: -16px;
  background-color: #E4E4E4;
}
</style>
