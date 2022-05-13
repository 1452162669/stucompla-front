<template>
  <div style="padding-top: 90px">
    <el-row :gutter="20" style="margin: 0px">
<!--      <el-col :span="4" :offset="1">-->
<!--        <div class="grid-content bg-purple">-->
<!--          <el-card class="box-card">-->
<!--            <div v-for="o in 4" :key="o" class="text item">-->
<!--              {{ '列表内容 ' + o }}-->
<!--            </div>-->
<!--          </el-card>-->
<!--        </div>-->
<!--      </el-col>-->
      <el-col :span="12" :offset="5">
        <div class="grid-content bg-purple">
          <el-card class="main-card" v-for="(item,index) in wallList" :key="index" shadow="hover">
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

<!--            <span>评论：{{ item.commentNum }} 点赞：{{ item.likeNum }}<br>{{ item.auditTime }}</span>-->
            <span>{{ item.auditTime }}</span>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-form
              label-position="right"
              label-width="60px"
              :model="newWall"
            >

              <el-form-item label="内容:" >
                <el-input
                  v-model="newWall.wallContent"
                  type="textarea"
                  placeholder="输入内容"
                  :autosize="{ minRows: 2, maxRows: 8}"
                />
              </el-form-item>
              <el-form-item label="图片:">
                <el-upload
                  action="http://localhost:8086/image/upload"
                  :headers="myHeader"
                  name="files"
                  :limit='3'
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
              <el-form-item>
                <el-button @click="applyWall">申请上墙</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getToken } from '../../utils/auth'

export default {
  name: 'wall',
  components: {
    // HotNews,
    // NewsList
    // AwFooter,
    // AwHeader
  },
  data () {
    return {
      isLogin: false,
      myHeader: {
        Authorization: getToken() // 这里应该监控jwt的变化，不然只获取到第一次，后面不会变（可以用计算属性)
      },
      newimgArray: [],
      dialogImageUrl: '',
      dialogVisible: false,
      wallList: {},
      newWall: {
        wallContent: undefined,
        wallImages: undefined
      }
    }
  },
  methods: {
    getLoginState () {
      this.isLogin = this.$store.state.user.jwt !== undefined
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
      this.dialogVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.error('最多只能上传三张图片')
    },
    getWallList () {
      this.$http.get('/wall/wallList').then(res => {
        if (res.data.code !== 200) {

        } else {
          this.wallList = res.data.data.walls
          this.wallList.forEach(function (item) {
            if (item.wallImages != null && item.wallImages.length > 0) {
              item.wallImages = item.wallImages.split(',')
            }
          })
          // console.log(this.wallList.wallImages)
          // if (this.wallList.wallImages != null && this.wallList.wallImages.length > 0) {
          //   this.wallList.wallImages = this.wallList.wallImages.split(',')
          // }
          // console.log(this.wallList.wallImages)
        }
      })
    },
    applyWall () {
      this.newWall.wallImages = this.newimgArray.toString()
      console.log(this.newWall)
      this.$http.post('/wall/apply', this.newWall).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.msg)
        }
      })
    },

    // 解决 clearable 搜索框后再次输入不显示下拉
    searchHandle () {
      if (this.autocompleteFlag) this.$refs.autocomplete.activated = true
    },
    // 新闻列表选项卡切换
    handleClick (tab, event) {
      this.getNewsItems()
    },
    // handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
    // },
    // 新闻列表页码切换
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.getNewsItems()
    },
    // 根据新闻 类型、日期 查询新闻，并按日期排序
    async getNewsItems () {
      // const { data: res } = await this.$http.get('/web/newslist', { params: this.pageInfo })
      // if (res.status !== 200) {
      //   this.newsItems = {}
      // } else {
      //   // this.$message.success('获取成功')
      //   this.newsItems = res.data
      //   if (this.newsItems.total <= this.newsItems.limit) {
      //     this.singlePage = true
      //   }
      // }
    },
    searchByDate (data) {
      // console.log(data)
      this.getNewsItems()
    },

    async getRecomNews () {
      // const { data: res } = await this.$http.get('/web/recomNews')
      // if (res.status !== 200) {
      //   this.hotNews = []
      // } else {
      //   // this.$message.success('获取成功')
      //   this.recomNews = res.data.list
      // }
    }
  },
  created () {
    this.getLoginState()
    this.getWallList()
    this.getNewsItems()
    this.getRecomNews()
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
    if (from.name === 'wall') {
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

<style>

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  /*background: #d3dce6;*/
}

.bg-purple-light {
  /*background: #e5e9f2;*/
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

/*卡片样式*/

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  border-radius: 5px;
}

.main-card {
  width: 100%;
  margin-bottom: 10px;
}
</style>
