<template>
  <div>
    <ul style="margin: 10px 0 0 0" v-if="items!==undefined">
      <li style="margin: 0px 0 5px 0;" v-for="(item,index) in items"
          :key="index">
        <el-card shadow="always" >
          <el-row>
            <el-col :span="2">
              <el-avatar
                :size="60"
                v-if="item.user.avatar===null||item.user.avatar.length===0"
                :src="require('../../assets/img/defaultAvatar.png')"
                fit="scale-down"
              />
              <el-avatar
                :size="60"
                v-else
                :src="`http://localhost:8086/image/${item.user.avatar}`"
                fit="scale-down"
              ></el-avatar>
<!--              <el-avatar :style="`background:${getColorByName('item.user.username')}`"> {{ item.user.username }} </el-avatar>-->

            </el-col>
            <el-col :span="17">
              <h3 style="margin: 10px 0 5px 0">{{ item.user.username }}  </h3>
              <p style="margin: 0 0 0px 0;font-size: 15px"><i class="el-icon-s-promotion"></i>{{ item.createTime }}</p>
            </el-col>
            <el-col :span="2" align="right" v-if="!isMyCenter">
              <span style="padding-right: 0px;color: #c59d85">{{items.length-index}}楼</span>
            </el-col>
            <el-col :span="2" align="right" v-if="!isMyCenter">
              <el-popover
                placement="right"
                :title="`回复 ${item.user.username}`"
                width="200"
                trigger="click"
              >
                <el-form
                  label-position="right"
                  label-width="45px"
                  :model="replyForm"
                >
                  <el-input
                    v-model="replyForm.text"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 8}"
                    placeholder="回复"
                  />
                  <el-upload
                    action="http://localhost:8086/image/upload"
                    :headers="myHeader"
                    name="files"
                    :limit='1'
                    :before-upload="beforeUpload"
                    list-type="picture-card"
                    :on-success="handleSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-exceed="handleExceed">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogImageVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                  <el-button type="primary" plain @click="reply(item.postId,item.commentId)">回复</el-button>
                </el-form>
                <el-link type="primary" slot="reference">
                  回复
                </el-link>
<!--                <el-button  type="text" plain  style="margin: 10px 0 5px 0"-->
<!--                            slot="reference">回复</el-button>-->
              </el-popover>
            </el-col>
            <el-col :span="1" align="right" v-if="(postInfo!=undefined&&postInfo.userId==userId)||item.user.userId==userId">
              <el-popconfirm
                icon="el-icon-info"
                icon-color="red"
                title="确定删除该评论？"
                style="padding-left: 10px"
                @confirm="deleteComment(item.commentId)"
              >
                <el-link type="primary" slot="reference">
                  删除
                </el-link>
              </el-popconfirm>
            </el-col>

          </el-row>
          <div class="item-content" >
            <div style="background-color: #f1f0f0;border-radius: 5px;padding: 5px 10px 5px 10px"
                 v-if="item.parentCommentVo!==null" >
              <p style="margin: 5px 0 5px 0">回复 {{item.parentCommentVo.user.username}}</p>
              <p style="margin: 5px 0 5px 0">{{item.parentCommentVo.text}}</p>
            </div>
            <p>{{ item.text }}</p>
            <el-image
              style="width: 150px; height: 150px"
              v-if="item.images!==null"
              :src="`http://localhost:8086/image/${item.images}`"
              fit="fill"></el-image>
            <div style="background-color: #f1f0f0;border-radius: 5px;padding: 5px 10px 5px 10px"
                 v-if="isMyCenter" >
              <router-link :to="`/stucompla/post/${item.postId}`">
                <p style="margin: 5px 0 5px 0">原贴：{{item.postVo.title}}</p>
                <p style="margin: 5px 0 5px 0">分类：{{item.postVo.category.categoryName}}</p>
              </router-link>
            </div>
          </div>
        </el-card>
      </li>
    </ul>
    <span class="is-null" v-else>暂无数据</span>
  </div>
</template>

<script>

import { getToken, getUserId } from '../../utils/auth'

export default {
  name: 'commentList',
  props: {
    items: Array,
    postInfo: Object,
    isMyCenter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userId: getUserId(),
      currentPage: 1,
      replyForm: {
        postId: undefined,
        parentId: undefined,
        text: '',
        images: undefined
      },
      myHeader: {
        Authorization: getToken() // 这里应该监控jwt的变化，不然只获取到第一次，后面不会变（可以用计算属性)
      },
      newImgArray: [],
      dialogImageVisible: false,
      dialogImageUrl: ''
    }
  },
  watch: {
    '$store.state.user.jwt': {
      handler: function (newVal, oldVal) {
        this.myHeader.Authorization = newVal
      }
    },
    '$store.state.user.userId': {
      handler: function (newVal, oldVal) {
        this.userId = newVal
        // console.log(this.avatar)
      }
    }
  },
  created () {
  },
  methods: {
    getColorByName (userName) {
      var temp = []
      temp.push('#')
      for (let index = 0; index < userName.length; index++) {
        temp.push(parseInt(userName[index].charCodeAt(0), 10).toString(16))
      }
      return temp.slice(0, 5).join('').slice(0, 4)
    },
    reply (postId, commentId) {
      console.log(this.replyForm)
      if (this.$store.state.user.jwt) {
        this.replyForm.postId = postId
        this.replyForm.parentId = commentId
        if (this.newImgArray.length > 0) {
          this.replyForm.images = this.newImgArray.toString()
        }
        this.$http.post('/comment/create', this.replyForm).then(res => {
          if (res.data.code !== 200) {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.$router.replace({
              path: '/refresh',
              query: {
                t: Date.now()
              }
            })
          }
        })
      } else {
        this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: true })
      }
    },
    deleteComment (commentId) {
      this.$http.delete('/comment/' + commentId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          const _this = this
          this.items.forEach(function (item, index) {
            if (item.commentId === commentId) {
              _this.items.splice(index, 1)
            }
          })
        }
      })
    },
    setArticlePath (path) {
      console.log(path)
      this.$store.commit('SET_ARTICLE_PATH', {
        path: path
      })
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        if (this.$store.state.user.jwt) {
          resolve()
        } else {
          this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: true })
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
      const urlIndex = this.newImgArray.indexOf(url)
      this.newImgArray.splice(urlIndex, 1)
      console.log(this.newImgArray)
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
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.error('只能上传一张图片')
    }
  }
}
</script>

<style lang="less" scoped>
//.news-list-item {
//  padding: 0 15px 15px 0px;
//  position: relative;
//  border-radius: 8px;
//
//  img {
//    width: 198px;
//    height: 125px;
//    border-style: none;
//  }
//
//  a {
//    color: rgba(0, 0, 0, 1);
//    transition: color .3s;
//    overflow: hidden;
//    display: flex;
//    cursor: pointer;
//  }
//
//  a:hover {
//    color: var(--hover_color);
//  }
//}

.el-card {
  border: none;
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
  margin-left: 70px;
  //width: calc(100% - 238px);
//width: 600px;
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
