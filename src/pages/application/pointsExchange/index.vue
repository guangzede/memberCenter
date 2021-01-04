<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">应用统一积分兑换规则</div>
        <el-row>
          <el-col :span="2">
            <span style="visibility: hidden">1</span>
          </el-col>
          <el-col :span="18">
            <el-table :data="changeTableData" style="width: 100%" stripe>
              <el-table-column prop="brand" label="品牌" ><template>{{ "HQ" }}</template></el-table-column>
              <el-table-column prop="accountName" label="应用账户名称 "/>
              <el-table-column label="积分与金额兑换比例" width="400px">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="11">
                      <el-input-number :controls="false" v-model="scope.row.ratio" :disabled="!editFlag" style="width: 100%" precision="0" min="1" max="999999" clearable placeholder="请输入" />
                    </el-col>
                    <el-col :span="2">
                      ：
                    </el-col>
                    <el-col :span="11">
                      <el-input-number :controls="false" disabled value="1" style="width: 100%" maxlength="6" clearable placeholder="请输入" />
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="4" style="margin: auto">
            <el-button v-if="editFlag" type="transparent" @click="cancel()">返回</el-button>
            <el-button type="primary" @click="clickEdit()">{{ editFlag?'保存':'编辑' }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getIntegralRatio, saveIntegralRatio } from '@/api/application'
export default {
  name: 'PointsExchange',
  data() {
    return {
      changeTableData: [],
      editFlag: false
    }
  },
  computed: {
    flush() {
      return this.$store.getters.flush
    }
  },
  watch: {
  },
  mounted() {
    this.getChangeData()
  },
  methods: {
    getChangeData() {
      getIntegralRatio().then(res => {
        this.changeTableData = res.result
      })
    },
    clickEdit() {
      if (this.editFlag) {
        this.save()
      } else {
        this.editFlag = !this.editFlag
      }
    },
    cancel() {
      this.editFlag = !this.editFlag
      this.getChangeData()
    },
    save() {
      this.changeTableData.forEach(data => {
        data.params = null
        data.applyRange = null
      })
      saveIntegralRatio(this.changeTableData).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          this.editFlag = !this.editFlag
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
