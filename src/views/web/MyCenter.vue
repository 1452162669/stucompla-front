<template>
  <div style="padding-top: 80px">

    <el-container>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="user-info">
            <el-avatar
              :size="100"
              v-if="basicInfo.avatar!=null&&basicInfo.avatar.length>0"
              :src="`http://localhost:8086/image/${basicInfo.avatar}`"
              fit="scale-down"
            ></el-avatar>
            <el-avatar
            :size="100"
            v-else
            :src="require('../../assets/img/defaultAvatar.png')"
            fit="scale-down"
          ></el-avatar>

            <h3 style="font-size: 21px;font-weight: 500;">{{ basicInfo.username }}</h3>
            <p style="font-size: 14px;">
              {{basicInfo.signature!=null?basicInfo.signature:'你还没有个性签名'}}
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
        <el-col :span="18">
          <el-card>
            <el-tabs
              v-model="currentMenu"
              class="menu"
            >
              <el-tab-pane
                label="基本信息"
                name="userInfo"
              >
                <el-row>
                  <el-col :span="11">
                    <el-card>
                      <el-form
                    ref="basicInfo"
                    :rules="basicInfoRules"
                    label-position="right"
                    label-width="80px"
                    :model="basicInfo"
                  >
                        <h3 align="center">修改基本信息</h3>
                    <el-form-item
                      label="用户名"
                      prop="username"
                    >
                      <el-input v-model="basicInfo.username"/>
                    </el-form-item>
                    <el-form-item
                      label="性别"
                      prop="sex"
                      required
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
                      label="个人签名"
                    >
                      <el-input
                        v-model="basicInfo.signature"
                        type="textarea"
                        :rows="2"
                        :maxlength="25"
                        placeholder="请输入你的个性签名"
                      />
                    </el-form-item>
                    <el-form-item
                      label="头像"
                    >
                      <el-upload
                        action="http://localhost:8086/image/upload"
                        :headers="myHeader"
                        :file-list="fileList"
                        name="files"
                        :limit="1"
                        :before-upload="beforeUpload"
                        list-type="picture-card"
                        :on-success="handleSuccess"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-exceed="handleExceed">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                    </el-form-item>
                    <el-form-item
                    >
                      <el-button
                        type="primary"
                        plain
                        round
                        size="small"
                        @click="editAccount"
                      >
                        确认修改
                      </el-button>
                    </el-form-item>
                  </el-form>
                    </el-card>
                  </el-col>
