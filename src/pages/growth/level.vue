<template>
  <div>
    <router-view v-if="this.$route.path !=='/growth/level'" :editable="editable" class="sibling"/>
    <div class="sibling">
      <div class="background">
        <breadcrumb/>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">成长等级信息</div>
          <div class="flex-buttons">
            <el-button @click="linkTo(false,addForm,'levelAdd')">新增</el-button>
          </div>
          <div class="relative">
            <el-table :data="tableData" fit stripe>
              <el-table-column prop="levelName" label="等级名称"><template slot-scope="scope">{{ scope.row.levelName?scope.row.levelName:'-' }}</template></el-table-column>
              <el-table-column label="等级图片" width="100px" class="image">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.levelPicture"
                    :src="scope.row.levelPicture"
                    class="avatar"
                    @click="uploadImg(scope.row)"
                  >
                  <i class="el-icon-plus avatar-uploader-icon" @click="uploadImg(scope.row)"/>
                </template>
              </el-table-column>
              <el-table-column label="升级挡" prop="levelLow"><template slot-scope="scope">{{ scope.row.levelLow+''?scope.row.levelLow:'-' }}</template></el-table-column>
              <template v-for="(item,index) in count">
                <el-table-column :key="item[index]" :label="index+1+'星'">
                  <template slot="header">
                    <img v-for="i in index+1" :key="i" :src="starImgUrl" class="starImg" >
                  </template>
                  <template slot-scope="scope">{{ scope.row.memberLevelInfos[index] ? (scope.row.memberLevelInfos[index].levelLow + '' ? scope.row.memberLevelInfos[index].levelLow:'-') : '-' }}</template>
                </el-table-column>
              </template>
              <el-table-column :key="'等级上限'" label="等级上限" prop="levelUp"><template slot-scope="scope">{{ scope.row.levelUp+''?scope.row.levelUp:'-' }}</template></el-table-column>
              <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                  <el-button type="text" @click="linkTo(true,scope.row,'levelDetail')">详情</el-button>
                  <el-button type="text" @click="linkTo(false,scope.row,'levelEdit')">编辑</el-button>
                  <el-popconfirm title="确定启用操作" @onConfirm="updateStatus(scope.row.id,1)">
                    <el-button slot="reference" :disabled="scope.row.status == 1" type="text">启用</el-button>
                  </el-popconfirm>
                  <el-popconfirm title="确定禁用操作" @onConfirm="updateStatus(scope.row.id,0)">
                    <el-button slot="reference" :disabled="scope.row.status == 0" type="text">禁用</el-button>
                  </el-popconfirm>
                  <el-button slot="reference" :style="{ display: scope.row.status == 0 ? '' : 'none' }" type="text" @click="clickDeleteOr(scope.row.id)">删除</el-button>
                  <el-button :style="{ display: scope.row.status == 1 ? '' : 'none' }" type="text" @click="relatedInterests(scope.row)">关联权益</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="totalPage>0" class="table-footer">
              <span>{{ total }}条记录，共{{ totalPage }}页</span>
              <el-pagination
                :page-count="totalPage"
                :current-page="pageNo"
                background
                hide-on-single-page
                layout="prev, pager, next"
                @current-change="currentChange"/>
            </div>
          </div>
        </div>
      </div>
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
          <i class="el-icon-upload"/>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getLevelInfo, deleteLevel, updateStatus, getCount } from '@/api/growth'
import breadcrumb from '@/components/breadcrumb'
import { getToken } from '@/utils/auth'

