<template>
  <van-dialog
    :value="value"
    :show-confirm-button="false"
    :close-on-click-overlay="true"
    @input="$emit('input', $event)"
  >
  <div v-if="isshowone">
    <van-cell title="对此内容不感兴趣" @click="nolickclick(articleItem)"/>
    <van-cell title="举报该文章" is-link @click="isshowone=!isshowone" />
    <van-cell title="拉黑作者" @click="pullbclick(articleItem)"/>
  </div>
  <div v-else>
    <van-cell icon="arrow-left" />
    <van-cell :title="itemproject.type" v-for="itemproject in project" :key="itemproject.number" @click="reportClick(articleItem, itemproject.number)" />
  </div>
  </van-dialog>
</template>

<script>
import { noLickContent, clickBlock, clickReport } from '@/api/article'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleItem: {
      type: Object
    }
  },
  data () {
    return {
      project: [
        { type: '标题夸张', number: 1 },
        { type: '低俗色情', number: 2 },
        { type: '错别字多', number: 3 },
        { type: '旧闻重复', number: 4 },
        { type: '广告软文', number: 5 },
        { type: '内容不实', number: 6 },
        { type: '涉嫌违法犯罪', number: 7 },
        { type: '侵权', number: 8 },
        { type: '其他问题', number: 0 }
      ],
      isshowone: true
    }
  },
  methods: {
    async nolickclick (item) {
      try {
        await noLickContent(item.art_id + '')
        this.$emit('nolick')
      } catch (err) {
        console.log(err)
      }
    },
    // 拉黑作者
    async pullbclick (item) {
      try {
        await clickBlock(item.art_id + '')
        this.$emit('blockClick')
      } catch (err) {
        console.log(err)
      }
    },

    // 举报用户
    async reportClick (item, number) {
      try {
        let id = item.art_id + ''
        await clickReport(id, number)
        this.$toast('操作成功')
        this.isshowone = !this.isshowone
        this.$emit('input', false)
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.$toast('该文章已被举报')
          this.isshowone = !this.isshowone
          this.$emit('input', false)
          return
        }
        this.$toast('未知错误')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
