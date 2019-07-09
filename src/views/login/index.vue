<template>
  <div>
    <van-nav-bar title="登陆"/>
    <form>
      <van-cell-group>
        <van-field
          v-model="form.mobile"
          required
          clearable
          label="用户名"
          placeholder="请输入用户名"
        />
        <van-field
          v-model="form.code"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
      </van-cell-group>
      <van-button type="info" @click.prevent="sendlogin" class="loginbtn">登陆</van-button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'loginIndex',
  data () {
    return {
      form: {
        mobile: '15120013810',
        code: '123456'
      }
    }
  },
  methods: {
    async  sendlogin () {
      try {
        let res = await axios({
          method: 'POST',
          url: 'http://toutiao.course.itcast.cn/app/v1_0/authorizations',
          data: this.form
        })
        console.log(res)
        this.$toast('登陆成功')
        this.$router.push({ name: 'home' })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.loginbtn {
  width: 345px;
  text-align: center;
  margin-left: 15px;
}
</style>
