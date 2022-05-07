<template>
  <div class="home">
    <div id="demo1" style="padding-right: 120px "></div>
    <!-- <button type="button" class="btn" @click="getEditorData">获取当前内容</button>
    <h3>内容预览</h3>
    <textarea name="" id="" cols="170" rows="20" readonly v-model="editorData"></textarea>
 -->
  </div>
</template>

<script>
import axios from 'axios'
// 引入 wangEditor
import WangEditor from 'wangeditor'
import { getToken } from '../../utils/auth'

var newimgArray = [] // 所有上传的图片
export default {
  name: 'MyEditor',
  data () {
    return {
      editor: null,
      editorData: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value: function (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    }
    // value为编辑框输入的内容，这里监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted () {
    const editor = new WangEditor('#demo1')

    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml
      this.$emit('change', this.editorData) // 将内容同步到父组件中
      // console.log(editor.$textElem.elems[0])
    }
    // 配置限制类型
    editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif']
    // 2M 限制图片大小
    editor.config.uploadImgMaxSize = 2 * 1024 * 1024
    // 一次最多上传 5 个图片
    editor.config.uploadImgMaxLength = 5
    editor.config.pasteIgnoreImg = false
    // 自定义上传图片
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      var formData = new FormData()
      for (var i = 0; i < resultFiles.length; i++) {
        formData.append('files', resultFiles[i])
        //  多张图片文件都放进一个form-data
      }
      axios.post('http://localhost:8086/image/upload', formData, { // 上传图片接口
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: getToken()
        }
      }).then(da => {
        // console.log(da)
        // console.log(da.data.data)
        // console.log(da.data.data[0])
        if (da.data.code === 200) {
          for (var j = 0; j < da.data.data.length; j++) {
            insertImgFn(da.data.data[j])
            newimgArray.push(da.data.data[j].replace('http://localhost:8086/image/', ''))
          }
          console.log(newimgArray)
        } else {
          alert(da.data.msg)
        }
      })
    }

    // 创建编辑器
    editor.create()
    this.editor = editor
  },
  methods: {
    getEditorData () { // 获取html（删除多余图片）
      const htmlData = this.editor.txt.html()
      // 删除上传后被删除的图片
      this.deleteExtraImg(newimgArray, this.getImgFromHtml(htmlData))
      return htmlData
    },
    getImgFromHtml (html) {
      // 获取完整提交内容中的图片 用于和上传的所有图片对比找出需要删除的图片
      var content = html
      const imgReg = /<img.*?(?:>|\/>)/gi // 匹配图片中的img标签
      const urlReg = /(http:\/\/localhost:8086\/image\/)(\S*)/ // 匹配图片接口
      const srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
      const srcArr = []
      const urlArr = []
      const arr = content.match(imgReg) // 筛选出所有的img
      if (arr != null) {
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          const src = arr[i].match(srcReg)
          // 获取图片地址
          srcArr.push(src[1])
          if (urlReg.test(src[1])) {
            urlArr.push(src[1].replace('http://localhost:8086/image/', ''))
          }
        }
        console.log(srcArr)
        console.log(urlArr)
      }
      return urlArr
    },
    deleteExtraImg (allImg, htmlImg) {
      const differentArr = allImg.filter(item => htmlImg.indexOf(item) === -1)
      console.log(differentArr) // 打印出allImg中不包含htmlImg中的图片  需要后续删除
      differentArr.forEach(function (item) { // 例子 1645354694425_1495352086701932544.png
        const paths = item.split('_')
        const idValue = paths[1].split('.')[0] // 取id 1495352086701932544
        console.log(idValue)
        axios.delete('http://localhost:8086/image/' + idValue).then(re => {
          // state：1 --> 0
          console.log(re.data)
        })
      })
    }
  },
  beforeDestroy () {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style lang="less" >
.w-e-toolbar {
  z-index: 2!important;
}
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
.home {
  width: 1200px;
  margin: auto;
  position: relative;

.btn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 5px 10px;
  cursor: pointer;
}

h3 {
  margin: 30px 0 15px;
}

}
</style>
