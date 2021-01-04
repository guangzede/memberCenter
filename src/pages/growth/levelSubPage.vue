<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-button type="transparent" @click="$router.push('./')">返回</el-button>
        <el-button v-if="!editable" @click="submitForm">提交</el-button>
      </div>
      <div class="content">
        <el-form
          ref="addForm"
          :inline="true"
          :rules="formRules"
          :model="addForm"
          :disabled="editable"
          label-width="150px"
          label-position="left"
          @submit.native.prevent>
          <div>
            <el-form-item prop="levelName" label="等级名称">
              <el-input v-model="addForm.levelName" maxlength="10" clearable/>
            </el-form-item>
          </div>
          <div>
            <el-form-item prop="levelType" label="选择等级方式">
              <el-select v-model="addForm.levelType" placeholder="请选择" @change="typeChange">
                <el-option key="1" label="仅等级" value="1" />
                <el-option key="2" label="等级+星级" value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="grade" >
            <el-form-item :rules="[{ required: true, message: '请输入等级下限数值', trigger: 'blur' },{ type: 'number', min: 0, max: 99999, message: '数值区间为[0-99999]', trigger: 'blur' }]" prop="levelLow" label="等级范围">
              <el-input v-model.number="addForm.levelLow" :min="0" :max="addForm.levelUp-1 || 99999" maxlength="5" clearable @change="gradeRangeChange"/>
            </el-form-item>
            <span class="center-span">&lt;= &nbsp;  X &nbsp; &lt;</span>
            <el-form-item prop="levelUp" >
              <el-input v-model.number="addForm.levelUp" :max="99999999" :min="addForm.levelLow+1 || 0" maxlength="8" clearable @change="gradeRangeChange"/>
            </el-form-item>
          </div>
          <div v-if="gradeStar">
            <el-form-item
              prop="levelLow"
              label="升级档">
              <el-input
                v-model.number="addForm.levelLow"
                :max="99999"
                :min="0"
                maxlength="5"
                clearable
                @change="changeLevelUp(-1,addForm.levelLow)"/>
            </el-form-item>
          </div>
          <div>
            <el-form-item v-if="gradeStar" label="星级范围X">
              <el-button circle @click="insertLine()"><i class="el-icon-plus"/></el-button>
            </el-form-item>
          </div>
          <div v-if="gradeStar">
            <el-row v-for="(item,index) in addForm.starRating" :key="index" :gutter="20" class="inline" style="margin: 0 auto">
              <el-col :xl="2" :sm="3" style="text-align: right;padding: 8px 0 0" >
                <img v-for="i in index+1" :key="i" :src="starImgUrl" class="starImg" >
              </el-col>
              <el-col :xl="1" :sm="1"/>
              &nbsp;
              <el-form-item>
                <el-input v-if="index === 0" v-model="addForm.levelLow" :disabled="true" style="width: 200px" clearable/>
                <el-input v-if="index !== 0" v-model="addForm.starRating[index-1].levelUp" :disabled="true" style="width: 200px" clearable/>
              </el-form-item>
              <span class="center-span">&lt;= X &lt;</span>
              <el-form-item :prop="`starRating[${index}].levelUp`" class="noLabel" label-width="0">
                <el-input-number v-model="addForm.starRating[index].levelUp" :precision="0" :controls="false" :max="99999999" :min="parseInt(index === 0 ? addForm.levelLow+1 : addForm.starRating[index-1].levelUp+1) || 0" maxlength="8" clearable style="width: 200px" @change="changeLevelUp(index,addForm.starRating[index].levelUp)"/>
              </el-form-item>
              <el-button type="text" @click.prevent="deleteLine(item)">删除</el-button>

            </el-row>
          </div>
          <div>
            <el-form-item
              prop="status"
              label="状态">
              <el-radio-group v-model="addForm.status">
                <el-radio :label="'1'">启用</el-radio>
                <el-radio :label="'0'">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { addLevelInfo, editLevelInfo, intervalValidity } from '@/api/growth'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'LevelSubPage',
  components: {
    breadcrumb
  },

  data() {
    return {
      formRules: {
        levelName: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
        levelType: [{ required: true, message: '请选择等级方式', trigger: 'blur' }],
        level: [{ required: true, message: '请输入等级范围', trigger: 'blur' }],
        levelLow: [{ required: true, message: '请输入升级档', trigger: 'blur' },
          { type: 'number', min: 0, max: 99999, message: '数值区间为[0-99999]', trigger: 'blur' }],
        levelUp: [
          { required: true, message: '请输入等级上限数值', trigger: 'blur' },
          { type: 'number', min: 0, max: 99999999, message: '数值区间为[0-99999999]', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        starRating: []
      },
      grade: false,
      gradeStar: true,
      addForm: {
        levelName: '',
        levelType: '2',
        levelLow: undefined,
        levelUp: undefined,
        starRating: [],
        status: '1'
      }, // 编辑数据
      starImgUrl: require('../../assets/star.png')
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    },
    editable() {
      return this.$store.getters.editable
    }
  },
  watch: {
  },
  mounted() {
    this.addForm = this.data
    console.log(this.addForm)
    this.typeChange(this.addForm.levelType)
  },
  methods: {
    typeChange(val) {
      if (val === '1') {
        this.gradeStar = false
        this.grade = true
      } else {
        this.changeLevelUp(-1, this.addForm.levelLow)
        if (this.addForm.starRating.length < 1) {
          for (let i = 0; i < 5; i++) {
            const map = {
              levelLow: this.addForm.starRating.length === 0 ? this.addForm.levelLow : this.addForm.starRating[this.addForm.starRating.length - 1].levelUp,
              levelUp: '',
              levelName: i + 1 + '星'
            }
            this.addForm.starRating.push(map)
            this.formRules.starRating.push({ levelUp: [{ required: true, message: '请输入星级上限数值', trigger: 'blur' }, { type: 'number', message: '数值区间为[1-99999999]', trigger: 'blur' }] })
          }
          console.log(JSON.stringify(this.addForm.starRating, null, 2))
        }
        this.gradeStar = true
        this.grade = false
      }
    },
    gradeRangeChange() {
      if (parseInt(this.addForm.levelLow) >= parseInt(this.addForm.levelUp)) {
        this.addForm.levelUp = this.addForm.levelLow + 1
      }
    },
    changeLevelUp(index, val) {
      this.addForm = { ...this.addForm }
      for (let i = index; i < this.addForm.starRating.length - 1; i++) {
        if (this.addForm.starRating[i + 1].levelUp <= val) {
          this.addForm.starRating[i + 1].levelUp = val + 1
          val++
        }
      }
      this.addForm = { ...this.addForm }
    },
    insertLine() {
      const map = {
        levelLow: this.addForm.starRating.length === 0 ? this.addForm.levelLow : this.addForm.starRating[this.addForm.starRating.length - 1].levelUp,
        levelUp: '',
        levelName: this.addForm.starRating.length + 1 + '星'
      }
      if (this.addForm.starRating.length < 7) {
        this.addForm = { ...this.addForm, starRating: [...this.addForm.starRating, map] }
        this.formRules.starRating.push({ levelUp: [{ required: true, message: '请输入星级上限数值', trigger: 'blur' }, { type: 'number', message: '数值区间为[1-99999999]', trigger: 'blur' }] })
      } else {
        this.$message('星级范围最多七级！')
      }
      console.log(this.addForm.starRating)
    },
    deleteLine(item) {
      var index = this.addForm.starRating.indexOf(item)
      if (this.addForm.starRating.length > 1) {
        if (index !== -1) {
          this.addForm.starRating.splice(index, 1)
        }
        this.addForm = { ...this.addForm, starRating: [...this.addForm.starRating] }
      } else {
        this.$message('星级范围最少一级！')
      }
    },
    submitForm() {
      this.addForm.levelName = this.addForm.levelName.trim()
      this.$refs.addForm.validate(validate => {
        if (validate) {
          if (this.addForm.id) {
            // 编辑
            for (let i = 0; i < this.addForm.starRating.length; i++) {
              if (i === 0) {
                this.addForm.starRating[i].levelLow = this.addForm.levelLow
              } else {
                this.addForm.starRating[i].levelLow = this.addForm.starRating[i - 1].levelUp
              }
            }
            this.addForm.memberLevelInfos = this.addForm.starRating
            for (const iterator of this.addForm.memberLevelInfos) {
              iterator.memberLevelInfos = []
            }
            if (this.addForm.memberLevelInfos.length && this.addForm.levelType === '2') {
              this.addForm.levelUp = this.addForm.memberLevelInfos[this.addForm.memberLevelInfos.length - 1].levelUp
            }
            for (let i = 0; i < this.addForm.memberLevelInfos.length; i++) {
              if (i !== 0) {
                this.addForm.memberLevelInfos[i].levelLow = this.addForm.memberLevelInfos[i - 1].levelUp
              }
            }
            intervalValidity(this.addForm).then(res => {
              console.log(res, 'kkkkk')
              if (res.resultStatus === 'WARNING') {
                this.$confirm('等级区间有空档是否继续保存？')
                  .then(_ => {
                    editLevelInfo(this.addForm).then(res => {
                      if (res.resultStatus === 'SUCCEED') {
                        this.$message({
                          message: '保存成功',
                          type: 'success'
                        })
                        this.$router.push('./')
                      }
                    })
                  })
                  .catch(_ => {
                  })
              } else if (res.resultStatus === 'SUCCEED') {
                editLevelInfo(this.addForm).then(res => {
                  if (res.resultStatus === 'SUCCEED') {
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                    this.$router.push('./')
                  }
                })
              }
            })
          } else {
            // 新增
            if (this.addForm.levelType === '1') {
              this.addForm.starRating = []
            }
            for (let i = 0; i < this.addForm.starRating.length; i++) {
              if (i === 0) {
                this.addForm.starRating[i].levelLow = this.addForm.levelLow
              } else {
                this.addForm.starRating[i].levelLow = this.addForm.starRating[i - 1].levelUp
              }
            }
            this.addForm.memberLevelInfos = this.addForm.starRating
            if (this.addForm.memberLevelInfos.length > 0 && this.addForm.levelType === '2') {
              this.addForm.levelUp = this.addForm.memberLevelInfos[this.addForm.memberLevelInfos.length - 1].levelUp
            }
            intervalValidity(this.addForm).then(res => {
              if (res.resultStatus === 'WARNING') {
                this.$confirm('等级区间有空档是否继续保存？')
                  .then(_ => {
                    addLevelInfo(this.addForm).then(res => {
                      if (res.resultStatus === 'SUCCEED') {
                        this.$message({
                          message: '保存成功',
                          type: 'success'
                        })
                        this.$router.push('./')
                      }
                    })
                  })
                  .catch(_ => {
                  })
              } else if (res.resultStatus === 'SUCCEED') {
                addLevelInfo(this.addForm).then(res => {
                  if (res.resultStatus === 'SUCCEED') {
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                    this.$router.push('./')
                  }
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 20px;
}
.center-span {
  padding-left: 10px;
  padding-right: 20px;
  font-size: 12px;
  line-height: 28px;
  display: inline-block;
}
.keyvalue {
  & > div {
    &.key {
      width: 150px;
    }
    &.value {
      text-align: left;
      width: calc(100% - 150px);
      box-shadow: none;
    }
  }
}
.item {
  display: flex;
  justify-content: left;
}
.el-form {
  text-align: left;
}
.el-select > .el-input,
.el-form-item__content {
  width: 200px;
}
.app-container {
  min-height: calc(100vh - 100px);
}

>>> .el-form-item--mini .el-form-item__label {
  font-size: 12px;
  font-weight: normal;
}
>>> .dialog {
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
  }
  .el-transfer-panel {
    width: 320px;
  }
}
.el-transfer-panel__list{
  height: 210px;
}
.el-transfer-panel .el-transfer-panel__footer {
  bottom: inherit;
  top: 40px;
}
>>> .el-dialog .el-form-item {
  width: 100%;
  margin-top: 5px;
  text-align: center;
  overflow: hidden;
  .el-form-item__content {
    width: 120px;
  }
}
>>> .el-dialog .el-form-item.second .el-form-item__content {
  width: 175px;
}
>>>.widthAuto .el-form-item__content{
  width: auto!important
}
span.info{
  color: #888;
  font-size: 80%;
}
.append:before{
  display: inline;
  content:'*';
  color: #F56C6C;
  margin-right: 4px;
  font-size:12px;
}
</style>

