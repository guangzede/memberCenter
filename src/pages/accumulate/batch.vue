<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">积分调整批量导入
          <el-upload
            ref="upload"
            :on-change="importExcel"
            :show-file-list="false"
            :file-list="fileList"
            :auto-upload="false"
            action
            class="upload-demo"
            @submit="submit"
          >
            <el-button slot="trigger" type="transparent" icon="el-icon-upload2">导入</el-button>
            <el-button type="transparent" icon="el-icon-download" @click="exportFile">下载模板</el-button>
          </el-upload>
        </div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="$router.push('./')">返回</el-button>
        </div>
        <template v-if="dialog">

          <div class="class-name">导入信息</div>
          <el-form ref="ruleForm" :model="postData" label-width="100px" label-position="left" @submit.native.prevent >
            <p>数据导入合计:{{ totalData }}条</p>
            <p>符合条件数据:{{ qualified }}条</p>
            <p>不符合条件数据:{{ unqualified }}条</p>
            <el-form-item
              :rules="[
                { required: true, message: '请输入原因说明  ', trigger: 'blur' },
                { type:'string',message: '请输入原因说明',trigger: ['blur', 'change']}
              ]"
              label="调整原因说明"
              prop="explain">
              <el-input v-model="postData.explain" style="width:400px" type="textarea" resize="none" maxlength="30" autocomplete="off" placeholder="请输入30个以内文字"/>
              <el-button @click="submit">提交</el-button>
            </el-form-item>
          </el-form>

        </template>
      </div>
    </div>

    <div v-if="dialog" class="app-container shadow">
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="class-name">正常数据</div>
            <el-table :data="postData.list" stripe height="400px" >
              <el-table-column prop="memberName" label="姓名" />
              <el-table-column label="积分增减">
                <template slot-scope="scope">
                  {{ scope.row.changeType==='integral_add'?'+'+scope.row.changeIntegral:'-'+scope.row.changeIntegral }}
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机号" />
              <el-table-column label="描述" >
                <template slot-scope="scope">
                  <span :title="scope.row.comment">{{ scope.row.comment }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <div class="class-name">异常数据</div>
            <el-table :data="postData.error" stripe height="400px">
              <el-table-column prop="__rowNum__" label="目标行数">
                <template slot-scope="scope">{{ 1+scope.row.__rowNum__ }}</template>
              </el-table-column>
              <el-table-column prop="姓名" label="姓名" />
              <el-table-column prop="积分增减" label="积分增减"/>
              <el-table-column prop="手机号" label="手机号" />
              <el-table-column label="描述" prop="描述" />
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>

</template>

<script>
import XLSX from 'xlsx'
import { Loading } from 'element-ui'
import { postApplyInfo } from '@/api/accumulate'
import breadcrumb from '@/components/breadcrumb'
let loading
export default {
  name: 'AuditInfo',
  components: {
    breadcrumb
  },
  data() {
    return {
      info: {
        cutFlag: '0',
        info: ''
      },
      postData: {
        explain: '',
        data: [],
        list: [],
        error: []
      },
      fileList: [],
      dialog: false,
      excelData: [],
      totalData: 0,
      qualified: 0,
      unqualified: 0,
      data1: {},
      data2: {}
    }
  },
  mounted() {
    this.postData = {
      explain: '',
      data: [],
      list: [],
      error: []
    }
    window.list = this.postData.error
  },
  methods: {
    exportFile() {
      var table = []
      table.push({
        A: '手机号',
        B: '积分增减',
        C: '姓名',
        D: '描述'
      }, {
        A: 13888888888,
        B: +12,
        C: '张三',
        D: '详情描述1'
      }, {
        A: 13888888888,
        B: 122,
        C: '王五',
        D: '详情描述1'
      }, {
        A: 13888888888,
        B: -200,
        C: '李四',
        D: '详情描述'
      })
      var wb = XLSX.utils.book_new()
      var ws = XLSX.utils.json_to_sheet(table, { header: ['A', 'B', 'C'], skipHeader: true })
      ws['!cols'] = [
        { width: 20 },
        { width: 20 },
        { width: 20 }
      ]
      XLSX.utils.book_append_sheet(wb, ws, 'file')
      XLSX.writeFile(wb, '积分批量导入模板' + '.xlsx')
    },
    checkData(data) {
      this.totalData = data.length
      for (const i of data) {
        try {
          if (
            !i['手机号'].toString().match(/^1(3|4|5|6|7|8|9)\d{9}$/) ||
          !i['积分增减'].toString().match(/^-?[1-9]\d*$/) ||
          Math.abs(i['积分增减']) > 99999999999
          ) {
            this.unqualified++
            this.postData.error.push(i)
            console.log(this.postData.error)
            continue
          }
          this.postData.data.push(i)
          this.postData.list.push({
            'changeType': i['积分增减'] > 0 ? 'integral_add' : 'integral_minus',
            'memberName': i['姓名'],
            'comment': i['描述'],
            'changeIntegral': Math.abs(i['积分增减']),
            'phone': i['手机号']
          })
          const phont = !!i['手机号'].toString().match(/^1(3|4|5|6|7|8|9)\d{9}$/)
          const jj = !!i['积分增减'].toString().match(/^-?[1-9]\d*$/)
          const name = !!i['姓名']
          const comment = !!i['描述']
          console.log(phont + '  ' + jj + '   ' + name + '  ' + comment)
          this.qualified++
        } catch (error) {
          this.postData.error.push(i)
          this.unqualified++
        }
      }
      this.data2 = new Date()
      const total = (this.data2.getTime() - this.data1.getTime())
      console.log(`文件解析时长为${total}ms`)
      loading.close()
      this.dialog = true
    },
    importExcel(file) {
      loading = Loading.service({
        lock: true,
        text: '正在解析数据请稍后...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const isFitSize = file.size / 1024 < 500
      if (!isFitSize) {
        this.$message.error('上传文件不能超过 500KB!')
        loading.close()
        return isFitSize
      }
      const fileType = file.name.endsWith('.xlsx')
      if (!fileType) {
        this.$message('格式错误！请核对模板格式。')
        loading.close()
        return
      }

      this.data1 = new Date()
      this.postData = {
        explain: '',
        data: [],
        list: [],
        error: []
      }
      this.totalData = 0
      this.qualified = 0
      this.unqualified = 0

      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson
          this.excelData = this.xlsxJson[0].sheet
          this.checkData(this.excelData)
        }
      })
    },

    file2Xce(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        FileReader.prototype.readAsBinaryString = function(fileData) {
          var binary = ''
          var pt = this
          var reader = new FileReader()
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result)
            var length = bytes.byteLength
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            pt.content = binary
            pt.onload(pt)
          }
          reader.readAsArrayBuffer(fileData)
        }
        reader.onload = function(e) {
          const data = e.content
          // e.
          this.wb = XLSX.read(data, {
            type: 'binary'
          })
          const result = []
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    submit() {
      const param = {
        'applyDesc': this.postData.explain,
        'detailInfos': this.postData.list
      }
      if (this.postData.list.length < 1) {
        this.$message({
          message: '数据无效请核实后再导入！',
          type: 'error'
        })
        return
      }
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          postApplyInfo(param).then(res => {
            this.$message({
              message: '导入成功',
              type: 'success'
            })
            this.dialog = false
            this.$router.push(`./`)
          })
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table div.cell {
    text-align: center;
    padding: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: keep-all;
}
.keyvalue{
  .key{
    width: 8em;
  }
  .value{
    box-shadow: none;
    text-align: left;
    width: calc(100% - 8em);
  }
}
.content{
  text-align: right;
}
.upload-demo{
  display: inline;
  padding-left: 4em;
}
.el-textarea~button{
  float: left;
  margin-left: 20px;
}
p{
    font-size: 12px;
    line-height: 2em;
    margin: 10px 0;
    font-weight: normal;
    color: #2c3e50;
    text-align: left;
}
.el-upload + button {
    margin-left: 20px;
}
</style>