export default {
  name: 'Level',
  components: {
    breadcrumb
  },
  data() {
    return {
      tableData: [], // 表单数据
      dialogUpload: false, // 等级图片
      editable: false,
      addForm: {
        levelName: '',
        levelType: '2',
        levelLow: undefined,
        levelUp: undefined,
        starRating: [],
        status: '1'
      }, // 编辑数据
      total: 0,
      pageNo: 1,
      totalPage: 0,
      uploadData: {},
      uploadHead: {},
      changeRow: {},
      count: 0, // 表格几颗星最大值
      starImgUrl: require('../../assets/star.png')
    }
  },
  computed: {
    actionUrl: () => {
      const basePath =
        process.env.NODE_ENV === 'development' ? '/api' : '/member-admin'
      return basePath + '/level/uploadPicture'
    }
  },
  mounted() {
    this.init()
    this.getCount()
  },
  methods: {
    starChange(val) { // 星级范围切换
      const dom = this.$refs['select_icon'].$el
      const input__prefix_custom = document.getElementById('el-input__prefix_custom')
      input__prefix_custom && dom.children[0].removeChild(input__prefix_custom)
      if (val === '') {
        document.getElementById('select_icon').style.color = '#000'
      } else {
        document.getElementById('select_icon').style.color = 'transparent'
        let icon = ''
        for (let i = 0; i < val; i++) {
          icon += `<i class="el-input__icon el-icon-star-on colorYellow"></i>`
        }
        const svgDom = document.createElement('span')
        svgDom.setAttribute('class', 'el-input__prefix')
        svgDom.setAttribute('id', 'el-input__prefix_custom')
        svgDom.innerHTML = `<span class="el-input__prefix-inner">${icon}</span>`
        dom.children[0].appendChild(svgDom)
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.init()
        })
        .catch(_ => {
        })
    },
    currentChange(num) {
      this.pageNo = num
      this.init()
    },
    getCount() {
      this.count = 0
      getCount().then(res => {
        this.count = res.result
      })
    },
    init() {
      const params = {
        pageNo: this.pageNo,
        pageSize: 10
      }
      getLevelInfo(params).then(res => {
        this.$store.commit('postData', { ...res.result })
        this.pageNo = res.pageNo
        this.tableData = res.result
        this.total = res.totalNum
        this.totalPage = res.totalPage
      })
    },
    updateStatus(id, status) {
      const parmse = { 'id': id, 'status': status }
      updateStatus(parmse).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          this.$message({
            message: status === 1 ? '启用成功' : '禁用成功',
            type: 'success'
          })
          this.init()
        }
      })
    },
    relatedInterests() {
      this.$message({
        message: '此功能暂未上线',
        type: 'success'
      })
    },
    clickDeleteOr(id) {
      this.$confirm('是否确认删除？')
        .then(_ => {
          deleteLevel(id).then(res => {
            if (res.resultStatus === 'SUCCEED') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.init()
            }
          })
        })
        .catch(_ => {
        })
    },
    uploadImg(data) {
      this.changeRow = data
      this.uploadData = { id: data.id }
      this.uploadHead = { token: getToken() }
      this.dialogUpload = true
    },
    uploadSuccess(response, file, fileList) {
      this.changeRow.levelPicture = response.result.levelPicture
      this.dialogUpload = false
      this.init()
    },
    beforeAvatarUpload(file) {
      const isImage =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('上传图片只能是 JPG,PNG,GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    linkTo(type, row, path) {
      if (row.memberLevelInfos) {
        row.starRating = row.memberLevelInfos.map(item => {
          return {
            levelLow: item.levelLow,
            levelUp: item.levelUp,
            levelName: item.levelName
          }
        })
      }
      this.$store.commit('postData', row)
      this.$store.commit('editable', type)
      this.$router.push(`/growth/level/${path}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    min-height: calc(100vh - 100px);
  }
  .sibling /deep/ .el-table_1_column_2  .cell{
    height: 23px;
    position: relative;
  }

  .relative {
    position: relative;

    /*.el-table {*/
    /*  float: left;*/
    /*  width: calc(100% - 150px);*/
    /*}*/

    .btns {
      position: absolute;
      bottom: 0;
      right: 0px;
      z-index: 3;
      min-width: 130px;
      padding-left: 20px;
      float: right;
    }

    &:after {
      clear: both;
      display: block;
      content: "";
    }
  }

  .el-upload.el-upload--text {
    position: relative;
  }

  > > > .el-table .cell {
    .el-icon-plus.avatar-uploader-icon {
      cursor: pointer;
      position: absolute;
      font-size: 16px;
      z-index: 3;
      top: 50%;
      left: 50%;
      display: flex;
      transform: translateX(-50%) translateY(-50%);
    }

    img {
      cursor: pointer;
      width: 100%;
      display: block;
    }
  }
  .el-image__error {
    display: none;
  }

  .class-name {
    margin-bottom: 20px;
  }

  > > > .el-image__error {
    display: none;
  }
  >>> .starImg{
    width: 15px !important;
    height: 15px !important;
    margin-right: 3px !important;
    display: inline !important;
  }
  .noLabel >>> .el-form-item__content {
    margin-left: 0 !important;
    width: 100% !important;
  }
  >>> .colorYellow{
    color: #fad403;
    width: 16px;
    font-size: 16px;
  }
  .el-select-dropdown__item >>> .colorYellow{
    font-size: 18px;
  }
  >>> #el-input__prefix_custom .el-input__prefix-inner{
    padding-left: 7px;
  }
  >>> .add-form-dialog .el-dialog{
    width: 700px;
  }
  >>> .add-form{
    text-align: left;
  }
</style>
