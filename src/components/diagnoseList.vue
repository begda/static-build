<template>
  <div>

    <el-collapse v-model="collapseActive" accordion>
      <!--      显示错误列表-->
      <el-collapse-item class="fade-in-top" name="err" v-if="completed">
        <template slot="title">
          <div class="flex justify-between text-pink-500">
            <div>
              <div style="margin-top: 15px; margin-right: 3px">
                <i class="el-icon-warning-outline " style="font-size:18px"></i>
              </div>
            </div>
            <div>问题项目</div>
          </div>
        </template>
        <template>
          <div class="flex justify-between py-2 px-6 " v-for="(item,key) in errList ">
            <div style="width:200px" class="fade-in-left">
              <el-tag type="info" size="mini" class="fade-in-left"> {{key+1}}</el-tag>
              {{item.data.name}}
            </div>
            <div class="flex-1 text-gray-400 fade-in-left">{{item.data.info}}</div>
            <div class=" fade-in-left">
              <span class="text-pink-500">有问题</span>
            </div>
            <div class=" fade-in-left" style="margin-left: 30px">
              <span class="text-blue-500 cursor-pointer hover:text-blue-900"> 查看<i
                  class="el-icon-arrow-right"></i></span>
            </div>
          </div>
        </template>
      </el-collapse-item>
      <!--      /显示错误列表-->

      <!--      显示扫描一级列表-->
      <el-collapse-item class="fade-in-top" :key="key" :title="item.name" :name="key" v-for="(item,key) in list">
        <template slot="title">
          <div class="flex justify-between text-blue-900">
            <div>
              <!--                默认显示显示图标-->
              <template v-if="item.loading===1">
                <div style="margin-top: 15px; margin-right: 3px">
                  <i class="el-icon-monitor " style="font-size:18px"></i>
                </div>
              </template>
              <!--                运行时候显示图标-->
              <template v-if="item.loading===2">
                <div style="margin-top: 15px; margin-right: 3px" class="rotate-in-center ">
                  <i class="el-icon-refresh " style="font-size:18px"></i>
                </div>
              </template>
              <!--                运行完成显示图标-->
              <template v-if="item.loading===3">
                <div style="margin-top: 15px; margin-right: 3px ">
                  <i class="el-icon-circle-check" style="font-size:18px"></i>
                </div>
              </template>
            </div>
            <div style="width: 70px">{{item.name}}</div>
            <div class="text-gray-500 font-normal text-justify" style="width: 60px;">共 {{errCount(item.sub).count}}
              项
            </div>
            <div class="text-gray-500 font-normal text-justify">问题 <span class="text-pink-500	">{{errCount(item.sub).err}}</span>
              项
            </div>
          </div>
        </template>

        <!--        循环sub列表-->
        <template v-for="(item2,key2) in item.sub">
          <div class="flex justify-between py-2 px-6 " v-show="item2">
            <div class="fade-in-left" style="width:28px">
              <div style="height: 2px"></div>
              <template v-if="item2.err">
                <el-tag type="danger" size="mini" class="fade-in-left"> {{key2+1}}</el-tag>
              </template>
              <template v-else>
                <el-tag type="info" size="mini" class="fade-in-left"> {{key2+1}}</el-tag>
              </template>
            </div>
            <div class="fade-in-left" style="width:200px">{{item2.name}}</div>
            <div class="flex-1 text-gray-400 fade-in-left">{{item2.info}}</div>
            <div class=" fade-in-left">
              <template v-if="item2.err"><span class="text-pink-500">有问题</span></template>
              <template v-else><span class="text-green-500">已完成</span></template>
            </div>
            <div class=" fade-in-left" style="margin-left: 30px">
              <span class="text-blue-500 cursor-pointer hover:text-blue-900"> 查看<i
                  class="el-icon-arrow-right"></i></span>
            </div>
          </div>
        </template>
        <!--        /循环sub列表-->
      </el-collapse-item>
      <!--      /显示扫描一级列表-->
    </el-collapse>
  </div>
</template>

<script>


