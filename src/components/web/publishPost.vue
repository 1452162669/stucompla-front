<template>
  <div style="padding-top: 80px;padding-left: 120px;padding-right: 160px;">
    <h3 v-if="!isEdit" align="center">发布新帖</h3>
    <h3 v-if="isEdit"  align="center">编辑帖子</h3>
    <el-form ref="form" :model="form" label-width="80px">

      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <el-select v-model="form.categoryId" placeholder="请选择类型">
          <el-option v-for="category in categories" :key="category.categoryId" :label="category.categoryName"
                     :value="category.categoryId">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="内容">
        <MyEditor ref="MyEditor" v-model="form.detail" @change="change"></MyEditor>
      </el-form-item>

      <el-form-item>
        <el-button v-if="!isEdit" type="primary" @click="onSubmit">立即发布</el-button>
        <el-button v-if="isEdit" type="primary" @click="updatePost">确认修改</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import MyEditor from './MyEditor'
import axios from 'axios'

export default {
  name: 'PublishPost',
  components: {
    MyEditor: MyEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    postId: Number
  },
  data () {
    return {
      form: {
        postId: undefined,
        title: '',
        categoryId: '',
        detail: '',
        images: ''
      },
      categories: []
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    updatePost () {
      console.log('图片：' + this.$refs.MyEditor.getImgFromHtml(this.$refs.MyEditor.editorData))
      this.form.images = this.$refs.MyEditor.getImgFromHtml(this.$refs.MyEditor.editorData).toString()
      this.form.detail = this.$refs.MyEditor.getEditorData()
      console.log(this.form)
      console.log(this.form.images)
      this.form.postId = this.postId
      this.$http.post('/post/edit', this.form).then(res => {
        if (res.data.code !== 200) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        } else {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
    },
    change (val) {
      this.form.detail = val
    },
    onSubmit () {
      console.log('图片：' + this.$refs.MyEditor.getImgFromHtml(this.$refs.MyEditor.editorData))
      this.form.images = this.$refs.MyEditor.getImgFromHtml(this.$refs.MyEditor.editorData).toString()
      this.form.detail = this.$refs.MyEditor.getEditorData()
      axios.post('http://localhost:8086/post/publish', this.form, {
        headers: {
          Authorization: this.$store.state.user.jwt
        }
      }).then(res => {
        if (res.data.code === 200) {
          console.log(res.data.data)
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '发布失败',
            type: 'error'
          })
        }
      })
    },
    getCategories () {
      axios.get('http://localhost:8086/category/list').then(res => {
        if (res.data.code === 200) {
          res.data.data.forEach(item => {
            const arr = {
              categoryId: item.categoryId,
              categoryName: item.categoryName
            }
            this.categories.push(arr)
          })
        }
        console.log(res.data)
      })
    }
  },
  created () {
    this.getCategories()
    if (this.isEdit) {
      this.$http.get('/post/' + this.postId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
          this.$router.push('/stucompla/forum')
          // 应该跳转一个提示不存在的页面
        } else {
          // console.log(res.data.data)
          var postVo = res.data.data
          this.form.categoryId = postVo.category.categoryId
          this.form.detail = postVo.detail
          this.form.title = postVo.title
        }
      })
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
  }
}
</script>
