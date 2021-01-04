<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div v-if="adjustmentType" class="app-container shadow">
      <div class="content">
        <div class="class-name" >积分调整审核</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="linkTo">返回</el-button>
          <el-button type="primary" @click="submitApply">提交</el-button>
        </div>
        <el-form ref="infoForm" :model="info" type="flex" justify="start" class="content" label-width="100px" label-position="left" @submit.native.prevent>
          <el-form-item label="本次审核结果" class="radio" prop="cutFlag" >
            <el-radio v-model="info.cutFlag" label="0">通过</el-radio>
            <el-radio v-model="info.cutFlag" label="1">不通过</el-radio>
          </el-form-item>
          <el-form-item
            :rules="[
              { required: true, message: '请输入审核信息', trigger: 'blur' },
              { type:'string',message: '请输入20以内文字',trigger: ['blur', 'change']}
            ]"
            label="审核备注"
            prop="importDesc"
          >
            <el-input v-model="info.importDesc" maxlength="20" clearable placeholder="请输入"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name" >申请信息</div>
        <div class="flex-buttons">
          <el-button v-if="!adjustmentType" @click="linkTo">返回</el-button>
        </div>
        <el-row :gutter="20" class="short">
          <el-col :span="8">
            <p><span>申请单号:</span>{{ data.applyNum }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>申请单状态:</span>{{ data.applyStatus==='0'?'待审核':'已审核' }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>申请时间:</span>{{ data.createDate }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>申请人:</span>{{ data.createBy }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>调整原因说明:</span>{{ data.applyDesc }}</p>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">会员积分调整信息</div>
        <el-table :data="tableData" :row-class-name="checkColumn" height="300" style="width: 100%" >
          <el-table-column type="index" width="50" label="序号"/>
          <el-table-column prop="memberName" label="会员姓名" />
          <el-table-column prop="phone" label="会员手机号"/>
          <!-- <el-table-column prop="integral" label="当前积分值"/> -->
          <el-table-column prop="changeType" label="积分调整类型">
            <template slot-scope="scope">
              {{ scope.row.changeType==='integral_add'?'积分增加':'积分减少' }}
            </template>
          </el-table-column>
          <el-table-column prop="changeIntegral" label="调整积分值">
            <template slot-scope="scope">
              <span v-if="scope.row.changeType==='integral_minus'" class="red">
                {{ '-'+scope.row.changeIntegral }}
              </span>
              <span v-else>{{ '+' + scope.row.changeIntegral }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作状态" >
            <template slot-scope="scope">
              {{ scope.row.operateFlag==='0'?'操作成功':scope.row.operateFlag==='1'?'操作失败':'-' }}
            </template>
          </el-table-column>
          <el-table-column prop="importDesc" label="反馈信息" />
        </el-table>
      </div>
    </div>
    <div v-if="isAdjustment ||data.applyStatus==='1'" class="app-container shadow">
      <div class="content">
        <div class="class-name">审核信息</div>
        <el-row :gutter="20" class="short">
          <el-col :span="8">
            <p><span>审核时间:</span>{{ data.approveDate }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>审核人:</span>{{ data.approveBy }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>审核结果:</span>{{ data.applyResult==='0'?'审核通过':'审核未通过' }}</p>
          </el-col>
          <el-col :span="8">
            <p><span>审核说明:</span>
              {{ data.applyComment }}
            </p>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { applyDetailList, deleteApplyDetail, postApplyApproved } from '@/api/accumulate'
export default {
  name: 'AuditInfo',
  components: {
    breadcrumb
  },
  data() {
    return {
      tableData: [
      ],
      info: {
        cutFlag: '0',
        info: ''
      }
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    },
    adjustmentType() {
      return this.$store.getters.editable
    },
    isAdjustment() {
      return this.$store.getters.isAdjustment
    }
  },
  created() {
    console.log(this.isAdjustment)
    applyDetailList({ applyId: this.data.id }).then(res => {
      this.tableData = res.result
    })
  },
  methods: {
    checkColumn({ row, index }) {
      if (row.operateFlag === '1') {
        return 'errorBackground'
      }
    },
    submitApply() {
      const param = {
        'applyComment': this.info.importDesc,
        'applyDesc': this.data.applyDesc,
        'applyNum': this.data.applyNum,
        'applyResult': this.info.cutFlag,
        'approveBy': this.data.approveBy,
        'id': this.data.id
      }
      this.$refs['infoForm'].validate(valid => {
        if (valid) {
          postApplyApproved(param).then(res => {
            if (res.resultStatus !== 'FAILED') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.$router.push('./')
            }
          })
        }
      })
    },
    deleteItem(data, index) {
      deleteApplyDetail({ id: data.id }).then(res => {
        this.tableData.splice(index, 1)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    linkTo() {
      this.$router.push('./')
    }
  }
}
</script>

<style lang="scss" scoped>
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
