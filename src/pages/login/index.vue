<template>
  <div/>
</template>

<script>
import { getInfo, getCode } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    return {
      token: ''
    }
  },
  mounted() {
    const token = getToken()
    var code = window.location.search.indexOf('code=') > -1
    if (!token && !code) {
      getInfo().then(res => {
        window.location.href = res.result
      })
      return
    } else if (code) {
      this.sends()
      return
    } else {
      this.$router.push('/dashboard')
      return
    }
  },
  methods: {
    sends() {
      var arr = window.location.search.split('&')
      var code = ''
      for (const i of arr) {
        if (i.indexOf('code=') > -1) {
          code = i
        }
      }
      getCode(code).then(res => {
        if (res.resultStatus === 'FAILED') {
          window.location.href = window.location.origin
        } else {
          setToken(res.result)
          this.token = getToken()
          this.$router.push('/dashboard')
        }
      })
    }

  }
}
</script>
