<template>
  <div>
    <MyHeader></MyHeader>
    <!-- 增加路由 -->
    <router-view></router-view>
    <MyFooter></MyFooter>
  </div>
</template>

<script>
import MyHeader from '../../components/web/public/Header'
import MyFooter from '../../components/web/public/Footer'

export default {
  name: 'Home',
  components: {
    MyFooter,
    MyHeader
  }
}
</script>

<style scoped>

</style>
