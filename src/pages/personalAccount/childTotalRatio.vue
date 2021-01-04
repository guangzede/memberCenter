<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">子账户与总账户转换比例</div>
        <el-row>
          <el-col :span="2">
            <span style="visibility: hidden">1</span>
          </el-col>
          <el-col :span="18">
            <el-table :data="changeTableData" style="width: 100%" stripe>
              <el-table-column prop="brand" label="品牌" />
              <el-table-column prop="clientName" label="子账户名称 "/>
              <el-table-column label="子账户与总账户积分转换比例" width="400px">
                <template slot-scope="scope">
                  <el-select :disabled="!editFlag" v-model="scope.row.ratio" style="width: 200px">
                    <el-option
                      v-for="item in ratioList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
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
import { getChildTotalAccountRatio, saveChildTotalAccountRatio } from '@/api/personalAccount'
export default {
  name: 'ChildTotalRatio',
  data() {
    return {
      changeTableData: [],
      editFlag: false,
      ratioList: [
        { code: 1, name: '1 ：1' },
        { code: 2, name: '2 ：1' },
        { code: 5, name: '5 ：1' },
        { code: 10, name: '10 ：1' },
        { code: 20, name: '20 ：1' },
        { code: 50, name: '50 ：1' },
        { code: 100, name: '100 ：1' }
      ]
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
      getChildTotalAccountRatio().then(res => {
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
      })
      saveChildTotalAccountRatio(this.changeTableData).then(res => {
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
