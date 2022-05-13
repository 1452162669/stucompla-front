<template>
  <div class="header" :class="{header_show: headerShow, shadow: headerShadowActive }">
    <div class="header_container">
      <div class="header_content">
        <div class="logo">
          <router-link to="/">
            <img :src="logo_img[0].path" alt="logo" v-if="headerLogoShow===true"/>
            <img :src="logo_img[1].path" alt="logo" v-else/>
          </router-link>
        </div>
        <div class="menu-wrapper">
          <div class="menu-item" v-for="(item,index) in navList" :key="index">
            <h2 class="menu-item-link">
              <router-link :to="item.path"><span :class="{a_text_dark: navDarkActive}">{{ item.title }}</span>
              </router-link>
            </h2>

          </div>
          <div v-if="!isLogin" class="menu-item">
            <el-button type="primary" @click="changeDialogLoginVisible">登录</el-button>
            <el-button type="danger" @click="changeDialogRegisterVisible">注册</el-button>
          </div>
          <div v-else class="menu-item">
            <el-dropdown class="avatar-container">
              <div class="avatar-wrapper">
<!--                <el-avatar src="http://localhost:8086/image/1649474344343_1512631150949040128.png">-->

<!--                </el-avatar>-->
                <el-avatar
                  v-if="avatar!=null&&avatar!=undefined&&avatar.length>0"
                  :src="`http://localhost:8086/image/${avatar}`"
                ></el-avatar>
                <el-avatar
                  v-else
                  :src="require('../../../assets/img/defaultAvatar.png')"
                ></el-avatar>
                <!--                <img :src="'http://localhost:8086/image/1649474344343_1512631150949040128.png'" class="user-avatar"-->
                <!--                     alt="头像">-->
                <i class="el-icon-caret-bottom"/>
              </div>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/">
                  <el-dropdown-item>
                    首页
                  </el-dropdown-item>
                </router-link>
                <router-link to="/stucompla/myCenter">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                </router-link>
                <router-link to="/stucompla/myMessage">
                  <el-dropdown-item>
                    我的消息
                    <el-badge class="mark" :value="total" v-if="total!==undefined&&total>0"/>
                  </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided @click.native="logout">
                  <span style="display:block;">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { removeToken, getAvatar } from '../../../utils/auth'
import { getUnReadTotal } from '../../../utils/letter'

export default {
  name: 'Header',
  data () {
    return {

      avatar: getAvatar(),
      total: getUnReadTotal(),
      isLogin: false,
      navList: [
        {
          title: '首页',
          path: '/index'
        },
        {
          title: '后台管理系统',
          path: '/admin'
        },
        {
          title: '交流栏目',
          path: '/stucompla/forum'
        },
        {
          title: '表白墙',
          path: '/stucompla/wall'
        },
        {
          title: '二手交易',
          path: '/stucompla/market'
        }

      ],
      logo_img: [
        {
          // path: require('../../../assets/img/index/logo.png')
          path: require('../../../assets/img/index/stucomplaLogo3.png')
        },
        {
          // path: require('../../../assets/img/index/logoColor.png')
          path: require('../../../assets/img/index/stucomplaLogoColor3.png')
        }
      ]
    }
  },
  watch: {
    '$store.state.user.jwt': {
      handler: function (newVal, oldVal) {
        this.isLogin = newVal !== undefined
      }
    },
    '$store.state.user.avatar': {
      handler: function (newVal, oldVal) {
        this.avatar = newVal
        console.log('更新了')
        // console.log(this.avatar)
      }
    },
    '$store.state.user.unReadTotal': {
      handler: function (newVal, oldVal) {
        this.total = newVal
      }
    }

  },
  created () {
    this.getLoginState()
  },
  computed: mapState(['headerShadowActive', 'headerShow', 'headerLogoShow', 'navDarkActive', 'dialogLoginVisible']),
  mounted () {
    // 在mounted 声明周期中创建定时器
    if (this.isLogin) {
      const timer = setInterval(() => {
        // 这里调用调用需要执行的方法，1为自定义的参数，由于特殊的需求它将用来区分，定时器调用和手工调用，然后执行不同的业务逻辑
        this.getUnReadTotal('1')
      }, 15000) // 每15秒执行1次
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除
      this.$once('hook:beforeDestroy', () => {
        // 在页面销毁时，销毁定时器
        clearInterval(timer)
      })
    }
  },
  methods: {
    logout () {
      this.$http.delete('/user/logout').then(res => {
        if (res.data.code !== 200) {

        } else {
          removeToken() // 必须先删除token
          // resetRouter()
          this.$store.dispatch('user/resetState')
          // resolve()
          this.$message({
            message: '已退出',
            type: 'success'
          })
          this.isLogin = false
          this.$router.replace({
            path: '/refresh',
            query: {
              t: Date.now()
            }
          })
        }
      })
    },
    async getUnReadTotal () {
      await this.$http.post('/letter/myUnReadTotal/').then(res => {
        console.log(res.data)
        if (res.data.code !== 200) {

        } else {
          console.log('获取成功')
          console.log(res.data.data)
          this.$store.dispatch('user/setUnReadTotal', res.data.data)
        }
        // console.log('2访问完成。赋值完成。')
      })
    },
    getLoginState () {
      // this.$http.get('/user/info').then(res => {
      //   if (res.data.code !== 200) {
      //     // this.$message.error('获取账户信息失败')
      //   } else {
      //     this.isLogin = true
      //   }
      // })
      this.isLogin = this.$store.state.user.jwt !== undefined
    },
    changeDialogLoginVisible () {
      // this.$emit('changeDialog', true)
      this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: true })
    },
    changeDialogRegisterVisible () {
      this.$store.commit('setDialogRegisterVisible', { dialogRegisterVisible: true })
    }

    // handleLogin () {
    //   // 要优化
    //   this.$http.post('/user/login/', this.loginForm).then(res => {
    //     console.log(res.data)
    //     if (res.data.code !== 200) {
    //       this.$message({
    //         message: res.data.msg,
    //         type: 'error'
    //       })
    //     } else {
    //       this.$store.dispatch('user/setJwt', res.data.data)
    //       this.dialogFormVisible = false
    //       this.$message({
    //         message: '登录成功',
    //         type: 'success'
    //       })
    //     }
    //     // console.log('2访问完成。赋值完成。')
    //   })
    // }
  }

}
</script>

