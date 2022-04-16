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
        <div class="grid-content bg-purple" align="right">
          <el-button type="primary" plain @click="toAddGoods">我要卖二手</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0" class="el-row-market">
      <el-col :span="8" :offset="3">
        <div class="grid-content bg-purple">
          <el-tabs tabPosition="left">
            <el-tab-pane :label="item.categoryName" :name="''+index"
                         v-for="(item,index) in firstLevelFromGoodsCategoryList"
                         :key="index" style="height: 355px;">

              <div v-for="(item,index) in childLevelList(item.categoryId)" :key="index">
                <h5 style="margin-top: 10px;margin-bottom: 10px;">{{ item.categoryName }}</h5>
                <el-link :underline="false" style="margin: 0px 15px 5px 0px"
                         v-for="(item,index) in childLevelList(item.categoryId)" :key="index">
                  {{ item.categoryName }}
                </el-link>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <div class="block">
            <el-carousel trigger="click" height="365px">
              <el-carousel-item v-for="item in 4" :key="item">
                <h3 class="small">{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
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
      keyName: '',
      goodsCategoryList: [],
      searchNews: '',
      newsTabs: [
        {
          id: '1',
          name: '最新动态'
        },
        {
          id: '2',
          name: '典型案例'
        },
        {
          id: '3',
          name: '通知公告'
        }
      ],
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
    handleSearch () {
      this.$http.get('/goods/getList', {
        params: { keyName: this.keyName }
      }).then(res => {
        if (res.data.code !== 200) {

        } else {
          console.log(res.data.data.goodsList)
        }
      })
    },
    toAddGoods () {
      this.$router.push('/stucompla/addGoods')
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
    }
  },
  created () {
    this.getGoodsCategoryList()
    // this.getNewsItems()
    // this.getRecomNews()
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
  padding-top: 20px;
}

.el-col {
  /*border-radius: 4px;*/
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
</style>
