<template>
    <div style="height: 100%">
        <el-container style="height: 100%; border: 1px solid #eee">
            <baseTable :tableData="tableData" ref="table" :type="null">
                <!-- 这个是自定义列字段 -->
                <template v-slot:phone="row">
                    <div>
                        {{ decodePhone(row.item.phone) }}
                    </div>
                </template>
                <template v-slot:status="row">
                    <template v-if="row.item.status == 0">
                        <el-tag type="success">正常</el-tag>
                    </template>
                    <template v-if="row.item.status == 1">
                        <el-tag type="danger">冻结</el-tag>
                    </template>
                </template>
            </baseTable>
        </el-container>
    </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import CryptoJS from '@/utils/crypto-js/crypto-js'
export default {
    data() {
        return {
            ids: '',
            dataForm: {
              roleId:''
            },
            tableData: {
                theads: [
                    { label: '用户账号', prop: 'userName' },
                    { label: '手机号', prop: 'phone', slotName: 'phone' },
                    { label: '邮箱', prop: 'mail' },
                    { label: '开通时间', prop: 'createTime' },
                    { label: '账号状态', prop: 'status', slotName: 'status' }
                ],
                url: '/userRole/user/list',
              dataList: []

            }
        }
    },
    components: {
        baseTable
    },
    mounted() {
        //this.refresh()
    },
    methods: {

        refresh() {
          console.log('111'+this.dataForm.roleId)
          let that = this
          this.$http({
            method: 'get',
            url: that.$http.adornUrl('/userRole/user/list?roleId='+this.dataForm.roleId),
            // params: that.$http.adornParams(this.dataForm)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.tableData.dataList.length = 0
              that.tableData.dataList.push(...data.payload)
            } else {
              that.$message.warning(data.msg)
            }
          })

        },
        init(id) {
          console.log(id)
            this.dataForm.roleId = id
          console.log(this.dataForm.roleId)

          this.refresh()

        },
        resetForm() {
            this.$refs.dataForm.resetFields()
        },
        // 取消
        cancelDialog() {
            this.$parent.hide()
        },
        // aes 解密
        decrypt(word, keyStr) {
            var key = CryptoJS.enc.Utf8.parse(keyStr)
            var decrypt = CryptoJS.AES.decrypt(word, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            })
            return CryptoJS.enc.Utf8.stringify(decrypt).toString()
        },
        decodePhone(phone) {
            return this.decrypt(phone, 'WB4wWc2HoXjaXg6u')
        }
    }
}
</script>
