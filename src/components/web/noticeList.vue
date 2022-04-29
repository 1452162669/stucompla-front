<template>
  <div>
    <ul style="margin: 10px 0 0 0" v-if="noticeList!==undefined&&noticeList.length>0">
      <li style="margin: 0px 0 5px 0;" v-for="(item,index) in noticeList"
          :key="index">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="3">
              <i class="el-icon-chat-dot-round" style="font-size: 65px"></i>
            </el-col>
            <el-col :span="14">
              <h4 style="margin: 10px 0 5px 0" >
                系统通知
                <el-badge value="new" class="item" v-if="item.letterStatus==0">
                </el-badge>
              </h4>

              <p style="font-size: 15px;margin-top: 0px">{{ item.letterDetail }}</p>
            </el-col>
            <el-col :span="7" align="right">
              <span style="color: #c59d85;margin-top: 10px">{{ item.createTime }}</span>

            </el-col>
          </el-row>
        </el-card>
      </li>
    </ul>
    <span class="is-null" v-else>暂无通知</span>
  </div>
</template>

<script>
export default {
  name: 'noticeList',
  props: ['noticeList']
}
</script>

<style scoped>

</style>
