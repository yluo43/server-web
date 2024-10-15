<template>
  <div class="container">
    <div v-if="type ==='docx'" style="height: 100%">
      <vue-office-docx ref="office" :src="src"></vue-office-docx>
    </div>
    <div v-if="type ==='xlsx'" style="height: 100%">
      <vue-office-excel style="height: 800px" ref="office" :src="src"></vue-office-excel>
    </div>
    <div v-if="type ==='pdf'" style="height: 100%">
      <vue-office-pdf ref="office" :src="src"></vue-office-pdf>
    </div>
  </div>
</template>

<script>
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'

export default {
  components: { VueOfficeDocx, VueOfficeExcel, VueOfficePdf },
  props: {},
  data() {
    return {
      src: '',
      type: ''
    }
  },
  mounted() {
    this.getQueryParam()
  },
  methods: {
    getQueryParam() {
      // 获取当前页面的URL
      const url = window.location.href
      // 获取查询字符串（URL中"?"符后的部分）
      const queryString = url.split('?')[1]
      // 将查询字符串分割成键值对数组
      const params = new URLSearchParams(queryString)
      // 返回指定参数的值
      this.type = params.get('type')
      this.src = window.location.href.split('/office')[0] + decodeURIComponent(params.get('src'))
    }
  }
}
</script>
<style scoped lang="scss">

</style>
