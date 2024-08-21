<style scoped lang="less" type="text/scss">
.chart-divider {
  height: 112px;
}
</style>
<template>
  <section style="display: flex;">
    <section style="width:100%;">
      <section style="margin: 10px; background-color: white; padding: 10px;">
<!--        <section style="margin: 10px; background-color: white; padding: 10px;" v-if="auth">-->
        <article style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <el-radio-group v-model="allShield" size="mini">
              <el-radio-button label="全部">全部
              </el-radio-button>
            </el-radio-group>

            <el-radio-group v-model="levelShield" size="mini" style="margin-left: 5px;">
              <el-radio-button label="0" @click.native="levelShieldClick(0)">P0</el-radio-button>
              <el-radio-button label="1" @click.native="levelShieldClick(1)">P1</el-radio-button>
              <el-radio-button label="2" @click.native="levelShieldClick(2)">P2
              </el-radio-button>
              <el-radio-button label="3" @click.native="levelShieldClick(3)">P3</el-radio-button>
              <el-radio-button label="4" @click.native="levelShieldClick(4)">P4</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="statusShield" size="mini" style="margin-left: 5px;">
              <el-radio-button label="0" @click.native="statusShieldClick(0)">进行中
              </el-radio-button>
              <el-radio-button label="1" @click.native="statusShieldClick(1)">已结束
              </el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <el-date-picker
                size="mini"
                style="width:350px"
                v-model="date"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="left"
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <!--                        <el-input style="width: 300px;margin-left: 5px;" v-model="search" placeholder="请输入搜索内容"-->
            <!--                                  size="mini"></el-input>-->
          </div>
        </article>

        <tableEvent :tableData="tableData" :tableHeaders="tableHeaders"
                    style="width: 100%"
                    heightParam="calc(100vh - 320px)" :loading="fullscreenLoading"
                    @getTableData="getTableData" @tableView="tableView"></tableEvent>
      </section>

    </section>
  </section>
</template>

<script>
import ROUTER_NAME from "@/router/names";
import axios from "axios";
import Vue from 'vue';
import tableEvent from './table-event';


