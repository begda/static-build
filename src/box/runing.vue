<template>
  <panel style="background: #ffffff">
    <div slot="top">
      <div class="p-10 bg-cover bg-blue-50">
        <div class="flex items-center justify-between" style="height: 150px">
          <div>
            <div class="grade">
              <div class="text-blue-600">{{grade}}</div>
            </div>
          </div>

          <div class="flex-grow pl-10">
            <div class="text-3xl py-1 "> {{title}}</div>
            <div class="text-gray-500	">
              <el-tag v-if="!completed" type="success" size="mini">已接入安全大脑以全面提升检测能力</el-tag>
              <div class="py-1 text-lg "><span v-html="subTitle"></span></div>
              <div v-if="completed" type="info" size="mini">上次诊断时间：{{lastTime}}</div>
            </div>
          </div>

          <div>
            <button @click="onCancel"
                    class="ring-4 ring-blue-300 bg-blue-500 py-4 px-16 hover:bg-blue-600  text-1xl
                    text-white font-bold  rounded-full focus:outline-none focus:shadow-outline"
                    type="button">
              {{btnTitle}}
            </button>
          </div>
        </div>
      </div>
      <!--    进度条-->
      <ba-progress v-model="progress" :status="status"></ba-progress>
    </div>


    <!--    扫描列表-->
    <div class="px-10">
      <ba-diagnose-list :data="dataList"
                        @completed="onCompleted" @sub-task="onSubTask"
                        @progress="onTaskProgress"></ba-diagnose-list>
    </div>


    <div class="space"></div>
  </panel>
</template>

<script>

module.exports = {
  data: function () {
    return {
      progress: 0,  //进度
      grade: 100,   //分数

      status: 'success', //进度条颜色状态
      title: '智能扫描中',
      subTitle: '正在扫描关联项设置...',
      btnTitle: '取消体检',
      completed: false,  //判断扫描列表是否彻底完成了停止了

      lastTime: '2019-10-17 12：23',  //上次诊断时间

      //评分数据说明  grade的值在 err= true 的情况下会被扣除,总分是100分每次遇到err就累减
      dataList: [
        {
          name: '人员诊断',
          sub: [
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字1', grade: 25, info: '项目说明项目说明项目说明', err: true},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
            {name: '人员诊断项目名字2', grade: 1, info: '项目说明项目说明项目说明'},
          ]
        },
        {
          name: '设备诊断',
          sub: [

            {name: '设备诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 25,err: true},

          ]
        },
        {
          name: '环境诊断',
          sub: [

            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '环境诊断项目1', grade: 1},
            {name: '设备诊断项目1', grade: 25,err: true},
          ]
        },
        {
          name: '管理体系',
          sub: [

            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 25, err: true},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},
            {name: '管理体系项目1', grade: 1},

          ]
        }
      ]
    };
  },
  created: function () {

  },
  mounted: function () {
  },
  methods: {
    //正在运行的子任务
    onSubTask(e) {
      //获取扫描的项目名字
      this.subTitle = '正在扫描' + e.data.name
      //如果错误存在,才扣分
      if (e.data.err) {
        this.grade = this.grade - e.data.grade
      }
      this.change(this.grade) //更新进度条颜色
    },
    //运行完成
    onCompleted(e) {
      if (this.grade < 100) {
        this.title = '系统存在安全问题'
        this.subTitle = '共检测了 <b class="text-pink-500">' + e.count + '</b> 项，以下 <b class="text-pink-500">' + e.err.length + '</b> 项有问题需要修复'
      } else {
        this.title = '系统非常健康'
        this.subTitle = '共检测了 <b class="text-pink-500">' + e.count + '</b> 项，全部没有问题'
      }
      this.btnTitle = '重新开始'
      this.completed = true
    },
    //运行进度百分比
    onTaskProgress(e) {
      this.progress = e
    },

    //更改进度条状态颜色
    change(val) {
      if (val <= 25) {
        this.status = 'danger'
      } else if (val <= 50) {
        this.status = 'warning'
      } else if (val <= 75) {
        this.status = 'primary'
      } else if (val <= 100) {
        this.status = 'success'
      }
    },
    onCancel() { //点击取消的时候,在组件外部触发切换 动态组件的跳转到 start组件
      this.$emit('cancel')
    },
  }
};
</script>

<style scoped>


.grade {
  width: 100px;
  height: 100px;
  background-color: #ffffff;
  border-radius: 50%;
  font-size: 40px;
  font-weight: bold;
  line-height: 90px;
  text-align: center;
  border: 4px #007cdf solid;
}
</style>
