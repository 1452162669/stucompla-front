<template>
  <div style="padding-top: 80px">

    <el-container>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="user-info">
            <el-avatar
              :size="100"
              :src="basicInfo.avatar"
              fit="scale-down"
            />
            <h3 style="font-size: 21px;font-weight: 500;">{{ basicInfo.username }}</h3>
            <p style="font-size: 14px;">
              尚未佩妥剑，转眼即江湖
            </p>

            <div style="width: 100%;display: flex;justify-content: space-evenly;text-align: center;">
              <div class="data-item" data-v-0c2f6664="">
                <a class="el-link el-link--default" @click="currentMenu='myPost'">
                  <span class="el-link--inner">
                    <p class="headline" data-v-0c2f6664="">帖子</p>
                    <p class="length-num" data-v-0c2f6664="">{{myPostList.total}}</p></span>
                </a>
              </div>
              <div class="data-item" >
                <a class="el-link el-link--default" @click="currentMenu='myComment'">
                  <span class="el-link--inner">
                    <p class="headline" data-v-0c2f6664="">回复</p>
                    <p class="length-num" data-v-0c2f6664="">10</p>
                </span>
                </a>
              </div>
              <div class="data-item">
                <a class="el-link el-link--default" @click="currentMenu='myCollect'">
                <span class="el-link--inner">
                  <p class="headline" data-v-0c2f6664="">收藏</p>
                  <p class="length-num" data-v-0c2f6664="">{{myCollectList.total}}</p>
                </span>
                </a>
              </div>
              <div class="data-item">
                <a class="el-link el-link--default" @click="currentMenu='myGoods'">
                <span class="el-link--inner">
                  <p class="headline" data-v-0c2f6664="">二手</p>
                  <p class="length-num" data-v-0c2f6664="">{{myGoodsList.total}}</p>
                </span>
                </a>
              </div>
              <div class="data-item">
                <a class="el-link el-link--default" @click="currentMenu='myOrder'">
                <span class="el-link--inner">
                  <p class="headline" data-v-0c2f6664="">订单</p>
                  <p class="length-num" data-v-0c2f6664="">5</p>
                </span>
                </a>
              </div>
            </div>

            <ul>
              <li><i class="el-icon-user"/>{{ basicInfo.username }}</li>
              <li v-if="basicInfo.sex =='男'">
                <svg-icon icon-class="sex"/>
                男
              </li>
              <li v-else-if="basicInfo.sex =='女'">
                <svg-icon icon-class="sex"/>
                女
              </li>
              <li v-else>
                <svg-icon icon-class="sex"/>
                保密
              </li>
              <li><i class="el-icon-time"/>{{ basicInfo.createtime }}</li>
              <li><i class="el-icon-office-building"/>{{ basicInfo.department }}</li>
              <li><i class="el-icon-location-outline"/>{{ basicInfo.location }}</li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card>
            <el-tabs
              v-model="currentMenu"
              class="menu"
            >
              <el-tab-pane
                label="基本信息"
                name="userInfo"
              >
                <el-form
                  ref="basicInfo"
                  label-position="right"
                  label-width="80px"
                  :model="basicInfo"
                >
                  <el-form-item
                    label="姓名"
                  >
                    <el-input v-model="basicInfo.username"/>
                  </el-form-item>
                  <el-form-item
                    label="账户名"
                  >
                    <el-input v-model="basicInfo.accountName"/>
                  </el-form-item>
                  <el-form-item
                    label="性别"
                  >
                    <el-select
                      v-model="basicInfo.sex"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in sexOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="个人简介"
                  >
                    <el-input
                      v-model="basicInfo.description"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                    />
                  </el-form-item>
                  <el-form-item
                    label="头像"
                  >
                    <!--                  <el-upload-->
                    <!--                    ref="uploadImg"-->
                    <!--                    :action="action"-->
                    <!--                    :http-request="uploadFile"-->
                    <!--                    :headers="headers"-->
                    <!--                    list-type="picture-card"-->
                    <!--                    :file-list="fileList"-->
                    <!--                    :limit="1"-->
                    <!--                    :class="{ disabled: uploadDisabled }"-->
                    <!--                    :before-upload="beforeImgUpload"-->
                    <!--                    :on-progress="imgOnProgress"-->
                    <!--                    :on-preview="handlePictureCardPreview"-->
                    <!--                    :on-remove="handleRemove"-->
                    <!--                  >-->
                    <i class="el-icon-plus"/>
                    <!--                  </el-upload>-->
                    <el-dialog :visible.sync="dialogVisible">
                      <img
                        width="100%"
                        :src="dialogImageUrl"
                        alt=""
                      >
                    </el-dialog>
                  </el-form-item>
                  <el-button
                    type="primary"
                    plain
                    round
                    size="small"
                    @click="editAccount"
                  >
                    确认修改
                  </el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane
                label="我的帖子"
                name="myPost"
              >
                <post-list :items="myPostList.postList"></post-list>
              </el-tab-pane>
              <el-tab-pane
                label="我的回复"
                name="myComment"
              >
                <div
                  v-for="(item,index) in bindAccount"
                  :key="index"
                  class="account-binding"
                >
                  <svg-icon
                    :icon-class="item.icon"
                    class-name="binding-icon"
                  />
                  <div class="account-binding-content">
                    <p>{{ item.desc }}</p>
                    <p v-if="item.accountId">
                      {{ item.accountId }}
                    </p>
                    <p v-else>
                      当前账号未{{ item.desc }}账号
                    </p>
                  </div>
                  <el-button
                    type="primary"
                    plain
                    round
                    size="small"
                  >
                    更换绑定
                  </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane
                label="我的收藏"
                name="myCollect"
              >
                <post-list :items="myCollectList.postList"></post-list>
              </el-tab-pane>
              <el-tab-pane
                label="我的二手"
                name="myGoods"
              >
                <el-row :gutter="20" class="el-row-market" style="margin: 0px">
                  <el-col :span="10" :offset="7" v-if="myGoodsList.goodsList.length<1">
                    <el-empty description="暂无商品" :image-size="300"></el-empty>
                  </el-col>
                  <el-col :span="5"  v-for="(item,index) in myGoodsList.goodsList" :key="item.goodsId" :offset="index%4===0?2:0">
                      <el-card :body-style="{ padding: '5px'}" shadow="hover" class="el-card-goods">
                        <router-link :to="`/stucompla/goods/${item.goodsId}`">
                          <el-image :src="`http://localhost:8086/image/${item.goodsImages[0]}`" class="image"></el-image>
                        </router-link>
                        <div style="padding: 5px;">
                          <span>{{ item.goodsName }}</span><br>
                          <span class="span-goodsDetail">{{ item.goodsDetail }}</span>
                          <span class="price">￥{{ item.goodsPrice }}</span>
                        </div>
                        <div align="center">
                            <el-button type="primary" size="small" @click="$router.push('/stucompla/editGoods/'+item.goodsId)">修改</el-button>

                          <el-popconfirm

                            icon="el-icon-info"
                            icon-color="red"
                            title="确定下架该商品？"
                            style="padding-left: 10px"
                            @confirm="deleteGoods(item.goodsId)"
                          >
                            <el-button  slot="reference" type="danger" size="small">下架</el-button>
