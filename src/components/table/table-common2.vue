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
</style>

<template>
    <div class="content-css">
        <div class="info-css">
            <el-table
                    :data="tmpUTableData"
                    stripe
                    id="elTable"
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="拼命加载中"
                    :height="height"
                    @sort-change="sortChange"
                    :default-sort='{prop: defaultOrder, order: "descending"}'
                    style="font-size: xx-small;line-height: 25px;"
                    border>
                <el-table-column
                        v-for="(item, index) in headers" :key="index"
                        :column-key="index + ',' + item.isString"
                        show-overflow-tooltip
                        :sortable="item.sortable"
                        :min-width="item.minWidth"
                        :prop="item.prop"
                        :label="item.label">
                    <template v-if="item.children">
                        <el-table-column v-for="(val,ind) in item.children" :key="ind"
                                         show-overflow-tooltip
                                         :column-key="ind + ',' + val.isString"
                                         sortable="custom"
                                         :min-width="val.minWidth"
                                         :prop="val.prop"
                                         :label="val.label"
                        >
                        </el-table-column>
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

    export default {
        name: "",
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
                headers: [],
                defaultOrder: null,
                tmpUTableData: [],
                allData: [],
                totalPages: 0,//总页数
                currentPage: 1, //当前页数
                pageSizes: [10, 20, 50, 100, 500],//每页显示个数选择器的选项设置
                pageSize: 50,// 每页显示条数
                pagerCount: 5,
                height: '',
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
                        // console.log(item[this.headers[i].prop]);
                        if (!_.isNil(item[this.headers[i].prop]) && _.toLower(item[this.headers[i].prop]).indexOf(_.toLower(val)) != -1) {
                            this.allData.push(item);
                            break;
                        } else if (_.isNil(this.headers[i].prop)) {
                            if (!_.isNil(this.headers[i].children)) {
                                for (let j = 0; j < this.headers[i].children.length; j++) {
                                    if (!_.isNil(item[this.headers[i].children[j].prop]) && _.toLower(item[this.headers[i].children[j].prop]).indexOf(_.toLower(val)) != -1) {
                                        this.allData.push(item);
                                        break;
                                    }
                                }
                            }
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
                    // console.log(filterIndicator);
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
            // 排序
            sortChange(col) {
                // console.log(col);
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
        },
    }
</script>