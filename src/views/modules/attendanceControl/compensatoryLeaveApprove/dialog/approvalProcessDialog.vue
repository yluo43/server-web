<template>
  <div style="height: 100%">
    <el-steps :active="step" align-center>
      <el-step title="提交">
        <template slot="description">
          <div>{{ approveInfo.name }}</div>
          <div>{{ approveInfo.createTime }}</div>
        </template>
      </el-step>
      <el-step v-if="flag == 1" title="项目初审" :class="approveInfo.status === 1 ? 'style2' : 'style1'">
        <template slot="description">
          <div>{{ approveInfo.firstAuditor }}</div>
          <div>{{ approveInfo.firstTrialTime }}</div>
        </template>
      </el-step>
      <el-step v-else title="团队初审" :class="approveInfo.status === 1 ? 'style2' : 'style1'">
        <template slot="description">
          <div>{{ approveInfo.firstAuditor }}</div>
          <div>{{ approveInfo.firstTrialTime }}</div>
        </template>
      </el-step>
      <el-step v-if="approveInfo.status != 1" title="部门复审" :class="approveInfo.status != 1 && approveInfo.status != 3 ? 'style1' : 'style2'">
        <template slot="description">
          <div>{{ approveInfo.reAuditor }}</div>
          <div>{{ approveInfo.reTrialTime }}</div>
        </template>
      </el-step>
      <el-step v-if="approveInfo.status != 1 && approveInfo.status != 3" title="已通过"></el-step>
      <el-step v-else status="error" title="已驳回"></el-step>
    </el-steps>
    <div class="btn-group">
      <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="cancelDialog">确认</el-button>
    </div>
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
      flag: '',
      step: '',
      approveInfo: {
        name: '',
        createTime: '',
        firstAuditor: '',
        firstTrialTime: '',
        reAuditor: '',
        reTrialTime: '',
        status: ''
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    // status  0待初审1初审驳回2待复审3复审驳回4审核通过
    // flag  1加班 2调休
    init(initData, flag) {
      this.flag = flag
      let url
      let params = {}
      if (flag == 1) {
        url = this.$http.adornUrl('/attendance/overtimeStatusInfo')
        params = { overtimeId: initData.overtimeId }
      } else {
        url = this.$http.adornUrl('/attendance/dayoffStatusInfo')
        params = { dayoffId: initData.dayoffId }
      }
      this.getApproveInfo(url, params)
    },
    //获取审批信息
    getApproveInfo(url, params) {
      this.$http({
        url: url,
        method: 'get',
        params: params
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.approveInfo = data.payload[0]
          switch (this.approveInfo.status) {
            case 0:
              this.step = 1
              break
            case 1:
              this.step = 2
              break
            case 2:
              this.step = 2
              break
            case 3:
              this.step = 3
              break
            case 4:
              this.step = 3
              break
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .is-finish {
  .el-step__line {
    background-color: #409eff;
  }
}
.style1 {
  ::v-deep .is-finish {
    .el-step__line {
      background-color: #409eff;
    }
  }
}
.style2 {
  ::v-deep .is-finish {
    .el-step__line {
      background-color: red;
    }
  }
}

::v-deep .el-step__icon-inner {
  display: none;
}
::v-deep .el-step__icon {
  width: 10px;
  height: 10px;
  top: 5px;
}
::v-deep .el-step__title.is-finish {
  color: rgba(0, 0, 0, 0.42745098039215684);
}
::v-deep .el-step__head.is-process {
  border-color: #409eff; //#2462f9
  color: #409eff;
  .el-step__icon {
    width: 13px;
    height: 13px;
  }
}
::v-deep .el-step__head.is-error .el-step__icon {
  width: 13px;
  height: 13px;
}
::v-deep .el-step__description.is-finish {
  color: rgba(0, 0, 0, 0.42745098039215684);
}
</style>
