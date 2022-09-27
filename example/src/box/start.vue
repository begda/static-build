<template>
  <panel>
    <div>
      <div class="pl-20 pr-10 bg-cover py-16" style="background-image: url(assets/images/bg.png)">
        <div class="flex items-center justify-between">
          <div class="flex-grow">
            <div class="text-4xl font-bold text-white">
              欢迎使用安全风险体检
            </div>
            <div class="pt-6 text-lg text-white">即刻进行体检，开启安全护航</div>
            <div class="pt-12">
              <button @click="onRun"
                      class="bg-blue-500 py-4 px-16 hover:bg-blue-600  text-2xl
                    ring-4 ring-blue-300 ring-opacity-90
                    text-white font-bold  rounded-full focus:outline-none focus:shadow-outline"
                      type="button">
                立即体检
              </button>
            </div>
          </div>
          <div class="w-96">
            <img class="w-screen" src="assets/images/2.svg"/>
          </div>
        </div>
      </div>
      <div class="p-20 pt-10 ">
        <div class="flex justify-between">
          <div class="text-center ">
            <div
                class="border-solid border-gray-300 border-4 bg-white
                rounded-full h-20 w-20 items-center flex	justify-center">
              <div class="iconfont dtzd-gongren text-5xl fill-current text-gray-600"></div>
            </div>
            <div class="text-base pt-2">人员诊断</div>
          </div>

          <div class="text-center ">
            <div
                class="border-solid border-gray-300 border-4 bg-white
                rounded-full h-20 w-20 items-center flex	justify-center">
              <div class="iconfont dtzd-a-jiqirenzhineng-05 text-5xl fill-current text-gray-600"></div>
            </div>
            <div class="text-base pt-2">设备诊断</div>
          </div>

          <div class="text-center ">
            <div
                class="border-solid border-gray-300 border-4 bg-white
                rounded-full h-20 w-20 items-center flex	justify-center">
              <div class="iconfont dtzd-huanjingguanli text-5xl fill-current text-gray-600"></div>
            </div>
            <div class="text-base pt-2">环境诊断</div>
          </div>

          <div class="text-center ">
            <div
                class="border-solid border-gray-300 border-4 bg-white
                rounded-full h-20 w-20 items-center flex	justify-center">
              <div class="iconfont dtzd-shebeiguanli text-5xl fill-current text-gray-600"></div>
            </div>
            <div class="text-base pt-2">管理体系</div>
          </div>
        </div>
      </div>

    </div>
  </panel>
</template>

<script>

module.exports = {
  data: function () {
    return {
      activeName: 'name1',
      options: {},
      dddd: true,
      data: []
    };
  },
  created: function () {

  },
  mounted: function () {

  },
  methods: {
    onRun(){
      this.$emit('run','11111')
    }
  }
};
</script>

<style scoped>

</style>
