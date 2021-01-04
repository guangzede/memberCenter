<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <el-row style="height: calc(100vh - 60px - 35px);overflow:hidden;">
      <el-col :span="4" class="tree">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :highlight-current="true"
          :expand-on-click-node="false"
          class="flow-tree"
          @node-click="handleNodeClick"/>
      </el-col>
      <el-col :span="20">
        <div class="app-container shadow">
          <div class="content">
            <div class="flex-buttons">
              <el-button v-if="hierarchy!=1" :style="{ display: visibleEdit }" type="primary" @click="editType()">编辑</el-button>
              <el-button v-if="hierarchy!=1" :style="{ display: visibleSave }" type="primary" @click="saveType()">保存</el-button>
            </div>
            <el-form ref="searchForm" :model="searchForm" :rules="searchRules" style="width:50%;" type="flex" justify="start" label-width="100px" label-position="left" @submit.native.prevent>
              <el-row :gutter="20">
                <el-col :lg="8" :md="12">
                  <el-form-item label="名称" prop="honorName">
                    <el-input v-model="searchForm.honorName" :maxlength="15" :disabled="editTop" clearable placeholder="请输入"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="app-container shadow">
          <div class="content">
            <div class="class-name">荣誉类型明细</div>
            <div class="flex-buttons">
              <el-button v-if="hierarchy!=3 || (hierarchy==3 && tableData.length==0)" @click="clickAddor()">新增</el-button>
              <el-button v-if="hierarchy==3 && tableData.length>0" @click="clickAddor()">编辑</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" max-height="300" stripe >
              <el-table-column label="荣誉项名称" ><template slot-scope="scope">{{ scope.row.honorName?scope.row.honorName:'-' }}</template></el-table-column>
              <el-table-column v-if="hierarchy!=3" label="荣誉项编码" ><template slot-scope="scope">{{ scope.row.honorCode?scope.row.honorCode:'-' }}</template></el-table-column>
              <template v-if="hierarchy===2 || hierarchy===3">
                <el-table-column label="未解锁图片">
                  <template slot-scope="scope"><img
                    v-if="scope.row.honorImgUrl"
                    :src="scope.row.honorImgUrl"
                    style="max-width:100%;
                      max-height: 100px;
                      text-align: center;"
                    class="avatar"
                ></template></el-table-column>
              </template>
              <template v-if="hierarchy===2 || hierarchy===3">
                <el-table-column label="已解锁图片">
                  <template slot-scope="scope">
                    <img
                      v-if="scope.row.unlockHonorImgUrl"
                      :src="scope.row.unlockHonorImgUrl"
                      style="max-width:100%;
                        max-height: 100px;
                        text-align: center;"
                      class="avatar">
                  </template>
                </el-table-column>
              </template>
              <el-table-column v-if="hierarchy===3" label="数量达到"><template slot-scope="scope">{{ scope.row.rangeLow+''?scope.row.rangeLow:'-' }}</template></el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="描述"><template slot-scope="scope">{{ scope.row.honorDesc?scope.row.honorDesc:'-' }}</template></el-table-column>
              <el-table-column label="排序值"><template slot-scope="scope">{{ scope.row.sortValue?scope.row.sortValue:'-' }}</template></el-table-column>
              <el-table-column label="操作" width="190px">
                <template slot-scope="scope">
                  <el-divider v-if="hierarchy!==3" direction="vertical" />
                  <el-button v-if="hierarchy!==3" type="text" @click="clickEditor(scope.row)">编辑</el-button>
                  <el-divider direction="vertical" />
                  <el-popconfirm title="点击确定后将启用本条策略" @onConfirm="editStatus(scope.row,'0')">
                    <el-button slot="reference" :disabled="scope.row.status === '0'" type="text">启用</el-button>
                  </el-popconfirm>
                  <el-divider direction="vertical" />
                  <el-popconfirm title="点击确定后将禁用本条策略" @onConfirm="editStatus(scope.row,'1')">
                    <el-button slot="reference" :disabled="scope.row.status === '1'" type="text">禁用</el-button>
                  </el-popconfirm>
                  <el-divider direction="vertical" />
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
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogEditor" :before-close="handleClose" :title="titleName" width="500px">
      <el-form ref="editorForm" :model="editorForm" :rules="formRules" :inline="true" label-width="150px" label-position="left" @submit.native.prevent>
        <el-form-item prop="honorType" label="上级名称">
          <el-input v-model="editorForm.honorType" :disabled="true" clearable/>
        </el-form-item>
        <el-form-item prop="honorCode" label="荣誉项编码">
          <el-input v-model="editorForm.honorCode" :maxlength="30" clearable/>
        </el-form-item>
        <el-form-item prop="honorName" label="荣誉项名称">
          <el-input v-model="editorForm.honorName" :maxlength="15" clearable/>
        </el-form-item>
        <el-form-item v-if="hierarchy===2" label="未解锁图片" prop="honorImgUrl">
          <el-input v-if="false" v-model="editorForm.honorImgUrl" clearable/>
          <img
            :src="editorForm.honorImgUrl"
            class="avatar"
            style="width: 60px; height: 60px"
          >
          <el-button
            size="mini"
            type="text"
            @click="uploadImg(-1, true)"
          >上传</el-button>
        </el-form-item>
        <el-form-item v-if="hierarchy===2" label="已解锁图片" prop="unlockHonorImgUrl">
          <el-input v-if="false" v-model="editorForm.unlockHonorImgUrl" clearable/>
          <img
            :src="editorForm.unlockHonorImgUrl"
            class="avatar"
            style="width: 60px; height: 60px"
          >
          <el-button
            size="mini"
            type="text"
            @click="uploadImg(-1, false)"
          >上传</el-button>
        </el-form-item>
        <el-form-item label="描述" prop="honorDesc">
          <el-input v-model="editorForm.honorDesc" :maxlength="500" type="textarea" clearable/>
        </el-form-item>
        <el-form-item prop="sortValue" label="排序值">
          <el-input v-model.number="editorForm.sortValue" :min="1" :max="999999" maxlength="6" clearable/>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio v-model="editorForm.status" label="0">启用</el-radio>
          <el-radio v-model="editorForm.status" label="1">禁用</el-radio>
        </el-form-item>
        <el-form-item
          v-if="hierarchy==1"
          label="设置应用范围："
          prop="status"
        >
          <el-button type="text" size="medium" @click="checkStatus">选择规则应用范围</el-button>
          <el-checkbox-group v-model="applyRange" class="unClickable">
            <template v-for="(item) of rangeList">
              <el-checkbox :key="item.key" :label="item.key">{{ item.label }}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialogEditor=false">关闭</el-button>
        <el-button @click="updataHandlear(1)">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogSon" :before-close="handleClose" :title="titleName" width="500px">
      <el-form ref="sonForm" :model="sonForm" :rules="sonRules" :inline="true" label-width="150px" label-position="left" @submit.native.prevent>
        <el-form-item prop="honorType" label="上级名称：">
          <el-input v-model="sonForm.honorType" :disabled="true" clearable/>
        </el-form-item>
        <el-form-item label="添加范围条件：" class="appendEmpty">
          <el-button circle @click="insertLine()"><i class="el-icon-plus"/></el-button>
        </el-form-item>
        <el-row v-for="(item,index) in sonForm.subset" :key="index" :gutter="20" class="inline" style="margin: 0 auto">
          <el-card class="box-card">
            <el-form-item :prop="'subset'+`[${index}]`+'.rangeLow'" label="范围条件：">
              <el-row >
                <el-col :xl="7" :sm="7" style="text-align: right;padding: 8px 0 0;font-size:12px;" >
                  数量达到
                </el-col>
                <el-col :xl="8" :sm="8" style="text-align: left;padding: 8px 0 0" >
                  <el-input-number v-if="index===0" v-model="sonForm.subset[index].rangeLow" :min="1" :controls="false" :disabled="false" class="numbers"/>
                  <el-input-number v-if="index!==0" v-model="sonForm.subset[index].rangeLow" :min="sonForm.subset[index-1].rangeLow+1" :max="999999" :controls="false" class="numbers" @change="changeRangeLow(index,sonForm.subset[index].rangeLow)"/>
                </el-col>
                <el-col :xl="9" :sm="9" style="text-align: right;padding: 8px 0 0" >
                  <el-select v-model="sonForm.subset[index].conditionUnit" placeholder="请选择">
                    <el-option key="次" label="次" value="次" />
                    <el-option key="分钟" label="分钟" value="分钟" />
                    <el-option key="小时" label="小时" value="小时" />
                    <el-option key="天" label="天" value="天" />
                    <el-option key="条" label="条" value="条" />
                    <el-option key="积分" label="积分" value="积分" />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :prop="'subset'+`[${index}]`+'.honorName'" label="荣誉项名称">
              <el-input v-model="sonForm.subset[index].honorName" :maxlength="15" clearable/>
            </el-form-item>
            <el-form-item :prop="'subset'+`[${index}]`+'.honorImgUrl'" label="未解锁图片">
              <el-input v-if="false" v-model="sonForm.subset[index].honorImgUrl" clearable/>
              <img
                :src="sonForm.subset[index].honorImgUrl"
                class="avatar"
                style="width: 60px; height: 60px"
              >
              <el-button
                size="mini"
                type="text"
                @click="uploadImg(index, true)"
              >上传</el-button>
            </el-form-item>
            <el-form-item :prop="'subset'+`[${index}]`+'.unlockHonorImgUrl'" label="已解锁图片">
              <el-input v-if="false" v-model="sonForm.subset[index].unlockHonorImgUrl" clearable/>
              <img
                :src="sonForm.subset[index].unlockHonorImgUrl"
                class="avatar"
                style="width: 60px; height: 60px"
              >
              <el-button
                size="mini"
                type="text"
                @click="uploadImg(index, false)"
              >上传</el-button>
            </el-form-item>
            <el-form-item :prop="'subset'+`[${index}]`+'.honorDesc'" label="描述">
              <el-input v-model="sonForm.subset[index].honorDesc" :maxlength="500" type="textarea" clearable/>
            </el-form-item>
            <el-form-item :prop="'subset'+`[${index}]`+'.sortValue'" label="排序值">
              <el-row>
                <el-col :xl="18" :sm="18" >
                  <el-input v-model.number="sonForm.subset[index].sortValue" :min="1" :max="999999" maxlength="6" clearable/>
                </el-col>
                <el-col :xl="5" :sm="5" >
                  <el-button type="text" @click.prevent="deleteLine(item)">删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-card>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialogSon=false">关闭</el-button>
        <el-button @click="updataHandlear(2)">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialog"
      class="dialog"
      title="积分规则应用范围"
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
            <el-form-item label="应用平台名称：" class="second">
              <el-input v-model="scoreForm.name" maxlength="100" clearable style="width:62%" placeholder="请输入" />
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
        <i class="el-icon-upload"/>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>

