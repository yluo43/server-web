<template>
  <div style="height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <div>
      <img src="@/assets/success.png" style="width: 60px; height: 60px" />
    </div>
    <div style="font-weight: 600; font-size: 18px">提交成功</div>
    <p>{{ reportWorkName }}{{ teamName }}工作量提交成功！</p>
    <p>
      请于“团队工作量”中跟踪项目经理对团队成员的审批情况。
      <el-link type="primary" @click="goToTrack">去跟踪</el-link>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {
      reportWorkName: '',
      teamName: ''
    }
  },
  mounted() {},
  created() {},
  methods: {
    //初始化
    init(initData) {
      this.reportWorkName = initData.reportWorkName
      this.teamName = initData.teamName
    },
    goToTrack() {
      this.cancelDialog()
      this.$emit('track')
    }
  }
}
</script>

<style scoped></style>
