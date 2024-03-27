<template>
  <div v-if="!!memberLogoUrl">
    <img :src="memberLogoUrl"
      :preview-src-list="memberLogoUrl"
      fit="contain"
      height="50px"
      @click="handlePictureCardPreview(memberLogoUrl)"/>
    <el-dialog :visible.sync="dialogVisible" title="查看图片" :modal="false">
      <div style="overflow: auto; padding: 20px;">
        <img fit="scale-down" :src="dialogImageUrl" alt="" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  props: {
    memberLogoUrl: {
      type: String,
      defualt: 'file'
    }
  },
  methods: {
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    }
  }
}
</script>
