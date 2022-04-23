<template>
  <add-goods :is-edit="true" :goodsId=goods_path></add-goods>
</template>

<script>
import AddGoods from '../../components/web/addGoods'
export default {
  name: 'editGoods',
  components: { AddGoods },

  computed: {
    goods_path () {
      return parseInt(this.$route.params.id)
    }
  }
}
</script>

<style scoped>

</style>