module.exports = {
  props: {
    data: {type: [Array]}
  },
  data() {
    return {
      completed: false,  //判断定时器是否彻底完成了停止了
      collapseActive: '1', //折叠面板选中
      list: [],           //接受整理好的数据,在页面上显示
      timer: {},          //定时任务全局变量
      errList: [],        //收集错误的列表
    };
  },
  //定义私用局部过滤器。只能在当前 vue 对象中使用
  filters: {
    errCount: (val) => { // msg表示要过滤的数据，a表示传入的参数
      let errArr = []
      let doneArr = []
      val.map(item => {
        console.log(item)
        if (item.err) {
          errArr.push(item)
        } else {
          doneArr.push(item)
        }
      })
      return `-共检查 ${val.length} 项 , 有 ${errArr.length} 项问题 `
    }
  },
  watch: {},
  created: function () {
    const {TaskTimer} = tasktimer;
    this.timer = new TaskTimer(1000);
    this.countGrade()
  },
  mounted() {

  },
  computed: {
    dataList() {
      return this.data
    }
  },
  methods: {
    errCount(val) {
      let errArr = []
      let doneArr = []
      val.map(item => {
        console.log(item)
        if (item.err) {
          errArr.push(item)
        } else {
          doneArr.push(item)
        }
      })
      // return `-共检查 ${val.length} 项 , 有 ${errArr.length} 项问题 `
      return {count: val.length, err: errArr.length}
    },
    onCollapseChange(e) {
      console.log(e)
    },
    countGrade() {
      //创建list数组并且插入一级内容
      this.dataList.map(item => {
        this.list.push({name: item.name, grade: item.grade, sub: []})
      })


      let self = this
      let tickDelay = 0  //从第一秒开始执行
      let lastTickDelay = 0 //存储上次运行的次数,默认开始是0, 这个是一直累加的状态,直到所有的数组都跑完
      this.dataList.map((item, key) => {
        self.list[key].loading = 1 // 默认显示显示图标状态
        let subLength = item.sub.length
        let totalRuns = subLength
        //如果key 大于或者等于0 说明
        if (key === 0) {
          tickDelay = 0
          lastTickDelay = lastTickDelay + subLength  //用 上次运行的次数 加上 现在sub字数组的长度,就是这次起始的时间
          // console.log('上次的运行次数',lastTickDelay)
        } else if (key > 0) {
          lastTickDelay = lastTickDelay + subLength   //用 上次运行的次数 加上 现在sub字数组的长度,就是这次起始的时间
          // console.log('上次的运行次数',lastTickDelay)
          /*
          * 这里是重点,说明一下
          * lastTickDelay - subLength 是因为本次运行的时候,是紧接着上次运行的,所有要用上次运行的次数减去本次运行次数
          * (lastTickDelay - subLength)+1 再加一 是因为本次运行完了以后,再往下执行一次才能显示下一个,如果不加一,就会造成本次无法显示完整
          * */
          tickDelay = (lastTickDelay - subLength) + 1
        }
        console.log(item.name, '从第(' + tickDelay + ')次开始 -', '至第(' + lastTickDelay + ')次结束_______', 'sub数组长度', subLength)

        let task = {
          id: item.name + "-" + key, // unique ID of the task
          tickDelay: tickDelay, //开始暂定多少秒执行
          tickInterval: 1, // 设置几秒钟运行一次
          totalRuns: totalRuns, // 循环次数 设置0表示无限循环
          callback(task) {
            self.collapseActive = key   //展开对应的手风琴菜单
            self.list[key].loading = 2  //运行时候显示图标状态
            if (task.currentRuns <= subLength) {
              //给list列表添加sub子内容 . task.currentRuns - 1 是因为数组是从0开始计数的
              self.list[key].sub.push(self.dataList[key].sub[task.currentRuns - 1])
              //当前子任务正在运行事件
              self.$emit('sub-task', {id: item.name, data: self.dataList[key].sub[task.currentRuns - 1]})
              //收集错误的列表,单独存储
              if (self.dataList[key].sub[task.currentRuns - 1].err) {
                self.errList.push({id: item.name, data: self.dataList[key].sub[task.currentRuns - 1]})
              }
              if (task.currentRuns === subLength) {
                self.list[key].loading = 3 //运行完成显示图标状态
                self.$emit('sub-task-done', {id: item.name + "-" + key, data: self.list[key]}) //当前子任务完成
              }
            }
          },
        }
        self.timer.add(task)
      })


      self.timer.on('tick', (e) => {
        //获取当前运行的百分比
        if (self.timer.tickCount <= lastTickDelay) {
          let baifenbi = (self.timer.tickCount / lastTickDelay) * 100
          self.$emit('progress', baifenbi) //运行进度的百分比
        }
        self.$emit('tickCount', self.timer.tickCount) //运行顺序事件
        if (self.timer.tickCount > lastTickDelay) { // lastTickDelay 是运行总次数
          self.timer.stop()  //停止定时器
        }
      });

      //当所有任务都已完成其所有执行（运行）或达到其停止日期/时间（如果已设置）时发出。请注意，仅当所有任务都设置了总运行次数限制或停止日期值时，才会触发此事件。
      self.timer.on('completed', () => {
        if (self.errList.length > 0) {
          //有错误的时候,显示错误折叠面板
          self.collapseActive = 'err'
          self.completed = true
        }
        self.$emit('completed', {count: lastTickDelay, err: self.errList}) //停止定时器
      });
      self.timer.start(); //启动定时器
    }
  }
};
</script>

<style scoped>
.fade-in-left {
  animation: fade-in-left .3s cubic-bezier(.39, .575, .565, 1.000) both
}

.fade-in-top {
  animation: fade-in-top .1s cubic-bezier(.39, .575, .565, 1.000) both
}

.fade-in-right {
  animation: fade-in-right .6s
}

/*旋转动画*/
.rotate-in-center {
  animation: rotate-in-center 1s linear infinite
}

@keyframes rotate-in-center {
  0% {
    transform: rotate(360deg);
    opacity: 1
  }
  100% {
    transform: rotate(0);
    opacity: 1
  }
}

@keyframes fade-in-right {
  0% {
    transform: translateX(50px);
    opacity: 0
  }
  100% {
    transform: translateX(0);
    opacity: 1
  }
}

@keyframes fade-in-top {
  0% {
    transform: translateY(-20px);
    opacity: 0
  }
  100% {
    transform: translateY(0);
    opacity: 1
  }
}


@keyframes fade-in-left {
  0% {
    transform: translateX(-20px);
    opacity: 0
  }
  100% {
    transform: translateX(0);
    opacity: 1
  }
}
</style>
