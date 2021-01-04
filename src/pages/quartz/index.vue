<template>
  <div>
    <div class="app-container">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions('changeSearchForm')">清空</el-button>
          <el-button type="primary" @click="getChangeData(1)">查询</el-button>
        </div>
        <el-form
          ref="searchForm"
          :model="changeSearchForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <el-row :gutter="20">
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="任务名称：">
                <el-input v-model="changeSearchForm.jobName" maxlength="100" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="任务分组：">
                <el-input v-model="changeSearchForm.jobGroup" maxlength="100" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="任务类名：">
                <el-input v-model="changeSearchForm.jobClassName" maxlength="100" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">定时任务配置表</div>
        <div class="flex-buttons">
          <el-button
            type="primary"
            @click="clickAdd"
          >新增定时任务</el-button>
        </div>
        <el-table :data="changeTableData" style="width: 100%" stripe>
          <el-table-column prop="jobName" label="任务名称" />
          <el-table-column prop="jobGroup" label="任务所在组" />
          <el-table-column prop="jobClassName" label="任务类名" />
          <el-table-column prop="triggerName" label="触发器名称"/>
          <el-table-column prop="triggerGroup" label="触发器所在组"/>
          <el-table-column prop="param" label="参数"/>
          <el-table-column prop="triggerState" label="状态"/>
          <el-table-column prop="cronExpression" label="CRON表达式"/>
          <el-table-column prop="timeZoneId" label="时区" />
          <el-table-column label="操作" width="190px">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="clickUpdate(scope.row)"
              >修改</el-button>
              <el-divider direction="vertical" />
              <el-popconfirm title="点击确定后将删除此任务" @onConfirm="deletejob(scope.row)">
                <el-button slot="reference" type="text">删除</el-button>
              </el-popconfirm>
              <el-divider direction="vertical" />
              <el-popconfirm title="点击确定后将恢复执行此任务" @onConfirm="resumejob(scope.row)">
                <el-button slot="reference" type="text">恢复</el-button>
              </el-popconfirm>
              <el-divider direction="vertical" />
              <el-popconfirm title="点击确定后将暂停执行此任务" @onConfirm="pausejob(scope.row)">
                <el-button slot="reference" type="text">暂停</el-button>
              </el-popconfirm>
              <!-- <el-button :disabled="scope.row.tacticsFlag==1" type="text" @click="updataFlag(scope.row,'1')">禁用</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <span>{{ total }}条记录，共{{ totalPage }}页</span>
          <el-pagination
            :total="total"
            :current-page="pageNo"
            background
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="currentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="openAdd" :close-on-click-modal="false" title="新增任务" width="20%" append-to-body @close="cancelAdd">
      <el-form ref="addForm" :model="addParam" :rules="rules">
        <el-form-item
          :rules="[{ required: true, trigger: 'blur',message:'请输入任务名称' }]"
          label="任务名称"
          prop="jobName">
          <el-input
            :style="{width: '100%'}"
            :autosize="{minRows: 1, maxRows: 2}"
            :disabled="!insertFlag"
            v-model="addParam.jobName"
            type="textarea"
            maxlength="190"
            placeholder="请输入任务名称"/>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'blur',message:'请输入任务类名' }]"
          label="任务类名"
          prop="jobClassName">
          <el-input
            :style="{width: '100%'}"
            :autosize="{minRows: 1, maxRows: 2}"
            :disabled="!insertFlag"
            v-model="addParam.jobClassName"
            type="textarea"
            maxlength="190"
            placeholder="请输入任务类名"/>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'blur',message:'请输入任务分组' }]"
          label="任务分组"
          prop="jobGroup">
          <el-input
            :style="{width: '100%'}"
            :autosize="{minRows: 1, maxRows: 1}"
            :disabled="!insertFlag"
            v-model="addParam.jobGroup"
            type="textarea"
            maxlength="190"
            placeholder="请输入任务分组"/>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'blur',message:'请输入CRON表达式' }]"
          label="CRON表达式"
          prop="cronExpression">
          <el-input
            :style="{width: '100%'}"
            :autosize="{minRows: 2, maxRows: 4}"
            v-model="addParam.cronExpression"
            type="textarea"
            maxlength="190"
            placeholder="请输入CRON表达式"/>
        </el-form-item>
        <el-form-item
          label="参数（JSON格式）"
          prop="param">
          <el-input
            :style="{width: '100%'}"
            :autosize="{minRows: 2, maxRows: 4}"
            v-model="addParam.param"
            type="textarea"
            maxlength="190"
            placeholder="请输入参数"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryjob, pausejob, resumejob, addjob, deletejob } from '@/api/quartz'
