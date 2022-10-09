<template>
  <div class="panel" ref="layout">
    <div v-if="$slots.top"  ref="top" class="top"><slot name="top"></slot></div>
    <div ref="content" class="content">
      <el-scrollbar style="height: 100%;"><slot></slot></el-scrollbar>
    </div>
  </div>

</template>
<script>

module.exports = {
  data: function () {
    return {};
  },
  props: {
    title: {type: String, default: ""},
    isHeader: {type: Boolean, default: true},
    padding: {type: Boolean, default: true},

  },
  created: function () {

  },
  mounted: function () {
    this.view()
  },
  methods:{
    view() {
      const self = this
      function init() {
        const winHeight = `${document.documentElement.clientHeight}` // 页面高度
        // 顶部高度
        const topHeight = self.$refs.top ? self.$refs.top.clientHeight : 0 // 顶部高度
        // 获取中间区域高度
        const contentHeight =
            winHeight -
            topHeight;

        //设置中间区域高度
        self.$refs.content.style.height = `${contentHeight}px`


        // 给外部传出一个 页面高度事件， 用于其他地方定位高度
        self.$emit('on-height', contentHeight)
      }
      // 进入运行
      init()
      // 窗口改变运行
      window.addEventListener('resize', () => {
        self.init()
      })
    }
  }
};
</script>
<style >

</style>
