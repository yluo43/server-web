<template>
  <div class="container">
    <div class="projectName-header">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick" style="width: 80%">
        <el-tab-pane label="项目信息" name="projectName"></el-tab-pane>
        <el-tab-pane label="项目订单" name="order"></el-tab-pane>
        <el-tab-pane label="入场人员" name="entry"></el-tab-pane>
        <el-tab-pane label="离场人员" name="departure"></el-tab-pane>
        <!--        <el-tab-pane label="结算信息" name="fourth"></el-tab-pane>-->
      </el-tabs>

      <div style="display: flex; align-items: center; margin-left: auto;margin-right: 20px">
        <el-button @click="returnIndexPage">返回</el-button>
      </div>
    </div>
    <div style="margin-top: 24px; display: flex; align-items: center; justify-content: space-between; padding: 16px 0 16px 20px; background: #fff;">
      <!-- 包裹靠左的元素 -->
      <div style="display: flex; align-items: center;">
        <div class="circular"></div>
        <span style="font-size: 20px; margin-left: 10px;">{{ initData.name }}</span>
      </div>
      <!-- 靠右的元素 -->
      <i v-if="activeName === 'order'&&showClose" style="font-size: 20px;margin-right: 20px;" class="el-icon-close" @click="handlerFlag"></i>
    </div>
    <div v-if="activeName === 'order'&&showClose" style=" display: flex; align-items: center; justify-content: space-between; padding: 0 0 16px 20px; background: #fff;">
      <!-- 包裹靠左的元素 -->
      <div style="display: flex; align-items: center;">
        <span style="font-size: 18px; margin-left: 10px;">{{ title }}</span>
      </div>
      <!-- 靠右的元素 -->
    </div>
    <div style="height: 16px"/>
    <div v-show="activeName === 'projectName'" class="main">
      <projectInfo ref="projectInfo" @changeName="changeName"/>
    </div>
    <div v-show="activeName === 'order'" class="main">
      <order :isEntry="true" ref="order" @changeName="changeName"/>
    </div>
    <div v-show="activeName === 'entry'" class="main">
      <entryPersonnel :isEntry="true" ref="entryPersonnel"/>
    </div>
    <div v-show="activeName === 'departure'" class="main">
      <entryPersonnel :isEntry="false" ref="departurePersonnel"/>
    </div>
  </div>
</template>
<script>
import projectInfo from './projectInfo'
import entryPersonnel from './entryPersonnel'
import order from './order'

export default {
  components: {projectInfo, entryPersonnel,order},
  data() {
    return {
      title: '',
      showClose: false,
      activeName: 'projectName',
      levels: [],
      entryMarks: [],
      initData: {}
    }
  },
  mounted() {
  },
  methods: {
    // 初始化
    init(initData) {
      this.initData = initData
      this.$refs.projectInfo.init(initData)
      this.$refs.entryPersonnel.init(initData)
      this.$refs.departurePersonnel.init(initData)
      this.$refs.order.init(initData)
    },
    changeName(name,orderName) {
      if(orderName){
        this.title = orderName
        this.showClose = true
      } else {
        this.showClose = false
      }
      this.initData.name = name
    },
    // 返回主页面
    returnIndexPage() {
      this.$emit('changePageFlag', 1)
    },

    // tab切换
    tabClick(tab) {
      if (tab.name === 'entry') {
        this.$refs.entryPersonnel.refresh()
      } else if (tab.name === 'departure') {
        this.$refs.departurePersonnel.refresh()
      } else if (tab.name === 'order') {
        this.$refs.order.refresh()
      }
    },
    handlerFlag(){
      this.$refs.order.handlerFlag()
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  height: 100%;

  .projectName-header {
    padding: 24px;
    height: 80px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    display: flex;
    align-items: center;
  }

  .entry-header {
    padding: 24px 0 0 24px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
  }

  .search-form {
    margin-top: 20px;
  }
}

.el-input {
  width: 200px;
}

::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

::v-deep .el-tabs--border-card > .el-tabs__header {
  border-bottom: none;
}

::v-deep .el-tabs--border-card {
  border: none;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  height: 32px;
  line-height: 22px;
}

.bottom-btn {
  height: 60px;
  padding-right: 20px;
  margin-top: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1);
}

.circular {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(311deg, #3d6ce1 0%, #4d82ff 100%);
}
</style>
