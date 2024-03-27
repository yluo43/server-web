<template>
  <div id="app">
    <router-view v-if="showRouter"></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  // 在页面加载时读取sessionStorage里的状态信息
  created() {
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  provide() {
    return {
      reload: this.reload()
    }
  },
  data() {
    return {
      showRouter: true
    }
  },
  methods: {
    reload() {
      this.showRouter = true
    }
  }

}
</script>

<style>
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  /*  font-family:"open sans","Helvetica Neue",Helvetica,Arial,sans-serif;*/
  font-size: 13px;
  min-width: 1100px;
  overflow-x: auto;
}

</style>

