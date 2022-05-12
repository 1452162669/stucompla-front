<template>
  <div class="news-detail">
    <!--    <AwHeader class="news_header" ref="news_header"></AwHeader>-->
    <div class="container">
      <div class="left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/stucompla/forum' }">交流首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ post.categoryName }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ post.title }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content">
          <h1>{{ post.title }}</h1>
          <p>作者：{{post.userName}}</p>
          <span>{{ post.createTime }}</span>
          <span title="热度" style="margin-left:19px;font-weight:400"><i
            class="el-icon-view"></i> {{ post.viewNum }}</span>
          <span title="评论" style="margin-left:19px"><i class="el-icon-chat-line-round" ></i> {{ post.commentNum }}</span>
          <span title="收藏" style="margin-left:19px">
<!--            <i class="el-icon-star-off" :class="{iconStarColor: isCollect}" @click="onCollect" ></i>-->
<!--            <el-button type="text"><i class="el-icon-star-off" :class="{iconStarColor: isCollect}" @click="onCollect" ></i></el-button>-->
            <button :disabled="isClick"><i class="el-icon-star-off" :class="{iconStarColor: isCollect}" style="cursor: pointer" @click="onCollect" ></i></button>
            {{ post.collectNum }}
          </span>
          <span style="float: right" v-if="isPublishUser">
            <el-button type="primary" size="small" @click="$router.push('/stucompla/editPost/'+post.postId)">修改</el-button>
            <el-popconfirm

              icon="el-icon-info"
              icon-color="red"
              title="确定删除该帖吗？删除后所有相关信息将丢失，此操作不可恢复！"
              style="padding-left: 10px"
              @confirm="deletePost(post.postId)"
            >
                            <el-button  slot="reference" type="danger" size="small">删除</el-button>
                          </el-popconfirm>
<!--            <el-button type="danger" size="small" >删除</el-button>-->
          </span>

          <el-divider><i class="el-icon-view"></i></el-divider>
          <div v-html="post.detail" class="postStyle"> </div>
          <el-divider>
            <el-button circle size="mini" :disabled="isClick" @click="onCollect"><i
              :class="{iconStarColor: isCollect}"
              style="font-size: 30px"
              class="el-icon-star-off"
            ></i></el-button>
          </el-divider>
        </div>
        <div style="padding-top: 10px">
          <span><b>发表评论</b></span>
          <el-input
            v-model="commentForm.text"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8}"
            placeholder="友善评论，文明发言"
          />
          <el-upload
            action="http://localhost:8086/image/upload"
            :headers="myHeader"
            name="files"
            :limit='1'
            :before-upload="beforeUpload"
            list-type="picture-card"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogImageVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <el-button type="primary" plain @click="createComment()">评论</el-button>
        </div>
        <comment-list :items="post.commentList" :post-info="post" v-if='post.commentList!==undefined'></comment-list>

      </div>
      <hot-news class="right"></hot-news>
    </div>

    <!--    <AwFooter></AwFooter>-->
  </div>
</template>

<script>
import HotNews from '../../components/web/hotPosts'
import CommentList from '../../components/web/commentList'
import { getToken } from '../../utils/auth'

