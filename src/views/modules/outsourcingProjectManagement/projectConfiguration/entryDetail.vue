<template>
  <div>
    <el-form ref="departurePersonnelInfoForm" :model="departurePersonnelInfo" label-width="100px" label-position="right"
             :rules="rules">
      <el-form-item label="入场日期:" prop="entryTime">
        <el-date-picker
            v-model="departurePersonnelInfo.entryTime"
            style="width: 300px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入场日期"
        />
      </el-form-item>
      <el-form-item label="计划离场日期:" prop="planExitTime">
        <el-date-picker
            v-model="departurePersonnelInfo.planExitTime"
            style="width: 300px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划离场日期"
            clearable
        />
      </el-form-item>
      <el-form-item label="人员岗位:" prop="postIndex">
        <el-select v-model="departurePersonnelInfo.postIndex" placeholder="请选择岗位" clearable style="width: 300px"
                   @change="jobChange">
          <el-option v-for="(item,i) in jobList" :key="item.name" :label="item.name" :value="i"/>
        </el-select>
      </el-form-item>
      <el-form-item label="人员等级:" prop="postId">
        <el-select v-model="departurePersonnelInfo.postId" style="width: 300px">
          <el-option v-for="item in postLevelSet" :key="item.postId" :label="item.level" :value="item.postId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="入场标记:" prop="entryMark">
        <el-radio-group v-model="departurePersonnelInfo.entryMark" style="width: 300px" @change="changeEntryMark">
          <el-radio :label="0">
            真实入场
          </el-radio>
          <el-radio :label="1">
            虚拟入场
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="入场原因:" prop="entryReason">
        <el-input
            v-model="departurePersonnelInfo.entryReason"
            type="textarea"
            style="width: 300px;margin-block: 6px"
            placeholder="请输入入场原因"
        ></el-input>
      </el-form-item>
      <div class="btn-group">
        <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="confirm()">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    jobList: {
      type: Object
    },
    postLevelSet: {
      type: Array
    }
  },
  data() {
    return {
      departurePersonnelInfo: {
        empId: '',
        name: '',
        postIndex: '',
        postName: '',
        level: '',
        entryTime: '',
        planExitTime: '',
        exitTime: '',
        entryReason: '',
        postId: '',
        entryMark: ''
      },
      pickerOptions: {},
      rules: {
        entryTime: [{required: true, message: '请选择入场日期', trigger: 'change'}],
        planExitTime: [{required: true, message: '请选择计划离场时间', trigger: 'change'}],
        postIndex: [{required: true, message: '请选择人员岗位', trigger: 'change'}],
        postId: [{required: true, message: '请选择人员等级', trigger: 'blur'}],
        entryMark: [{required: true, message: '请选择入场标记', trigger: 'change'}],
        entryReason: [{required: false, message: '请输入入场原因', trigger: 'change'}]
      }
    }
  },
  components: {},
  mounted() {
  },
  methods: {
    jobChange() {
      this.$emit('jobChange',this.departurePersonnelInfo.postIndex)
      delete this.departurePersonnelInfo.postId
    },
    init(initData) {
      // delete initData.postId
      Object.assign(this.departurePersonnelInfo, initData)
      this.pickerOptions = {
        disabledDate: (time) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const targetDate = new Date(this.departurePersonnelInfo.entryTime);
          targetDate.setHours(0, 0, 0, 0);
          return time.getTime() < targetDate.getTime();
        }
      }
      debugger
      this.changeEntryMark()
    },
    changeEntryMark() {
      if (this.departurePersonnelInfo.entryMark === 1) {
        this.rules.entryReason[0].required = true
      } else {
        this.rules.entryReason[0].required = false
      }
    },
    // 确认
    confirm() {
      this.$refs.departurePersonnelInfoForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/externalProject/updateEmpEntryProjectData'),
          method: 'post',
          data: this.departurePersonnelInfo
        }).then((result) => {
          if (result.data.success) {
            this.$message.success(result.data.msg)
            this.cancelDialog()
            this.$emit('refreshTableData')
          } else {
            this.$message.error('修改失败：' + result.data.msg)
          }
        })
      })
    },
    //取消
    cancelDialog() {
      this.$parent.hide()
    }
  }
}
</script>
<style scoped lang="scss"></style>
