<template>
  <div>
    <div class="background">
      <breadcrumb />
      <div class="flex-buttons">
        <el-button type="transparent" @click="$router.push('./')">返回</el-button>
      </div>
      <el-tabs v-model="activeName" class="app-container shadow" @tab-click="handleClick">
        <el-tab-pane name="baseInfo">
          <el-button slot="label" :type="activeName==='baseInfo'?'primary':'default'" size="medium"> 基本信息</el-button>
          <base-info/>
        </el-tab-pane>
        <el-tab-pane name="carInfo">
          <el-button slot="label" :type="activeName==='carInfo'?'primary':'default'" size="medium" > 车辆信息</el-button>
          <car-info/>
        </el-tab-pane>
        <el-tab-pane name="scoreInfo">
          <el-button slot="label" :type="activeName==='scoreInfo'?'primary':'default'" size="medium" name="scoreInfo"> 积分信息</el-button>
          <score-info/>
        </el-tab-pane>
        <el-tab-pane name="growthInfo">
          <el-button slot="label" :type="activeName==='growthInfo'?'primary':'default'" size="medium" name="growthInfo"> 成长值信息</el-button>
          <growth-info/>
        </el-tab-pane>
        <el-tab-pane name="medalInfo">
          <el-button slot="label" :type="activeName==='medalInfo'?'primary':'default'" size="medium" name="medalInfo"> 勋章信息</el-button>
          <medal-info/>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>

</template>

<script>
import baseInfo from './components/baseinfo'
import scoreInfo from './components/scoreinfo'
import carInfo from './components/carinfo'
import growthInfo from './components/growthInfo'
import breadcrumb from '@/components/breadcrumb'
import medalInfo from './components/medalInfo'
export default {
  name: 'Detail',
  components: {
    breadcrumb,
    baseInfo,
    carInfo,
    growthInfo,
    scoreInfo,
    medalInfo
  },
  data() {
    return {
      activeName: 'baseInfo'
    }
  },
  methods: {
    handleClick(tab, event) {
    }
  }

}
</script>

<style lang="scss" scoped>
.el-tab-pane {
    min-height: calc(100vh - 205px);
}
.background{
  background: #eee;
  position:relative;
}

>>>.el-tabs__content{
  background: #fff;
  border: 1px solid #cacaca;
  box-sizing: border-box;
  min-height: calc(100vh - 180px);
}
.el-image{
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 20px;
}
.el-button--medium{
  border-radius: 0;
}
>>>.el-tabs__nav{
  padding-bottom: 10px;
}
.flex-buttons{
  top:63px;
  z-index: 22;
}
</style>