export default {
  name: 'Quartz',
  data() {
    return {
      insertFlag: false,
      openAdd: false,
      changeTableData: [],
      changeSearchForm: {
        jobName: '',
        jobGroup: '',
        jobClassName: ''
      },
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0,
      addParam: {
        jobName: '',
        jobClassName: '',
        jobGroup: '',
        cronExpression: '',
        param: ''
      }
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
    this.currentChange(1)
  },
  methods: {
    currentChange(num) {
      this.pageNo = num
      this.getChangeData(num)
    },
    getChangeData(pageNo) {
      const param = {
        pageNum: pageNo || this.pageNo,
        pageSize: this.pageSize,
        jobName: this.changeSearchForm.jobName,
        jobGroup: this.changeSearchForm.jobGroup,
        jobClassName: this.changeSearchForm.jobClassName
      }
      queryjob(param).then(res => {
        this.total = res.result.JobAndTrigger.total
        this.totalPage = res.result.JobAndTrigger.pages
        this.changeTableData = res.result.JobAndTrigger.list
        this.pageNo = res.result.JobAndTrigger.pageNum
      })
    },
    clickAdd() {
      this.openAdd = true
      this.insertFlag = true
    },
    clickUpdate(row) {
      this.openAdd = true
      this.insertFlag = false
      this.addParam.jobName = row.jobName
      this.addParam.jobClassName = row.jobClassName
      this.addParam.jobGroup = row.jobGroup
      this.addParam.cronExpression = row.cronExpression
      this.addParam.param = row.param
    },
    cancelAdd() {
      this.openAdd = false
      this.addParam = {
        jobName: '',
        jobClassName: '',
        jobGroup: '',
        cronExpression: '',
        param: ''
      }
    },
    save() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.insertFlag) {
            addjob(this.addParam).then(res => {
              if (res.resultStatus === 'SUCCEED') {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                this.openAdd = false
                this.getChangeData()
              }
            })
          } else {
            const param = {
              jobName: this.addParam.jobName,
              jobGroup: this.addParam.jobGroup
            }
            deletejob(param).then(res => {
              if (res.resultStatus === 'SUCCEED') {
                addjob(this.addParam).then(res => {
                  if (res.resultStatus === 'SUCCEED') {
                    this.$notify({
                      title: '成功',
                      message: '保存成功',
                      type: 'success'
                    })
                    this.openAdd = false
                    this.getChangeData()
                  }
                })
              }
            })
            // reschedulejob(this.addParam).then(res => {
            //   if (res.resultStatus === 'SUCCEED') {
            //     this.$notify({
            //       title: '成功',
            //       message: '修改成功',
            //       type: 'success'
            //     })
            //     this.openAdd = false
            //     this.getChangeData()
            //   }
            // })
          }
        }
      })
    },
    clearOptions() {
      this.changeSearchForm = {
        jobName: '',
        jobGroup: '',
        jobClassName: ''
      }
    },
    pausejob(row) {
      const param = {
        jobName: row.jobName,
        jobGroup: row.jobGroup
      }
      pausejob(param).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          this.$notify({
            title: '成功',
            message: '暂停成功',
            type: 'success'
          })
          this.getChangeData()
        }
      })
    },
    resumejob(row) {
      const param = {
        jobName: row.jobName,
        jobGroup: row.jobGroup
      }
      resumejob(param).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          this.$notify({
            title: '成功',
            message: '暂停成功',
            type: 'success'
          })
          this.getChangeData()
        }
      })
    },
    deletejob(row) {
      const param = {
        jobName: row.jobName,
        jobGroup: row.jobGroup
      }
      deletejob(param).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.getChangeData()
        }
      })
    }
  }
}
</script>
