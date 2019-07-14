<template>
  <div>
    <form action="/">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="onCancel"
        @input="vagueText"
      />
      <div @click="searchtext" >
        <van-cell-group>
          <van-cell v-for="(item, index) in vagueend" :key="index" class="fontText">
            <van-icon name="search" />
            <span>{{ item }}</span>
          </van-cell>
        </van-cell-group>
      </div>
    </form>
  </div>
</template>

<script>
import { textVague } from '@/api/search'
export default {
  name: 'SearchIndex',
  data () {
    return {
      value: '',
      vagueend: []
    }
  },
  methods: {
    onSearch () {},
    onCancel () {},
    searchtext () {},
    async vagueText () {
      let text = this.value.trim()
      if (text === '') {
        return
      }
      try {
        let data = await textVague(text)
        this.vagueend = data.options
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fontText {
  font-size: 14px;
}
</style>
