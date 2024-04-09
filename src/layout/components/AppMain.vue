<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div id="water-mark-show">
        <router-view v-if="isRouterAlive" />
      </div>
    </transition>
  </section>
</template>

<script>
import { removeWatermark, setWaterMark } from '@/utils/waterMark'
import { getCName } from '@/utils/auth'

let elementResizeDetectorMaker = require('element-resize-detector')
export default {
  name: 'AppMain',
  data() {
    return {
      isRouterAlive: true
    }
  },
  mounted() {
    // 当屏幕大小进行缩放时，重新生成水印  window.onresize() 屏幕大小改变时触发、用了，登录页面也有水印
    // window.onresize = () => {
    //   this.set('noPdf', '')
    // }
    // 监听左侧树元素的变化,重新生成水印
    let erd = elementResizeDetectorMaker()
    let that = this
    erd.listenTo(document.getElementById('left-tree'), function (element) {
      that.$nextTick(function () {
        // 重新加载水印
        //setWaterMark(getCName(), '')
      })
    })
  },
  destroyed() {
    removeWatermark()
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 127px);
  width: 100%;
  position: relative;
  border-radius: 12px;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

#water-mark-show {
  z-index: 0;
}
</style>
