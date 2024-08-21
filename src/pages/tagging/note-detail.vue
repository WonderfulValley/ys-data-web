<style scoped lang="less" type="text/scss">
.chart-divider {
  height: 112px;
}
</style>
<template>
  <section style="display: flex;">
    222
  </section>
</template>

<script>
import ROUTER_NAME from "@/router/names";
import axios from "axios";
import Vue from 'vue';


export default {
  name: '',
  components: {},
  data() {
    return {
      hourBarSeriesData: [],
    }

  },
  methods: {},
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