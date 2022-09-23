<template>
  <div style="overflow: hidden">
    <div ref="chartID" :style="{ height: height + 'px', }" ></div>
  </div>
</template>

<script>

let echarts = window.echarts;

module.exports = {
  props: {
    options: { required: true, type: [Object, String] },
    height: { type: Number, default: 300 }
  },
  data() {
    return {
      loading: true
    };
  },
  watch: {
    // options(newData, oldData) {
    options() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setOptions(this.options);
    },
    create() {
      // let chartId = uuid();
      // this.$refs.chartID.innerHTML = `<div id="${chartId}"  style="height: 300px">正在加载...</div>`;
      // 基于准备好的dom，初始化echarts实例
      // return echarts.init(document.getElementById(chartId));
      return echarts.init(this.$refs.chartID);
    },
    setOptions(opt) {
      if (Object.keys(opt).length > 0) {
        this.loading = false;
      } else {
        this.loading = true;
      }
      let Chart = this.create();
      Chart.resize();
      Chart.setOption(opt);
      this.$emit("loading", Chart);
      window.onresize = function() {
        Chart.resize(); //myEchart为echarts.init初始化得到的对象
      };
    }
  }
};
</script>

<style scoped></style>
