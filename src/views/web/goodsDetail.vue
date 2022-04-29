<template>
  <div class="container">
    <div class="content">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/stucompla/market' }">二手交易首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ goods.goodsCategory.categoryName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ goods.goodsName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="el-row-market">
        <el-col :span="24">
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
                <el-col :span="24">
                  <h3>商品详情</h3>
                  {{goods.goodsDetail}}
                  <h3>图片</h3>
                  <img style="width: 700px" :src="`http://localhost:8086/image/${item}`" v-for="(item,index) in goods.goodsImages" :key="index">
                </el-col>
              </el-row>

            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="goodsDetailRight">
      <el-card >
        <h4>单价：{{goods.goodsPrice}}</h4>
        <h4>购买数量：<el-input-number size="small" style="width: 90px" v-model="buyCount"  controls-position="right" :min="1" :max="goods.goodsCount<1?1:goods.goodsCount"></el-input-number>
        <br><span v-if="goods.goodsCount<1" style="color: red; font-size: 10px">库存已不足</span>
        </h4>
      <h4>总价：{{goods.goodsPrice*this.buyCount}}</h4>
        <el-button :disabled="goods.goodsCount<1" type="primary" @click="addOrder(goods.goodsId)" >立即购买</el-button>
        <el-popover
          placement="right"
          :title="`联系 ${goods.user.username}`"
          width="200"
          trigger="click"
        >

          <el-input
            v-model="letterDetail"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8}"
            placeholder="请输入沟通内容"
          />
          <el-button type="primary" @click="sendLetter(goods.user.userId)">发送</el-button>
          <el-button type="primary"  style="margin: 10px 0 5px 0"
                      slot="reference">联系卖家</el-button>
        </el-popover>
<!--        <el-button type="danger" >加入购物车</el-button>-->
      </el-card>
    </div>
<!--    订单详情弹窗-->
    <el-dialog title="订单信息" :visible.sync="dialogOrderVisible" :modal-append-to-body="false" :lock-scroll="false"
               width="25%" :center="true" :show-close="false">
      <el-form label-position="right" label-width="80px" label-suffix=":" :model="OrderForm">
        <el-form-item label="订单ID">
          {{OrderForm.orderId}}
        </el-form-item>
        <el-form-item label="商品名">
          {{OrderForm.goods.goodsName}}
        </el-form-item>
        <el-form-item label="商品单价">
          {{OrderForm.goods.goodsPrice}}
        </el-form-item>
        <el-form-item label="购买数量">
          {{OrderForm.buyCount}}
        </el-form-item>
        <el-form-item label="总价">
          {{OrderForm.totalPrice}}
        </el-form-item>
        <el-form-item label="创建时间">
          {{OrderForm.createTime}}
        </el-form-item>

        <el-form-item align="left">
          <el-button type="primary" @click.native="handlePay(OrderForm.orderId)">立即支付</el-button>
          <el-button type="danger" @click="handlePayLater">稍后支付</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
<!--    <hot-news class="right"></hot-news>-->
  </div>

</template>

<script>
export default {
  name: 'goodsDetail',
  data () {
    return {
      dialogOrderVisible: false,
      OrderForm: {
        orderId: '',
        seller: {},
        buyer: {},
        goods: {},
        buyCount: '',
        totalPrice: '',
        createTime: '',
        updateTime: '',
        orderStatus: ''
      },
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
      },
      letterDetail: undefined
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
    },
    addOrder (goodsId) {
      this.$http.post('/market-order/addOrder', {
        goodsId: goodsId,
        buyCount: this.buyCount
      }).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          console.log(res.data.data)
          this.OrderForm = res.data.data
          this.dialogOrderVisible = true
        }
      })
    },
    handlePay (orderId) {
      // 更改订单状态为’1‘-“已支付”    假支付
      this.$http.post('/market-order/payOrder/' + orderId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.dialogOrderVisible = false
        }
      })
    },
    handlePayLater () {
      this.$message.success('订单已保存到“我的订单”，请及时支付')
      this.dialogOrderVisible = false
    },
    sendLetter (receiverId) {
      this.$http.post('/letter/send', {
        letterDetail: this.letterDetail,
        receiverId: receiverId
      }).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success('发送成功，具体对话请前往“我的消息”中查看！')
          this.$router.go(0)
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
  max-width: 1000px;
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

.goodsDetailRight{
  padding-top: 180px;
}
</style>