<style lang="less" scoped>
.avatar-container {
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}

@nav_active_color: #3370ff;
h2 {
  margin: 0;
}

.header_show {
  transform: translateY(-62px);
}

.a_text_dark {
  color: rgba(0, 0, 0, .8);
}

.header {
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0);
  //backdrop-filter: blur(0);
  box-shadow: none;

  position: fixed;
  z-index: 999;
  transition: transform .2s ease;
  //color: rgba(255, 255, 255, 1) !important;
  //transition: all 0.3s ease;
  .header_container {
    height: 100%;
  }
}

.shadow {
  background-color: rgba(255, 255, 255, .7);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
}

.header_content {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: 100%;
  align-items: center;
  padding: 0 96px;
  margin: 0 auto;

  .logo {
    flex: 0 0 auto;

    img {
      height: 35px;
    }
  }
}

.menu-wrapper {
  display: flex;
  flex-direction: row;
  list-style: none;
  -ms-flex-align: center;
  align-items: center;
  padding: 0;
  margin: 0 0 0 20px;
  position: relative;

  .menu-item {
    flex-shrink: 0;
  }

  .menu-item:last-child:before {
    content: "";
    display: block;
    height: 12px;
    border-right: 1px solid #bbbfc4;
    //border-right: 1px solid #fff;
    position: absolute;
    bottom: 24px;
    right: 48px;
  }

  > .menu-item + .menu-item {
    margin-left: 40px;
  }

  .menu-item-link {
    //color: #646a73;
    font-weight: 400;
    font-size: 14px;
    line-height: 60px;
    cursor: pointer;
    position: relative;

    a {
      display: inline-block;
      color: rgba(255, 255, 255, 1);
      transition: color .3s;

      :hover {
        color: @nav_active_color;
      }
    }

    .router-link-exact-active {
      color: @nav_active_color;
      font-weight: 600;

      span:after {
        content: "";
        display: block;
        height: 2px;
        position: absolute;
        width: 26px;
        left: calc(50% - 13px);
        bottom: 14px;
        background-color: @nav_active_color;
      }
    }
  }
}

.nav_text_white {
  color: rgba(255, 255, 255, 1);
}

.nav_text_dark {
  color: rgba(0, 0, 0, .8);
}

@media only screen and (max-width: 991px) {
  .header_content {
    padding: 0 32px;
  }
}

</style>
