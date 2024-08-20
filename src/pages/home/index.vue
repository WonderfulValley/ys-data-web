<style scoped lang="less" type="text/scss">
/**
 *   TODO 编写组件 CSS
 *   Lucky : 2022/1/5 7:03 下午
 **/
</style>
<template>
  <div>
    <div class="capacity-info">
      <div class="chart">
        标注总览
        <trend-chart :chartData="chartData1" :legend="legend1"
                     :dataX="chartDataX1"
        ></trend-chart>
        爬虫总览
        <trend-chart :chartData="chartData1" :legend="legend1"
                     :dataX="chartDataX1"
        ></trend-chart>
      </div>
    </div>
  </div>
</template>

<script>
/**
 *   TODO 编写 JS
 *   Lucky : 2022/1/5 7:04 下午
 **/
import trendChart from "../../components/charts/trend-chart";

export default {
  components: {trendChart},
  computed: {},
  name: 'home-page',
  data() {
    return {
      date: [],
      legend1: [],
      chartDataX1: [],
      chartData1: [],
    }
  },
  watch: {
    date: {
      handler(date) {
        if (!_.isNil(date)) {
          this.getRuleDetailTrend();
        }
      },
    },
  },
  methods: {

    renderChartData(data, num) {
      let obj = {
        name: '标注博主数量',
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
        ]
      }
      let obj2 = {
        name: '标注图片数量',
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      }
      this['legend' + num] = ['标注博主数量', '标注图片数量'];
      this['chartDataX' + num] = ['8-11', '8-12', '8-13', '8-14', '8-15', '8-16', '8-17', '8-18', '8-19', '8-20', '8-21', '8-22'];
      // this['chartDataX' + num] = [1702387200, 1702473600, 1702560000, 1702646400, 1702732800, 1702819200, 1702905600, 1702992000, 1703078400, 1703164800, 1703251200, 1703337600];
      this['chartData' + num] = [obj,obj2];
    },
    getRuleDetailTrend() {
      //todo 此处可能会有多个evaluatorId
//获取规则的趋势
      let timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      let startTime = timestamp - 3600 * 3;
      let endTime = timestamp;
      let date = this.date;
      if (date != '') {
        startTime = date[0].getTime() / 1000;
        endTime = date[1].getTime() / 1000;
      }
      let resultData = {}
      // //todo 替换参数
      // Vue.$http.post('/anomaly-detection-manage/api/rule/getRuleEvaluatorData', {
      //   "startTime": startTime,
      //   "endTime": endTime,
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // }).then(res => {
      //   let resultData = res.data;
      //   //处理predict
      this.renderChartData(resultData, 1);
      // }).catch(err => {
      //   if (axios.isCancel(err)) {
      //     console.log('Request canceled', err.message);
      //   } else {
      //     console.log(err);
      //   }
      // });

    },
  },
  created() {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    let startTime = timestamp - 3600 * 3;
    let endTime = timestamp;
    this.date = [new Date(startTime * 1000), new Date(endTime * 1000)];
    this.getRuleDetailTrend();

  },
}
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}
</script>
