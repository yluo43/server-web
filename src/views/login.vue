<template>
  <div align="center">
    <div class="logoTitle">
      <img :src="logo" class="sidebar-logo" style="height: 64px" />
      <div id="u2300_text">
        <p><span style="color: #262b39; margin-left: 32px">PMIS项目管理系统</span></p>
      </div>
    </div>
    <div class="login-border">
      <div class="login-container">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          @submit.prevent="handleLogin"
          label-position="left"
        >
          <div class="title-container">
            <div class="title">
              <img src="@/assets/pmis-logo-small.png" />
              <span style="margin-left: 16px">欢迎登录</span>
            </div>
          </div>
          <div style="text-align: left; margin-top: 35px; height: 25px; line-height: 25px; font-size: 16px; color: #262b39">用户名</div>
          <el-form-item prop="username" style="margin-top: 3px">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              style="height: 45px"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <div style="text-align: left; margin-top: 24px; height: 25px; line-height: 25px; font-size: 16px; color: #262b39">密码</div>
          <el-form-item prop="password" style="margin-top: 3px">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <!--          <el-form-item prop="captcha">-->
          <!--            <el-row :gutter="20">-->
          <!--              <el-col :span="12">-->
          <!--                <el-input-->
          <!--                  ref="captchaStr"-->
          <!--                  v-model="loginForm.captchaStr"-->
          <!--                  placeholder="请输入验证码"-->
          <!--                  name="captchaStr"-->
          <!--                  type="text"-->
          <!--                  tabindex="3"-->
          <!--                  auto-complete="on"-->
          <!--                  style="height:45px;"-->
          <!--                  @keyup.enter.native="handleLogin"-->
          <!--                />-->
          <!--              </el-col>-->
          <!--              <el-col :span="12">-->
          <!--                <img :src="loginForm.captchaImgUrl" alt="验证码" style="height: 45px;float: right;" @click="getImageGeneration"/>-->
          <!--              </el-col>-->
          <!--            </el-row>-->
          <!--          </el-form-item>-->

          <el-button
            :loading="loading"
            type="primary"
            style="
              font-size: 17px;
              height: 48px;
              background-color: #2a6eff;
              background-image: none;
              border-radius: 4px;
              width: 100%;
              margin-top: 42px;
              align-content: center;
            "
            @click.native.prevent="handleLogin"
          >
            登&nbsp;&nbsp;录
          </el-button>
          <div style="display: flex; padding: 42px 34px; align-items: center">
            <div style="flex: 1; border: 1px solid #d8e0ef"></div>
            <div style="font-size: 14px; padding: 0 10px; color: #adb5bd">新讯数字科技有限公司</div>
            <div style="flex: 1; border: 1px solid #d8e0ef"></div>
            <!-- <el-divider content-position="center"><span style="font-size: 14px; color: #adb5bd">新讯数字科技有限公司</span></el-divider> -->
          </div>
        </el-form>
      </div>
    </div>
    <!-- <h2 style="color: aliceblue; position: fixed; bottom: 2em; left: 10%">系统使用最佳分辨率: 1920*1080</h2> -->
  </div>
</template>

