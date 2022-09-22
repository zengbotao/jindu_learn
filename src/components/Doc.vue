<template>
  <div ref="tip" class="to-doc" :style="{ top: top + 'px' }" @click="jumpToDoc" draggable="true">
    <!-- <Icon type="help-circled" size="30" style="opacity: 0.5"></Icon> -->
    <span>帮助文档</span>
  </div>
</template>

<script>
export default {
  name: 'DocTip',
  data() {
    return {
      isMoving: false,
      docUrl: '/doc/bjx/',
      // clientWidth: 0,
      clientHeight: 0,
      // itemWidth: 0,
      itemHeight: 0,
      top: null,
      downTime: 0,
      upTime: 0
    }
  },
  computed: {
    dom() {
      return this.$refs.tip
    }
  },
  created() {
    // 屏幕宽度
    // this.clientWidth = document.documentElement.clientWidth
    // 屏幕高度
    this.clientHeight = document.documentElement.clientHeight
  },
  mounted() {
    this.$nextTick(() => {
      // 获取宽度
      // this.itemWidth = this.$refs.tip.offsetWidth
      this.itemHeight = this.$refs.tip.offsetHeight
      // 设置位置
      let t = sessionStorage.docTop
      this.top = t ? t : this.clientHeight - this.itemHeight - 45
      this.dom.addEventListener('mousedown', this.handleMousedown)
      this.dom.addEventListener('mousemove', this.handleMousemove)
      document.addEventListener('mouseup', this.handleMouseup)
    })
  },
  beforeDestroy() {
    this.dom.removeEventListener('mousedown', this.handleMousedown)
    this.dom.removeEventListener('mousemove', this.handleMousemove)
    document.removeEventListener('mouseup', this.handleMouseup)
  },
  methods: {
    handleMousedown() {
      this.downTime = new Date().getTime()
      this.isMoving = true
      return false
    },
    handleMousemove(e) {
      // 阻止默认动作
      e.preventDefault()
      if (this.isMoving) {
        this.top = e.clientY - this.itemHeight / 2
      }
    },
    handleMouseup() {
      this.upTime = new Date().getTime()
      this.isMoving = false
      // 手指放开top位置
      if (this.top < 60) {
        this.top = 60
      } else if (this.top > this.clientHeight - this.itemHeight - 45) {
        this.top = this.clientHeight - this.itemHeight - 45
      }
      sessionStorage.docTop = this.top
    },
    jumpToDoc() {
      if (!this.isMoving && this.upTime - this.downTime < 200) {
        let i = location.href.indexOf('/#')
        if (i !== -1) {
          let url = location.href.substring(0, i)
          window.open(`${url}${this.docUrl}`)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.to-doc {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 5px;
  z-index: 1000;
}
</style>
