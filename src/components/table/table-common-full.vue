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

    .element-css {
        color: rgb(64, 158, 255);
        background: rgb(236, 245, 255);
        border-radius: 4px;
        border-color: #d9ecff;
        padding: 0px 3px;
    }
</style>

<template>
    <div class="content-css">
        <div class="info-css">
            <el-table
                    ref="tableRef"
                    :data="tmpUTableData"
                    stripe
                    :id="tableId"
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="拼命加载中"
                    :row-key="rowKeyMethod"
                    @sort-change="sortChange"
                    @selection-change="handleSelectionChange"
                    @select-all="selectAll"
                    :default-sort='{prop: defaultOrder, order: "descending"}'
                    style="font-size: xx-small;line-height: 25px;"
                    border>
                <el-table-column
                        v-if="isMultiSelection && !loading"
                        type="selection"
                        :reserve-selection="true"
                        width="45">
                </el-table-column>
                <el-table-column
                        v-for="(item, index) in headers" :key="index"
                        :column-key="index + ',' + item.isString"
                        show-overflow-tooltip
                        sortable="custom"
                        :min-width="item.minWidth"
                        :prop="item.prop"
                        :label="item.label">
                    <template slot-scope="scope">
                        <div v-if="isMergedColumn(mergeColumns, item.prop) && isArray(scope.row[item.prop])">
                            <div v-if="scope.row[item.prop].length <= 3">
                                <div v-for="(item,index) in scope.row[item.prop]">
                                    <span class="element-css">{{item}}</span>
                                </div>
                            </div>
                            <el-popover
                                    v-else
                                    placement="left"
                                    trigger="hover">
                                <div style="max-height: calc(100vh - 150px); overflow: auto;">
                                    <div style="line-height: 25px; height: 25px;"
                                         v-for="(item,index) in scope.row[item.prop]">
                                        <span>{{item}}</span>
                                    </div>
                                </div>
                                <div slot="reference">
                                    <div v-for="(item,index) in scope.row[item.prop]" v-if="index < 3">
                                        <span class="element-css">{{item}}</span>
                                    </div>
                                    <div>
                                        <span class="element-css" style="color: orange;">更多（+{{scope.row[item.prop].length - 3}}）</span>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                        <div v-else>{{getProp(scope.row, item.prop)}}</div>
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
    </div>
</template>

