<template>
  <el-row style="padding-top: 80px">
    <el-col :span="12" :offset="6">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick" @tab-remove="removeTab" >
          <el-tab-pane name="myLetterList" >
            <span slot="label">
              私信列表
              <el-badge style="margin-top: 10px" :value="unReadLetterTotal" :max="50" v-if="unReadLetterTotal!==undefined&&unReadLetterTotal>0"/>
            </span>
            <ul style="margin: 10px 0 0 0" v-if="letterList!==undefined&&letterList.length>0">
              <li style="margin: 0px 0 5px 0;" v-for="(item,index) in letterList"
                  :key="index"
                  @click="addTab('与 '+item.targetUser.username+' 的聊天',item.letter.sessionId,item.targetUser.userId)">
                <el-card shadow="hover"   >

                  <el-row>
                    <el-col :span="3">
                      <el-avatar
                        :size="75"
                        v-if="item.targetUser.avatar===null||item.targetUser.avatar.length===0"
                        :src="require('../../assets/img/defaultAvatar.png')"
                        fit="scale-down"
                      ></el-avatar>
                      <el-avatar
                        :size="75"
                        v-else
                        :src="`http://localhost:8086/image/${item.targetUser.avatar}`"
                        fit="scale-down"
                      ></el-avatar>
                      <!--              <el-avatar :style="`background:${getColorByName('item.user.username')}`"> {{ item.user.username }} </el-avatar>-->

                    </el-col>
                    <el-col :span="14">
                      <h3 style="margin: 10px 0 5px 0">{{ item.targetUser.username }} </h3>
                      <p>{{ item.letter.letterDetail }}</p>
                    </el-col>
                    <el-col :span="7" align="right">
                      <span style="color: #c59d85;margin-top: 10px">{{ item.letter.createTime }}</span>
                      <p>
                        <el-badge class="mark" :value="item.unReadCount" v-if="item.unReadCount!==undefined&&item.unReadCount>0"/>
                      </p>
                    </el-col>
                  </el-row>
                </el-card>
              </li>
            </ul>
            <span class="is-null" v-else>暂无数据</span>
          </el-tab-pane>
          <el-tab-pane name="mySystemNotice" >
            <span slot="label">
              系统通知
              <el-badge style="margin-top: 10px" :value="unReadNoticeTotal" :max="50" v-if="unReadNoticeTotal!==undefined&&unReadNoticeTotal>0"/>
            </span>
<!--            <el-alert-->
<!--              title="系统通知"-->
<!--              type="info"-->
<!--              :description="item.letterDetail"-->
<!--              show-icon-->
<!--              :closable="false"-->
<!--              v-for="(item,index) in noticeList"-->
<!--              :key="index">-->
<!--            </el-alert>-->
            <ul style="margin: 10px 0 0 0" v-if="noticeList!==undefined&&noticeList.length>0">
              <li style="margin: 0px 0 5px 0;" v-for="(item,index) in noticeList"
                  :key="index">
                <el-card shadow="hover">
                  <el-row>
                    <el-col :span="3">
                      <i class="el-icon-chat-dot-round" style="font-size: 65px"></i>
                    </el-col>
                    <el-col :span="14">
                      <h4 style="margin: 10px 0 5px 0" >
                        系统通知
                        <el-badge value="new" class="item" v-if="item.letterStatus==0">
                        </el-badge>
                      </h4>

                      <p style="font-size: 15px;margin-top: 0px">{{ item.letterDetail }}</p>
                    </el-col>
                    <el-col :span="7" align="right">
                      <span style="color: #c59d85;margin-top: 10px">{{ item.createTime }}</span>

                    </el-col>
                  </el-row>
                </el-card>
              </li>
            </ul>
            <span class="is-null" v-else>暂无通知</span>
          </el-tab-pane>
          <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.name"
            :label="item.lable"
            :name="item.name"
            :closable="true"
          >
            <chat-frame :session-id="item.sessionId" :target-user-id="item.userId"></chat-frame>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>

  </el-row>
</template>

<script>
import ChatFrame from '../../components/web/chatFrame'
export default {
  name: 'myMessage',
  components: { ChatFrame },
  data () {
    return {
      activeName: 'myLetterList',
      unReadLetterTotal: undefined,
      unReadNoticeTotal: undefined,
      letterList: undefined,
      noticeList: undefined,
      editableTabs: []
    }
  },
  async created () {
    await this.getMyUnReadLetterTotal()
    await this.getMyUnReadNoticeTotal()
    await this.getMySessionList()
  },
  methods: {
    async getMyUnReadLetterTotal () {
      await this.$http.post('/letter/myUnReadLetterTotal').then(res => {
        if (res.data.code !== 200) {
          // this.$message.error(res.data.msg)
        } else {
          console.log(res.data.data)
          this.unReadLetterTotal = res.data.data
        }
      })
    },
    async getMyUnReadNoticeTotal () {
      await this.$http.post('/letter/myUnReadNoticeTotal').then(res => {
        if (res.data.code !== 200) {
          // this.$message.error(res.data.msg)
        } else {
          console.log(res.data.data)
          this.unReadNoticeTotal = res.data.data
        }
      })
    },
    async getMySessionList () {
      await this.$http.post('/letter/mySessionList').then(res => {
        if (res.data.code !== 200) {
          // this.$message.error(res.data.msg)
        } else {
          console.log(res.data.data)
          this.letterList = res.data.data
        }
      })
    },
    async getMyNoticeList () {
      await this.$http.post('/letter/myNoticeList').then(res => {
        if (res.data.code !== 200) {
          // this.$message.error(res.data.msg)
        } else {
          console.log(res.data.data)
          this.noticeList = res.data.data
        }
      })
    },
    async handleClick (tab, event) {
      if (tab.name === 'myLetterList') {
        await this.getMyUnReadNoticeTotal()
        await this.getMyUnReadLetterTotal()
        await this.getMySessionList()
      }
      if (tab.name === 'mySystemNotice') {
        await this.getMyUnReadLetterTotal()
        await this.getMyNoticeList()
      }
      this.$store.dispatch('user/setUnReadTotal', this.unReadNoticeTotal + this.unReadLetterTotal)
      console.log(tab, event)
    },
    addTab (targetName, sessionId, userId) {
      const _this = this
      // Array的forEach()方法里面无法使用return终止遍历且不会有返回值
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name === targetName) {
          // 如果已经存在，则直接跳转对应tab页，无须再添加
          _this.activeName = targetName
          return null
        }
      }
      _this.editableTabs.push({
        lable: targetName,
        name: targetName,
        sessionId: sessionId,
        userId: userId
      })
      _this.activeName = targetName
    },
    removeTab (targetName) {
      const tabs = this.editableTabs
      let activeName = this.activeName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            } else {
              activeName = 'myLetterList'
            }
          }
        })
      }

      this.activeName = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    }
  },
  mounted () {
    this.$store.commit('setHeaderLogo', {
      headerLogoShow: false
    })
    this.$store.commit('setShadowActive', {
      headerShadowActive: true
    })
    this.$store.commit('setNavDarkActive', {
      navDarkActive: true
    })
    this.$store.commit('setHeaderShow', {
      headerShow: false
    })
  }
}
</script>

<style scoped>

</style>