</template>

<script>
import { getHonorTreeList, getHonorList, editSave, addSave, addSaveList, getUnselectedClients, updateName, updateStatus } from '@/api/typeManagement'
import breadcrumb from '@/components/breadcrumb'
import { getToken } from '@/utils/auth'
export default {
  name: 'TypeManagement',
  components: {
    breadcrumb
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      hierarchy: 1, // 当前新增层级
      visibleEdit: '',
      visibleSave: 'none',
      editTop: true,
      titleName: '',
      applyRange: [],
      rangeList: [],
      searchForm: {
        honorName: '全部',
        parentId: 0
      },
      formRules: {
        honorType: [{ required: true, message: '请输入上级名称', trigger: 'blur' }],
        honorName: [{ required: true, message: '请输入荣誉名称', trigger: 'blur' }],
        honorCode: [{ required: true, message: '请输入荣誉编码', trigger: 'blur' }],
        sortValue: [{ required: true, message: '请输入排序值', trigger: 'blur' },
          { type: 'number', min: 1, message: '排序值区间为[1-999999]', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        clientName: [{ required: true, message: '请设置应用范围', trigger: 'blur' }],
        rangeLow: [{ required: true, message: '请输入数量达到', trigger: 'blur' },
          { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' }]
      },
      searchRules: { honorName: [{ required: true, message: '请输入名称', trigger: 'blur' }] },
      sonForm: {},
      sonRules: {
        honorType: [{ required: true, message: '请输入上级名称', trigger: 'blur' }],
        subset: []
      },
      scoreForm: {
        type: null,
        name: ''
      },
      uploadHead: {},
      rangeData: [],
      dialogEditor: false,
      dialogSon: false,
      dialog: false,
      dialogUpload: false,
      editorForm: {},
      uploadData: {},
      indexs: -1,
      lockFlag: false,
      imgType: '',
      pageSize: 10,
      total: 0,
      pageNo: 1,
      totalPage: 0,
      tableData: [{
        rangeLow: '' }]
    }
  },
  computed: {
    actionUrl: () => {
      const basePath =
        process.env.NODE_ENV === 'development' ? '/api' : '/member-admin'
      return basePath + '/honor/uploadPicture'
    }
  },
  watch: {
  },
  mounted() {
    this.getHonorTreeList()
    this.getSearchInfo()
    this.init(1)
  },
  methods: {
    editType() {
      this.editTop = false
      this.visibleEdit = 'none'
      this.visibleSave = ''
    },
    saveType() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          const param = {
            id: this.searchForm.parentId,
            honorName: this.searchForm.honorName
          }
          updateName(param).then(res => {
            if (res.resultStatus === 'SUCCEED') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.editTop = true
              this.visibleSave = 'none'
              this.visibleEdit = ''
              this.getHonorTreeList()
            }
          })
        }
      })
    },
    updataHandlear(type) {
      if (type === 1) {
        if (this.editorForm.honorCode) {
          this.editorForm.honorCode = this.editorForm.honorCode.trim()
        }
        if (this.editorForm.honorName) {
          this.editorForm.honorName = this.editorForm.honorName.trim()
        }
        this.$refs['editorForm'].validate(valid => {
          if (valid) {
            if (this.hierarchy === 1 && this.applyRange.length === 0) {
              return this.$message({ message: '请设置应用范围', type: 'warning' })
            }
            this.editorForm.clients = this.applyRange
            if (!this.editorForm.id) {
              addSave(this.editorForm).then(res => {
                if (res.resultStatus === 'SUCCEED') {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.dialogEditor = false
                  this.getHonorTreeList()
                  this.init(1)
                }
              })
            } else {
              editSave(this.editorForm).then(res => {
                if (res.resultStatus === 'SUCCEED') {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.dialogEditor = false
                  this.getHonorTreeList()
                  this.init(1)
                }
              })
            }
          }
        })
      } else if (type === 2) {
        if (this.sonForm.subset.length < 1) {
          return this.$message('请添加一条数据')
        }
        this.$refs['sonForm'].validate(valid => {
          if (valid) {
            const params = {}
            params.hierarchy = this.sonForm.hierarchy
            params.parentId = this.sonForm.parentId
            params.children = this.sonForm.subset
            addSaveList(params).then(res => {
              if (res.resultStatus === 'SUCCEED') {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogSon = false
                this.getHonorTreeList()
                this.init(1)
              }
            })
          } else {
            setTimeout(() => {
              var isError = document.getElementsByClassName('is-error')
              isError[0].querySelector('input').focus()
            }, 100)
            return false
          }
        })
      }
    },
    editStatus(row, type) {
      console.log(11111)
      row.status = type
      updateStatus(row).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          this.$message({
            message: type === '0' ? '启用成功' : '禁用成功',
            type: 'success'
          })
          this.init(1)
        }
      })
    },
    handleNodeClick(data) {
      if (data.hierarchy !== '3') {
        this.searchForm.honorName = data.label
        this.searchForm.parentId = data.id
        this.hierarchy = parseInt(data.hierarchy) + 1
        this.init(1)
      }
    },
    insertLine() {
      const map = {
        hierarchy: this.hierarchy,
        parentId: this.searchForm.parentId,
        rangeLow: '',
        conditionUnit: '次',
        honorName: '',
        honorDesc: '',
        sortValue: ''
      }
      if (this.sonForm.subset.length <= 20) {
        this.sonForm = { ...this.sonForm, subset: [...this.sonForm.subset, map] }
        this.sonRules.subset.push({
          rangeLow: [{ required: true, message: '请输入范围条件', trigger: 'blur' }],
          honorName: [{ required: true, message: '请输入荣誉项名称', trigger: 'blur' }],
          sortValue: [{ required: true, message: '请输入排序值', trigger: 'blur' }, { type: 'number', min: 1, message: '排序值区间为[1-999999]', trigger: 'blur' }] })
      } else {
        this.$message('最多二十条！')
      }
    },
    deleteLine(item) {
      if (this.sonForm.subset.length <= 1) {
        return this.$message('至少添加一条')
      }
      var index = this.sonForm.subset.indexOf(item)
      if (index !== -1) {
        this.sonForm.subset.splice(index, 1)
      }
      // this.sonForm.subset[0].rangeLow = 0
      this.sonForm = { ...this.sonForm, subset: [...this.sonForm.subset] }
    },
    changeRangeLow(index, val) {
      for (let i = index + 1; i < this.sonForm.subset.length; i++) {
        if (this.sonForm.subset[i].rangeLow <= val) {
          this.sonForm.subset[i].rangeLow = val + 1
          val++
        }
      }
      this.sonForm = { ...this.sonForm }
    },
    checkStatus() {
      this.dialog = true
    },
    getSearchInfo() {
      getUnselectedClients({ clientName: this.scoreForm.name }).then(res => {
        this.rangeData = []
        for (const i of res.result) {
          this.rangeData.push({
            key: i.id,
            label: i.clientName
          })
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    clickEditor(row) {
      this.rangeList = []
      this.dialogEditor = true
      this.titleName = '编辑'
      this.editorForm = { ...row }
      this.applyRange = row.clients
      this.editorForm.honorType = this.searchForm.honorName
      this.$refs['editorForm'].clearValidate()
      for (const i of row.clients) {
        for (const j of this.rangeData) {
          if (i === j.key) {
            this.rangeList.push(j)
          }
        }
      }
    },
    clickAddor() {
      if (this.hierarchy === 3) {
        this.sonForm.honorType = this.searchForm.honorName
        const param = {
          parentId: this.searchForm.parentId,
          pageNo: 1,
          pageSize: 20
        }
        getHonorList(param).then(res => {
          this.sonForm.subset = res.result
          this.sonForm.parentId = this.searchForm.parentId
          if (this.sonForm.subset.length > 0) {
            this.titleName = '编辑'
          } else {
            this.titleName = '新增'
          }
          for (let i = 0; i < this.sonForm.subset.length; i++) {
            this.sonRules.subset.push({
              rangeLow: [{ required: true, message: '请输入范围条件', trigger: 'blur' }],
              honorName: [{ required: true, message: '请输入荣誉项名称', trigger: 'blur' }],
              honorCode: [{ required: true, message: '请输入荣誉编码', trigger: 'blur' }],
              sortValue: [{ required: true, message: '请输入排序值', trigger: 'blur' }] })
          }
          this.dialogSon = true
          this.sonForm = { ...this.sonForm }
        })
        this.sonForm.hierarchy = this.hierarchy
      } else {
        this.titleName = '新增'
        this.dialogEditor = true
        this.applyRange = []
        this.rangeList = []
        this.editorForm = {}
        this.editorForm.honorType = this.searchForm.honorName
        this.editorForm.parentId = this.searchForm.parentId
        this.editorForm.hierarchy = this.hierarchy
        this.editorForm.status = '0'
        this.editorForm = { ...this.editorForm }
        this.$refs['editorForm'].clearValidate()
      }
    },
    currentChange(num) {
      this.pageNo = num
      this.init()
    },
    init(pageNo) {
      const param = {
        parentId: this.searchForm.parentId,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
      this.editTop = true
      getHonorList(param).then(res => {
        this.tableData = res.result
        console.log('表格数据', this.tableData)
        this.total = res.totalNum
        this.pageNo = res.pageNo
        this.totalPage = res.totalPage
      })
    },
    getHonorTreeList() {
      this.treeData = []
      getHonorTreeList().then(res => {
        this.treeData.push(res.result)
      })
    },
    uploadImg(val, lockFlag) {
      this.uploadData = { file: this.imgType }
      this.uploadHead = { token: getToken() }
      this.dialogUpload = true
      this.indexs = val
      this.lockFlag = lockFlag
    },
    beforeAvatarUpload(file) {
      this.imgType = file.type.split('/')[1]
      this.uploadData.suffix = this.imgType
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
    uploadSuccess(response, file, fileList) {
      if (response.resultStatus === 'SUCCEED') {
        console.log(this.indexs)
        if (this.indexs === -1) {
          if (this.lockFlag) {
            this.editorForm.honorImgUrl = response.result
          } else {
            this.editorForm.unlockHonorImgUrl = response.result
          }
        } else {
          if (this.lockFlag) {
            this.sonForm.subset[this.indexs].honorImgUrl = response.result
          } else {
            this.sonForm.subset[this.indexs].unlockHonorImgUrl = response.result
          }
        }
        this.dialogUpload = false
      } else {
        this.$message.error(response.errorMessage)
      }
    },
    linkToAdd() {
      this.$router.push('/member/detail')
    },
    transferChange(value, direction, movedKeys) {
      if (direction === 'right') {
        console.log('右移', value, movedKeys)
      }
      if (direction === 'left') {
        console.log('左移', value, movedKeys)
      }

      this.rangeList = []
      for (const i of this.applyRange) {
        for (const j of this.rangeData) {
          if (i === j.key) {
            this.rangeList.push(j)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .dialog {
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
  }
  .el-transfer-panel {
    width: 320px;
  }
}
/deep/ .tree {
  height: 140%;
  .el-tree > .el-tree-node > .el-tree-node__content:first-child {
    &::before,
    &::after {
      border: none;
    }
  }
  .el-tree-node .el-tree-node__content {
    height: 30px;
    &::before,
    &::after {
      content: "";
      position: absolute;
      right: auto;
    }
    &::before {
      border-left: 1px solid #e6e6e6;
      bottom: 50px;
      height: 100%;
      top: 0;
      width: 1px;
      margin-left: -5px;
      margin-top: -15px;
    }
    &::after {
      border-top: 1px solid #e6e6e6;
      height: 20px;
      top: 14px;
      width: 10px;
      margin-left: -5px;
    }
  }
  .el-tree .el-tree-node {
    position: relative;
  }

  .flow-tree {
    overflow: auto;
    height: 70%;
    > > > .el-tree-node {
      > .el-tree-node__children {
        overflow: visible !important
      }
    }
  }
}

.appendEmpty:before{
  display: inline;
  margin-right: 16px;
}
.numbers{
  >>>.el-input__inner{
    text-align: left;
  }
}
</style>
