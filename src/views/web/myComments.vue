<template>
  <comment-list :items="myCommentList" :is-my-center=true></comment-list>
</template>

<script>
import CommentList from '../../components/web/commentList'
export default {
  name: 'myComments',
  components: { CommentList },
  data () {
    return {
      myCommentList: {}
    }
  },
  methods: {
    getMyCommentList () {
      this.$http.get('/comment/myList/1/10').then(res => {
        // console.log(res.data)
        if (res.data.code !== 200) {

        } else {
          this.myCommentList = res.data.data.comments
          console.log(this.myCommentList)
          // console.log('00000000')
          // console.log(this.post.commentList)
          // console.log(this.post.commentList !== undefined)
        }
        // console.log('2访问完成。赋值完成。')
      })
    }
  }
}
</script>

<style scoped>

</style>
