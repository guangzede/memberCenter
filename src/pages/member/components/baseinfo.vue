<template>
  <div>
    <div class="content">
      <el-form :disabled="baseFormEdit" :inline="true" :model="baseForm" style="margin-top:24px;padding:0 10px;" label-width="120px" label-position="left" @submit.native.prevent>
        <el-row :gutter="10" class="short">
          <el-col :span="8">
            <p><span>客户ID:</span>{{ data.aid }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>手机号码:</span>{{ data.mobile }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>姓名:</span>{{ data.userName }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>昵称:</span>{{ data.nickName }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>民族:</span>{{ data.nation }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>年龄:</span>{{ data.age }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>婚姻状况:</span>{{ data.isMarriage?'已婚':'未婚' }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>教育程度:</span>{{ data.educationLevel }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>生日:</span>{{ data.birthday }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>QQ号:</span>{{ data.qq }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>邮箱:</span>{{ data.email }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>行业:</span>{{ data.industry }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>职位:</span>{{ data.position }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>公司:</span>{{ data.company }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>省份:</span>{{ data.province }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>城市:</span>{{ data.city }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>区县:</span>{{ data.area }}</p>
          </el-col>
        </el-row>
        <p><span>详细地址:</span>{{ data.address }}</p>
        <p><span>兴趣爱好:</span>{{ data.hobby }}</p>

      </el-form>
    </div>
    <el-divider />
    <div class="content">
      <div class="class-name">会员等级信息</div>
      <el-row style="padding: 0 10px;">
        <el-col :span="6">
          <p><span>成长等级: </span> <span style="font-weight: bold;">{{ data.memberLevelName }}</span>
            <!--<img v-for="i in index+1" :key="i" :src="starImgUrl" class="starImg" >-->
            <img v-for="item in starsNum" :key="item" :src="starImgUrl" class="starImg" >
          </p>
        </el-col>

        <el-col v-if="!maxLevelFlag" :span="10">
          <p><span>升到下一级别需要{{ nextLevelGrowthValue }}成长值</span></p>
        </el-col>

      </el-row>
    </div>
    <el-divider />
    <div class="content" hidden>
      <div class="class-name">会员标签
      </div>
      <div>
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          :disable-transitions="false"
          closable
          @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增标签 </el-button>

      </div>
    </div>
  </div>

</template>

<script>

import { getLevelInfoByGrowth } from '@/api/growth'
export default {
  name: 'BaseInfo',
  data() {
    return {

      baseFormEdit: false,
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      baseForm: {
        name: '张二河',
        sex: 1,
        nation: '汉族',
        age: 0,
        education: 0,
        wx: '-vo3dSag_xI4khGko9WTAnF6hhy',
        email: 'asdasd',
        industry: '周围神经病学',
        position: 'Font-End',
        company: 'NTT DATA',
        provinc: '',
        city: '',
        address: '',
        hobby: ''
      },
      education: [{
        label: '高中及以下',
        value: 0
      }, {
        label: '大专',
        value: 1
      }, {
        label: '本科',
        value: 2
      }, {
        label: '硕士研究生',
        value: 3
      }, {
        label: '博士研究生',
        value: 4
      }],
      sex: [{
        label: '男',
        value: 1
      }, {
        label: '女',
        value: 0
      }],
      age: [
        {
          label: '20岁以下',
          value: 0
        },
        {
          label: '21-29岁',
          value: 1
        },
        {
          label: '30-39岁',
          value: 2
        },
        {
          label: '40-49岁',
          value: 3
        },
        {
          label: '50-59岁',
          value: 4
        },
        {
          label: '60岁以上',
          value: 5
        }
      ],
      married: [
        {
          label: '已婚',
          value: true
        }, {
          label: '未婚',
          value: false
        }
      ],
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
      this.getMoveToTheNextLevelGrowthValueByBase(this.data.growthValue)
      this.starsNum = parseInt(this.data.memberStarsName.substring(0, 1))
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getMoveToTheNextLevelGrowthValueByBase(growth) {
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
  display: inline;
}
.class-name{
  margin-bottom: 20px;
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
.keyvalue{
  margin: 0;
  padding: 12px 0;
  .key{
    width:6em;
  }
  .value{
    text-align: left;
    width:calc(100% - 6em);
    box-shadow: none;
  }
  &.shadow{
    box-shadow: 0px 1px 0 0 #e1e1e1;
  }
}

.el-tag{
  margin-top: 15px;
  padding: 5px 11px;
    box-sizing: content-box;
}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
.head {
  justify-content: space-between;
  display: flex;
}
.classs-name{
  text-align: left;
  margin-bottom: 15px;
}
.full-row{
  text-align: left;

}
.el-image{
  border: 1px solid #ddd;
    padding: 21px;
}
em{
  padding: 0 5px;
}
small{
  text-align: left;
  display: block;
}
</style>
