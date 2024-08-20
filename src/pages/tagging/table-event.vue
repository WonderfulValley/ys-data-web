<style scoped lang="less" type="text/scss">
    .content-css {
        width: 100%;
        height: 100%;
    }

    .content-css /deep/ .el-table__header .cell {
        color: #666666;
        font-weight: normal;
        line-height: 25px;
    }

    .content-css /deep/ .el-table th, .el-table td {
        padding: 3px;
    }

    .content-css /deep/ .el-table__header .cell {
        color: #666666;
        font-weight: normal;
        line-height: 25px;
    }

    .content-css /deep/ .el-table th, .el-table td {
        padding: 3px;
        font-size: xx-small;
    }

    .content-css /deep/ .el-table__row .cell {
        color: #666666;
    }

    .content-css /deep/ .el-button--primary {
        color: #FFFFFF;
        background-color: #409eff;
        border-color: #409eff;
    }

    #elTable /deep/ .showBackColor {
        background-color: #6d2ba4;
    }

    #elTable /deep/ .el-table__body tr.current-row > td.el-table__cell {
        background-color: @main-1;
    }

    .wrap {

        & /deep/ img {
            width: 100%;
        }

        & /deep/ p {
            padding-bottom: 0.5rem;
        }

        & /deep/ strong {
            line-height: 25px;
        }
    }

    #elTable /deep/ .el-table__header .table-header-class-name .cell {
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        /*background-color: #eeeeee;*/
    }

    #elTable /deep/ .el-table__header .table-header-class-name th {
        background-color: #f0f0f0;
    }

    #elTable /deep/ .mid .cell {
        text-align: center;
    }

    #elTable /deep/ span {
        font-size: 12px;
    }

</style>