export default {
  name: 'postDetail',
  components: {
    CommentList,
    HotNews
    // AwHeader,
    // AwFooter
  },
  data () {
    return {
      isLogin: false,
      isPublishUser: false,
      isCollect: false, // 默认未收藏
      isClick: false, // 默认不禁止
      post: {
        postId: '',
        title: '',
        createTime: '',
        detail: '',
        // category: [],
        categoryName: '',
        viewNum: '',
        commentNum: '',
        collectNum: '',
        commentList: undefined,
        userId: undefined,
        userName: undefined
      },
      commentForm: {
        postId: this.$route.params.id,
        parentId: undefined,
        text: '',
        images: undefined
      },
      myHeader: {
        Authorization: getToken() // 这里应该监控jwt的变化，不然只获取到第一次，后面不会变（可以用计算属性)
      },
      newimgArray: [],
      dialogImageVisible: false,
      dialogImageUrl: ''
    }
  },
  watch: {
    '$store.state.user.jwt': {
      handler: function (newVal, oldVal) {
        this.myHeader.Authorization = newVal
      }
    },
    news_path: {
      handler (newVal, oldVal) {
        this.initThisPage()
      }
    }
  },
  computed: {
    news_path () {
      return this.$route.params.id
    },
    dialogLoginVisible: {
      get () {
        return this.$store.state.dialogLoginVisible
      },
      set (v) {
        this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: v })
      }
    }
  },
  created () {
    this.initThisPage()
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
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (to.name === 'index') {
      this.$store.commit('setHeaderLogo', {
        headerLogoShow: true
      })
      this.$store.commit('setShadowActive', {
        headerShadowActive: false
      })
      this.$store.commit('setNavDarkActive', {
        navDarkActive: false
      })
      this.$store.commit('setHeaderShow', {
        headerShow: false
      })
      next()
    } else {
      next()
    }
  },
  methods: {
    getLoginState () {
      return new Promise(resolve => {
        this.isLogin = this.$store.state.user.jwt !== undefined
        resolve()
      })
    },
    async initThisPage () {
      await this.getLoginState()
      await this.getPostDetail()
      await this.checkCollect()
      await this.getCommentListFromPostId(this.news_path)
      await this.checkPublishUser()
    },
    createComment () {
      console.log(this.commentForm)
      if (this.$store.state.user.jwt) {
        if (this.newimgArray.length > 0) {
          this.commentForm.images = this.newimgArray.toString()
        }
        this.$http.post('/comment/create', this.commentForm).then(res => {
          if (res.data.code !== 200) {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            // this.getCommentListFromPostId()
            this.$router.replace({
              path: '/refresh',
              query: {
                t: Date.now()
              }
            })
          }
        })
      } else {
        this.dialogLoginVisible = true
      }
    },
    checkPublishUser () {
      if (this.$store.state.user.jwt) {
        this.$http.get('/user/info').then(res => {
          if (res.data.code !== 200) {

          } else {
            console.log(this.post.userId === res.data.data.userId)
            console.log(res.data.data.userId)
            console.log(this.post.userId)
            this.isPublishUser = this.post.userId === res.data.data.userId
          }
        })
      }
    },
    // 检查是否收藏
    checkCollect () {
      console.log(this.$store.state.user.jwt)
      if (this.$store.state.user.jwt) {
        console.log('执行检查')
        return new Promise((resolve, reject) => {
          this.$http.get('/collect/check/' + this.news_path).then(res => {
            if (res.data.code !== 200) {
              resolve(false)
            } else {
              if (res.data.data) {
                this.isCollect = true
                // console.log(res.data.data)
              }
              resolve(res.data.data)
            }
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(false)
        })
      }
      // 是登陆用户就/collect/check/ 带上postId 看是否已经收藏 true或者false 后台根据postId和request去处理
    },
    // 收藏和取消收藏
    onCollect () {
      // if (this.isClick) {
      this.isClick = true
      // console.log(this.checkCollect())
      // console.log(!this.checkCollect())
      this.checkCollect().then(res => {
        if (!res) {
          this.$http.post('/collect/add/' + this.news_path).then(res => {
            console.log(res)
            if (res.data.code !== 200) {
              // this.$message({
              //   message: res.data.msg,
              //   type: 'error'
              // })
              // this.$emit('update')
              this.dialogLoginVisible = true
              this.isClick = false
            } else {
              this.$message({
                message: '已添加到“我的收藏”',
                type: 'success'
              })
              this.isCollect = true
              this.isClick = false
              this.post.collectNum++
            }
          })
        } else {
          this.$http.delete('/collect/delete/' + this.news_path).then(res => {
            if (res.data.code !== 200) {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
              this.isClick = false
            } else {
              this.$message({
                message: '已取消收藏',
                type: 'success'
              })
              this.isCollect = false
              this.isClick = false
              this.post.collectNum--
            }
          })
        }
      })
      // }
    },
    // 获取帖子信息
    getPostDetail () {
      // const { data: res } = await this.$http.get('/post/' + this.news_path)
      return new Promise((resolve, reject) => {
        this.$http.get('/post/' + this.news_path).then(res => {
          // console.log('1访问后台完成')
          // console.log(res.data)
          if (res.data.code !== 200) {
            // console.log(res)
            this.$message.error(res.data.msg)
            this.$router.back()
            // 应该跳转一个提示不存在的页面
          } else {
            // this.$message.success('获取成功')
            console.log(res.data.data.postId)
            if (res.data.data.postStatus === 1) {
              this.$message.error('该帖已被锁定，如需申诉，请联系管理员1452162669@qq.com')
              this.$router.back()
              reject(new Error('状态异常'))
            } else {
              this.post.postId = res.data.data.postId
              console.log(this.post.postId)
              this.post.title = res.data.data.title
              this.post.createTime = res.data.data.createTime
              this.post.detail = res.data.data.detail
              this.post.categoryName = res.data.data.category.categoryName
              this.post.viewNum = res.data.data.viewNum
              this.post.commentNum = res.data.data.commentNum
              this.post.collectNum = res.data.data.collectNum
              this.post.userId = res.data.data.user.userId
              this.post.userName = res.data.data.user.username
            }
            // category: res.data.category
          }
          resolve()
          // console.log('1赋值完成·')
        })
      })
    },
    deletePost (postId) {
      this.$http.delete('/post/' + postId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          this.$router.back()
        }
      })
    },
    getCommentListFromPostId (postId) {
      // 要优化
      this.$http.get('/comment/list/' + postId + '/1/10').then(res => {
        // console.log(res.data)
        if (res.data.code !== 200) {

        } else {
          this.post.commentList = res.data.data.comments
          // console.log('00000000')
          // console.log(this.post.commentList)
          // console.log(this.post.commentList !== undefined)
        }
        // console.log('2访问完成。赋值完成。')
      })
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        if (this.isLogin) {
          resolve()
        } else {
          this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: !this.isLogin })
          reject(new Error('未登录'))
        }
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      const url = file.response.data[0].replace('http://localhost:8086/image/', '')
      const paths = url.split('_')
      const idValue = paths[1].split('.')[0] // 取id 1495352086701932544
      this.$http.delete('/image/' + idValue).then(res => {
        if (res.data.code !== 200) {

        } else {
          console.log(res.data.data)
        }
      })
      const urlIndex = this.newimgArray.indexOf(url)
      this.newimgArray.splice(urlIndex, 1)
      console.log(this.newimgArray)
    },
    handleSuccess (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      if (response.code === 200) {
        for (var j = 0; j < response.data.length; j++) {
          this.newimgArray.push(response.data[j].replace('http://localhost:8086/image/', ''))
        }
        console.log(this.newimgArray)
      } else {
        alert(response.msg)
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.error('只能上传一张图片')
    }
  }
}
</script>

