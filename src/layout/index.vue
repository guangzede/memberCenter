<template>

  <el-container>
    <el-aside :class="isCollapse?'isCollapse':''" ><sidebar/></el-aside>
    <el-main :class="isCollapse?'isCollapse':''" class="main">
      <el-header>
        <div class="box">
          <i :class="isCollapse?'isCollapse':''" class="el-icon-s-fold" @click="tcollapse"/>
          <h2>{{ title }}</h2>
        </div>
        <div class="icon">
          <!-- <img :src="userImg" alt=""> -->
          <span>{{ username }}</span>
          <el-popover v-model="visible" placement="top" width="160" >
            <i slot="reference" class="el-icon-switch-button" />
            <p>退出登录？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="logOut">确定</el-button>
            </div>

          </el-popover>
        </div>
      </el-header>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import sidebar from './sidebar'
import { removeToken } from '@/utils/auth'
import { logout } from '@/api/user.js'
export default {
  name: 'Layout',
  components: {
    sidebar
  },

  data() {
    return {
      visible: false
    }
  },
  computed: {
    username() {
      return this.$store.getters.user.userName
    },
    userImg() {
      return this.$store.getters.user.img
    },
    isCollapse() {
      return this.$store.getters.isCollapse
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(o, n) {
        this.title = this.$route.meta.title
        return this.$route.name
      }
    }
  },
  methods: {
    tcollapse() {
      this.$store.commit('increment')
    },
    logOut() {
      logout().then(res => {
        this.visible = false
        removeToken()
        // window.localStorage.removeItem('token')
        for (const i in window.localStorage) {
          window.localStorage.removeItem(i)
        }
        // window.close()
        this.$router.push('/login')
        console.log(window.localStorage.token)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .main{
    transition: linear all .15s;
    padding-left:200px;
    position: relative;
    &.isCollapse{
    padding-left: 64px;
    }
  }
  .box{
    display: flex;
    justify-content: left;
    i{
      transition: ease-in-out all .3s .15s;
      &.isCollapse{
        transform: rotatey(180deg);
      }
    }
    h2{
      padding-left: 15px;
    }
  }
.el-aside{
    background: url('../assets/menu.jpg');
    background-position: bottom right;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    overflow-x: hidden;
  >>> .el-menu{
    background: none;
    border: none;
  }
}
  i {
    cursor: pointer;
    margin-top: 14px;
    font-size: 30px;
    &.el-icon-switch-button{
      margin-top: 0;
      padding: 0 15px;
      opacity: .7;
      transition: linear all .13s;
      &:hover{
        opacity: 1;
      }
    }
  }
.el-header{
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  h2{
    line-height: 60px;
    font-size: 18px;
    font-weight: 500;
  }
  .icon{
    display: flex;
    justify-content: space-between;
    align-items: center;
    img{
      width:30px;
      height: 30px;
      border-radius: 50%;
    }
    span{
      font-size: 12px;
      padding-left: 10px;
    }
  }
}
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
