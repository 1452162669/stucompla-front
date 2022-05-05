<template>
  <div>
    <ul class="news-list-items" v-if="items!==undefined&&items.length>0">
      <li class="news-list-item" v-for="(item,index) in items"
          :key="index">
        <el-card shadow="hover">
          <router-link :to="`/stucompla/post/${item.postId}`">
<!--          <router-link :to="{name:'postDetail',params:{id: item.postId}}">-->
            <!--<div class = "item-mask"></div>-->
            <img :src="item.images[0]" alt="" v-if="item.images!=null&&item.images.length>0">
            <div class="item-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.news_desc }}</p>
              <span style="padding-right: 10px" v-if="!isMyCenter">{{ item.user.username }}</span>
              <span>{{ item.createTime }}</span>
              <span title="热度" style="margin-left:19px;font-weight:400"><i
                class="el-icon-view"></i> {{ item.viewNum }}</span>
              <span title="评论" style="margin-left:19px"><i class="el-icon-chat-line-round"></i> {{
                  item.commentNum
                }}</span>
              <span title="收藏" style="margin-left:19px"><i class="el-icon-star-off" ></i> {{ item.collectNum }}</span>
              <el-alert
                v-if="isMyCenter&&item.postStatus==1"
                title="已被管理员锁定"
                type="error"
                style="width: 140px"
                :closable="false">
              </el-alert>
            </div>
          </router-link>
          <p align="right" v-if="isMyCenter">
            <el-button type="primary" size="small" @click="$router.push('/stucompla/editPost/'+item.postId)">修改</el-button>
            <el-popconfirm
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该帖吗？删除后所有相关信息将丢失，此操作不可恢复！"
              style="padding-left: 10px"
              @confirm="deletePost(item.postId)"
            >
              <el-button  slot="reference" type="danger" size="small">删除</el-button>
            </el-popconfirm>

          </p>
        </el-card>
      </li>
    </ul>
    <span class="is-null" v-else>暂无数据</span>
  </div>
</template>

<script>
export default {
  name: 'postList',
  props: {
    items: Array,
    isMyCenter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  watch: {
    items: {
      handler (newVal, oldVal) {
        this.handleImg()
      }
    }
  },
  // async created () {
  //   await this.handleImg()
  // },
  methods: {
    async handleImg () {
      await this.items.forEach(function (item) {
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
            console.log(srcArr)
            item.images = srcArr
          }
        }
      })
    },
    deletePost (postId) {
      this.$http.delete('/post/' + postId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功')
          this.$router.go(0)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.news-list-item {
  padding: 0 15px 15px 8px;
  position: relative;
  border-radius: 8px;

  img {
    width: 198px;
    height: 125px;
    border-style: none;
  }

  a {
    color: rgba(0, 0, 0, 1);
    transition: color .3s;
    overflow: hidden;
    display: flex;
    cursor: pointer;
  }

  a:hover {
    color: var(--hover_color);
  }
}

.el-card {
  //border: none;
  transition: .5s;
  ///deep/.el-card__body{
  //  padding: 20px 20px 20px 0;
  //}
}

.is-null {
  display: flex;
  justify-content: center;
  margin-top: 45px;
  color: #777
}

//.news-list-item:after {
//  content: "";
//  display: block;
//  width: 100%;
//  position: absolute;
//  bottom: 0;
//  left: 0;
//  border-bottom: 1px dashed #cfcfcf;
//}
//
//.news-list-item:last-of-type:after {
//  content: none
//}

.item-mask {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  transition: all .3s;
  border-radius: 8px;
}

//.news-list-item:hover .item-mask {
//  background-color: rgba(0, 0, 0, .03);
//}

.item-content {
  margin-left: 40px;
  width: calc(100% - 238px);

  h2 {
    font-size: 20px;
    font-weight: 500;
    overflow: hidden;
    //white-space: nowrap;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  p {
    margin: 10px 0;
    font-size: 15px;
    color: #777;
    letter-spacing: 0;
    line-height: 22px;
    overflow: hidden;
    //white-space: nowrap;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  span {
    color: #b8b8b8;
    line-height: 14px;
  }
}
</style>
