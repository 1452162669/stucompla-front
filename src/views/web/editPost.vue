<template>
  <publish-post :is-edit="true" :postId=post_path></publish-post>
</template>

<script>
import PublishPost from '../../components/web/publishPost'
export default {
  name: 'editPost',
  components: { PublishPost },
  computed: {
    post_path () {
      return parseInt(this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>
