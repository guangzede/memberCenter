<template>
  <div class="app-container">
    <div class="content">
      <div class="class-name">已经绑定车辆{{ carinfo.length }}台</div>
      <el-divider />
    </div>
    <div class="content">
      <template v-for="(item,index) in carinfo" >
        <el-row :gutter="40" :key="index">
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">品牌</div>
              <div class="value">{{ item.bigClassName }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">车系</div>
              <div class="value">{{ item.seriesName }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">车型</div>
              <div class="value">{{ item.vehicleModelName }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">车辆识别码</div>
              <div class="value">{{ item.vin }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">产品代码</div>
              <div class="value">{{ item.productCode }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">颜色</div>
              <div class="value">{{ item.color }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">购车日期</div>
              <div class="value">{{ item.saleTime }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">购车经销商</div>
              <div class="value">{{ item.dealerName }}</div>
            </div>
          </el-col>
          <el-col :lg="6" :md="8">
            <div class="keyvalue">
              <div class="key">车牌号</div>
              <div class="value">{{ item.vehicleNumber }}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <el-divider />
          </el-col>
        </el-row>
      <!-- <el-button v-if="item.userType==='auth_user'" type="" @click="unbind">车辆解绑</el-button> -->
      </template>
    </div>

  </div>
</template>

<script>
import { vehicleinfo } from '@/api/member.js'
export default {
  name: 'CarInfo',
  data() {
    return {
      carinfo: []
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      vehicleinfo({
        'aId': this.data.aid
      }).then(res => {
        this.carinfo = res.result
      }).catch()
    },
    unbind() {
      window.alert('全力开发中。。。。。')
    }
  }
}
</script>
<style lang="scss" scoped>

.keyvalue{
  line-height: 1.8em;
  .key{
    width: 6em;
  }
  .value{
    width:calc( 100% - 6em);
  }
}
</style>