<template>
    <div class="content-css">
        <div class="info-css">
            <el-table
                    :data="tmpUTableData"
                    :row-key="rowKeyFunc"
                    id="elTable"
                    ref="table"
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="拼命加载中"
                    :height="height"
                    header-row-class-name="table-header-class-name"
                    :default-sort='{prop: defaultOrder, order: "descending"}'
                    style="font-size: xx-small;line-height: 25px;"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    :highlight-current-row="true"
            >
                <div slot="empty">
                    <el-empty :image-size="200" description="此场景下暂无事件"></el-empty>
                </div>

                <el-table-column
                        v-for="(item, index) in headers" :key="index"
                        :column-key="index + ',' + item.isString"
                        show-overflow-tooltip
                        sortable
                        :width="item.minWidth"
                        :prop="item.prop"
                        :label="item.label">
                    <template slot-scope="scope">
                        <span v-if="item.prop == 'event_start_time'">
                            <span>{{typeof scope.row.event_start_time != "undefined" && scope.row.event_start_time > 1259510400 && scope.row.event_start_time < 2521814400 ? new Date(scope.row.event_start_time * 1000).format('yyyy-MM-dd hh:mm:ss') : "未知日期"}}</span>
                        </span>
                        <span v-else-if="item.prop == 'event_end_time'">
                            <span v-if="scope.row.event_is_over == 0">进行中</span>
                            <span v-if="scope.row.event_is_over == 1">{{typeof scope.row.event_end_time != "undefined" && scope.row.event_end_time > 1259510400 && scope.row.event_end_time < 2521814400 ? new Date(scope.row.event_end_time * 1000).format('yyyy-MM-dd hh:mm:ss') : "未知日期"}}</span>
                        </span>
                        <span v-else-if="item.prop == 'tag'">
                            <tag-render :tag="scope.row.tag"></tag-render>
                        </span>
                        <span v-else-if="item.prop == 'takeover_by'">
                            <span v-if="typeof scope.row.take_over_user != 'undefined'">{{scope.row.take_over_user}} 已接手</span>
                            <span v-else>未接手</span>
                        </span>
                        <span v-else-if="item.prop == 'feed_back_type'">
                            <el-dropdown @command="feedbackCommand">
                              <el-button
                                      :type="typeof(scope.row[item.prop])!='undefined'?(scope.row[item.prop]=='正确'?'success':'primary'):''"
                                      size="mini">
                                {{typeof(scope.row[item.prop])!='undefined'?scope.row[item.prop]:'暂无'}}<i
                                      class="el-icon-arrow-down el-icon--right"></i>
                              </el-button>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="[scope.row,3]">正确</el-dropdown-item>
                                <el-dropdown-item :command="[scope.row,1]">误报</el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                        </span>
                        <span v-else-if="item.prop == 'chakan'">
                            <el-link type="primary"
                                     style="margin-right: 10px;font-size: 12px;" @click="takeOver(scope)">接手</el-link>
                            <el-popover
                                    placement="left"
                                    width="500"
                                    trigger="click">
                                <div class="panding" style="">
                                    <div style="margin-bottom:0.3rem; width: 100%;" class="border-tag">
                                        <span style="color: SeaGreen;margin-left: 10px;margin-right: 20px;">正确播报</span>
                                        <br/>
                                        <el-radio v-model="tag" label="活动" size="mini" class="green-radio"
                                                  style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px;"
                                                  border>&emsp;活&emsp;动&emsp;
                                        </el-radio>
                                        <el-radio v-model="tag" label="故障" size="mini" class="green-radio" border>&emsp;故&emsp;障&emsp;
                                        </el-radio>
                                        <el-radio v-model="tag" label="压测" size="mini" class="green-radio" border>&emsp;压&emsp;测&emsp;
                                        </el-radio>
                                        <el-radio v-model="tag" label="变更" size="mini" class="green-radio" border>&emsp;变&emsp;更&emsp;
                                        </el-radio>
                                        <el-radio v-model="tag" label="爬虫" size="mini" class="green-radio" border>&emsp;爬&emsp;虫&emsp;
                                        </el-radio>
                                        <el-radio v-model="tag" label="需要关注" size="mini" class="green-radio" border>&emsp;需要关注</el-radio>
                                        <br/>
                                        <br/>
                                        <span style="color: FireBrick;margin-top: 15px;margin-left: 10px;margin-right: 20px;">错误播报</span>
                                        <br/>
                                        <el-radio v-model="tag" label="波动小" size="mini" class="red-radio"
                                                  style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px;"
                                                  border>&emsp;波动小&emsp;
                                        </el-radio>
                                        <el-radio v-model="tag" label="数据源延迟" size="mini" class="red-radio" border>数据源延迟
                                        </el-radio>
                                        <el-radio v-model="tag" label="定时出现" size="mini" class="red-radio" border>&emsp;定时出现
                                        </el-radio>
                                        <el-radio v-model="tag" label="无需关注" size="mini" class="red-radio" border>&emsp;无需关注
                                        </el-radio>

                                        <br/>
                                        <br/>
                                        <div style="">
                                            <div style="margin-top: 15px;margin-left: 10px;margin-right: 30px;height: 70px;verticle-align:top;display: inline-block;">
                                                其他信息
                                            </div>
                                            <el-input
                                                    type="textarea"
                                                    :rows="3"
                                                    placeholder="其他信息"
                                                    style="display: inline-block;width: calc(100% - 110px);"
                                                    v-model="textarea">
                                            </el-input>
                                        </div>
                                        <div style="text-align:right;background: #fff;margin-top: 10px;">
                                            <el-button size="" type="primary" round
                                                       style="margin-bottom: 15px;margin-right: 15px;"
                                                       @click="makeTag(scope)">保存
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                            <el-link type="primary" style="margin-right: 10px;font-size: 12px;" slot="reference"
                                     @click="biaozhuClick(scope)">标注</el-link>
                            </el-popover>

                            <el-link type="primary" @click="tableView(scope.row)" style="font-size: 12px;">详情</el-link>
                        </span>
                        <span v-else-if="item.prop == 'shield_range'">
                            <span>
                                <span v-if="scope.row.shield_range != null">{{scope.row.shield_range}}</span>
                                <span v-else>未屏蔽</span>
                            </span>
                        </span>
                        <span v-else-if="item.prop == 'alert_message'">
                            P2
                            <!--                            <span v-if="typeof scope.row.alert_message == 'undefined'">系统错误（alert_message为空）</span>-->
                            <!--                            <span v-else-if="scope.row.alert_message.grade>0">P{{scope.row.alert_message.grade}}</span>-->
                            <!--                            <span v-else>错误配置（{{scope.row.alert_message.grade}}）</span>-->
                        </span>
                        <span v-else-if="item.prop == 'event_is_over'">
                            <span v-if="scope.row.event_is_over == 1">已结束</span>
                            <span v-else-if="scope.row.event_is_over == 0">进行中</span>
                            <span v-else>未知</span>
                        </span>
                        <span v-else-if="item.prop == 'evaluator_id'">
                            <span v-if="typeof scope.row.evaluator_id == 'undefined'">系统错误（alert_message为空）</span>
                            <span v-else>{{scope.row.evaluator_id}}</span>
                        </span>
                        <span v-else-if="item.prop == 'anomaly_continue'">
                            <span>{{renderAnomalyContinue(scope.row)}}</span>
                        </span>
                        <span v-else-if="item.prop == 'notice_info'">
