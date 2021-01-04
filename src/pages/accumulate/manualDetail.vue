<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div >
          <div class="class-name" >申请信息</div>
          <div class="flex-buttons">
            <el-button type="transparent" @click="linkTo">返回</el-button>
          </div>
          <el-form ref="searchForm" :model="info" type="flex" justify="start" label-width="100px" label-position="left" @submit.native.prevent>
            <el-form-item label="本次审核结果" class="radio" prop="mobile" >
              <el-radio v-model="info.cutFlag" label="0">通过</el-radio>
              <el-radio v-model="info.cutFlag" label="1">不通过</el-radio>
            </el-form-item>
            <el-form-item label="审核备注">
              <el-input v-model="info.info" clearable placeholder="请输入"/>
            </el-form-item>
          </el-form>
        </div>

        <div>
          <div class="class-name" >申请信息</div>
          <div class="flex-buttons">
            <el-button @click="linkTo">返回</el-button>
          </div>
          <el-row :gutter="20" class="short">
            <el-col :span="8">
              <div class="keyvalue">
                <div class="key">申请单号
                </div>
                <div class="value">{{ data.aid }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="keyvalue">
                <div class="key">申请单状态</div>
                <div class="value">{{ data.mobile }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="keyvalue">
                <div class="key">申请时间</div>
                <div class="value">{{ data.nickName }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="keyvalue">
                <div class="key">申请人</div>
                <div class="value">{{ data.nickName }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="keyvalue">
                <div class="key">调整原因说明</div>
                <div class="value">{{ data.nickName }}</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div>
          <div class="class-name">会员积分调整信息</div>
          <el-table :data="tableData" height="300" style="width: 100%" stripe>
            <el-table-column type="index" width="50" label="序号"/>
            <el-table-column prop="createDate" label="会员姓名" />
            <el-table-column prop="tacticsCode" label="会员手机号"/>
            <el-table-column prop="tacticsCode" label="当前积分值"/>
            <el-table-column prop="tacticsCode" label="积分调整类型"/>
            <el-table-column prop="tacticsCode" label="调整积分值"/>
          </el-table>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditInfo',
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
    }
  },
  created() {
    this.tableData = [
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' },
      { tacticsCode: 'tacticsCode' }
    ]
  },
  methods: {
    deleteItem() {

    },
    submit() {

    },
    linkTo() {
      this.$router.push('/accumulate/adjustmentAudit')
    }
  }
}
</script>
