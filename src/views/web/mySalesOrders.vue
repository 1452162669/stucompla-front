<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.orderId" placeholder="订单ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.buyerId" placeholder="买家ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.goodsId" placeholder="商品ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.orderStatus" placeholder="订单状态" clearable style="width: 150px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="订单ID" prop="orderId" sortable="custom" align="center" width="90" :class-name="getSortClass('order_id')">
        <template slot-scope="{row}">
          <span>{{ row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家ID" align="left" width="70">
        <template slot-scope="{row}">
          <span>{{ row.buyer.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品ID" align="left" width="70">
        <template slot-scope="{row}">
          <span>{{ row.goodsId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名" align="left" >
        <template slot-scope="{row}">
          <span>{{ row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" align="left" width="60">
        <template slot-scope="{row}">
          <span>{{ row.goodsPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买数量" align="left">
        <template slot-scope="{row}">
          <span>{{ row.buyCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单总价" align="left" >
        <template slot-scope="{row}">
          <span>{{ row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" class-name="status-col" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ getOrderStatus(row.orderStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleSend(row.orderId)" v-if="row.orderStatus===1">
            发货
          </el-button>
          <el-popover
            placement="left"
            title="审核"
            width="240"
            trigger="click"
            v-if="row.orderStatus===4"
          >
            <div style="text-align: center">
              <p>
                <el-radio v-model="auditRadio" :label=1 :value=1>审核通过</el-radio>
                <el-radio v-model="auditRadio" :label=0 :value=0>审核不通过</el-radio>
              </p>
              <p v-if="auditRadio==0">
                <el-input v-model="auditCause" type="textarea" :maxlength="30" placeholder="请填写退货审核不通过的原因（必填）" />
              </p>
              <p style="">
                <el-button size="mini" type="primary" @click="handleAudit(row)">
                  确定
                </el-button>
              </p>
            </div>
            <el-button slot="reference" size="mini" type="primary">
              审核
            </el-button>
            <!--            <el-button slot="reference">click 激活</el-button>-->
          </el-popover>
<!--          <el-button size="mini" type="primary" @click="handleAudit(row.orderId)" v-if="row.orderStatus===4">-->
<!--            审核-->
<!--          </el-button>-->

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      @current-change="handleCurrentChange"
      :current-page.sync="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="singlePage"
      v-scroll-to="{ element: '.menu',duration: 300, easing: 'ease',offset: -90  }"

      align="center">
    </el-pagination>
<!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />-->

  </div>
</template>

<script>
// import { fetchPv, createArticle, updateArticle } from '@/api/admin'
// import { auditWall, fetchWallList } from '@/api/wall'
// import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MySalesOrders',
  // components: { Pagination },
  // directives: { waves },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      auditRadio: 1,
      auditCause: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      singlePage: '',
      listQuery: {
        pageNum: 1,
        pageSize: 7,
        orderId: undefined,
        buyerId: undefined,
        goodsId: undefined,
        sort: '-order_id',
        orderStatus: undefined
      },
      // 0-未付 1-已付 2-已发货 3-已签收 4-退货中 5-已退货
      statusOptions: [
        { label: '待支付', key: '0' }, { label: '待发货', key: '1' },
        { label: '待签收', key: '2' }, { label: '已签收', key: '3' },
        { label: '退货中', key: '4' }, { label: '已退货', key: '5' }],
      sortOptions: [
        { label: 'ID升序', key: '+order_id' },
        { label: 'ID降序', key: '-order_id' },
        { label: '更新时间升序', key: '+update_time' },
        { label: '更新时间降序', key: '-update_time' },
        { label: '总价升序', key: '+total_price' },
        { label: '总价降序', key: '-total_price' }
      ],

      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getOrderStatus (status) {
      console.log(status)
      if (status === 0) {
        return '待支付'
      } else if (status === 1) {
        return '待发货'
      } else if (status === 2) {
        return '待签收'
      } else if (status === 3) {
        return '已签收'
      } else if (status === 4) {
        return '退货中'
      } else if (status === 5) {
        return '已退货'
      }
    },
    // 帖子列表页码切换
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.getList()
    },
    getList () {
      this.$http.get('/market-order/mySalesOrders', {
        params: this.listQuery
      }).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.list = res.data.data.orderList
          this.list.forEach(function (item) {
            if (item.goodsImages !== null) {
              item.goodsImages = item.goodsImages.split(',')
            }
          })
          // console.log(this.list)
          // this.list.forEach(function (item) {
          //   console.log(item)
          //   if (item.wallImages !== null) {
          //     const srcArr = item.wallImages.split(',')
          //     const srcList = []
          //     srcArr.forEach(function (item1) {
          //       srcList.push('http://localhost:8086/image/' + item1)
          //     })
          //     item.wallImages = srcList
          //   }
          //   console.log(item.wallImages)
          // })
          this.total = res.data.data.total
          console.log(this.list)
          this.listLoading = false
        }
      })
      // fetchWallList(this.listQuery).then(response => {
      //   this.list = response.data.walls
      //   console.log(this.list)
      //   this.list.forEach(function (item) {
      //     console.log(item)
      //     if (item.wallImages !== null) {
      //       const srcArr = item.wallImages.split(',')
      //       const srcList = []
      //       srcArr.forEach(function (item1) {
      //         srcList.push('http://localhost:8086/image/' + item1)
      //       })
      //       item.wallImages = srcList
      //     }
      //     console.log(item.wallImages)
      //   })
      //   this.total = response.data.total
      //   console.log(this.list)
      //   this.listLoading = false
      //   // Just to simulate the time of the request
      //   // setTimeout(() => {
      //   //   this.listLoading = false
      //   // }, 1.5 * 1000)
      // })
    },
    handleFilter () {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSend (orderId) {
      this.$http.get('/market-order/sendGoods/' + orderId).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getList()
        }
      })
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'orderId') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+order_id'
      } else {
        this.listQuery.sort = '-order_id'
      }
      this.handleFilter()
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    createData () {
      // this.$refs.dataForm.validate((valid) => {
      //   if (valid) {
      //     this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //     this.temp.author = 'vue-element-admin'
      //     createArticle(this.temp).then(() => {
      //       this.list.unshift(this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: 'Success',
      //         message: 'Created Successfully',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    handleAudit (row) {
      this.$http.post('/market-order/auditReturn', null, {
        params: {
          orderId: row.orderId,
          auditState: this.auditRadio,
          cause: this.auditCause
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.$message.error(res.data.msg)
        } else {
          this.$message.success(res.data.data)
          this.getList()
        }
      })
      // auditWall({
      //   wallId: row.wallId,
      //   auditState: this.auditRadio,
      //   auditFailedCause: this.auditCause
      // }).then(res => {
      //   console.log(res)
      //   this.$message.success(res.msg)
      //   this.$router.go(0)
      // })
    },
    updateData () {
      // this.$refs.dataForm.validate((valid) => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.temp)
      //     tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      //     updateArticle(tempData).then(() => {
      //       const index = this.list.findIndex(v => v.id === this.temp.id)
      //       this.list.splice(index, 1, this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: 'Success',
      //         message: 'Update Successfully',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    handleDelete (row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv (pv) {
      // fetchPv(pv).then(response => {
      //   this.pvData = response.data.pvData
      //   this.dialogPvVisible = true
      // })
    },
    // handleDownload () {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['墙ID', '申请人ID', '内容', '图片', '申请时间', '审核状态', '审核人ID', '审核时间', '评论数', '点赞数']
    //     const filterVal = ['wallId', 'userId', 'wallContent', 'wallImages', 'createtime', 'auditState', 'adminId', 'auditTime', 'commentNum', 'likeNum']
    //     const data = this.formatJson(filterVal)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'walls-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson (filterVal) {
    //   return this.list.map(v => filterVal.map(j => {
    //     return v[j]
    //   }))
    // },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style>
.span-wallContent{
  font-size: 12px;
  white-space:nowrap;/*强制单行显示*/
  text-overflow:ellipsis;/*超出部分省略号表示*/
  overflow:hidden;/*超出部分隐藏*/
  width: 100%;/*设置显示的最大宽度*/
  display:inline-block;
}
</style>
