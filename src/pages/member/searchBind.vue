<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">vin码查询</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="$router.push('./')">返回</el-button>
        </div>
        <el-form ref="ruleForm" :inline="true" :model="ruleForm" label-width="150px" label-position="left" @submit.native.prevent>
          <el-form-item
            :rules="[{ required: true,message: '请输入17位车辆Vin码', trigger: 'blur' },
                     {type:'string', min:17,max:17,message: '请输入17位车辆Vin码'}]"
            label="车辆Vin码"
            prop="vin">
            <el-input v-model="ruleForm.vin" maxlength="17" placeholder="请输入17位车辆Vin码" clearable/>
          </el-form-item>
          <el-button @click="search">搜索</el-button>
          <!-- v-if="baseData.userType==='auth_user'"  -->
          <el-button @click="dialog = true">解绑</el-button>
        </el-form>
      </div>
    </div>
    <div v-if="infoForm" class="app-container shadow">
      <div class="content">
        <div class="class-name">已查询车主信息</div>
        <p><span>会员姓名:</span>{{ baseData.memberName }}</p>
        <p><span>会员手机号:</span>{{ baseData.phone }}</p>
        <div class="class-name">车辆基本信息</div>
        <p><span>车系:</span>{{ baseData.vehicleSeriesName }}</p>
        <p><span>车型:</span>{{ baseData.vehicleModeName }}</p>
        <p><span>颜色:</span>{{ baseData.colorName }}</p>
        <p><span>车牌号:</span>{{ baseData.vehicleNumber }}</p>
      </div>
    </div>
    <el-dialog :visible.sync="dialog" :before-close="handleClose" title="车辆解绑" width="50%">
      <el-form ref="unbindForm" :model="unbindForm" :inline="true" label-width="150px" label-position="left" @submit.native.prevent>
        <div class="class-name">为{{ baseData.memberName }}解绑车辆Vin【{{ ruleForm.vin }}】</div>
        <el-form-item
          :rules="[{ required: true, trigger: 'blur',message:'请选择' },]"
          prop="noticeStatus"
          label="是否已通知客户">
          <el-radio-group v-model="unbindForm.noticeStatus">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :rules="[{required: true, trigger: 'blur',message:'请输入解绑说明' },
                   {type:'string',max:50,message:'请输入50个以内文字'}
          ]"
          prop="revokeDesc"
          label="解绑说明">
          <el-input v-model="unbindForm.revokeDesc" :maxlength="50" type="textarea" placeholder="请输入50个以内文字"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialog=false"> 取消</el-button>
        <el-button @click="unbind"> 提交</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { getVin, saveRevokeInfo } from '@/api/member.js'
export default {
  name: 'Detail',
  components: {
    breadcrumb
  },
  data() {
    return {
      ruleForm: {
        vin: ''
      },
      baseData: {},
      infoForm: false,
      dialog: false,
      unbindForm: {}
    }
  },
  methods: {
    search() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          getVin({ vin: this.ruleForm.vin }).then(res => {
            if (res.result) {
              this.infoForm = true
              this.baseData = res.result
            }
          })
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    unbind() {
      this.$refs['unbindForm'].validate(valid => {
        if (valid) {
          saveRevokeInfo({
            aId: this.baseData.aId,
            memberName: this.baseData.memberName,
            phone: this.baseData.phone,
            vin: this.ruleForm.vin,
            vehicleNumber: this.baseData.vehicleNumber,
            vehicleModeName: this.baseData.vehicleModeName,
            vehicleSeriesName: this.baseData.vehicleSeriesName,
            revokeDesc: this.unbindForm.revokeDesc,
            noticeStatus: this.unbindForm.noticeStatus
          }).then(res => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.$router.push('./')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
form{
  text-align: left;
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
