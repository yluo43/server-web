<template>
  <div class="login-wrapper">
    <div class="logo-title">
      <img :src="logo" class="sidebar-logo" alt="Logo" />
      <div class="system-title">
        <span>GoalDay管理系统</span>
      </div>
    </div>

    <div class="login-box">
      <div class="login-container">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <div class="title-container">
            <div class="title">
              <span>欢迎登录</span>
            </div>
          </div>

          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              prefix-icon="el-icon-user"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              prefix-icon="el-icon-lock"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click.native.prevent="handleLogin"
          >
            登 录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { setCName, setUserID } from '@/utils/auth'
import logoImgMiddle from '@/assets/pmis-logo-big.png'
import Vue from 'vue'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }

    return {
      logo: logoImgMiddle,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.setBodyBackground()
  },
  beforeDestroy() {
    this.clearBodyBackground()
  },
  methods: {
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
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          const loginData = {
            username: this.loginForm.username.trim(),
            password: this.loginForm.password,
            type: 0
          }

          login(loginData)
            .then(response => {
              this.loading = false

              // 根据后端返回的数据结构处理
              if (response.data && response.data.code === 200) {
                const result = response.data.data

                this.$message.success('登录成功')

                // 保存用户信息
                if (result.username) {
                  setCName(result.username)
                }

                // 保存用户ID
                if (result.userId) {
                  setUserID(result.userId)
                } else if (result.id) {
                  setUserID(result.id)
                }

                // 保存token
                if (result.token) {
                  Vue.cookie.set('token', result.token)
                } else if (result.accessToken) {
                  Vue.cookie.set('token', result.accessToken)
                }

                // 设置默认系统为 GoalDay
                localStorage.setItem('currentSystem', 'goalday')

                // 跳转到首页或重定向页面
                if (this.redirect) {
                  this.$router.push({ path: this.redirect })
                } else {
                  this.$router.push({ path: '/home' })
                }
              } else {
                this.$message.error(response.data?.msg || '登录失败')
              }
            })
            .catch(error => {
              this.loading = false
              console.error('登录失败:', error)

              const errorMsg = error.response?.data?.msg || error.message || '登录失败，请检查网络连接'
              this.$message.error(errorMsg)
            })
        } else {
          return false
        }
      })
    },

    setBodyBackground() {
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundImage = 'url(' + require('@/assets/login-background.png') + ')'
    },

    clearBodyBackground() {
      document.body.style.backgroundImage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
$bg-color: #f5f7fa;
$primary-color: #2a6eff;
$text-color: #262b39;
$border-color: #dddfe6;

.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}

.logo-title {
  display: flex;
  align-items: center;
  margin-bottom: 60px;
  font-size: 42px;
  color: $text-color;

  .sidebar-logo {
    height: 64px;
  }

  .system-title {
    margin-left: 32px;
    font-weight: 500;
  }
}

.login-box {
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-container {
  width: 460px;
  padding: 36px 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0px 0px 20px 0px #e9eef6;
  backdrop-filter: blur(10px);

  .title-container {
    margin-bottom: 30px;

    .title {
      font-size: 24px;
      font-weight: 500;
      color: $primary-color;
      text-align: center;
    }
  }

  .login-form {
    .el-form-item {
      margin-bottom: 22px;
      position: relative;

      ::v-deep .el-input__inner {
        height: 48px;
        line-height: 48px;
        border: 1px solid $border-color;
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.3s;

        &:focus {
          border-color: $primary-color;
        }

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: $text-color !important;
        }
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
      user-select: none;

      &:hover {
        color: $primary-color;
      }
    }

    .login-button {
      width: 100%;
      height: 48px;
      font-size: 16px;
      margin-top: 10px;
      background-color: $primary-color;
      border: none;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>
