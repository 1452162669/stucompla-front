<template>
  <div style="padding-top: 90px;padding-bottom: 20px">
    <el-row>
      <el-col :span="14" :offset="5">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <el-form
              label-position="right"
              label-width="80px"
              :model="newGoods"
            >

              <el-form-item
                label="商品名"
              >
                <el-input
                  v-model="newGoods.goodsName"
                  placeholder="品类/品牌/型号，都是大家喜欢搜索的"
                />
              </el-form-item>
              <el-form-item
                label="详情介绍"
              >
                <el-input
                  v-model="newGoods.goodsDetail"
                  placeholder="描述商品的具体信息、入手渠道、转手原因"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 8}"
                />
              </el-form-item>
              <el-form-item label="相关图片">
                <el-upload
                  action="http://localhost:8086/image/upload"
                  :headers="myHeader"
                  name="files"
                  :before-upload="beforeUpload"
                  list-type="picture-card"
                  :on-success="handleSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item label="商品定价">
                <el-input-number size="medium" v-model="newGoods.goodsPrice" :precision="2" :step="0.5"
                                 :min="0" :max="9999" style="width: 150px"></el-input-number>
              </el-form-item>
              <el-form-item label="商品分类">
                <div class="block">
                  <el-cascader
                    v-model="newGoods.goodsCategoryId"
                    :options="options"
                    :props="{ expandTrigger: 'hover' ,emitPath:false}"
                    :show-all-levels="false"
                    placeholder="必填，请选择商品分类"
                    @click="handleChange"
                  ></el-cascader>
                </div>
              </el-form-item>
              <el-form-item label="商品数量">
                <el-input-number size="medium" style="width: 150px" v-model="newGoods.goodsCount"
                                 :min="1" :max="999"
                                 label="描述文字"></el-input-number>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addGoods">一键上架</el-button>
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
  name: 'addGoods',
  data () {
    return {
      isLogin: false,
      myHeader: {
        Authorization: getToken()
      },
      newimgArray: [],
      newGoods: {
        goodsName: '',
        goodsDetail: '',
        goodsImages: '',
        goodsPrice: 0.00,
        goodsCategoryId: '',
        goodsCount: 1
      },
      dialogImageUrl: '',
      dialogVisible: false,
      goodsCategoryList: [],
      options: []

    }
  },
  created () {
    this.getLoginState()
    this.getGoodsCategoryList()
  },
  computed: {
    firstLevelFromGoodsCategoryList () {
      return this.goodsCategoryList.filter((item, index) => {
        return item.categoryLevel === 1
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
  },
  methods: {
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
    getLoginState () {
      this.isLogin = this.$store.state.user.jwt !== undefined
      this.$store.commit('setDialogLoginVisible', { dialogLoginVisible: !this.isLogin })
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
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    childLevelList (parentId) {
      return this.goodsCategoryList.filter((item, index) => {
        return item.parentId === parentId
      })
    },
    getGoodsCategoryList () {
      var _this = this
      this.$http.get('/goods-category/list').then(res => {
        if (res.data.code !== 200) {

        } else {
          console.log(res.data.data.goodsCategoryList)
          _this.goodsCategoryList = res.data.data.goodsCategoryList

          _this.firstLevelFromGoodsCategoryList.forEach(function (item1) {
            var children2 = []
            var childLevelList = _this.childLevelList(item1.categoryId)
            console.log(childLevelList)
            console.log(_this.childLevelList(item1.categoryId))
            _this.childLevelList(item1.categoryId).forEach(function (item2) {
              var children1 = []
              _this.childLevelList(item2.categoryId).forEach(function (item3) {
                children1.push({
                  value: item3.categoryId,
                  label: item3.categoryName
                })
              })
              children2.push({
                value: item2.categoryId,
                label: item2.categoryName,
                children: children1
              })
            })
            _this.options.push({
              value: item1.categoryId,
              label: item1.categoryName,
              children: children2
            })
          })
        }
      })
    },
    handleChange () {

    },
    addGoods () {
      this.newGoods.goodsImages = this.newimgArray.toString()
      console.log(this.newGoods)
      this.getLoginState()
      this.$http.post('/goods/add', this.newGoods).then(res => {
        if (res.data.code !== 200) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        } else {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.bg-purple {
  background: #d3dce6;
}

.grid-content {
  /*border-radius: 4px;*/
  min-height: 36px;
}
</style>