<style lang="less" scoped>

.iconStarColor {
  color: #ff8c25;
}

.news_header {
  background-color: rgba(255, 255, 255, .5);
  backdrop-filter: blur(10px);
  //border-bottom: 1px solid #eff0f1;
}

.container {
  padding-top: 60px;
  position: relative;
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  //background: #d3dce6;
  min-height: 580px;
  margin: 0 auto;
}

.el-breadcrumb {
  height: 40px;
  font-size: 13px;
  padding-top: 40px;
}

::v-deep .el-breadcrumb__item:last-child span {
  color: #f84521;
}

.content {
  width: 860px;

  h1 {
    font-size: 23px;
    line-height: 30px;
    padding: 20px 0 14px;
  }

  span {
    color: @regular-text-color;
    line-height: 18px;
  }
}

//.article {
//  margin-top: 5px;
//  overflow: hidden;
//}

.right {
  margin-left: 50px;
  margin-top: 80px;
}

//帖子详情的样式
.postStyle {
  /* table 样式 */
  /deep/ table {border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  /deep/ table td,
  /deep/ table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  /deep/ table th {border-bottom: 2px solid #ccc;text-align: center;}
  /* blockquote 样式 */
  /deep/  blockquote {
    display: block;border-left: 8px solid #d0e5f2;padding: 5px 10px;
    margin: 10px 0;line-height: 1.4;font-size: 100%;background-color: #f1f1f1;}
  /* code 样式 */
  /deep/ code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  /deep/ pre code {
    display: block;
  }

  /* ul ol 样式 */
  /deep/ ul, ol {
    margin: 10px 0 10px 20px;
  }
}
</style>
