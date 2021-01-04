<template>
  <div class="content">
    <el-row :gutter="20" style="margin-top:24px;padding: 0 10px;">
      <el-col :span="4">
        <p><span>会员姓名:</span>{{ data.userName }}</p>
      </el-col>
      <el-col :span="4">
        <p><span>手机号:</span>{{ data.mobile }}</p>
      </el-col>
      <el-col :span="4">
        <p><span>成长值:</span>{{ data.growthValue }}</p>
      </el-col>

      <el-col :span="6">
        <p><span>成长等级: </span> <span style="font-weight: bold;">{{ data.memberLevelName }} </span> <img v-for="item in starsNum" :key="item" :src="starImgUrl" class="starImg" > </p>
      </el-col>

      <el-col v-if="!maxLevelFlag" :span="6">
        <p><span>升到下一级别需要{{ nextLevelGrowthValue }}成长值</span></p>
      </el-col>
    </el-row>
    <el-divider />
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column label="变动时间"><template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate:'-' }}</template></el-table-column>
      <el-table-column label="变动成长值"><template slot-scope="scope">{{ scope.row.changeGrowth?scope.row.changeGrowth:'-' }}</template></el-table-column>
      <el-table-column label="变动前成长值"><template slot-scope="scope">{{ scope.row.lastTotalGrowth - scope.row.changeGrowth }}</template></el-table-column>
      <el-table-column label="变动后成长值"><template slot-scope="scope">{{ scope.row.lastTotalGrowth?scope.row.lastTotalGrowth:'-' }}</template></el-table-column>
      <el-table-column label="成长值变动说明"><template slot-scope="scope">{{ scope.row.changeDesc?scope.row.changeDesc:'-' }}</template></el-table-column>
    </el-table>
    <div v-if="totalPage>0" class="table-footer">
      <span>{{ total }}条记录，共{{ totalPage }}页</span>
      <el-pagination
        :page-count="totalPage"
        :current-page="pageNo"
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="currentChange"/>
    </div>
  </div>
</template>

<script>
import { getLevelInfoByGrowth, getGrowthSteam } from '@/api/growth'
export default {
  name: 'GrowthInfo',
  data() {
    return {
      aid: 0,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNo: 1,
      totalPage: 0,
      starsNum: 0,
      nextLevelGrowthValue: 0,
      maxLevelFlag: false,
      starImgUrl: require('../../../assets/star.png')
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    }
  },
  mounted() {
    if (this.data.memberStarsName.length > 0) {
      // 查询升到下一级别需要的成长值
      this.getMoveToTheNextLevelGrowthValueByFlow(this.data.growthValue)
      this.starsNum = parseInt(this.data.memberStarsName.substring(0, 1))
    }
    this.initParam()
    this.init()
  },
  methods: {
    initParam(pageNo) {
      this.param = {
        aid: this.data.aid,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
    },
    init() {
      getGrowthSteam(this.param).then(res => {
        this.pageNo = res.pageNo
        this.tableData = res.result
        this.total = res.totalNum
        this.totalPage = res.totalPage
      })
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    },
    getMoveToTheNextLevelGrowthValueByFlow(growth) {
      const params = {
        growth
      }
      const maxGrowth = {
        growth: 0x7fffffff
      }
      getLevelInfoByGrowth(params).then(res => {
        const level = res.result
        getLevelInfoByGrowth(maxGrowth).then(res => {
          const maxLevel = res.result
          if (level.levelName === maxLevel.levelName) {
            if (level.levelType === '1') {
              this.maxLevelFlag = true
              return
            } else {
              if (level.memberLevelInfos.length > 0 && maxLevel.memberLevelInfos.length > 0) {
                if (level.memberLevelInfos[0].levelName === maxLevel.memberLevelInfos[0].levelName) {
                  this.maxLevelFlag = true
                  return
                }
              }
            }
          }

          if (level.levelType === '1') {
            if (growth >= level.levelUp) {
              this.maxLevelFlag = true
            } else {
              this.nextLevelGrowthValue = level.levelUp - growth
            }
          } else {
            if (level.memberLevelInfos.length > 0) {
              if (growth >= level.memberLevelInfos[0].levelUp) {
                this.maxLevelFlag = true
              } else {
                this.nextLevelGrowthValue = level.memberLevelInfos[0].levelUp - growth
              }
            } else {
              if (growth >= level.levelUp) {
                this.maxLevelFlag = true
              } else {
                this.nextLevelGrowthValue = level.levelUp - growth
              }
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.starImg{
  width: 12px !important;
  height: 12px !important;
  margin-right: 3px !important;
  display: inline !important;
}
.text-left{
  text-align: left;
  margin: 20px 0;
}
p{
  font-size: 12px;
  text-align: left;
  margin: .8em 0;
  font-weight: bold;
  span{
    font-weight: normal;
    padding-right: 1em;
  }
}
</style>
