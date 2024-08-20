<style scoped lang="less" type="text/scss">
.chart {
    width: 100%;
    height: 100%;
}
</style>

<template>
    <div class="chart" ref="chart"></div>
</template>

<script>
export default {
    data() {
        return {
            chart: null,
        };
    },
    props: {
        pieData: {
            type: Array,
            default: function () {
                return [];
            },
        },
        title: {
            type: String,
            default: function () {
                return "-";
            },
        },
        tooltip: {
            type: String,
            default: function () {
                return "-";
            },
        },
    },
    computed: {
        option() {
            return {
                color: [
                    "#8B5CFF",
                    "#00CA69",
                    "#37a2da",
                    "#32c5e9",
                    "#9fe6b8",
                    "#ffdb5c",
                    "#ff9f7f",
                    "#fb7293",
                    "#e7bcf3",
                    "#8378ea",
                    "#87CEFA",
                    "#7FFFAA",
                    "#3CB371",
                    "#FFFF00",
                    "#F0E68C",
                    "#FFA500",
                    "#FFDEAD",
                    "#FFE4E1",
                    "#808000",
                    "#40E0D0",
                ],
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                toolbox: {
                    show: true,
                },
                title: {
                    text: this.title,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: "#666", //颜色
                        fontSize: 14,
                        formatter: function(params) {
                            return params + '1'
                        }
                    },
                },
                legend: {
                    type: "scroll",
                    left: "center",
                    top: "10",
                    textStyle: {
                        color: "#8C8C8C",
                    },
                    height: 150,
                },
                series: [
                    {
                        name: this.tooltip,
                        type: "pie",
                        minAngle: 10,
                        radius: ['35%', '60%'],
                        center: ["50%", "50%"],
                        data: this.pieData,
                    },
                ],
            };
        },
    },
    watch: {
        option: {
            immediate: true,
            handler(option) {
                this.$nextTick(() => {
                    try {
                        this.chart.resize();
                        this.chart.setOption(option);
                    } catch (e) {
                        this.initChart();
                    }
                });
            },
        },
    },
    methods: {
        initChart() {
            if (this.chart == null) {
                this.chart = echarts.init(this.$refs.chart);
                this.chart.resize();
                this.chart.setOption(this.option);
            }
        },
        chart_resize() {
            this.$nextTick(() => {
                try {
                    this.chart.resize();
                } catch (e) {
                    this.chart = null;
                }
            });
        },
    },
    mounted() {
        window.addEventListener("resize", this.chart_resize);
    },
    beforeDestroy() {
        if (this.chart != null) {
            this.chart.dispose();
        }
        window.removeEventListener("resize", this.chart_resize);
    },
};
</script>