<script>
import { setCName } from '@/utils/auth'
import logoImgMiddle from '@/assets/pmis-logo-big.png'
import { fnAddDynamicMenuRoutes } from '@/router'
import router from '@/router'
import { mapMutations } from 'vuex'
const Base64 = require('js-base64').Base64
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      checked: false,
      logo: logoImgMiddle,
      loginForm: {
        username: '',
        password: '',
        captchaStr: '',
        captchaImgUrl: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },

      loading: false,
      passwordType: 'password',
      redirect: undefined,
      bodyBgImage: 'url(' + require('@/assets/login-background.png') + ')'
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // 进来时调用添加
    this.setBodyBackGround()
    this.getCookie()
    // 获取验证码
    //this.getImageGeneration()
  },
  beforeDestroy() {
    // 离开页面时清除
    this.clearBodyBackGround()
  },
  methods: {
    ...mapMutations({
      setEmpId: 'user/SET_EMPID'
    }),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$http({
        url: this.$http.adornUrl('/userLogin/login'),
        method: 'POST',
        data: {
          password: this.loginForm.password,
          username: this.loginForm.username
          //captcha: this.loginForm.captchaStr
        }
      }).then((result) => {
        if (result.data.code === 200) {
          this.$message.success('登录成功')
          setCName(result.data.payload.name)
          this.setEmpId(result.data.payload.empId)
          this.$http({
            url: this.$http.adornUrl('/userInfo/menu'),
            method: 'get'
          })
            .then(({ data }) => {
              if (data && data.code === 200) {
                localStorage.setItem('buttons', JSON.stringify(data.payload.permissions || '[]'))
                fnAddDynamicMenuRoutes(data.payload.menuList)
                router.options.isAddDynamicMenuRoutes = true
                if (router.options.routes.length > 5) {
                  this.$router.push({ name: router.options.routes[5].children[0].name })
                } else {
                  this.$router.push({ name: 'index1' })
                }
              } else {
                router.push({ name: 'login' })
              }
            })
            .catch((e) => {
              router.push({ name: 'login' })
            })
        } else {
          this.$message.error(result.data.msg)
          if (result.data.msg === '验证码错误') {
            this.getImageGeneration()
          }
        }
        return {}
      })
    },
    // 添加body图片
    setBodyBackGround() {
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundImage = this.bodyBgImage
    },
    // 清除背景图
    clearBodyBackGround() {
      document.body.style.backgroundImage = ''
    },
    setCookie(userId, password, days) {
      let date = new Date() // 获取时间
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie = 'userId' + '=' + userId + ';path=/;expires=' + date.toGMTString()
      window.document.cookie = 'password' + '=' + password + ';path=/;expires=' + date.toGMTString()
    },

    // 读取cookie 将用户名和密码回显到input框中
    getCookie() {
      if (document.cookie.length > 0) {
        let arr = document.cookie.split('; ') //分割成一个个独立的“key=value”的形式
        for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split('=') // 再次切割，arr2[0]为key值，arr2[1]为对应的value
          if (arr2[0] === 'userId') {
            this.loginForm.username = arr2[1]
          } else if (arr2[0] === 'password') {
            this.loginForm.password = Base64.decode(arr2[1]) // base64解密
            this.checked = true
          }
        }
      }
    },

    getImageGeneration() {
      let that = this
      this.$http({
        url: this.$http.adornUrl('/captcha/imageGeneration'),
        method: 'GET',
        responseType: 'blob'
      }).then((result) => {
        if (!result) {
          this.$message.error('验证码获取失败')
        }
        const imgUrl = window.URL.createObjectURL(result.data)
        this.loginForm.captchaImgUrl = imgUrl
      })
    }
  }
}
</script>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg: #f5f7fa; //输入框自动输入时背景色
$light_gray: #fff;
$cursor: #666666; //输入框文字颜色

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.el-form-item__error {
  top: 50px !important;
}
.logoTitle {
  display: flex;
  align-items: center;
  margin-left: 76px;
  //margin-top: 60px;
  //float: left;
  //display: inline-flex;
  font-size: 42px;
}

/* reset element-ui css */
.login-container {
  /*按钮样式*/
  .el-button {
    background-image: linear-gradient(to left, #2566ff, #73ffe4);
    border: none;
  }

  .el-input {
    display: inline-block;
    height: 33px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      color: $cursor;
      height: 45px;
      caret-color: $cursor;
      border-radius: 4px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #ffffff inset !important;
        -webkit-text-fill-color: $cursor !important;
      }

      &:focus {
        box-shadow: 0 0 0px 1000px #ffffff inset !important;
      }
    }
  }

  .el-form-item {
    width: 100%;
    height: 50px;
    background: #fff;
    border: 1px solid #dddfe6;
    color: #bcbec0;
    //float: left;
    // margin-bottom: -23px;
    //margin-top: 50px;
    // padding-bottom: 1px;
    // border-radius: 4px;
    // background: #f5f7fa !important;
  }

  .el-form-item:focus-within {
    border-color: #2a6eff;
    background-color: #ffffff !important;
  }

  .el-form-item__content {
    // padding-bottom: 4px;
    line-height: 50px;
  }

  .el-checkbox {
    float: right;
  }
}
</style>

<style lang="scss" scoped>
// .el-form-item {
//   width: 100% !important;
// }
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$back_gray: #dfe5e7;

.login-container {
  height: 497px;
  width: 460px;
  overflow: hidden;
  border-radius: 20px;
  //margin-top: 5%;
  left: 75%;
  position: absolute;
  top: 200px;
  min-width: 460px;
  min-height: 497px;
  transform: translate(-50%);
  opacity: 1;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.4);
  // background-image: linear-gradient(white, white), linear-gradient(-30deg, #2668ff, #67e8e8);
  box-shadow: 0px 0px 20px 0px #e9eef6;
  padding: 1px;

  .login-form {
    position: relative;
    margin: 36px 30px 0px 30px;
    overflow: hidden;
  }

  .svg-container {
    padding: 0px 0px 7px 12px;
    color: $dark_gray;
    vertical-align: middle;
    width: 48px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      display: flex;
      align-items: center;
      font-size: 20px;
      color: #2462f9;
      //  margin: 0px auto -10px auto;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    right: 6%;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
