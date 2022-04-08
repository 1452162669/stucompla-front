<template>
  <div></div>
</template>
<script>
export default {
  name: 'admin',
  mounted () {
    // 后台管理系统登录路径
    const devUrl = 'http://localhost:9528/login'
    window.open(devUrl, '_blank')
    // _blank - URL加载到一个新的窗口。这是默认值
    this.$router.push('/index')
  }
}
</script>