<!--                            * 应用号播报。播报群：公测：Kwai异常检测 oncall 吴成伟 SRE-oncall 王鑫。圈人信息：all。-->
                        <span>
                        </span>
                        </span>
                        <span v-else>{{scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-button
                    v-if="isShowDownLoad"
                    type="primary"
                    @click="outputData"
                    size="mini"
                    style="float: right; border-radius: 0.3rem; height: 1.7rem; padding: 5px 10px 5px 10px;margin-top: 6px;">
                导出数据
            </el-button>

            <el-pagination
                    v-if="isPagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :pager-count="pagerCount"
                    :total="totalPages"
                    style="border-radius: 0.3rem;margin-top: 3px;font-size: x-small"
                    ref="elPagination">
            </el-pagination>
        </div>

        <el-dialog
                :title="dialogRow.uniq_name"
                :visible.sync="centerDialogVisible"
                width="50%">
            <div class="wrap">
                <el-row>

                    <el-col span=10>
                    </el-col>
                    <el-col span=4>
                        <span><br/></span>
                    </el-col>
                    <el-col span=10>

                        <p style="font-weight: bold; padding: 0 0 5px 0.5rem">
                            <span>操作记录</span>
                        </p>

                        <div class="time_line"
                             v-if="activities != undefined && activities!= null && activities.length > 0">
                            <el-timeline :reverse="false">
                                <el-timeline-item
                                        v-for="(activity, index) in activities"
                                        :key="index"
                                        placement="top"
                                        :color="activity.feed_back_code == 1 ? 'orangered' : (activity.feed_back_code == 2 ? 'orange' : '#0bbd87')"
                                        :timestamp="index == 0 ? activity.create_timestamp + '（最近）' : activity.create_timestamp">
                                    <div>
                                        <span>操作人：</span>
                                        <span style="margin-right:1rem">{{activity.user}}</span>
                                        <span>操作类型：</span>
                                        <span :style="{color: activity.feed_back_code == 1 ? 'orangered' : (activity.feed_back_code == 2 ? 'orange' : '#0bbd87')}">{{activity.feed_back_type}}</span>
                                        <div v-if="activity.shield_range != undefined && activity.shield_range != null">
                                            <span style="">忽略</span>
                                            <span>时段：</span>
                                            <div v-for="range in JSON.parse(activity.shield_range)">
                                                <span>{{range.start}}</span>
                                                <span> - </span>
                                                <span>{{range.end}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                        <div v-else>
                            暂无记录
                        </div>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import _ from 'lodash';
    import {bubbleSort, numIndicatorFilter} from "@/utils/utils";
    import {dateFormat} from "@/utils/date";
    import FileSaver from 'file-saver';// 用于数据导出的依赖插件
    import XLSX from 'xlsx';
    import axios from "axios";
    import Vue from 'vue';
    import ROUTER_NAME from "@/router/names";


    export default {
        name: "",
        components: {
        },
        props: {
            // 默认排序列
            defaultSort: {
                type: String,
                default: '',
            },
            // 表格 title
            tableHeaders: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            // 表格数据
            tableData: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            // 查询过滤字段
            filter: {
                type: String,
                default: '',
            },

            loading: {
                type: Boolean,
                default: false,
            },

            heightParam: {
                type: String,
                default: '',
            },
            oncall: {
                type: Boolean,
                default: false,
            },

            isShowDownLoad: {
                type: Boolean,
                default: true,
            },

            isPagination: {
                type: Boolean,
                default: true,
            },

            filterIndicator: {
                type: Array,
                default: function () {
                    return [];
                },
            },

            isRemoteDownLoad: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                showBackColor: '',
                headers: [],
                defaultOrder: null,
                tmpUTableData: [],
                allData: [],
                totalPages: 0,//总页数
                currentPage: 1, //当前页数
                pageSizes: [10, 20, 50, 100, 500, 1000, 2000],//每页显示个数选择器的选项设置
                pageSize: 10,// 每页显示条数
                pagerCount: 5,
                height: '',
                centerDialogVisible: false,
                dialogRow: '',
                activities: [],
                tag: '',
                textarea: '',

            }
        },
        computed: {},
        watch: {
            heightParam: {
                immediate: true,
                handler(heightParam) {
                    this.height = heightParam;
                }
            },

            filter(val) {
                this.allData = [];
                this.tableData.forEach(item => {
                    for (let i = 0; i < this.headers.length; i++) {
                        if (!_.isNil(item[this.headers[i].prop]) && _.toLower(item[this.headers[i].prop]).indexOf(_.toLower(val)) != -1) {
                            this.allData.push(item);
                            break;
                        }
                    }
                });
                this.totalPages = this.allData.length;
                this.currentPage = 1;
                this.currentPageChange(this.allData, this.currentPage);
            },

            defaultSort: {
                watch: true,
                handler(defaultSort) {
                    if (!_.isNil(defaultSort)) {
                        this.defaultOrder = defaultSort;
                    }
                }
            },
            tableHeaders: {
                watch: true,
                handler(tableHeaders) {
                    this.headers = [];
                    if (_.isArray(tableHeaders) && tableHeaders.length > 0) {
                        this.headers = tableHeaders;
                    }
                }
            },
            tableData: {
                watch: true,
                handler(tableData) {
                    this.initTable(tableData);
                }
            },

            filterIndicator: {
                watch: true,
                handler(filterIndicator) {
                    if (_.isArray(filterIndicator) && filterIndicator.length > 0) {
                        this.allData = JSON.parse(JSON.stringify(this.tableData));
                        filterIndicator.forEach(item => {
                            this.allData = numIndicatorFilter(this.allData, item.indicator, item.conditionFilter, item.condition);
                        });
                        this.totalPages = this.allData.length;
                        this.currentPage = 1;
                        this.currentPageChange(this.allData, this.currentPage);
                    }
                }
            },

        },
        methods: {
            rowKeyFunc(row) {
                return row.event_id + '_' + _.get(row, 'updateRowKeyTime', '0');
            },
            getTableData() {
                this.$emit('getTableData');
            },
            submit() {
                return null;
            },
            // 排序
            sortChange(col) {
                //持续时间
                if (col.column.columnKey.split(',')[1] == 'false') {
                    this.allData = bubbleSort(this.allData, col.prop, col.order, false);
                } else {
                    this.allData = bubbleSort(this.allData, col.prop, col.order, true);
                }
                this.totalPages = this.allData.length;
                this.currentPage = 1;
                this.currentPageChange(this.allData, this.currentPage);
            },

            // 初始化表格
            initTable(data) {
                this.allData = data;
                this.totalPages = this.allData.length;
                this.currentPage = 1;
                this.currentPageChange(this.allData, this.currentPage);
            },

            tableView(row) {
                this.$emit('tableView', row);

                // let query = JSON.parse(JSON.stringify(this.$route.query))
                // query.search = this.search.toString();
                // let query={"aaa":"bbb"};
                // let routeUrl = this.$router.resolve({
                //     path: "/quick-option/detail-pc",
                //     query: query
                // });
                // window.open(routeUrl.href,"_blank");
            },

            takeOver(scope) {
                //记录接手状态
                let feedback_result = this.saveFeedback('接手', scope.row.event_id, scope.row.alert_rule_id, scope.row.evaluator_id,
                    scope.row.alert_notification_id, scope.row.strategy_id, scope.row.event_start_time,
                    scope.row.anomaly_continue, 3, null, null, this.textarea, '接手')
                //前端更新已接手
                if (feedback_result) {
                    let newRow = scope.row;
                    newRow.take_over_user = _.get(this.$store.getters['login/userInformation'], 'userName', '未知用户');
                    newRow.updateRowKeyTime = new Date().getTime();//通过更新rowKey，达到刷新的目的
                    this.$set(this.tmpUTableData, scope.$index, newRow);
                }
            },

            makeTag(scope) {
                let tag_feedbackcode_map = {
                    '活动': 6,
                    '故障': 6,
                    '压测': 6,
                    '变更': 6,
                    '爬虫': 6,
                    '需要关注': 6,
                    '波动小': 7,
                    '定时出现': 7,
                    '数据源延迟': 7,
                    '无需关注': 7,
                };
                let code_type_map = {
                    6: '正确',
                    7: '错误'
                };

                //记录接手状态
                this.saveFeedback('标注', scope.row.event_id, scope.row.alert_rule_id, scope.row.evaluator_id,
                    scope.row.alert_notification_id, scope.row.strategy_id, scope.row.event_start_time,
                    scope.row.anomaly_continue, tag_feedbackcode_map[this.tag], null, this.tag, this.textarea, code_type_map[tag_feedbackcode_map[this.tag]]);
                //前端更新已接手
                let newRow = scope.row;
                newRow.updateRowKeyTime = new Date().getTime(); //通过更新rowKey，达到刷新的目的
                newRow.tag = this.tag;
                // if (typeof newRow.alert_feedback != 'undefined') {
                //     newRow.alert_feedback.tag = this.tag; //更新tag
                // } else {
                //     newRow.alert_feedback = {};
                //     newRow.alert_feedback.tag = this.tag; //更新tag
                // }
                this.$set(this.tmpUTableData, scope.$index, newRow);
            },

            biaozhuClick(scope) {
                this.tag = scope.row.tag
            },

            //正在沟通接口，6个参数看起来没啥必要
            saveFeedback(message, event_id, alert_rule_id, evaluator_id, alert_notification_id, strategy_id, event_start_time, anomaly_continue, feed_back_code, shield_range, tag, desc, feed_back_type) {
                let param = {
                    event_id: event_id,
                    // alert_rule_id: alert_rule_id,
                    // evaluator_id: evaluator_id,
                    // alert_notification_id: alert_notification_id,
                    // strategy_id: strategy_id,
                    // event_start_time: event_start_time,
                    // anomaly_continue: anomaly_continue,
                    shield_range: shield_range,
                    desc: desc,
                    feed_back_code: feed_back_code,
                    feed_back_type: feed_back_type,
                    tag: tag
                };
                param.version = 1;

                Vue.$http.post('/anomaly-detection-manage/api/feedBack/saveFeedBack', param, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    if (_.isObject(res) && res.status == 200) {
                        this.$message.success(message + "成功");
                        return true;
                    } else {
                        if (feed_back_code == 3) {
                            this.$message.error(message + "失败:" + res.message);
                        } else {
                            this.$message.error(message + "失败(" + res.status + ")");
                        }
                        return false;
                    }
                }).catch(err => {
                    console.log(err);
                });

            },


            // 分页回调函数
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPageChange(this.allData, this.currentPage);

            },
            // currentPage 改变时会触发的回调函数
            handleCurrentChange(val) {
                this.currentPage = val;
                this.currentPageChange(this.allData, this.currentPage);
            },


            handleFeedback(row, desc) {
                //进行反馈
                let path = '/feedback/updateAlertFeedBack?uniq_id=' + row.uniq_id + '&feed_back_type=' + desc + '&desc=' + desc + '&tag=';
                let CancelToken = axios.CancelToken;
                const _this = this;
                Vue.$http.get(path, {
                    cancelToken: new CancelToken(function executor(c) {
                        _this.source = c;
                    })
                }).then(res => {
                    _this.tableData = res.data;
                    return res;
                }).catch(err => {
                    if (axios.isCancel(err)) {
                        console.log('Request canceled', err.message);
                    } else {
                        console.log(err);
                    }
                });

                this.getTableData();
            },
            // 页码状态发生变化时，修改tmpUTableData
            currentPageChange(allData, currentPage) {
                let from = (currentPage - 1) * this.pageSize;
                let to = currentPage * this.pageSize;
                this.tmpUTableData = [];
                for (; from < to; from++) {
                    if (allData[from]) {
                        this.tmpUTableData.push(allData[from]);
                    }
                }
            },


            //导出表格数据（全部数据）
            outputData() {
                if (this.isRemoteDownLoad) { // 后端下载
                    this.$emit('remoteDownLoad');
                } else {
                    let tmpUdata = this.tmpUTableData;
                    this.tmpUTableData = this.allData;
                    this.$nextTick(() => {
                        /* generate workbook object from table */
                        var xlsxParam = {raw: true}; // 导出的内容只做解析，不进行格式转换
                        let wb = XLSX.utils.table_to_book(document.querySelector('#elTable'), xlsxParam);
                        /* get binary string as output */
                        var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
                        try {
                            FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '导出数据_' + dateFormat(new Date()) + '.xlsx');
                        } catch (e) {
                            if (typeof console !== 'undefined') {
                                console.log(e, wbout);
                            }
                        }
                        this.tmpUTableData = tmpUdata;
                    });
                }
            },

            // 获取用户操作记录信息
            getUserOptionRecord(indicator_id, first_occur_time) {
                this.activities = [];
                let param = {
                    indicatorId: indicator_id,
                    firstOccurTimestamp: first_occur_time,
                };
                this.$store.dispatch('quickOption/queryUserOptionRecord', param).then(response => {
                    // 请求失败
                    if (response.status != 200) {
                        Notify({type: 'warning', message: response.message});
                        return;
                    }
                    this.activities = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
        },

        created() {
            this.initTable(this.tableData);
            if (_.isArray(this.tableHeaders) && this.tableHeaders.length > 0) {
                this.headers = this.tableHeaders;
            }
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