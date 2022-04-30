<template>
  <el-card shadow="hover">
    <el-scrollbar ref="selfScrollbar" style="height: 335px;">
      <el-card v-for="(item,index) in letterList" :key="index" >
        <el-row :span="24" align="left" v-if="item.senderId==targetUserId">
            <el-col :span="3">
              <el-avatar
                :size="65"
                v-if="item.sender.avatar===null||item.sender.avatar.length===0"
                :src="require('../../assets/img/defaultAvatar.png')"
                fit="scale-down"
              ></el-avatar>
              <el-avatar
                :size="65"
                v-else
                :src="`http://localhost:8086/image/${item.sender.avatar}`"
                fit="scale-down"
              ></el-avatar>
            </el-col>
            <el-col :span="21">
              <p style="font-size: 5px">{{item.createTime}}</p>

              <p style="margin-top: 10px;margin-bottom: 10px">{{item.letterDetail}}</p>
            </el-col>
        </el-row>
        <el-row align="right" v-else>
          <el-col :span="21" align="right">
            <p style="font-size: 5px">{{item.createTime}}</p>

            <p style="margin-top: 10px;margin-bottom: 10px">{{item.letterDetail}}</p>
          </el-col>
          <el-col :span="3">
            <el-avatar
              :size="65"
              v-if="item.sender.avatar===null||item.sender.avatar.length===0"
              :src="require('../../assets/img/defaultAvatar.png')"
              fit="scale-down"
            ></el-avatar>
            <el-avatar
              :size="65"
              v-else
              :src="`http://localhost:8086/image/${item.sender.avatar}`"
              fit="scale-down"
            ></el-avatar>
          </el-col>

        </el-row>
      </el-card>
    </el-scrollbar>
    <el-divider></el-divider>
    <el-input
      v-model="letterDetail"
      type="textarea"
      :autosize="{ minRows: 3, maxRows: 5}"
      :maxlength="100"
      placeholder="请输入聊天内容"
    />
    <el-button type="primary" @click="sendLetter(targetUserId)">发送</el-button>

  </el-card>
</template>

<script>
export default {
  name: 'chatFrame',
  props: ['sessionId', 'targetUserId'],
  data () {
    return {
      letterList: undefined,
      letterDetail: undefined
    }
  },
  watch: {
    sessionId: {
      handler (newVal, oldVal) {
        // this.initThisPage()
      }
    },
    targetUserId: {
      handler (newVal, oldVal) {
        // this.initThisPage()
      }
    }
  },
  async created () {
    await this.getLetterListBySessionId(this.sessionId)
    this.selfScrollDown()
  },
  methods: {
    selfScrollDown () {
      this.$refs.selfScrollbar.wrap.scrollTop = this.$refs.selfScrollbar.wrap.scrollHeight
    },
    async getLetterListBySessionId (sessionId) {
      await this.$http.get('/letter/letterList/' + sessionId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          console.log(res.data.data)
          this.letterList = res.data.data
          // this.unReadLetterTotal = res.data.data
        }
      })
    },
    async sendLetter (receiverId) {
      await this.$http.post('/letter/send', {
        letterDetail: this.letterDetail,
        receiverId: receiverId
      }).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success('发送成功')
          this.letterDetail = undefined
          // this.letterList.push()
          // this.$router.go(0)
        }
      })
      await this.getLetterListBySessionId(this.sessionId)
      this.selfScrollDown()
    }
  }
}

</script>

<style scoped>

</style>
