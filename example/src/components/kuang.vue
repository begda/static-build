<template>
  <div style="display: flex;justify-content: space-around;" class="kuang">
    <div style="line-height: 40px;font-size: 17px;height: 40px;overflow: hidden">
     <span :style="{color:color}"> {{title}}</span>
    </div>
    <div style="font-weight: bold;font-size: 25px;color:#ffffff">
      <span :style="{color:color2}">
      <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>


module.exports = {
  props: {
    title: {  type: [Object, String] },
    color: {  type: [String] ,default:"#3D7AE8" },
    color2: {  type: [String] ,default:"#ffa200" },
  },
  data() {
    return {
    };
  },
  watch: {
    // options(newData, oldData) {
    options() {

    }
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style scoped></style>
