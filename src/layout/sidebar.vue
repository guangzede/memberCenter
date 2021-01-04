<template>
  <div style="height:100%;">
    <div :class="isCollapse?'isCollapse':''" class="logo">
      <img :src="isCollapse?logoXsSrc:logoMdSrc" title="一汽会员中心" >
    </div>
    <happy-scroll color="rgba(159, 149, 158, 0.5)" style="height: calc(100% - 60px);" size="5" resize >
      <div>
        <el-menu
          v-for="(item) of menu"
          :key="item.name"
          :collapse="isCollapse"
          :hidden="item.hidden"
          text-color="#fff"
          unique-opened
          router
          active-text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item v-if="!hasChild(item.children)" :index="item.path" >
            <i :class="item.icon?item.icon:'el-icon-setting'"/>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>

          <el-submenu v-else :index="item.path">
            <template slot="title">
              <i :class="item.icon?item.icon:'el-icon-setting'"/>
              {{ item.menuName }}
            </template>
            <template v-for="(i,ix) of item.children">
              <el-menu-item v-if="!i.hidden" :index="i.path" :key="ix">
                <span slot="title">{{ i.meta.title }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </div>
    </happy-scroll>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'
import { mapState } from 'vuex'
import { tree0 } from '@/utils/menu'
export default {
  name: 'Sidebar',
  data() {
    return {
      logoMdSrc: require('@/assets/logo.png'),
      logoXsSrc: require('@/assets/logo2.png'),
      style: ''
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.isCollapse,
      menu: state => state.user.menuList,
      name: state => state.user.userName
    })
  },
  watch: {
    isCollapse: {
      immediate: true,
      handler() {
        // const h = document.body.clientHeight - 60
        // const w = this.isCollapse ? 64 : 200
        // this.style = `width:${w}px;height:${h}px`
      }
    }
  },
  created() {
    // var temp = this.$router.options.routes.concat(JSON.parse(localStorage.userMenu))
    // this.$router.addRoutes([...temp])
    // this.computedMenu(JSON.parse(localStorage.userMenu))
    this.send()
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    hasChild(item) {
      if (!item) {
        return false
      }
      if (item.length > 1) {
        return true
      }
    },

    linkTo(item) {
      if (this.$route.path !== item.path) {
        this.$router.push(item.menuUrl)
      } else {
        return
      }
    },
    send() {
      getInfo({
        token: window.localStorage.token
      }).then(res => {
        res = res.result
        if (res.menuList.length === 0) {
          this.$notify.info({
            title: '提示',
            message: '请联系管理员授权菜单'
          })
        } else {
          if (JSON.stringify(res.menuList) === window.localStorage.getItem('userMenu')) {
            console.log('same')
          } else {
            this.$store.commit('logInfo', res)
            this.computedMenu(res.menuList)
          }
        }
      })
    },
    computedMenu(menuList) {
      window.localStorage.removeItem('userMenu')
      var temp = tree0(menuList)
      temp = this.$router.options.routes.concat(...temp)
      this.$store.commit('userMenu', temp)
      window.localStorage.setItem('userMenu', JSON.stringify(menuList))
      this.$router.addRoutes([...temp])
    }
  }
}
</script>

<style lang="scss" scoped>
// .position{
//     position: absolute;
//     left: 0;
//     right: 0;
//     top: 0;
//     bottom: 0;
//     overflow-x: hidden;
// }
.logo {
  height: 59px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  &.isCollapse {
  transition: linear all .3s;
    img {
      padding-left: 0;
      display: block;
    }
  }
  img {
    transition: linear all .3s;
    text-align: left;
    padding-left: 20px;
  }
  i {
    cursor: pointer;
    margin-top: 14px;
    font-size: 30px;
  }
}
// >>>.happy-scroll-container{
//   width:auto!important;
// }
// >>>.happy-scroll-container .happy-scroll-content{
//   display: inherit;
// }
>>>.happy-scroll-container{
  height: 100% !important;
}
>>>.happy-scroll-container .happy-scroll-content{
  display: block;
}

</style>
