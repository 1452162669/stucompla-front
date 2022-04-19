<template>
  <div class="container">
    <div class="left">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/stucompla/market' }">二手交易首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ goods.goodsCategory.categoryName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ goods.goodsName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="el-row-market">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-card >
              <el-row>
                <el-col :span="3">
                <el-avatar
                  :size="90"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                  fit="scale-down"
                />
              </el-col>
                <el-col :span="13">
                <h3>{{ goods.user.username }}  </h3>
                <p><i class="el-icon-s-promotion"></i>{{ goods.createTime }}</p>
              </el-col>
              </el-row>
              <el-row>
                <el-col :span="15">
                  <h3>商品详情</h3>
                  {{goods.goodsDetail}}
                  <h3>图片</h3>
                  <img style="width: 700px" :src="`http://localhost:8086/image/${item}`" v-for="(item,index) in goods.goodsImages" :key="index">
                </el-col>
              </el-row>

            </el-card>
          </div>
        </el-col>
        <el-col :span="4" >
          <h4>定价：{{goods.goodsPrice}}</h4>
          <h4>数量：<el-input-number size="medium" style="width: 150px" v-model="buyCount"
                                  :min="1" :max="999"
                                  label="描述文字"></el-input-number></h4>
        </el-col>
      </el-row>
      <div class="content">
        <h1>{{ goods.goodsName }}</h1>
        <span>{{ goods.createTime }}</span>
        <span title="热度" style="margin-left:19px;font-weight:400"><i
          class="el-icon-view"></i> {{ goods.viewNum }}</span>
        <span title="评论" style="margin-left:19px"><i class="el-icon-chat-line-round"></i> {{  }}</span>
        <span title="收藏" style="margin-left:19px"><i class="el-icon-star-off"></i> {{ }}</span>
        <el-divider><i class="el-icon-view"></i></el-divider>
        <article class="article" v-html="goods.goodsDetail"></article>
<!--        <el-divider>-->
<!--          <el-button circle size="mini" :disabled="isClick" @click="onCollect"><i-->
<!--            :class="{iconStarColor: isCollect}"-->
<!--            style="font-size: 30px"-->
<!--            class="el-icon-star-off"-->
<!--          ></i></el-button>-->
<!--        </el-divider>-->
      </div>

    </div>

<!--    <hot-news class="right"></hot-news>-->
  </div>

</template>

<script>
export default {
  name: 'goodsDetail',
  data () {
    return {
      buyCount: '',
      goods: {
        goodsId: '',
        goodsName: '',
        goodsDetail: '',
        goodsImages: undefined,
        goodsPrice: '',
        goodsCategory: {},
        goodsCount: '',
        goodsStatus: '',
        createTime: '',
        updateTime: '',
        user: {},
        viewNum: ''

      }
    }
  },
  computed: {
    goods_path () {
      return this.$route.params.id
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
  },
  created () {
    this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail () {
      this.$http.get('/goods/' + this.goods_path).then(res => {
        if (res.data.code !== 200) {
          this.$message.error('商品不存在')
          // 应该跳转一个提示不存在的页面
        } else {
          // console.log(res.data.data)
          this.goods = res.data.data
          // console.log(this.goods)
          this.goods.goodsImages = this.goods.goodsImages.split(',')
          console.log(this.goods)
        }
      })
    }
  }
}
</script>

<style>

/*布局样式*/
.el-row-market {
  padding-top: 10px;
  padding-bottom: 10px;
}

.bg-purple {
  background: #d3dce6;
}

.grid-content {
  /*border-radius: 4px;*/
  min-height: 36px;
}
.container {
  padding-top: 90px;
  position: relative;
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
//background: #d3dce6;
  min-height: 580px;
  margin: 0 auto;
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

</style>
