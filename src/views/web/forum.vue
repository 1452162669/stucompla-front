<template>
  <div class="news">
    <div class="box">
      <div class="news-banner">
        <div class="banner-title">
          <h2>交流栏目</h2>
          <h3>了解更多信息</h3>
        </div>
        <el-input style="width: 46%;"
                  placeholder="请输入关键词"
                  v-model="searchTitle"
                  @keyup.enter.native="handleSearch(searchTitle)"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="news-container">
        <el-row class="product-carousel">
          <el-card>
            <h2>精华帖子</h2>
            <el-carousel
              :interval="4000"
              type="card">
              <el-carousel-item
                v-for="(item,index) in bestPostsData"
                :key="index">

                <router-link :to="`/stucompla/post/${item.postId}`">
                  <div class="pic_item">
                  <el-image
                    :src="item.images[0]"
                    v-if="item.images!=null&&item.images.length>0"
                    fit="cover"
                    style="width: 100%;height: 100%"/>
                  <h3>{{ item.title }}</h3>
                  </div>
                </router-link>

              </el-carousel-item>
            </el-carousel>
          </el-card>
        </el-row>
        <div class="news-list" id="post-list">
          <el-tabs class="list-left" v-model="pageInfo.activeName"
                   @tab-click="handleClick">

            <el-tab-pane :label="item.categoryName" :name="''+index" v-for="(item,index) in categories" :key="index">
              <post-list :items="postItems.postList" v-if="pageInfo.activeName===''+item.categoryId"></post-list>
            </el-tab-pane>
            <el-pagination
              class="pagination"
              background
              @current-change="handleCurrentChange"
              :current-page.sync="postQuery.pageNum"
              :page-size="postQuery.pageSize"
              layout="prev, pager, next, jumper"
              :total="postItems.total"
              :hide-on-single-page="singlePage"
              v-scroll-to="{ element: '.news-container',duration: 300, easing: 'ease',offset: -40  }">
            </el-pagination>
          </el-tabs>
          <div class="list-right">
            <div class="search-by-date">
            </div>
            <hot-posts></hot-posts>
          </div>
        </div>
      </div>
    </div>
    <div class="gb-sider" style="right: auto; display: block; left: 1333.5px;">
      <router-link to="/stucompla/createPost">
        <!-- 如果没有登录，应该直接退出登录窗口，不跳转 -->
        <i class="el-icon-edit-outline" style="font-size: 30px"></i>发帖
      </router-link>
    </div>
  </div>
</template>

<script>
import HotPosts from '../../components/web/hotPosts'
import PostList from '../../components/web/postList'

export default {
  name: 'forum',
  components: {
    PostList,
    HotPosts
  },
  data () {
    return {
      searchTitle: undefined,
      searchNews: '',
      bestPostsData: [],
      categories: [
        {
          categoryId: '0',
          categoryName: '全部'
        }

      ],
      postItems: {},
      pageInfo: {
        activeName: '0',
        // 当前页码
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
        selectDate: ''
      },
      postQuery: {
        categoryId: undefined,
        title: undefined,
        pageNum: 1,
        pageSize: 8,
        postStatus: 0
      },
      // 单页隐藏
      singlePage: '',
      // 卡片新闻
      recomNews: [],
      selectDate: '',
      // 新闻搜索
      searchList: []
      // autocompleteFlag: false
    }
  },
  methods: {
    // 解决 clearable 搜索框后再次输入不显示下拉
    searchHandle () {
      if (this.autocompleteFlag) this.$refs.autocomplete.activated = true
    },
    // 帖子列表选项卡切换
    handleClick (tab, event) {
      // 切换tabs时重置页码
      this.postQuery.pageNum = 1
      this.getPostsItems()
    },
    // handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
    // },
    // 帖子列表页码切换
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.getPostsItems()
    },
    async handleSearch (searchTitle) {
      this.postQuery.title = searchTitle
      await this.getPostsItems()
      // 这个方法因为有标头，所以不准
      // document.getElementById('post-list').scrollIntoView({
      //   block: 'start',
      //   inline: 'nearest',
      //   behavior: 'smooth'
      // })
      // 这个方法可以设置偏移
      const element = document.getElementById('post-list')
      const headerOffset = 50
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    },
    async getPostsItems () {
      if (this.pageInfo.activeName !== '0') {
        this.postQuery.categoryId = this.pageInfo.activeName
      } else {
        // 如果点击全部，条件查询里就不要帖子类型
        this.postQuery.categoryId = undefined
      }
      await this.$http.get('/post/list', {
        params: this.postQuery
      }).then(res => {
        if (res.data.code !== 200) {
          this.postItems = {}
        } else {
          console.log(res.data.data)
          this.postItems = res.data.data
          // 这里要修复
          if (this.postItems.total <= this.postItems.pageSize) {
            this.singlePage = true
          }
        }
      })
    },

    searchByDate (data) {
      this.getNewsItems()
    },
    // 获取精帖 要改
    async getBestPostsDataList () {
      const { data: res } = await this.$http.get('/post/list', {
        params: {
          bestPost: true,
          pageSize: 8,
          postStatus: 0
        }
      })
      if (res.code !== 200) {
        this.bestPostsData = []
      } else {
        this.bestPostsData = res.data.postList
        this.handleImg(this.bestPostsData)
      }
    },
    // 处理本地图片和网站图片问题
    async handleImg (postList) {
      await postList.forEach(function (item) {
        if (item.images != null && item.images.length > 0) {
          item.images = item.images.split(',')
          item.images[0] = 'http://localhost:8086/image/' + item.images[0]
        } else {
          var content = item.detail
          const imgReg = /<img.*?(?:>|\/>)/gi // 匹配图片中的img标签
          const srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
          const srcArr = []
          const arr = content.match(imgReg) // 筛选出所有的img
          if (arr != null) {
            // console.log(arr)
            for (let i = 0; i < arr.length; i++) {
              const src = arr[i].match(srcReg)
              // 获取图片地址
              srcArr.push(src[1])
            }
            item.images = srcArr
          }
        }
      })
    },
    async getCategories () {
      await this.$http.get('/category/list').then(res => {
        if (res.data.code !== 200) {

        } else {
          console.log(res.data.data)
          res.data.data.forEach(item => {
            this.categories.push(item)
          })
          console.log(this.categories)
        }
      })
    }
  },
  async created () {
    await this.getCategories()
    await this.getPostsItems()
    await this.getBestPostsDataList()
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
    if (from.name === 'forum') {
      this.$store.commit('setNavDarkActive', {
        navDarkActive: false
      })
      this.$store.commit('setHeaderLogo', {
        headerLogoShow: true
      })
      next()
    }
  }
}
</script>

