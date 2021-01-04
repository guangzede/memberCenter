<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-popconfirm title="您是否取消本次操作？" @confirm="$router.push('/rights/information')" >
          <el-button slot="reference" type="transparent">取消</el-button>
        </el-popconfirm>
        <el-button v-if="rightsType!=='detail'" @click="submitForm">提交</el-button>
      </div>
      <div class="content">
        <el-form ref="form" :inline="true" :model="formData" label-width="150px" label-position="left" @submit.native.prevent>
          <div class="keyvalue">
            <el-form-item

              :rules="[{ required: true,message:'请输入权益编码'},
                       {type:'string',min:5,max:20,message:'请输入5-20个字'}
              ]"
              label="权益编码:"
              prop="rightCode">
              <el-input v-if="rightsType==='add'" v-model.trim="formData.rightCode" maxlength="20" placeholder="请输入5-20位字母或数字">
                <template slot="prepend">MR-</template>
              </el-input>
              <template v-else>{{ formData.rightCode }}</template>
            </el-form-item>

          </div>
          <div v-if="rightsType!=='add'" class="keyvalue">
            <div class="key">
              操作人
            </div>
            <div class="value">{{ formData.createBy }}</div>
          </div>
          <div v-if="rightsType!=='add'" class="keyvalue">
            <div class="key">
              更新时间
            </div>
            <div class="value">{{ formData.updateTime }}</div>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请输入权益编码'},
                       {type:'string',min:1,max:30,message:'请输入30个以内文字'}
              ]"
              label="权益名称:"
              prop="rightName">
              <el-input v-if="rightsType!=='detail'" v-model.trim="formData.rightName" maxlength="30" placeholder="请输入30个以内文字"/>
              <template v-else>{{ formData.rightName }}</template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {message:'请选择'}
              ]"
              label="权益来源:"
              prop="rightSource">
              <el-select v-if="rightsType!=='detail'" v-model.trim="formData.rightSource" placeholder="请选择">
                <el-option v-for="item of rightSource" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              <template v-else>{{ valueMatchLabel('rightSource',formData.rightSource) }}</template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {message:'请选择'}
              ]"
              label="权益业务分类:"
              prop="rightBusinessType">
              <el-select v-if="rightsType!=='detail'" v-model.trim="formData.rightBusinessType" placeholder="请选择">
                <el-option v-for="item of rightBusinessType" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              <template v-else>{{ valueMatchLabel('rightBusinessType',formData.rightBusinessType) }}</template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {message:'请选择'}
              ]"
              label="权益类别:"
              prop="rightType">
              <el-select v-if="rightsType!=='detail'" v-model.trim="formData.rightType" placeholder="请选择">
                <el-option v-for="item of rightType" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              <template v-else>{{ valueMatchLabel('rightType',formData.rightType) }}</template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {type:'number',message:'请选择'}
              ]"
              label="权益有效期:"
              prop="valideTime">
              <el-select v-if="rightsType!=='detail'" v-model.number="formData.valideTime" placeholder="请选择">
                <el-option v-for="item of valideTime" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              <template v-else> {{ valueMatchLabel('valideTime',formData.valideTime) }}</template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="rules.account"
              label="发行总量:"
              prop="account">
              <el-input v-if="rightsType!=='detail'" v-model.number="formData.account" placeholder="请输入数字"/>
              <template v-else>{{ formData.account }}</template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: false},
                       {type:'string',min:0,max:500}
              ]"
              label="权益图片:"
              prop="rightsPhoto"
              class="photo"
            >
              <img
                :disabled="rightsType!=='detail'"
                :src="formData.rightsPhoto"
                class="avatar"
                @click="uploadImg('rightsPhoto')"
              >
              <i v-if="!formData.rightsPhoto&&rightsType!=='detail'" class="el-icon-plus avatar-uploader-icon" @click="uploadImg('rightsPhoto')" />
              <span v-if="rightsType!=='detail'" class="text-info">注：仅支持jpg、png格式，大小不超过10M</span>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: false},
                       {type:'string',min:0,max:50,message:'请输入0-50个字'}
              ]"
              label="权益描述:"
              prop="rightDesc">
              <el-input v-if="rightsType!=='detail'" v-model.trim="formData.rightDesc" maxlength="20"/>
              <template v-else>{{ formData.rightDesc }}</template>
            </el-form-item>
          </div>

          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {message:'请选择'}
              ]"
              label="权益应用状态:"
              prop="rightStatus">
              <template v-if="rightsType!=='detail'" >
                <el-radio v-model="formData.rightStatus" :label="'0'" >启用</el-radio>
                <el-radio v-model="formData.rightStatus" :label="'1'" >禁用</el-radio>
              </template>
              <template v-else>{{ formData.rightStatus==='0'?'启用':'禁用' }}</template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {message:'请选择'}
              ]"
              label="权益发放方式:"
              prop="grantPattern">
              <el-select v-if="rightsType==='add'" v-model="formData.grantPattern" placeholder="请选择">
                <el-option v-for="item of grantPattern" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              <template v-else>{{ formData.grantPattern==='0'?'会员通用权益':'应用端自定义权益' }}</template>
              <span v-if="rightsType==='add'" class="text-info">注：选择发放方式后不可更改</span>
            </el-form-item>
          </div>
          <div v-if="formData.grantPattern==='1'" class="keyvalue">
            <el-form-item
              :rules="[{ required: true, trigger: 'blur' },]"
              label="设置应用范围">
              <el-button :disabled="rightsType==='detail'" type="text" @click="checkStatus">选择规则应用范围</el-button>
              <el-checkbox-group v-model="checkboxList" class="unClickable">
                <template v-for="(item,index) of checkboxList">
                  <el-checkbox :key="index" :label="item">{{ item }}</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialogTransfer"
      class="dialog"
      title="权益应用范围"
      width="880px"
    >
      <el-transfer
        v-model="applyRange"
        :data="rangeData"
        :titles="['全选', '全选']"
        :button-texts="['移除', '添加']"
        style="text-align: left; display: inline-block"
        @change="transferChange"
      >
        <el-form
          slot="left-footer"
          :inline="true"
          :model="scoreForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <div>
            <el-form-item label="应用平台名称：" class="second" label-width="75px">
              <el-input v-model="scoreForm.name" clearable style="width:62%" placeholder="请输入" />
              <el-button type="primary" @click="getSearchInfo">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-transfer>
    </el-dialog>
    <el-dialog :visible.sync="dialogUpload" :before-close="handleClose" title="拖拽上传" width="40%">
      <el-upload
        :data="uploadData"
        :action="actionUrl"
        :headers="uploadHead"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        :multiple="false"
        :on-success="uploadSuccess"
        class="avatar-uploader"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { getITCWL, getClintInfo, updateRightInfo, getITCYL, addRightsInfo } from '@/api/rights'
