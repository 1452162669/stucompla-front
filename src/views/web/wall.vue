<template>

  <el-row :gutter="20" style="margin: 0px">
    <el-col :span="4" :offset="1">
      <div class="grid-content bg-purple">
        <el-card class="box-card">
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple">
        <el-card class="main-card" v-for="item in wallList" :key="item" shadow="hover">
          {{ item.wallContent }}
          <br>
          <br>
          <span>评论：{{ item.commentNum }} 点赞：{{ item.likeNum }}<br>{{ item.auditTime }}</span>
        </el-card>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content bg-purple">
        <el-card class="box-card">
          <el-form
            label-position="right"
            label-width="45px"
            :model="newWall"
          >

            <el-form-item
              label="内容:"
            >
              <el-input
                v-model="newWall.wallContent"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
              />
            </el-form-item>
            <el-form-item label="图片:">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                  >
                  <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item>
              <el-button>申请上墙</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>

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
      wallList: {},
      newWall: {}
    }
  },
  methods: {

    getWallList () {
      this.$http.get('/wall/wallList').then(res => {
        if (res.data.code !== 200) {

        } else {
          this.wallList = res.data.data.walls
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
.el-row {
  padding-top: 90px;

}

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
