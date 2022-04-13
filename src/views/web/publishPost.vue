<template>
  <div style="padding-top: 80px;padding-left: 120px;padding-right: 160px;">
    <!--    <h3 style="margin: 30px 0 15px">发表新帖子</h3>-->
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
      <br/>
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      <br/>-->
      <!--      <br/>-->
      <el-form-item label="内容">
        <MyEditor ref="MyEditor"></MyEditor>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即发布</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import MyEditor from '../../components/web/MyEditor'
import axios from 'axios'

export default {
  name: 'PublishPost',
  components: {
    MyEditor: MyEditor
  },
  data () {
    return {
      form: {
        title: '',
        categoryId: '',
        detail: '',
        images: ''
      },
      categories: []
    }
  },
  methods: {
    onSubmit () {
      console.log('图片：' + this.$refs.MyEditor.getImgFromHtml(this.$refs.MyEditor.editorData))
      this.form.images = this.$refs.MyEditor.getImgFromHtml(this.$refs.MyEditor.editorData).toString()
      this.form.detail = this.$refs.MyEditor.getEditorData()
      console.log(this.form)
      console.log(this.form.images)
      // console.log(this.$store.state.token)
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
      console.log('submit!!!!!')
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
  mounted () {
    this.getCategories()
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
    if (to.name === 'index') {
      this.$store.commit('setHeaderLogo', {
        headerLogoShow: true
      })
      this.$store.commit('setShadowActive', {
        headerShadowActive: false
      })
      this.$store.commit('setNavDarkActive', {
        navDarkActive: false
      })
      this.$store.commit('setHeaderShow', {
        headerShow: false
      })
      next()
    } else {
      next()
    }
  }
}
</script>

<style>

/*.el-form {*/
/*  width: 100%;*/
/*}*/

/*::v-deep {*/

/*.el-form-item:nth-child(1) .el-form-item__content,*/
/*.el-form-item:nth-child(2) .el-form-item__content,*/
/*.el-form-item:nth-child(3) .el-form-item__content,*/
/*.el-form-item:nth-child(4) .el-form-item__content {*/
/*  margin-left: 28px;*/
/*}*/

/*.el-form-item:nth-child(5) .el-form-item__content {*/
/*  margin-left: 10px;*/
/*}*/

/*.el-form-item:nth-child(6) .el-form-item__content {*/
/*  margin-left: 77px;*/
/*}*/

/*.el-input__inner {*/
/*  width: 500px;*/
/*}*/

/*.el-textarea__inner {*/
/*  width: 500px;*/
/*}*/

/*.el-form-item:nth-child(4) .el-form-item__content {*/
/*  width: 100%;*/
/*}*/

/*}*/

/*.el-form-item:nth-child(4) .editor {*/
/*  !*max-width: 1100 px;*!*/
/*  z-index: 200;*/
/*}*/

/*.el-form-item:nth-child(5) span {*/
/*  line-height: 28px;*/
/*  margin-top: 120px;*/
/*}*/

/*.el-form-item:nth-child(5) .warning {*/
/*  color: #ff461f*/
/*}*/

</style>
