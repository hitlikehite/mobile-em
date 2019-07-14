<template>
 <div>
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      :style="{ height: '95%' }"
    >
      <div class="headchannel">
        <span>我的频道</span>
        <button @click="isDisplay=!isDisplay">{{isDisplay?"完成":"修改"}}</button>
      </div>
      <van-grid>
        <van-grid-item
          v-for="(useritem, index) in channels"
          :key="useritem.id"
          @click="clickChannel(useritem, index)"
        >
          <div
            slot="text"
            class="usertext"
            :class="{active: active == index && !isDisplay}"
          >{{ useritem.name }}
            <span :class="{display: !isDisplay || index === 0 }" class="cross"><van-icon name="cross" /></span></div>
        </van-grid-item>
      </van-grid>
      <div class="headchannel">
        <p><span>频道推荐</span><span class="textsamll">点击增加频道</span></p>
      </div>
      <van-grid>
        <van-grid-item
          v-for="(item, index) in residueChannels"
          :key="item.id"
        >
          <span
            slot="text"
            class="usertext"
            @click="clickAddChannel(item, index)"
          >{{ item.name }}</span>
        </van-grid-item>
      </van-grid>
    </van-popup>
 </div>
</template>

<script>
import { getFnChannelAll, updateChannelAll } from '@/api/channel'
export default {
  name: 'homeChannels',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannel: [],
      isDisplay: false
    }
  },
  created () {
    this.goodChannels()
  },
  computed: {
    residueChannels () {
      let userChannels = this.channels.map(item => item.id)
      return this.allChannel.filter(item => !userChannels.includes(item.id))
    }
  },
  methods: {
    // 获取所有频道
    async goodChannels () {
      let allChannel = await getFnChannelAll()
      allChannel.channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.allChannel = allChannel.channels
    },
    // 点击我的频道按钮
    async clickChannel (item, index) {
      // console.log(this.isDisplay)
      // 判断是跳转状态
      if (!this.isDisplay) {
        console.log(111)
        this.$emit('update:active', index)
        this.$emit('input', false)
      } else {
        // debugger
        // 判断是修改状态
        // 判断是已登录状态
        if (index === 0) {
          // 推荐默认不能删除
          return
        }
        // 删除我的频道中的频道
        this.channels.splice(index, 1)
        if (this.$store.state.user) {
          const data = this.channels.slice(1).map((item, index) => {
            return {
              id: item.id,
              seq: index + 2
            }
          })
          // console.log(data)
          await updateChannelAll(data)
        } else {
          // 未登录
          window.localStorage.setItem('channels', JSON.stringify(this.channels))
        }
      }
    },
    // 编辑增加频道
    async clickAddChannel (item, index) {
      this.channels.push(item)
      // 已登录
      if (this.$store.state.user) {
        let channels = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        console.log(channels)
        await updateChannelAll(channels)
        console.log(1)
      } else {
        // 未登录
        console.log(2)
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    }
  }
}

</script>

<style lang="less" scoped>
.headchannel {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  button {
    border: 1px solid #f00;
    color: #f00;
  }
}
.usertext {
  font-size: 14px;
}
.textsamll {
  font-size: 12px;
}
.cross {
  position: absolute;
  top: 5px;
  right: 8px;
}
.display {
  display: none;
}
.active {
  color: #f00;
}
</style>