<el-col :span="12" :offset="1">
  <el-card>
    <el-form
      ref="changePwdForm"
      :rules="changePwdRules"
      label-position="right"
      label-width="80px"
      :model="changePwdForm"
    >
      <h3 align="center">修改密码</h3>
      <el-form-item
        label="旧密码"
        prop="oldPassword"
      >
        <el-input v-model="changePwdForm.oldPassword" type="password"/>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="inPassword"
      >
        <el-input v-model="changePwdForm.inPassword" type="password"/>
      </el-form-item>
      <el-form-item
        label="重复密码"
        prop="secondPassword"
      >
        <el-input v-model="changePwdForm.secondPassword" type="password" @keyup.enter.native="changePwd"/>
      </el-form-item>
      <el-form-item
      >
        <el-button
          type="primary"
          plain
          round
          size="small"
          @click="changePwd"
        >
          确认修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane
                label="我的帖子"
                name="myPost"
              >
                <post-list :items="myPostList.postList" :is-my-center=true></post-list>
              </el-tab-pane>
              <el-tab-pane
                label="我的回复"
                name="myComment"
              >
                <comment-list :items="myCommentList.comments" :is-my-center=true ></comment-list>
              </el-tab-pane>
              <el-tab-pane
                label="我的收藏"
                name="myCollect"
              >
                <post-list :items="myCollectList.postList" :is-my-center=true></post-list>
              </el-tab-pane>
              <el-tab-pane
                label="我的墙列表"
                name="myWall"
              >
                <el-row>
                  <el-col :span="18" :offset="3">
                    <el-card class="main-card" v-for="(item,index) in myWallList.walls" :key="index" shadow="hover">
                      {{ item.wallContent }}
                      <br>
                      <br>
                      <div v-if="item.wallImages!=null&&item.wallImages.length>0" >
                        <!--做一个图片预览-->
                        <el-image
                          v-for="(image,index) in item.wallImages"
                          style="width: 120px; height: 120px;margin-right: 10px;border-radius: 5px"
                          :key="index"
                          :src="`http://localhost:8086/image/${image}`"
                        />
                      </div>

                      <span>申请时间：{{ item.createtime }} </span>
                      <span style="padding-left: 10px" v-if="item.auditTime!==null"> 审核时间：{{ item.auditTime }}</span>
                      <span>
                        <el-alert
                          v-if="item.auditState==2"
                          title="审核不通过"
                          type="error"
                          style="width: 120px;float: right"
                          :closable="false">
              </el-alert>
                        <el-alert
                          v-if="item.auditState==1"
                          title="审核通过"
                          type="success"
                          style="width: 100px;float: right"
                          :closable="false">
              </el-alert>
                        <el-alert
                          v-if="item.auditState==0"
                          title="未审核"
                          type="info"
                          style="width: 90px;float: right"
                          :closable="false">
              </el-alert>
                      </span>
                    </el-card>
                  </el-col>
                </el-row>

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
                            v-if="item.goodsStatus==true"
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定下架该商品？"
                            style="padding-left: 10px"
                            @confirm="unShelve(item.goodsId)"
                          >
                            <el-button  slot="reference" type="warning" size="small">下架</el-button>
<!--                            <el-button slot="reference">删除</el-button>-->
                          </el-popconfirm>
                          <el-button @click="upGoods(item.goodsId)" v-else size="small" type="primary">上架</el-button>
                          <el-popconfirm
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除该商品？此操作不可恢复！"
                            style="padding-left: 10px"
                            @confirm="deleteGoods(item.goodsId)"
                          >
                            <el-button  slot="reference" type="danger" size="small">删除</el-button>
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
                            <router-link :to="`/stucompla/post/${item.goodsId}`">
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
                            <router-link :to="`/stucompla/goods/${item.goodsId}`">
                              <img style="width: 100%;border-radius: 5px" :src="`http://localhost:8086/image/${item.goodsImages[0]}`" alt="" class="image">
                            </router-link>
                          </el-col>
                          <el-col :span="9" :offset="1" align="left">
                              <h3 style="margin: 0 0 8px 0" class="single-show">{{ item.goodsName }}</h3>
                              <p style="margin: 0 0 8px 0" class="single-show">备注：{{  }}</p>
                            <p style="margin: 0 0 8px 0">创建时间：{{item.createTime}}</p>
                          </el-col>
                          <el-col :span="7" align="right">
                            <h3 style="margin: 0 0 8px 0">￥{{item.goodsPrice}}</h3>
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
                              <el-button type="primary"
                                         size="small"
                                         v-if="item.orderStatus===3"
                                         @click="handleReturn(item.orderId,index)">申请退货</el-button>
<!--                              <el-popconfirm-->
<!--                                icon="el-icon-info"-->
<!--                                icon-color="red"-->
<!--                                title="确定删除该订单？"-->
<!--                                style="padding-left: 10px"-->
<!--                                @confirm="deleteOrder(item.orderId,i)"-->
<!--                                v-if="item.orderStatus===5"-->
<!--                              >-->
<!--                                <el-button slot="reference"-->
<!--                                           type="danger"-->
<!--                                           size="small"-->
<!--                                           align="right">删除订单</el-button>-->
<!--                              </el-popconfirm>-->

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
              <el-tab-pane
                label="销售订单"
                name="mySalesOrders"
              >
                <MySalesOrders :key="mySalesOrdersRefreshKey"></MySalesOrders>