<!--                            <el-button slot="reference">删除</el-button>-->
                          </el-popconfirm>
                        </div>
                      </el-card>

                  </el-col>

                </el-row>
              </el-tab-pane>
              <el-tab-pane
                label="我的订单"
                name="myOrder"
              >
                <div align="center" v-loading="loading" element-loading-text="加载中...">
                  <ul class="news-list-items" v-if="myOrderList.orderList.length">
                    <li class="news-list-item" v-for="(item,index) in myOrderList.orderList"
                        :key="index"
                        style="padding: 0 10px 10px 0;">
                      <el-card shadow="hover" style="width: 700px" >
<!--                        <router-link :to="`/stucompla/post/${item.postId}`">-->
                          <!--          <router-link :to="{name:'postDetail',params:{id: item.postId}}">-->
                          <!--<div class = "item-mask"></div>-->
<!--                        <div slot="header" align="left">-->
<!--                          -->
<!--&lt;!&ndash;                          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>&ndash;&gt;-->
<!--                        </div>-->
                        <el-row>
                          <div align="left" style="padding-bottom: 10px">
                          <span >
                            订单号：
                            <router-link :to="`/stucompla/post/${item.postId}`">
<!--                              这里应该跳转订单详情页-->
                              {{item.orderId}}
                            </router-link>
                            <!--                            <a @click="orderDetail(item.orderId)"></a>-->
                          </span>
                          <span style="float: right;color: #f84521">{{getOrderStatus(item.orderStatus)}}</span>
                          </div>
                        </el-row>
                        <el-row>
                          <el-col :span="7">
                            <router-link :to="`/stucompla/post/${item.goods.postId}`">
                              <img style="width: 100%;border-radius: 5px" :src="`http://localhost:8086/image/${item.goods.goodsImages[0]}`" alt="">
                            </router-link>
                          </el-col>
                          <el-col :span="9" :offset="1" align="left">
                              <h3 style="margin: 0 0 8px 0" class="single-show">{{ item.goods.goodsName }}</h3>
                              <p style="margin: 0 0 8px 0" class="single-show">备注：{{  }}</p>
                            <p style="margin: 0 0 8px 0">创建时间：{{item.createTime}}</p>
                          </el-col>
                          <el-col :span="7" align="right">
                            <h3 style="margin: 0 0 8px 0">￥{{item.goods.goodsPrice}}</h3>
                            <p style="margin: 0 0 8px 0">x{{item.buyCount}}</p>
                            <h3 style="color: #f84521;margin: 0 0 8px 0">￥{{ item.totalPrice }}</h3>
                            <div align="right">
                              <el-button type="primary"
                                         size="small"
                                         v-if="item.orderStatus===0"
                                         @click="handlePay(item.orderId,index)">立即支付</el-button>
                              <el-button type="primary"
                                         size="small"
                                         v-if="item.orderStatus===2"
                                         @click="handleReceipt(item.orderId,index)">确认签收</el-button>
                              <el-popconfirm
                                icon="el-icon-info"
                                icon-color="red"
                                title="确定删除该订单？"
                                style="padding-left: 10px"
                                @confirm="deleteOrder(item.orderId,i)"
                                v-if="item.orderStatus===5"
                              >
                                <el-button slot="reference"
                                           type="danger"
                                           size="small"
                                           align="right">删除订单</el-button>
                              </el-popconfirm>

                            </div>
                          </el-col>
                        </el-row>