<style lang="less">

.gb-sider a {
  width: 68px;
  height: 62px;
  display: block;
  background: #FFF;
  border: 1px solid #d8d8d8;
  padding: 6px 0 0;
  text-align: center;
  line-height: 50px;
  color: gray;
}

.gb-sider {
  position: fixed;
  right: 100px;
  bottom: 175px;
  z-index: 9999;
  border-bottom: 0;
}

@hover_color: #3370ff;
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .desc {
      font-size: 12px;
      color: #b4b4b4;
    }

    &.highlighted {
      background: #edf6ff !important
    }

    .highlighted .addr {
      color: #ddd;
    }
  }

  a {
    color: rgba(0, 0, 0, 1);
    //transition: color .3s;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  a:hover {
    color: @hover_color;
  }
}

.el-autocomplete-suggestion li:hover {
  background-color: #edf6ff !important;
}
</style>
<style lang="less" scoped>
.product-carousel {
  margin-top: 30px;
  //margin-right: 100px;
}

@hover_color: #3370ff;
* {
  margin: 0;
  padding: 0;
}

.news_header {
  background-color: rgba(255, 255, 255, .5);
  backdrop-filter: blur(10px);
  //border-bottom: 1px solid #eff0f1;
}

.box {
  padding-top: 60px;
  //background: url("../../assets/img/news/bg_02.jpg");
  //background-size: cover;
}

.news-banner {
  width: 100%;
  height: 280px;
  background: url("../../assets/img/news/newsbanner.jpg") 50% no-repeat;
  background-size: cover;
  text-align: center;
  padding-top: 70px;

  .banner-title {
    padding-bottom: 30px;

    h2 {
      font-size: 40px;
      line-height: 60px;
      font-weight: 600;
    }

    h3 {
      color: #828282;
      margin-top: 5px;
      font-size: 100%;
      font-weight: 400;
      font-variant: normal;
    }
  }

  .search-news {
    width: 46%;

    .el-input__icon {
      line-height: 46px;
      font-size: 16px;
    }
  }

  /deep/ .el-input__inner {
    height: 46px;
    line-height: 46px;
    border-radius: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
}

.news-container {
  max-width: 1200px;
  //background: #d3dce6;
  min-height: 580px;
  margin: 0 auto;

  .news-card {
    padding-top: 40px;
    margin: 0 auto 50px auto;
    display: flex;
    justify-content: space-evenly;
    //background-color: #d3dce6;
    .el-card {
      width: 280px;
      height: 160px;
      overflow: hidden;
      color: #FFFFFF;
    }

    .news-card-item {
      width: 280px;
      height: 160px;
      position: relative;
      cursor: pointer;

      .item-mask {
        position: absolute;
        background: linear-gradient(transparent, #030822);
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 50px 20px;
        height: 97px;
        box-sizing: border-box;
      }

      span {
        color: #fff;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }

    .news-card-item:hover img {
      transform: scale(1.02);
    }

    /deep/ .el-card__body {
      padding: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all .4s ease-in-out;
    }
  }

  .news-list {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .news-list:after {
    content: "";
    position: absolute;
    left: 0;
    top: 43px;
    width: 100%;
    height: 2px;
    background-color: #E4E7ED;
    z-index: 1;
  }

  /deep/ .el-tabs__header {
    height: 60px;
  }

  /deep/ .el-tabs__active-bar {
    bottom: 5px;
    //height: 3px;
  }

  /deep/ .el-tabs__item {
    height: 50px;
    line-height: 50px;
    font-weight: 600;
  }

  .list-left {
    width: 860px;

    /deep/ .el-tabs__content {
      height: auto;
      //background-color: #d2d3d4;
    }
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 50px;
  }

  .list-right {
    margin-left: 50px;

    .search-by-date {
      //padding: 6px 0;
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: flex-end;
      font-size: 14px;
      margin-bottom: 25px;

      p {
        white-space: nowrap;
        position: relative;
        //right: -30px;
      }

      .el-date-editor.el-input {
        width: 160px;
      }

      /deep/ .el-input__inner {
        width: 160px;
        height: 30px;
        line-height: 30px;
      }

      /deep/ .el-input__prefix, /deep/ .el-input__suffix {
        top: -4px;
      }

      ///deep/ .el-input__suffix{
      //  right: 50px;
      //}
    }

    /deep/ .el-card__body {
      padding-top: 0;
    }

  }
}

/deep/ .el-tabs__nav-wrap::after {
  content: none;
}

.box-card {
  width: 480px;
}

.pic_item {
  position: relative;
  height: 100%;
}
.pic_item:hover{
  cursor: pointer;
}

.pic_item img {
  width: 100%;
  height: 100%;
}

.pic_item h3 {
  position: absolute;
  left: 1rem;
  bottom: 2rem;
}
</style>