<script>
    import _ from 'lodash';
    import {bubbleSort, numIndicatorFilter} from "@/utils/utils";
    import {dateFormat} from "@/utils/date";
    // 用于数据导出的依赖插件
    import FileSaver from 'file-saver';
    import XLSX from 'xlsx';
    import bus from 'table-common-bus';

    export default {
        name: "",
        props: {
            tableId: {
                type: String,
                default: 'elTableId',
            },
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

            // 加载中
            loading: {
                type: Boolean,
                default: false,
            },

            // 表格高度
            heightParam: {
                type: String,
                default: '100%',
            },

            // 是否显示下载
            isShowDownLoad: {
                type: Boolean,
                default: true,
            },

            // 是否显示分页
            isPagination: {
                type: Boolean,
                default: true,
            },

            // 指标过滤
            filterIndicator: {
                type: Array,
                default: function () {
                    return [];
                },
            },

            // 是否远程下载
            isRemoteDownLoad: {
                type: Boolean,
                default: false,
            },

            // 是否多选
            isMultiSelection: {
                type: Boolean,
                default: false,
            },

            // 合并属性
            mergeColumns: {
                type: Array,
                default: function () {
                    return [];
                }
            },

            // 过滤 Prop
            filterProp: {
                type: Array,
                default: function () {
                    return [];
                }
            },
        },
        data() {
            return {
                headers: [],
                defaultOrder: null,
                tmpUTableData: [],
                allData: [],
                totalPages: 0,
                currentPage: 1,
                pageSizes: [10, 20, 50, 100, 500],
                pageSize: 20,
                pagerCount: 5,
                height: '',
                isSelectAll: false,
                checkedList: [],

                tableDataCopy: [],
            }
        },
        mounted() {
            bus.$on('submitFilter', (filterProps) => {
                if (!_.isNil(filterProps) && _.isArray(filterProps) && filterProps.length > 0) {
                    this.allData = _.cloneDeep(this.tableData);
                    filterProps.forEach(item => {
                        let prop = _.get(item, 'prop', null);
                        let type = _.get(item, 'type', null);
                        let isMultiSelection = _.get(item, 'isMultiSelection', false);
                        let filters = _.get(item, 'selected', null);
                        if (!_.isNil(prop) && !_.isNil(type) && !_.isNil(filters)) {
                            filters = isMultiSelection ? _.get(item, 'selected', []) : [_.get(item, 'selected', null)];
                            if (type == 'include' && filters.length > 0) {
                                if (this.mergeColumns.length > 0 && _.indexOf(this.mergeColumns, prop) != -1) {
                                    let includes = _.filter(this.allData, (o) => {
                                        return _.indexOf(filters, _.get(o, prop, null)) != -1;
                                    });
                                    let includeResult = [];
                                    includes.forEach(item => {
                                        includeResult.push(JSON.stringify(_.omit(item, this.mergeColumns)));
                                    });
                                    if (includeResult.length > 0) {
                                        this.allData = _.filter(this.allData, (o) => {
                                            return _.indexOf(includeResult, JSON.stringify(_.omit(o, this.mergeColumns))) != -1;
                                        });
                                    }
                                } else {
                                    this.allData = _.filter(this.allData, (o) => {
                                        return _.indexOf(filters, _.get(o, prop, null)) != -1;
                                    });
                                }
                            } else if (type == 'exclude' && filters.length > 0) {
                                if (this.mergeColumns.length > 0 && _.indexOf(this.mergeColumns, prop) != -1) {
                                    let excludes = _.filter(this.allData, (o) => {
                                        return _.indexOf(filters, _.get(o, prop, null)) != -1;
                                    });
                                    let excludeResult = [];
                                    excludes.forEach(item => {
                                        excludeResult.push(JSON.stringify(_.omit(item, this.mergeColumns)));
                                    });
                                    if (excludeResult.length > 0) {
                                        this.allData = _.filter(this.allData, (o) => {
                                            return _.indexOf(excludeResult, JSON.stringify(_.omit(o, this.mergeColumns))) == -1;
                                        });
                                    }
                                } else {
                                    this.allData = _.filter(this.allData, (o) => {
                                        return _.indexOf(filters, _.get(o, prop, null)) == -1;
                                    });
                                }
                            }
                        }
                    });
                    this.tableDataProcess(this.allData);
                } else {
                    this.tableDataProcess(this.tableData);
                }
            });
        },
        watch: {
            // 定义表格高度
            heightParam: {
                immediate: true,
                handler(heightParam) {
                    this.height = heightParam;
                }
            },

            // 搜索
            filter(val) {
                this.allData = [];
                this.tableDataCopy.forEach(item => {
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

            // 默认排序（可忽略）
            defaultSort: {
                watch: true,
                handler(defaultSort) {
                    if (!_.isNil(defaultSort)) {
                        this.defaultOrder = defaultSort;
                    }
                }
            },

            // 表头
            tableHeaders: {
                immediate: true,
                handler(tableHeaders) {
                    this.headers = [];
                    if (_.isArray(tableHeaders) && tableHeaders.length > 0) {
                        this.headers = tableHeaders;
                    }
                }
            },

            // 表格内容
            tableData: {
                immediate: true,
                handler(tableData) {
                    this.tableDataProcess(tableData);
                }
            },

            // 过滤指标（ > < = ... 非合并 column 使用）
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
            tableDataProcess(tableData) {
                this.tableDataCopy = [];
                if (this.mergeColumns.length > 0) {
                    let groupedData = _.groupBy(tableData, (o) => {
                        return JSON.stringify(_.omit(o, this.mergeColumns));
                    });
                    let tmpTableData = [];
                    _.keys(groupedData).forEach(item => {
                        let tmpObj = JSON.parse(item);
                        let tmpValues = _.get(groupedData, item, []);
                        let tmpMap = new Map();
                        this.mergeColumns.forEach(column => {
                            tmpValues.forEach(value => {
                                let tmpValue = _.get(value, column, null);
                                if (!_.isNil(tmpValue)) {
                                    tmpMap.set(column, (tmpMap.has(column) ? ((tmpMap.get(column)).add(tmpValue)) : ((new Set()).add(tmpValue))));
                                }
                            });
                        });
                        for (let [k, v] of tmpMap) {
                            tmpObj[k] = Array.from(v);
                        }
                        tmpTableData.push(tmpObj);
                    });
                    this.tableDataCopy = tmpTableData;
                    this.initTable(tmpTableData);
                } else {
                    this.tableDataCopy = tableData;
                    this.initTable(tableData);
                }
            },

            getProp(data, prop) {
                return !_.isNil(_.get(data, prop, null)) && _.trim(_.get(data, prop, '-')) != '' ? _.get(data, prop, '-') : '-';
            },
            // 排序
            sortChange(col) {
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
            // 页码状态发生变化时，修改tmpUTableData
            currentPageChange(allData, currentPage) {
                let from = (currentPage - 1) * (this.isPagination ? this.pageSize : allData.length);
                let to = currentPage * (this.isPagination ? this.pageSize : allData.length);
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
                    this.tmpUTableData = this.isMultiSelection ? this.checkedList : this.allData;
                    this.$nextTick(() => {
                        let xlsxParam = {raw: true};
                        let wb = XLSX.utils.table_to_book(document.querySelector('#' + this.tableId), xlsxParam);
                        let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
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

            // row key
            rowKeyMethod(row) {
                return JSON.stringify(row);
            },
            //全选事件
            selectAll() {
                this.isSelectAll = !this.isSelectAll;
                if (this.isSelectAll) {
                    this.allData.forEach(item => {
                        this.$refs['tableRef'].toggleRowSelection(item, true);
                    });
                } else {
                    this.allData.forEach(item => {
                        this.$refs['tableRef'].toggleRowSelection(item, false);
                    });
                }
            },
            // 选择事件
            handleSelectionChange(val) {
                this.checkedList = val;
                this.$emit('checkedList', this.checkedList);
            },

            // indexOf
            isMergedColumn(mergeColumns, column) {
                return _.indexOf(mergeColumns, column) != -1;
            },
            isArray(data) {
                return !_.isNil(data) && _.isArray(data);
            },
        },
        beforeDestroy() {
            bus.$off('submitFilter');
        },
    };
</script>