<!--                <router-view></router-view>-->
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
                v-if="currentMenu!=='userInfo'&&currentMenu!=='mySalesOrders'"
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
import commentList from '../../components/web/commentList'
import { removeToken } from '../../utils/auth'
import MySalesOrders from './mySalesOrders'

export default {
  name: 'Index',
  components: {
    MySalesOrders,
    PostList,
    commentList
  },
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3 || value.length > 10) {
        callback(new Error('用户名长度在3-10位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度在6-16位'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      currentMenu: 'userInfo',
      labelPosition: 'right',
      myHeader: {
        Authorization: this.$store.state.user.jwt
      },
      basicInfo: {

      },
      basicInfoRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        sex: [{ required: true, trigger: 'blur', message: '请选择性别' }]
      },
      changePwdForm: {
        oldPassword: '',
        inPassword: '',
        secondPassword: ''
      },
      changePwdRules: {
        oldPassword: [{ required: true, trigger: 'blur', message: '请输入旧密码' }],
        inPassword: [{ required: true, trigger: 'blur', message: '密码长度在6-16位', validator: validatePassword }],
        secondPassword: [{ required: true, trigger: 'blur', message: '密码长度在6-16位', validator: validatePassword }]
      },
      sexOptions: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
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

      // 图片默认提交地址，未使用。
      action: '',
      // 上传文件列表
      fileList: [],
      // 是否禁用上传
      uploadDisabled: false,
      // 图片弹窗
      dialogImageUrl: '',
      dialogVisible: false,
      newImgArray: [],
      // 单页隐藏
      singlePage: '',
      Query: {
        userId: undefined,
        pageNum: 1,
        pageSize: 8
      },
      showList: {
      },
      myPostList: {
        current: '',
        pageSize: '',
        pages: '',
        postList: [],
        total: '0'
      },
      myCollectList: {
        current: '',
        pageSize: '',
        pages: '',
        postList: [],
        total: '0'
      },
      myGoodsList: {
        current: '',
        pageSize: '',
        pages: '',
        goodsList: [],
        total: '0'
      },
      myOrderList: {
        current: '',
        pageSize: '',
        pages: '',
        orderList: [],
        total: '0'
      },
      mySalesOrderList: {
        current: '',
        pageSize: '',
        pages: '',
        orderList: [],
        total: '0'
      },
      myCommentList: {
        current: '',
        pageSize: '',
        pages: '',
        comments: [],
        total: '0'
      },
      myWallList: {
        current: '',
        pageSize: '',
        pages: '',
        walls: [],
        total: '0'
      },
      mySalesOrdersRefreshKey: 0
    }
  },
  watch: {
    'this.$store.state.user.jwt': {
      handler (newVal) {
        this.myHeader.Authorization = newVal
      }
    },
    currentMenu: {
      handler (newVal, oldVal) {
        // if (newVal === 'myPost') {
        //   this.showList = this.myPostList
        // }
        this.Query.pageNum = 1
        switch (newVal) {
          case 'myPost':
            this.getMyPostList()
            break
          case 'myComment':
            this.getMyCommentList()
            // console.log('我是', this.showList)
            break
          case 'myCollect':
            this.getMyCollectList()
            break
          case 'myWall':
            this.getMyWallList()
            break
          case 'myGoods':
            this.getMyGoodsList()
            break
          case 'myOrder':
            this.getMyOrderList()
            break
          case 'mySalesOrders':
            this.mySalesOrdersRefreshKey++
            // this.$router.push('/stucompla/myCenter/mySalesOrders')
            // this.getMySalesOrders()
            // this.showList = this.mySalesOrderList
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
      // console.log(this.basicInfo.userId)
      if (this.basicInfo.userId !== undefined) {
        await this.getMyPostList()
        await this.getMyCommentList()
        await this.getMyCollectList()
        await this.getMyWallList()
        await this.getMyGoodsList()
        await this.getMyOrderList()
        // this.getMySalesOrders()
      }
    },
    // 获取账户信息
    getAccountInfo () {
      return new Promise(resolve => {
        this.basicInfo = {}
        this.$http.get('/user/info').then(res => {
          if (res.data.code !== 200) {
            this.$message.error('获取账户信息失败')
          } else {
            console.log(res.data.data)
            this.$store.dispatch('user/setAvatar', res.data.data.avatar)
            this.$store.dispatch('user/setUserId', res.data.data.userId)
            this.basicInfo = res.data.data
            this.newImgArray = []
            if (this.basicInfo.avatar != null && this.basicInfo.avatar.length > 0) {
              var imgUrl = 'http://localhost:8086/image/' + this.basicInfo.avatar
              this.fileList.push({ url: imgUrl })
              this.newImgArray.push(this.basicInfo.avatar)
            }
          }
          resolve()
        })
      })
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        if (this.$store.state.user.jwt) {
          resolve()
        } else {
          this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: !this.isLogin })
          reject(new Error('未登录'))
        }
      })
    },
    handleSuccess (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
      if (response.code === 200) {
        for (var j = 0; j < response.data.length; j++) {
          this.newImgArray.push(response.data[j].replace('http://localhost:8086/image/', ''))
        }
        console.log(this.newImgArray)
      } else {
        alert(response.msg)
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      var idValue = ''
      var url = ''
      if (file.response !== undefined) {
        url = file.response.data[0].replace('http://localhost:8086/image/', '')
      } else {
        url = file.url.replace('http://localhost:8086/image/', '')
      }
      const paths = url.split('_')
      idValue = paths[1].split('.')[0] // 取id 1495352086701932544
      this.$http.delete('/image/' + idValue).then(res => {
        if (res.data.code !== 200) {

        } else {
          console.log(res.data.data)
        }
      })
      const urlIndex = this.newImgArray.indexOf(url)
      this.newImgArray.splice(urlIndex, 1)
      console.log(this.newImgArray)
    },
    handleExceed (files, fileList) {
      this.$message.error('请先移除之前的头像')
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
          this.showList = this.myPostList
        }
      })
    },
    // 获取我的评论列表
    async getMyCommentList () {
      await this.$http.get('/comment/myList/' + this.Query.pageNum + '/' + this.Query.pageSize).then(res => {
        // console.log(res.data)
        if (res.data.code !== 200) {
          this.myCommentList = undefined
        } else {
          this.myCommentList = res.data.data
          this.showList = this.myCommentList
          console.log('我是myCommentList')
          console.log(this.myCommentList)
        }
      })
    },
    // 获取我的收藏列表
    async getMyCollectList () {
      this.Query.userId = this.basicInfo.userId
      await this.$http.get('/collect/list', {
        params: this.Query
      }).then(res => {
        if (res.data.code !== 200) {
          this.myCollectList = undefined
        } else {
          console.log(res.data.data)
          this.myCollectList = res.data.data
          this.showList = this.myCollectList
        }
      })
    },
    // 获取我的表白墙列表
    async getMyWallList () {
      await this.$http.get('/wall/myWallList', {
        params: this.Query
      }).then(res => {
        if (res.data.code !== 200) {
          this.myWallList = undefined
        } else {
          console.log(res.data.data)
          this.myWallList = res.data.data
          this.myWallList.walls.forEach(function (item) {
            if (item.wallImages != null && item.wallImages.length > 0) {
              item.wallImages = item.wallImages.split(',')
            }
          })
          this.showList = this.myWallList
        }
      })
    },

    // 获取我的二手列表
    async getMyGoodsList () {
      this.Query.userId = this.basicInfo.userId
      await this.$http.get('/goods/getList', {
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
          this.showList = this.myGoodsList
        }
      })
    },
    // 获取我的订单列表
    async getMyOrderList () {
      await this.$http.get('/market-order/myOrder', {
        params: this.Query
      }).then(res => {
        if (res.data.code !== 200) {
          this.myOrderList = undefined
        } else {
          console.log(res.data.data)
          this.myOrderList = res.data.data
          this.myOrderList.orderList.forEach(function (item) {
            item.goodsImages = item.goodsImages.split(',')
          })
          this.showList = this.myOrderList
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
    // deleteOrder (orderId, index) {
    //   this.$http.delete('/market-order/' + orderId).then(res => {
    //     if (res.data.code !== 200) {
    //       this.$message.error(res.data.msg)
    //     } else {
    //       this.$message.success(res.data.data)
    //       // 删除成功 从列表中移除
    //       this.myOrderList.orderList.splice(index, 1)
    //     }
    //   })
    // },
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
    handleReceipt (orderId, index) {
      this.$http.post('/market-order/receipt/' + orderId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getMyOrderList()
        }
      })
      // console.log('这里写签收相关操作')
    },
    handleReturn (orderId, index) {
      this.$http.post('/market-order/applyReturn/' + orderId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getMyOrderList()
        }
      })
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
        return '退货中'
      } else if (status === 5) {
        return '已退货'
      }
    },
    // 帖子列表页码切换
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      switch (this.currentMenu) {
        case 'myPost':
          this.getMyPostList()
          break
        case 'myComment':
          this.getMyCommentList()
          break
        case 'myCollect':
          this.getMyCollectList()
          break
        case 'myWall':
          this.getMyWallList()
          break
        case 'myGoods':
          this.getMyGoodsList()
          break
        case 'myOrder':
          this.getMyOrderList()
          break
        // case 'mySalesOrders':
        //   this.getMySalesOrders()
        //   break
      }
    },
    deleteGoods (goodsId) {
      // console.log('1111111111111111')
      this.$http.delete('/goods/' + goodsId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getMyGoodsList()
        }
      })
    },
    upGoods (goodsId) {
      this.$http.post('/goods/putMyGoods/' + goodsId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getMyGoodsList()
        }
      })
    },
    unShelve (goodsId) {
      this.$http.post('/goods/unShelveMyGoods/' + goodsId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getMyGoodsList()
        }
      })
    },

    async editAccount () {
      const updateData = {
        userId: this.basicInfo.userId,
        username: this.basicInfo.username,
        sex: this.basicInfo.sex,
        signature: this.basicInfo.signature,
        avatar: this.newImgArray.toString()
      }
      await this.$refs.basicInfo.validate(valid => {
        if (valid) {
          this.$http.post('/user/editUserInfo', updateData).then(res => {
            if (res.data.code !== 200) {
              this.$message.error(res.data.msg)
            } else {
              this.$message.success(res.data.data)
              this.$router.go(0)
            }
          })
        } else {
          return false
        }
      })
    },
    async changePwd () {
      await this.$refs.changePwdForm.validate(valid => {
        if (valid) {
          this.$http.post('/user/changePassword', null, {
            params: {
              oldPassword: this.changePwdForm.oldPassword,
              inPassword: this.changePwdForm.inPassword,
              secondPassword: this.changePwdForm.secondPassword
            }
          }).then(res => {
            if (res.data.code !== 200) {
              this.$message.error(res.data.msg)
            } else {
              this.$http.delete('/user/logout').then(res => {
                if (res.data.code !== 200) {

                } else {
                  removeToken() // 必须先删除token
                  // resetRouter()
                  this.$store.dispatch('user/resetState')
                  this.$message.success('修改成功，请重新登录')

                  this.$router.push('/')
                }
              })
            }
          })
        } else {
          return false
        }
      })
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
  /*固定图片显示*/
  width: 240px;
  height: 168px;
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

.main-card {
  width: 100%;
  margin-bottom: 10px;
}
</style>
