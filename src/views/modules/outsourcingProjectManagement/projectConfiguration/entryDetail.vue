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
            :picker-options="pickerOptions"
            @change= "changeEntryTime"
        />
      </el-form-item>
      <el-form-item label="计划离场日期:" prop="planExitTime">
        <el-date-picker
            v-model="departurePersonnelInfo.planExitTime"
            style="width: 300px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择计划离场日期"
            :picker-options="pickerOptionsAgain"
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
          <div style="display: flex;  justify-content: space-between; width: 100%;">
            <div style="flex-basis: 50%;">
              <el-radio :label="0">
                真实入场
              </el-radio>
              <el-radio :label="2">
                虚拟入场（代付款）
              </el-radio>
            </div>
            <div style="flex-basis: 50%;">
              <el-radio :label="1" style="text-align: left;"> <!-- 确保文本左对齐 -->
                虚拟入场（补差价）
              </el-radio>
              <el-radio :label="3" style="text-align: left;"> <!-- 确保文本左对齐 -->
                虚拟入场（其他）
              </el-radio>
            </div>
          </div>
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
    },
    initData: {
      type: Object
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
      pickerOptionsAgain: {},
      rules: {
        entryTime: [{required: true, message: '请选择入场日期', trigger: 'change'},
          {
            validator: (rule, value, callback) => {
              if (new Date(value) > new Date(this.initData.endTime)) {
                callback(new Error('入场日期不能晚于项目结束日期'))
              } else if (new Date(value) < new Date(this.initData.startTime)) {
                callback(new Error('入场日期不能早于项目开始日期'))
              } else {
                callback();
              }
            },
            trigger: ['blur','change']
          }],
        planExitTime: [{required: true, message: '请选择计划离场时间', trigger: 'change'},{
          validator: (rule, value, callback) => {
            if (new Date(value) > new Date(this.initData.endTime)) {
              callback(new Error('计划离场时间不能晚于项目结束日期'))
            } else if (new Date(value) < new Date(this.initData.startTime)) {
              callback(new Error('计划离场时间不能早于项目开始日期'))
            } else if (new Date(value) < new Date(this.departurePersonnelInfo.entryTime)) {
              callback(new Error('计划离场时间不能早于入场日期'))
            } else {
              callback();
            }
          },
          trigger: ['blur','change']
        }],
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
          const startTime = new Date(this.initData.startTime)
          startTime.setHours(0, 0, 0, 0)
          const endTime = new Date(this.initData.endTime)
          endTime.setHours(0, 0, 0, 0)
          return time.getTime() > endTime.getTime() || time.getTime() < startTime.getTime()
        }
      }
      this.pickerOptionsAgain = {
        disabledDate: (time) => {
          const startTime = new Date(this.initData.startTime)
          startTime.setHours(0, 0, 0, 0)
          const entryTime = new Date(this.departurePersonnelInfo.entryTime)
          entryTime.setHours(0, 0, 0, 0)
          const endTime = new Date(this.initData.endTime)
          endTime.setHours(0, 0, 0, 0)
          return time.getTime() > endTime.getTime() || time.getTime() < startTime.getTime() || time.getTime() < entryTime.getTime()
        }
      }
      this.changeEntryMark()
    },
    changeEntryTime(){
      this.pickerOptionsAgain = {
        disabledDate: (time) => {
          const startTime = new Date(this.initData.startTime)
          startTime.setHours(0, 0, 0, 0)
          const entryTime = new Date(this.departurePersonnelInfo.entryTime)
          entryTime.setHours(0, 0, 0, 0)
          const endTime = new Date(this.initData.endTime)
          endTime.setHours(0, 0, 0, 0)
          return time.getTime() > endTime.getTime() || time.getTime() < startTime.getTime() || time.getTime() < entryTime.getTime()
        }
      }
    },
    changeEntryMark() {
      if (this.departurePersonnelInfo.entryMark === 0) {
        this.rules.entryReason[0].required = false
      } else {
        this.rules.entryReason[0].required = true
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
