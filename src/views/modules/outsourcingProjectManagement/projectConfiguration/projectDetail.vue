<template>
  <div class="container">
    <div class="projectName-header">
      <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick" style="width: 80%">
        <el-tab-pane label="项目信息" name="projectName"></el-tab-pane>
        <el-tab-pane label="入场人员" name="second"></el-tab-pane>
        <el-tab-pane label="离场人员" name="third"></el-tab-pane>
        <!--        <el-tab-pane label="结算信息" name="fourth"></el-tab-pane>-->
      </el-tabs>

      <div style="display: flex; align-items: center; margin-left: auto;margin-right: 20px">
        <el-button @click="returnIndexPage">返回</el-button>
      </div>
    </div>
    <div style=" margin-top: 24px;display: flex; align-items: center; padding: 16px 0 16px 20px;background: #fff;">
      <div class="circular"></div>
      <span style="font-size: 20px;margin-left: 10px;">{{ initData.name }}</span>
    </div>
    <div v-show="activeName == 'projectName'" class="main">
      <projectInfo ref="projectInfo" @changeName="changeName"/>
    </div>
    <div v-show="activeName == 'second'" class="main">
      <entryPersonnel :isEntry="true" ref="entryPersonnel"/>
    </div>
    <div v-show="activeName == 'third'" class="main">
      <entryPersonnel :isEntry="false" ref="departurePersonnel"/>
    </div>
  </div>
</template>
<script>
import projectInfo from './projectInfo'
import entryPersonnel from './entryPersonnel'

export default {
  components: {projectInfo, entryPersonnel},
  data() {
    return {
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
    },
    changeName(name) {
      this.initData.name = name
    },
    // 返回主页面
    returnIndexPage() {
      this.$emit('changePageFlag', 1)
    },
    //获取项目基本信息
    getProjectInfo() {

    },
    //查询列表数据
    searchTableData(activeName) {
      if (activeName == 'second') {
        this.$refs.entryPersonnel.refreshTable(this.personnelDataForm)
      } else if (activeName == 'third') {
        this.$refs.departurePersonnel.refreshTable(this.personnelDataForm)
      }
    },
    //tab切换
    tabClick(tab) {
      if (tab.name === 'second') {
        this.$refs.entryPersonnel.refresh()
      } else if (tab.name === 'third') {
        this.$refs.departurePersonnel.refresh()
      }
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

  .second-header {
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
