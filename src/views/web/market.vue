<template>
  <div style="padding-top: 70px">

    <el-row class="el-row-market">
      <el-col :span="10" :offset="7">
        <div>
          <el-input
            style="border-radius: 21px"
            placeholder="请输入内容"
            v-model="keyName"
            @keyup.enter.native="handleSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </el-col>
      <el-col :span="2" :offset="2">
        <div class="grid-content " align="right">
          <el-button type="primary" plain @click="toCreateGoods">我要卖二手</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0" class="el-row-market">
      <el-col :span="18" :offset="3" >
        <div class="grid-content bg-purple">
          <el-tabs tabPosition="left" >
            <el-tab-pane :label="item.categoryName" :name="''+index"
                         v-for="(item,index) in firstLevelFromGoodsCategoryList"
                         :key="index" style="height: 355px;">

              <div v-for="(item,index) in childLevelList(item.categoryId)" :key="index">
                <h5 style="margin-top: 10px;margin-bottom: 10px;">{{ item.categoryName }}</h5>
                <el-link @click="getGoodsList(item.categoryId,item.categoryName)" :underline="false" style="margin: 0px 15px 5px 0px"
                         v-for="(item,index) in childLevelList(item.categoryId)" :key="index">
                  {{ item.categoryName }}
                </el-link>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
<!--      <el-col :span="11">-->
<!--        <div class="grid-content bg-purple">-->
<!--          <div class="block">-->
<!--            <el-carousel trigger="click" height="365px">-->
<!--              <el-carousel-item v-for="item in 4" :key="item">-->
<!--                <h3 class="small">{{ item }}</h3>-->
<!--              </el-carousel-item>-->
<!--            </el-carousel>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
    </el-row>
    <el-row class="el-row-market" >
      <el-col :span="5" :offset="2">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to=" { path: '/refresh',query: {t: Date.now()}} ">全部</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentCategoryName!==undefined">{{ currentCategoryName }}</el-breadcrumb-item>
          <!--        <el-breadcrumb-item>{{ goods.goodsName }}</el-breadcrumb-item>-->
        </el-breadcrumb>
      </el-col>

    </el-row>
    <el-row :gutter="40" class="el-row-market" style="margin: 0px">
      <el-col :span="10" :offset="7" v-if="goodsList.length<1">
        <el-empty description="暂无商品" :image-size="300"></el-empty>
      </el-col>
      <el-col :span="5"  v-for="(item,index) in goodsList" :key="item.goodsId" :offset="index%4===0?2:0">
        <router-link :to="`/stucompla/goods/${item.goodsId}`">
          <el-card :body-style="{ padding: '10px' }" shadow="hover" class="el-card-goods">
            <img :src="`http://localhost:8086/image/${item.goodsImages[0]}`"
                 class="image">
            <div style="padding: 14px;">
              <span>{{ item.goodsName }}</span><br>
              <span class="span-goodsDetail">{{ item.goodsDetail }}</span>
              <div class="bottom clearfix">
                <time class="time">￥{{ item.goodsPrice }}</time>
                <!--              <el-button type="text" class="button">操作按钮</el-button>-->
              </div>
            </div>
          </el-card>
        </router-link>

      </el-col>

    </el-row>

  </div>
</template>

<script>
export default {
  name: 'market',
  components: {
    // HotNews,
    // NewsList
    // AwFooter,
    // AwHeader
  },
  data () {
    return {
      currentCategoryName: undefined,
      currentCategoryId: undefined,
      currentDate: new Date(),
      count: 0,
      keyName: undefined,
      goodsCategoryList: [],
      goodsList: [],
      searchNews: '',

      newsItems: {},
      pageInfo: {
        activeName: '1',
        // 当前页码
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
        selectDate: ''
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
  computed: {
    firstLevelFromGoodsCategoryList () {
      return this.goodsCategoryList.filter((item, index) => {
        return item.categoryLevel === 1
      })
    }

  },
  methods: {
    load () {
      // this.count += 2
    },
    handleSearch () {
      this.$http.get('/goods/getList', {
        params: {
          keyName: this.keyName,
          goodsCategoryId: this.currentCategoryId,
          goodsStatus: true
        }
      }).then(res => {
        if (res.data.code !== 200) {

        } else {
          this.goodsList = res.data.data.goodsList
          this.goodsList.forEach(function (item) {
            item.goodsImages = item.goodsImages.split(',')
          })
          console.log(this.goodsList)
        }
      })
    },
    toCreateGoods () {
      this.$router.push('/stucompla/createGoods')
    },
    childLevelList (parentId) {
      return this.goodsCategoryList.filter((item, index) => {
        return item.parentId === parentId
      })
    },

    getGoodsCategoryList () {
      this.$http.get('/goods-category/list').then(res => {
        if (res.data.code !== 200) {

        } else {
          console.log(res.data.data.goodsCategoryList)
          this.goodsCategoryList = res.data.data.goodsCategoryList
        }
      })
    },
    getGoodsList (goodsCategoryId, categoryName) {
      console.log(goodsCategoryId)
      this.currentCategoryName = categoryName
      this.currentCategoryId = goodsCategoryId
      this.$http.get('/goods/getList', {
        params: {
          goodsCategoryId: goodsCategoryId,
          goodsStatus: true
        }
      }).then(res => {
        if (res.data.code !== 200) {

        } else {
          this.goodsList = res.data.data.goodsList
          this.goodsList.forEach(function (item) {
            item.goodsImages = item.goodsImages.split(',')
          })
          console.log(this.goodsList)
        }
      })
    }
  },
  created () {
    this.getGoodsList()
    this.getGoodsCategoryList()
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
<style>
/*布局样式*/
.el-row-market {
  padding-top: 10px;
  padding-bottom: 10px;
}

.el-card-goods :hover{
  color: red;
}

.span-goodsDetail{
  font-size: 12px;
  white-space:nowrap;/*强制单行显示*/
  text-overflow:ellipsis;/*超出部分省略号表示*/
  overflow:hidden;/*超出部分隐藏*/
  width: 100%;/*设置显示的最大宽度*/
  display:inline-block;
}
.el-col {
  padding-top: 20px;

}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  /*background: #e5e9f2;*/
}

.grid-content {
  /*border-radius: 4px;*/
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

/*.el-row {*/
/*  padding-top: 20px;*/
/*}*/

/*搜索框样式*/
.el-input__inner {
  border-radius: 20px;
}

/*走马灯样式*/
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

/* 商品卡片样式 */
.time {
  font-size: 20px;
  color: red;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  /*固定图片显示*/
  width: 240px;
  height: 168px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