import { getToken } from '@/utils/auth'
export default {
  name: 'Accumulate',
  components: {
    breadcrumb
  },
  data() {
    const account = (rule, value, callback) => {
      if (value.toString().length > 8) {
        callback(new Error('数字过大'))
      // eslint-disable-next-line eqeqeq
      } else if (!value || parseInt(value) == value) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    return {
      formData: {
        rightCode: '',
        rightName: '',
        rightSource: '',
        rightBusinessType: '',
        rightType: '',
        account: '',
        rightsPhoto: '',
        rightDesc: '',
        rightStatus: '0',
        grantPattern: '',
        valideTime: null
      },
      checkList: [],
      checkboxList: [],
      dialogTransfer: false,
      scoreForm: {},
      applyRange: [],
      scoreType: [],
      rangeData: [],
      rangeList: [],
      uploadData: {},
      uploadHead: {},
      dialogUpload: false,
      key: null,
      rightSource: [
        { label: '自建', value: '0' },
        { label: '电商', value: '1' },
        { label: '兑吧', value: '2' }
      ],
      rightBusinessType: [
        { label: '维修保养', value: '0' },
        { label: '商城优惠', value: '1' },
        { label: '金融保险', value: '2' },
        { label: '活动特权', value: '3' },
        { label: '异业合作', value: '4' },
        { label: '其他', value: '5' }
      ],
      rightType: [
        { label: '消费类', value: '0' },
        { label: '非消费类', value: '1' }
      ],
      valideTime: [
        { label: '6个月', value: 6 },
        { label: '12个月', value: 12 },
        { label: '24个月', value: 24 },
        { label: '36个月', value: 36 },
        { label: '60个月', value: 60 },
        { label: '永久有效', value: '' }
      ],
      grantPattern: [
        { label: '会员通用权益', value: '0' },
        { label: '应用端自定义权益', value: '1' }
      ],
      memberRightsClientInfo: {},
      listTCYL: [],
      rules: {
        account: [
          { validator: account, trigger: 'blur' }
        ]
      },
      id: ''
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    },
    rightsType() {
      return this.$store.getters.rightsType
    },

    isdisabled: () => {
      return this.isAddRights === 'detail'
    },
    actionUrl: () => {
      const basePath = process.env.NODE_ENV === 'development' ? '/api' : '/member-admin'
      return basePath + '/right/upload'
    },
    tacticsId: {
      get() {
        return this.formData.id
      },
      set(val) {
        return val
      }
    },
    tacticsType() {
      return this.formData.rightType
    }
  },
  watch: {
    applyRange: {
      handler(value) {
        const temp = []
        this.applyRange.forEach(item => {
          this.rangeData.forEach(ele => {
            if (item === ele.key) { temp.push(ele.label) }
          })
        })
        this.checkboxList = temp
      }
    },
    tacticsId: {
      handler() {
        if (this.tacticsId) {
          getClintInfo().then(res => {
            this.rangeData = []
            for (const i of res.result) {
              this.rangeData.push({
                label: i.clientName,
                key: i.id
              })
            }
          })
          getITCYL({
            clientName: this.scoreForm.name,
            rightsId: this.tacticsId,
            rightsType: this.tacticsType
          }).then(
            res => {
              this.applyRange = []
              this.checkboxList = []
              for (const i of res.result) {
                this.applyRange.push(i.clientId)
                this.checkboxList.push(i.clientName)
              }
              this.listTCYL = res.result
            }
          )
        }
      },
      immediate: true
    }
  },

  mounted() {
    if (this.rightsType !== 'add') {
      this.formData = this.data
    }
    this.checkItem()
  },
  methods: {
    valueMatchLabel(tag, value) {
      try {
        return this[tag].filter(ele => {
          return ele.value === value
        })[0].label
      } catch (error) {
        console.log(tag)
      }
    },
    checkExpiration() {
      if (this.formData.id === 0) {
        this.dialogTransfer = true
      } else {
        this.submitForm()
      }
    },
    checkStatus() {
      if (!this.tacticsId && !this.id) {
        getClintInfo().then(res => {
          this.rangeData = []
          for (const i of res.result) {
            this.rangeData.push({
              label: i.clientName,
              key: i.id
            })
          }
        })
      }
      this.dialogTransfer = true
    },
    getClintInfo() {
      getClintInfo().then(res => {
        this.rangeData = []
        for (const i of res.result) {
          this.rangeData.push({
            label: i.clientName,
            key: i.id
          })
        }
      })
    },
    uploadImg(data) {
      this.uploadHead = { token: getToken() }
      this.key = data
      this.dialogUpload = true
    },
    uploadSuccess(response, file, fileList) {
      this.formData[this.key] = response.result.url
      this.dialogUpload = false
    },
    uploadChange(data) {
      this.uploadHead = { token: getToken() }
    },
    beforeAvatarUpload(file) {
      const isImage =
        file.type === 'image/png' ||
        file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isImage) {
        this.$message.error('上传图片只能是 JPG,PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isImage && isLt2M
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },

    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formData.grantPattern === '1' && this.applyRange.length < 1) {
            this.$message({
              message: '请选定应用范围',
              type: 'error'
            })
            return
          }
          const param = { ...this.formData }
          let infos = []
          if (this.formData.grantPattern === '1') {
            infos = this.applyRange.map(item => {
              return {
                clientId: item,
                rightId: 0,
                rightsType: this.tacticsType
              }
            })
          }
          if (!this.formData.id && !this.id) {
            if (this.rightsType === 'add') {
              param.rightCode = 'MR-' + param.rightCode
            }

            addRightsInfo({ memberRightsInfo: { ...param }, infos }).then(res => {
              if (res.resultStatus === 'FAILED') {
                return
              }
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.tacticsId = this.id = res.result.id
              this.$router.push('/rights/information')
              this.$parent.currentChange(1)
            })
          } else {
            updateRightInfo({ memberRightsInfo: { ...param }, infos }).then(res => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.$router.push('/rights/information')
              this.$parent.currentChange(1)
            })
          }
        }
      })
    },
    getSearchInfo() {
      this.rangeList = []
      for (const i of this.applyRange) {
        for (const j of this.rangeData) {
          if (i === j.key) {
            this.rangeList.push(j)
          }
        }
      }
      getITCWL({
        clientName: this.scoreForm.name,
        rightsId: this.tacticsId,
        rightsType: this.tacticsType
      }).then(res => {
        this.rangeData = []

        for (const i of res.result) {
          const flag = this.applyRange.some(ele => {
            return ele === i.clientId
          })
          if (flag) continue
          this.rangeData.push({
            key: i.clientId,
            label: i.clientName
          })
        }
        this.rangeData.push(...new Set([...this.rangeList]))
      })
    },
    transferChange(value, direction, movedKeys) {
    },
    checkItem() {
      getITCYL({ clientName: this.scoreForm.name,
        rightsId: this.tacticsId,
        rightsType: this.tacticsType }).then(res => {
        this.applyRange = []
        this.checkboxList = []
        for (const i of res.result) {
          this.applyRange.push(i.clientId)
          this.checkboxList.push(i.clientName)
        }
        this.listTCYL = res.result
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.text-info{
      color: #999;
    font-size: 12px;
}
.photo{
  width:500px
}
.photo >>> .el-form-item__content{
  width:auto !important;
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
.el-form{
  text-align: left;
}
.el-select>.el-input, .el-form-item__content{
  width:200px;
}
.app-container{
  min-height: calc( 100vh - 100px);
}

>>>.el-form-item--mini .el-form-item__label{
  font-size: 12px;
  font-weight: normal;
}
>>>.dialog{
  .el-transfer-panel .el-transfer-panel__footer{
    height: 40px
  }
  .el-transfer-panel__list{
    height: 210px;
  }
  .el-transfer-panel{
    width: 300px;
  }
}
.el-transfer-panel .el-transfer-panel__footer{
  bottom: inherit;
  top: 40px;
}
>>>.el-dialog .el-form-item {
  width: 100%;
    margin-top: 5px;
  text-align: center;
  overflow: hidden;
  .el-form-item__content{
    width:120px;
  }
}
>>>.el-dialog .el-form-item.second .el-form-item__content{ width:175px;}
.item {
  display: flex;
  justify-content: left;
}
.el-form{
  text-align: left;
}
.el-select>.el-input, .el-form-item__content{
  width:200px;
}
.app-container{
  min-height: calc( 100vh - 100px);
}

>>>.el-form-item--mini .el-form-item__label{
  font-size: 12px;
  font-weight: normal;
}
>>>.dialog{
  .el-transfer-panel .el-transfer-panel__footer{
    height: 40px
  }
  .el-transfer-panel{
    width: 300px;
  }
}
.el-transfer-panel .el-transfer-panel__footer{
  bottom: inherit;
  top: 40px;
}
>>>.el-dialog .el-form-item {
  width: 100%;
  // display: flex;
  // justify-content: space-around;

  .el-form-item__content{
    width:100px;
  }
}
>>>.el-dialog .el-form-item.second .el-form-item__content{ width:184px;}

</style>
