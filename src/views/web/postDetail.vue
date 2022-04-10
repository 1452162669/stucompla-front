<template>
  <div class="news-detail">
    <!--    <AwHeader class="news_header" ref="news_header"></AwHeader>-->
    <div class="container">
      <div class="left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ post.categoryName }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ post.title }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content">
          <h1>{{ post.title }}</h1>
          <span>{{ post.createTime }}</span>
          <span title="热度" style="margin-left:19px;font-weight:400"><i
            class="el-icon-view"></i> {{ post.viewNum }}</span>
          <span title="评论" style="margin-left:19px"><i class="el-icon-chat-line-round"></i> {{ post.commentNum }}</span>
          <span title="收藏" style="margin-left:19px"><i class="el-icon-star-off"></i> {{ post.collectNum }}</span>
          <el-divider><i class="el-icon-view"></i></el-divider>
          <article class="article" v-html="post.detail"></article>
          <el-divider><i :style="{color: iconStarColor}" style="font-size: 40px" class="el-icon-star-on"
                         @click="onCollect"></i>
          </el-divider>
        </div>
        <comment-list :items="post.commentList" v-if='post.commentList!==undefined'></comment-list>

      </div>
      <hot-news class="right"></hot-news>
    </div>
    <!--    <AwFooter></AwFooter>-->
  </div>
</template>

<script>
import HotNews from '../../components/web/hotNews'
import CommentList from '../../components/web/commentList'

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

      iconStarColor: '#ff8c25',
      post: {
        title: '',
        createTime: '',
        detail: '',
        // category: [],
        categoryName: '',
        viewNum: '',
        commentNum: '',
        collectNum: '',
        commentList: undefined
      }
    }
  },
  computed: {
    news_path () {
      return this.$route.params.id
    }
  },
  created () {
    this.getPostDetail()
    this.getCommentListFromPostId(this.news_path)
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
    // 检查是否收藏
    checkCollect () {
      // 去写用户登录
      // 如果没有登录就直接返回false（没收藏）

      this.$http.get('/collect/check/' + this.news_path).then(res => {

      })
      // 是登陆用户就/collect/check/ 带上postId 看是否已经收藏 true或者false 后台根据postId和request去处理
    },
    // 收藏和取消收藏
    onCollect () {
      // 执行checkCollect()根据结果改变颜色

      if (this.iconStarColor === '#ff8c25') {
        this.iconStarColor = 'red'
      }
      this.iconStarColor = 'red'
    },
    // 获取帖子信息
    getPostDetail () {
      // const { data: res } = await this.$http.get('/post/' + this.news_path)
      this.$http.get('/post/' + this.news_path).then(res => {
        // console.log('1访问后台完成')
        // console.log(res.data)
        if (res.data.code !== 200) {
          // console.log(res)
        } else {
          // this.$message.success('获取成功')
          this.post.title = res.data.data.title
          this.post.createTime = res.data.data.createTime
          this.post.detail = res.data.data.detail
          this.post.categoryName = res.data.data.category.categoryName
          this.post.viewNum = res.data.data.viewNum
          this.post.commentNum = res.data.data.commentNum
          this.post.collectNum = res.data.data.collectNum
          // category: res.data.category
        }
        // console.log('1赋值完成·')
      })
    },
    getCommentListFromPostId (postId) {
      // 要优化
      this.$http.get('/comment/list/' + postId + '/1/10').then(res => {
        // console.log(res.data)
        if (res.data.code !== 200) {

        } else {
          this.post.commentList = res.data.data.comments
          console.log('00000000')
          console.log(this.post.commentList)
          console.log(this.post.commentList !== undefined)
        }
        // console.log('2访问完成。赋值完成。')
      })
    }
  }
}
</script>

<style lang="less" scoped>
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

.article {
  margin-top: 5px;
  overflow: hidden;
}

.right {
  margin-left: 50px;
  margin-top: 80px;
}
</style>