<!--                        <el-row >-->
<!--                          <div align="right">-->
<!--                          <el-button type="primary"-->
<!--                                     size="small"-->
<!--                                     v-if="item.orderStatus===0"-->
<!--                                     @click="handlePay(item.orderId,index)">立即支付</el-button>-->
<!--                          <el-popconfirm-->
<!--                            icon="el-icon-info"-->
<!--                            icon-color="red"-->
<!--                            title="确定删除该订单？"-->
<!--                            style="padding-left: 10px"-->
<!--                            @confirm="deleteOrder(item.orderId,i)"-->
<!--                          >-->
<!--                            <el-button slot="reference"-->
<!--                                       type="danger"-->
<!--                                       size="small"-->
<!--                                       align="right">删除订单</el-button>-->
<!--                          </el-popconfirm>-->

<!--                          </div>-->
<!--                        </el-row>-->

<!--                          <img :src="item.cover_img" alt="">-->

<!--                        </router-link>-->
                      </el-card>
                    </li>
                  </ul>
                  <span class="is-null" v-else >你还没有创建订单</span>
                </div>

              </el-tab-pane>
              <el-pagination
                class="pagination"
                background
                @current-change="handleCurrentChange"
                :current-page.sync="Query.pageNum"
                :page-size="Query.pageSize"
                layout="prev, pager, next, jumper"
                :total="showList.total"
                :hide-on-single-page="singlePage"
                v-scroll-to="{ element: '.menu',duration: 300, easing: 'ease',offset: -90  }"
                v-if="currentMenu!=='userInfo'"
              align="center">
              </el-pagination>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
// import { uploadFile } from '@/api/file'
// import { getInfoById, updateAccount } from '@/api/user'
import PostList from '../../components/web/postList'
import login from './login'

