<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页" fixed/>
      <!--
        activeChannelIndex 绑定当前激活的标签页，使用索引
       -->
      <van-tabs class="channel-tabs" v-model="active">
        <van-tab
          v-for="channelItem in channels"
          :key="channelItem.id"
          :title="channelItem.name"
        >

        <!-- 添加一个频道栏按钮 -->
        <div class="icontext" @click="isShow = !isShow"><van-icon name="wap-nav" /></div>
        <ChannelsAll v-model="isShow" :channels="channels" :active.sync="active"/>
          <!--
            下拉刷新
            isLoading 用来控制下拉刷新的 loading 状态
            下拉刷新的时候，它会自动将 loading 设置为 true
            @refresh 当下拉刷新的时候会触发
           -->
          <van-pull-refresh
            v-model="channelItem.downPullLoading"
            @refresh="onRefresh"
            :success-text="channelItem.downPullSuccessText"
            :success-duration="800"
          >
            <!--
              列表组件：主要提供上拉加载更多的功能
              channelItem.upPullLoading 用来控制加载中 loading 状态
              finished 用来控制是否加载完毕
              @load 加载更多的时候触发的一个事件，它自动会调用 onLoad 函数拿数据，以填充页面
                  它每次调用 onLoad 会自动将 channelItem.upPullLoading 设置为 true
                  我们需要在 onLoad 中拿到本次加载的数据以后，将 channelItem.upPullLoading 设置为 false
            -->
            <van-list
              v-model="channelItem.upPullLoading"
              :finished="channelItem.upPullFinished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="articleItem in channelItem.articles"
                :key="articleItem.art_id"
                :title="articleItem.title"
              />
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { getFnChannel } from '@/api/channel'
import { getFnarticle } from '@/api/article'
import ChannelsAll from './components/channels'

export default {
  name: 'home',
  components: {
    ChannelsAll
  },
  data () {
    return {
      active: 0,
      channels: [],
      isShow: true
    }
  },
  created () {
    this.getChnnels()
  },
  computed: {
    // 点亮的频道
    activeChannel () {
      return this.channels[this.active]
    }
  },
  methods: {
    // 频道改变是的状态
    onChange (name, title) {
      this.$toast(title)
    },

    // 获取文章数据列表
    async onLoad () {
      // 增加一个时间，控制刷新时间
      await this.$sleep(800)
      // 调用获取文章数据的数组
      let data = []
      data = await this.loadArticles()

      // 有pre_timestamp并且数组是空的，则请求上次数据
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        data = await this.loadArticles()
      } else if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据已记载完毕，组件会自动给出提示，并且不再 onLoad
        this.activeChannel.upPullFinished = true

        // 取消 loading
        this.activeChannel.upPullLoading = false
      }
      // 将文章数据更新到频道中（注意：是 push 追加，不是覆盖）
      this.activeChannel.articles.push(...data.results)

      // 数据加载完毕，取消上拉 loading
      this.activeChannel.upPullLoading = false
    },

    // 封装一个获取文章列表的函数
    async loadArticles () {
      let { id: channelId, timestamp } = this.activeChannel
      let articlelist = await getFnarticle(
        { channelId,
          timestamp
        })
      return articlelist
    },

    // 下拉刷新
    async onRefresh () {
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp

      // 使用最新时间戳去请求最新的推荐数据
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()

      // 如果有最新数据，将数据更新到频道的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文章中
        activeChannel.articles = data.results

        // 由于你重置了文章列表，那么当前数据中的 pre_timestamp 就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'

        // 当下拉刷新有数据并重置以后数据无法满足一屏，所以我们使用 onLoad 再多加载一页数据
        this.onLoad()
      } else {
        // 如果没有最新数据，提示已是最新内容
        activeChannel.downPullSuccessText = '已是最新数据'
      }

      // 下拉刷新结束，取消 loading 状态
      activeChannel.downPullLoading = false

      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp
    },

    // 获取频道列表
    async getChnnels () {
      // 频道
      let data = []
      // 已登陆
      if (this.$store.state.user) {
        data = await getFnChannel()
      } else {
        const local = JSON.parse(window.localStorage.getItem('channels'))
        if (local) {
          // 未登录，有本地数据
          data = local
          this.channels = data
          return
        } else {
          data = await getFnChannel()
        }
      }
      data.channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.channels = data.channels
    }
  }
}

</script>

<style lang="less" scoped>
.home {
  margin-bottom: 50px;
}
.home /deep/ .van-tabs__wrap {
  position: fixed;
  margin-top: 50px;
}
.home /deep/ .van-tabs__content {
  margin-top: 50px;
}
.icontext {
  position: fixed;
  right: 0;
  font-size: 25px;
  top: 50px;
  background-color: #fff;
  z-index: 99;
}
</style>