export default {
  name: '',
  components: {tableEvent},
  data() {
    return {
      auth: true,
      allShield: "全部",
      levelShield: null,
      statusShield: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近90天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本周期',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              let timestamp = new Date().getTime()
              start.setTime(parseInt(timestamp / (86400 * 1000 * 7)) * (86400 * 1000 * 7) + 86400 * 1000 * 0.5 - 3600 * 1000 * 26);
              end.setTime(parseInt(timestamp / (86400 * 1000 * 7) + 1) * (86400 * 1000 * 7) + 86400 * 1000 * 0.5 - 3600 * 1000 * 26);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上周期',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              let timestamp = new Date().getTime()
              start.setTime(parseInt(timestamp / (86400 * 1000 * 7) - 1) * (86400 * 1000 * 7) + 86400 * 1000 * 0.5 - 3600 * 1000 * 26);
              end.setTime(parseInt(timestamp / (86400 * 1000 * 7)) * (86400 * 1000 * 7) + 86400 * 1000 * 0.5 - 3600 * 1000 * 26);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上上周期',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              let timestamp = new Date().getTime()
              start.setTime(parseInt(timestamp / (86400 * 1000 * 7) - 2) * (86400 * 1000 * 7) + 86400 * 1000 * 0.5 - 3600 * 1000 * 26);
              end.setTime(parseInt(timestamp / (86400 * 1000 * 7) - 1) * (86400 * 1000 * 7) + 86400 * 1000 * 0.5 - 3600 * 1000 * 26);
              picker.$emit('pick', [start, end]);
            }
          }],
        // disabledDate: function (time) {
        //     return time.getTime() > parseInt(new Date().getTime() / 86400) * 86400 + 86400 * 1000 * 2;
        // }
      },
      statisticsData: {
        "takeOverSize": 0,
        "P-1_num": 0,
        "totalNum": 0,
        "eventNotOverSize": 0,
        "P2_num": 0,
        "takeNotOverSize": 0,
        "eventOverSize": 0
      },
      tableData: [],
      tableHeaders: [
        {
          prop: "alert_rule_name",
          label: "规则名"
        },
        {
          prop: "event_start_time",
          minWidth: 140,
          className: "mid",
          label: "开始时间",
        },
        {
          prop: "event_end_time",
          className: "mid",
          minWidth: 140,
          label: "结束时间",
        },
        {
          prop: "anomaly_continue",
          minWidth: 120,
          label: "持续时间",
        },
        {
          prop: "alert_message",
          minWidth: 60,
          className: "mid",
          label: "级别",
        },
        {
          prop: "event_is_over",
          minWidth: 80,
          className: "mid",
          label: "事件状态",
        },
        // {
        //     prop: "shield_range",
        //     minWidth: 80,
        //     label: "屏蔽状态",
        // },
        {
          prop: "notice_info",
          minWidth: 120,
          label: "通知方式",
        },
        {
          prop: "takeover_by",
          minWidth: 120,
          label: "接手状态",
        },
        {
          prop: "tag",
          minWidth: 120,
          label: "标签",
        },
        {
          prop: "chakan",
          minWidth: 160,
          label: "详情",
        }],
      fullscreenLoading: false,


    }

  },
  methods: {
    doListShield() {
      let timestamp = new Date().getTime()
      let start_timestamp = parseInt(timestamp / 1000) - 3600 * 24 * 7
      let end_timestamp = parseInt(timestamp / 1000)
      let scene_id = this.sceneId; //sidebar
      let date = this.date;
      let search = this.search;
      if (date != '') {
        start_timestamp = parseInt(date[0].getTime() / 1000);
        end_timestamp = parseInt(date[1].getTime() / 1000);
      }

      let path = '/anomaly-detection-manage/api/notification/statisticalFilterEventList';
      let param = {
        sceneId: scene_id,
        search: search,
        startTime: start_timestamp,
        endTime: end_timestamp,
        is_take_over: this.takeoverShield,
        grade: this.levelShield,
        is_event_over: this.statusShield,
      }
      Vue.$http.post(path, param, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => {
        this.statisticsData = res.data;

        let hourPieData =this.statisticsData['hourChart'];
        this.hourBarXData = [];
        this.hourBarSeriesData = [];
        hourPieData.forEach(item => {
          this.hourBarXData.push(parseInt(item.name.slice(0,2)) + '时')
          this.hourBarSeriesData.push(item.value)
        });

        let datePieData =this.statisticsData['dateChart'];
        this.dateBarXData = [];
        this.dateBarSeriesData = [];
        datePieData.forEach(item => {
          this.dateBarXData.push(item.name.slice(5))
          this.dateBarSeriesData.push(item.value)
        });

        this.tagPieData = this.statisticsData['tagChart'];
      }).catch(err => {
        this.fullscreenLoading = false;
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.log(err);
        }
      });
    },
    debounce: function (fn, wait) {
      if (this.fun !== null) {
        clearTimeout(this.fun);
      }
      this.fun = setTimeout(fn, wait);
    },
    getTableData() {
      this.debounce(this.getTableDataOri, 100); //增加0.1s的watch防抖动
      this.doListShield();
    },
    getTableDataOri() {
      this.fullscreenLoading = true;
      //播报详情
      let timestamp = new Date().getTime()
      let start_timestamp = parseInt(timestamp / 1000) - 3600 * 24 * 7
      let end_timestamp = parseInt(timestamp / 1000)
      let scene_id = this.sceneId; //sidebar
      let date = this.date;
      let search = this.search;
      if (date != '') {
        start_timestamp = date[0].getTime() / 1000;
        end_timestamp = date[1].getTime() / 1000;
      }
      let param = {
        sceneId: scene_id,
        startTime: start_timestamp,
        endTime: end_timestamp,
        search: search,
        alertRuleName: search,
        alertRuleId: parseInt(search),
        pageSize: 10000,
        page: 1,
        sortField: 'event_is_over',
        sortType: 'asc',
        filterConf: {
          is_take_over: this.takeoverShield,
          grade: this.levelShield,
          is_event_over: this.statusShield,
        }
      }
      this.tableData = [];
      let path = '/anomaly-detection-manage/api/notification/getNotificationEventInfo';
      let CancelToken = axios.CancelToken;
      const _this = this;
      Vue.$http.post(path, param, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.status == 200) {
          _this.tableData = res.data.data;
          // _this.auth = true;
          _this.fullscreenLoading = false;
        } else if (res.status == 401) {
          _this.tableData = [];
          // _this.auth = false;
          _this.fullscreenLoading = false;
        } else {
          _this.tableData = [];
          _this.fullscreenLoading = false;
        }
        return res;
      }).catch(err => {
        this.fullscreenLoading = false;
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.log(err);
        }
      });
    },
    tableView(row) {
      let query = JSON.parse(JSON.stringify(this.$route.query))
      query.eventId = row.event_id;
      // let query = {"eventId": row.event_id};
      let routeUrl = this.$router.resolve({
        path: "/quick-option/detail-pc",
        query: query
      });
      window.open(routeUrl.href, "_self");
    },
  },
  computed: {
  },
  created() {
    let timestamp = new Date().getTime();
    let start_timestamp = parseInt(timestamp) - 3600 * 24 * 7 * 1000;
    let end_timestamp = parseInt(timestamp);
    this.date = (this.$route.query.startTime == undefined || this.$route.query.endTime == undefined) ? [new Date(start_timestamp), new Date(end_timestamp)] : [new Date(this.$route.query.startTime), new Date(this.$route.query.endTime)];
    this.getTableData()
  },
  watch: {
    search() {
      let query = JSON.parse(JSON.stringify(this.$route.query))
      query.search = this.search.toString();
      this.$router.push({
        name: ROUTER_NAME.event.list,
        query: query
      });
      this.getTableData();
    },
  }
};
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