export default {
  name: 'Index',
  components: {
    PostList
  },
  data () {
    return {
      loading: true,
      currentMenu: 'userInfo',
      labelPosition: 'right',
      basicInfo: {
        avatar: 'http://localhost:8086/image/1649474344343_1512631150949040128.png',
        // name: '',
        userName: '',
        sex: '',
        description: '',
        location: ''
      },
      sexOptions: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
        },
        {
          label: '保密',
          value: '保密'
        }
      ],
      bindAccount: [
        {
          icon: 'qq',
          accountId: '1452162669',
          desc: '绑定QQ'
        },
        {
          icon: 'wechat',
          accountId: '',
          desc: '绑定微信'
        },
        {
          icon: 'zhifubao',
          accountId: '',
          desc: '绑定支付宝'
        }
      ],
      oldPassword: '',
      newPassword: '',
      // 图片默认提交地址，未使用。
      action: '',
      // 上传文件列表
      fileList: [],
      // 是否禁用上传
      uploadDisabled: false,
      // 图片弹窗
      dialogImageUrl: '',
      dialogVisible: false,
      // 单页隐藏
      singlePage: '',
      Query: {
        userId: undefined,
        pageNum: 1,
        pageSize: 8
      },
      showList: {},
      myPostList: {
        current: '',
        pageSize: '',
        pages: '',
        postList: [],
        total: ''
      },
      myCollectList: {
        current: '',
        pageSize: '',
        pages: '',
        postList: [],
        total: ''
      },
      myGoodsList: {
        current: '',
        pageSize: '',
        pages: '',
        goodsList: [],
        total: ''
      },
      myOrderList: {
        current: '',
        pageSize: '',
        pages: '',
        orderList: [],
        total: ''
      }
    }
  },
  watch: {
    currentMenu: {
      handler (newVal, oldVal) {
        // if (newVal === 'myPost') {
        //   this.showList = this.myPostList
        // }
        this.Query.pageNum = 1
        switch (newVal) {
          case 'myPost':
            this.getMyPostList()
            this.showList = this.myPostList
            break
          case 'myCollect':
            this.getMyCollectList()
            this.showList = this.myCollectList
            break
          case 'myGoods':
            this.getMyGoodsList()
            this.showList = this.myGoodsList
            break
          case 'myOrder':
            this.getMyOrderList()
            this.showList = this.myOrderList
            break
        }
      }
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
    // this.getMyAll()
  },
  computed: {
    headers () {
      return {
        // 'Authorization': 'Bearer ' + this.$store.getters.token // 直接从本地获取token就行
      }
    },
    editId () {
      return this.$store.getters.id
    }

  },
  // 每次进入路由前，重新获取数据
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getMyAll()
    })
  },
  methods: {
    async getMyAll () {
      await this.getAccountInfo()
      console.log(this.basicInfo.userId)
      if (this.basicInfo.userId !== undefined) {
        this.getMyPostList()
        this.getMyCollectList()
        this.getMyGoodsList()
        this.getMyOrderList()
      }
    },
    // handleTabsClick (tab, event) {
    //   if (tab.name === 'myPost') {
    //     this.showList = this.myPostList
    //     console.log(this.showList)
    //   }
    // },
    // 获取账户信息
    getAccountInfo () {
      return new Promise(resolve => {
        this.basicInfo = {}
        this.$http.get('/user/info').then(res => {
          if (res.data.code !== 200) {
            this.$message.error('获取账户信息失败')
          } else {
            console.log(res.data.data)
            this.basicInfo = res.data.data
          }
          resolve()
        })
      })
    },
    // 获取我的帖子列表
    getMyPostList () {
      this.Query.userId = this.basicInfo.userId
      this.$http.get('/post/list', {
        params: this.Query
      }).then(res => {
        if (res.data.code !== 200) {
          this.myPostList = undefined
        } else {
          console.log(res.data.data)
          this.myPostList = res.data.data
        }
      })
    },
    // 获取我的评论列表
    getMyCommentList () {

    },
    // 获取我的收藏列表
    getMyCollectList () {
      this.Query.userId = this.basicInfo.userId
      this.$http.get('/collect/list', {
        params: this.Query
      }).then(res => {
        if (res.data.code !== 200) {
          this.myCollectList = undefined
        } else {
          console.log(res.data.data)
          this.myCollectList = res.data.data
        }
      })
    },
    // 获取我的二手列表
    getMyGoodsList () {
      this.Query.userId = this.basicInfo.userId
      this.$http.get('/goods/getList', {
        params: this.Query
      }).then(res => {
        if (res.data.code !== 200) {
          this.myGoodsList = undefined
        } else {
          console.log(res.data.data)
          this.myGoodsList = res.data.data
          this.myGoodsList.goodsList.forEach(function (item) {
            item.goodsImages = item.goodsImages.split(',')
          })
        }
      })
    },
    // 获取我的订单列表
    getMyOrderList () {
      this.$http.get('/market-order/myOrder', {
        params: this.Query
      }).then(res => {
        if (res.data.code !== 200) {
          this.myOrderList = undefined
        } else {
          console.log(res.data.data)
          this.myOrderList = res.data.data
          this.myOrderList.orderList.forEach(function (item) {
            item.goods.goodsImages = item.goods.goodsImages.split(',')
          })
          this.loading = false
        }
      })
    },
    orderDetail (orderId) {
      // this.$router.push({
      //   path: 'orderDetail',
      //   query: {
      //     orderId: orderId
      //   }
      // })
    },
    deleteOrder (orderId, index) {
      this.$http.delete('/market-order/' + orderId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          // 删除成功 从列表中移除
          this.myOrderList.orderList.splice(index, 1)
        }
      })
    },
    handlePay (orderId, index) {
      // 更改订单状态为’1‘-“已支付”    假支付
      this.$http.post('/market-order/payOrder/' + orderId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getMyOrderList()
        }
      })
    },
    handleReceipt () {
      console.log('这里写签收相关操作')
    },
    getOrderStatus (status) {
      console.log(status)
      if (status === 0) {
        return '待支付'
      } else if (status === 1) {
        return '待发货'
      } else if (status === 2) {
        return '待签收'
      } else if (status === 3) {
        return '已签收'
      } else if (status === 4) {
        return '已退货'
      } else if (status === 5) {
        return '订单完成'
      }
    },
    // 帖子列表页码切换
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      switch (this.currentMenu) {
        case 'myPost':
          this.getMyPostList()
          break
        case 'myCollect':
          this.getMyCollectList()
          break
        case 'myGoods':
          this.getMyGoodsList()
          break
        case 'myOrder':
          this.getMyOrderList()
          break
      }
    },
    deleteGoods (goodsId) {
      // console.log('1111111111111111')
      this.$http.delete('/goods/' + goodsId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          this.getMyGoodsList()
        }
      })
    },
    editAccount () {
      // const updateData = {
      //   username: this.basicInfo.accountName,
      //   name: this.basicInfo.name,
      //   password: this.basicInfo.password,
      //   sex: this.basicInfo.sex,
      //   introduction: this.basicInfo.description,
      //   avatar: this.basicInfo.avatar
      // }
      // updateAccount(this.editId, updateData).then(response => {
      //   const res = response.data
      //   if (res.status === 200) {
      //     this.basicInfo = {}
      //     this.getAccountInfo()
      //     this.newPassword = this.basicInfo.password
      //     this.$message.success(res.msg)
      //   } else {
      //     this.dialogVisible = false
      //     this.$message.error(res.msg)
      //     this.basicInfo = {}
      //     this.getAccountInfo()
      //   }
      // })
    },
    // 上传文件
    uploadFile (param) {
      const formData = new FormData()
      formData.append('file', param.file)
      // uploadFile(formData).then(response => {
      //   const res = response.data
      //   // 上传状态
      //   if (res.status === 200) {
      //     this.basicInfo.avatar = res.data.fileUrl
      //     param.onSuccess()
      //     this.uploadDisabled = true
      //   } else {
      //     this.basicInfo.avatar = ''
      //     this.$message.error('上传失败,请联系管理员！')
      //     param.onError()
      //     this.uploadDisabled = false
      //   }
      // })
    },
    beforeImgUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isLt1M) {
        this.$message.error('上传封面图片大小不能超过 1MB!')
      }
      return isLt1M
    },
    // 上传中
    imgOnProgress (event, file) {
      this.uploadDisabled = true
    },
    // 移除头像
    handleRemove (file) {
      this.uploadDisabled = false
    },
    // 查看头像
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
/*布局样式*/
.el-row-market {
  padding-top: 10px;
  padding-bottom: 10px;
}

