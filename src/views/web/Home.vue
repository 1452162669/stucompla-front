<template>
  <div>

    <MyHeader></MyHeader>
    <!-- 增加路由 -->
    <router-view @update="viewLogin()"></router-view>

<!--    登录弹窗-->
    <el-dialog title="欢迎登录" :visible.sync="dialogLoginVisible" :modal-append-to-body="false" :lock-scroll="false"
               width="25%" :center="true" :show-close="false">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
        <el-form-item label="" prop="username">
          <el-input
            placeholder="用户名"
            v-model="loginForm.username"
            prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="handleLogin">
          </el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click.native="handleLogin()">登录</el-button>
          <el-button type="danger" @click.native="dialogLoginVisible=false;dialogRegisterVisible=true">注册</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

<!--    注册弹窗-->
    <el-dialog title="欢迎注册" :visible.sync="dialogRegisterVisible" :modal-append-to-body="false" :lock-scroll="false"
               width="25%" :center="true" :show-close="false">
      <el-form :model="regForm" :rules="regRules" ref="regForm">
        <el-form-item label="" prop="username">
          <el-input
            placeholder="用户名"
            v-model="regForm.username"
            prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="regForm.password"
            prefix-icon="el-icon-lock">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="secondPassword">
          <el-input
            type="password"
            placeholder="重复密码"
            v-model="regForm.secondPassword"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="handleRegister">
          </el-input>
        </el-form-item>

        <el-form-item align="center">
          <el-button type="danger" @click="handleRegister()">注册</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <MyFooter></MyFooter>
  </div>
</template>

<script>
import MyHeader from '../../components/web/public/Header'
import MyFooter from '../../components/web/public/Footer'

export default {
  name: 'Home',
  components: {
    MyFooter,
    MyHeader
  },
  computed: {
    dialogLoginVisible: {
      get () {
        return this.$store.state.dialogLoginVisible
      },
      set (v) {
        this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: v })
      }
    },
    dialogRegisterVisible: {
      get () {
        return this.$store.state.dialogRegisterVisible
      },
      set (v) {
        this.$store.commit('setDialogRegisterVisible', { dialogRegisterVisible: v })
      }
    }

  },
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3 || value.length > 10) {
        callback(new Error('用户名长度在3-10位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度在6-16位'))
      } else {
        callback()
      }
    }
    return {
      // dialogLoginVisible: false,
      loginForm: {
        username: 'test1',
        password: ''
      },
      regForm: {
        username: '',
        password: '',
        secondPassword: '' // 补上其他属性
      },
      userId: undefined,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      regRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        secondPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]

      }
    }
  },
  methods: {
    viewLogin () {
      this.dialogLoginVisible = true
    },
    // 获取账户信息
    getAccountInfo () {
      this.$http.get('/user/info').then(res => {
        if (res.data.code !== 200) {
          this.$message.error('获取账户信息失败')
        } else {
          this.$store.dispatch('user/setAvatar', res.data.data.avatar)
          this.$store.dispatch('user/setUserId', res.data.data.userId)
        }
      })
    },
    async handleLogin () {
      // 要优化
      await this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$http.post('/user/login/', this.loginForm).then(res => {
            console.log(res.data)
            if (res.data.code !== 200) {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            } else {
              this.$store.dispatch('user/setJwt', res.data.data)
              this.dialogLoginVisible = false
              this.getAccountInfo()
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              // this.$router.go(0)
              this.$router.replace({
                path: '/refresh',
                query: {
                  t: Date.now()
                }
              })
              this.$http.post('/letter/myUnReadTotal/').then(res => {
                console.log(res.data)
                if (res.data.code !== 200) {

                } else {
                  this.$store.dispatch('user/setUnReadTotal', res.data.data)
                }
                // console.log('2访问完成。赋值完成。')
              })
            }
          })
        } else {
          return false
        }
      })
    },
    async handleRegister () {
      await this.$refs.regForm.validate(valid => {
        if (valid) {
          this.$http.post('/user/register', this.regForm).then(res => {
            if (res.data.code !== 200) {
              this.$message.error(res.data.msg)
            } else {
              this.dialogRegisterVisible = false
              console.log(res.data.msg)
              this.$message.success(res.data.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
