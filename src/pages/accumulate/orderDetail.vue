<template >
  <div>
    <router-view :editable="editable" class="sibling"/>
    <div class="sibling">
      <div class="background">
        <breadcrumb />
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name" >查询条asd件</div>
          <div class="flex-buttons">
            <el-button type="primary" >返回</el-button>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="keyvalue">
                <div class="vlue">申请单号</div>
                <div class="key">asd</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="keyvalue">
                <div class="vlue">申请单状态</div>
                <div class="key">asd</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="keyvalue">
                <div class="vlue">申请时间</div>
                <div class="key">asd</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="keyvalue">
                <div class="vlue">申请人</div>
                <div class="key">asd</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="keyvalue">
                <div class="vlue">调整原因说明</div>
                <div class="key">asd</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'OrderDetail',
  components: {
    breadcrumb
  },
  data() {
    return {
    }
  }
}
</script>