//.el-card-goods :hover{
//  color: red;
//}

/* 商品卡片样式 */
.price {
  font-size: 20px;
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
.image {
  width: 100%;
  display: block;
}
.el-container {
  //margin: 20px;

}

.el-row {
  width: 100%;
}

.el-form {
  margin-bottom: 50px;
}

.el-form-item {
  display: block;

  width: 100%;
}

.user-info {
  text-align: center;

  ul {
    text-align: left;
    list-style: none;
    margin: 0 20px;

    li {
      margin: 10px 0;
    }

    i, {
      margin-right: 10px;
    }

    .svg-icon {
      margin-right: 5px;
    }
  }
}

::v-deep {
  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
  }

  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
  }

  .el-input__inner {
    width: 80%;
  }

  .el-select {
    width: 80%;

    .el-input__inner {
      width: 100%;
    }
  }

  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-textarea__inner {
    width: 80%;
  }
}

// .el-upload--picture-card 控制加号部分
::v-deep .disabled .el-upload--picture-card {
  display: none !important;
}

.account-binding {
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #dfe4ed;
}

.account-binding-content {
  margin-left: 15px;
  width: 100%;

  p {
    margin: 10px 0;
  }
}

.binding-icon {
  font-size: 40px;
}

.is-null {
  display: flex;
  justify-content: center;
  margin-top: 45px;
  color: #777
}

.single-show{
  white-space:nowrap;/*强制单行显示*/
  text-overflow:ellipsis;/*超出部分省略号表示*/
  overflow:hidden;/*超出部分隐藏*/
  width: 100%;/*设置显示的最大宽度*/
  display:inline-block;
}
</style>
