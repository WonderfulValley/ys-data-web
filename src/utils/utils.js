import _ from 'lodash';
import Vue from "vue";
import qs from "querystring";
import axios from 'axios'

// 最大值
export function MaxArrValue(arr) {
    let maxValue = Number.MIN_VALUE;
    if (_.isArray(arr) && arr.length > 0) {
        arr.forEach(item => {
            if ((item != null) && (!isNaN(item)) && (maxValue < +item)) {
                maxValue = +item;
            }
        })
    }
    return (maxValue != Number.MIN_VALUE) ? maxValue : null;
}

// 最小值
export function MinArrValue(arr) {
    let minValue = Number.MAX_VALUE;
    if (_.isArray(arr) && arr.length > 0) {
        arr.forEach(item => {
            if ((item != null) && (!isNaN(item)) && (minValue > +item)) {
                minValue = +item;
            }
        })
    }
    return (minValue != Number.MAX_VALUE) ? minValue : null;
}

// 计算最大值
export function calculateMaxIntegerValue(originValue) {
    let digitalNums = 0;
    let maxIntegerValue = originValue;
    for (digitalNums = 0; maxIntegerValue >= 10; ++digitalNums) {
        maxIntegerValue = (maxIntegerValue / 10);
    }
    if (digitalNums == 0) {
        maxIntegerValue = Math.ceil(+maxIntegerValue);
    } else {
        maxIntegerValue += 0.1;
        maxIntegerValue = +(maxIntegerValue.toFixed(1));
        maxIntegerValue *= Math.pow(10, digitalNums);
        maxIntegerValue = Math.ceil(maxIntegerValue);
    }

    return maxIntegerValue;
}

// 计算最小值
export function calculateMinIntegerValue(originValue) {
    let digitalNums = 0;
    let minIntegerValue = originValue;
    for (digitalNums = 0; minIntegerValue >= 10; ++digitalNums) {
        minIntegerValue = (minIntegerValue / 10);
    }
    if (digitalNums == 0) {
        minIntegerValue = Math.floor(+minIntegerValue);
    } else {
        minIntegerValue -= 0.1;
        minIntegerValue = +(minIntegerValue.toFixed(1));
        minIntegerValue *= Math.pow(10, digitalNums);
        minIntegerValue = Math.floor(minIntegerValue);
    }

    return minIntegerValue;
}

/**
 * 对象数组排序 (用的 快排)
 * @param arr 数组
 * @param column 排序字段名
 * @param order 排序方式（ascending / descending）
 * @param isString 是否字符串排序
 * @returns {*}
 */
export function bubbleSort(arr, column, order, isString = false) {
    if (order == null) {
        return arr;
    } else if (Array.isArray(arr) && arr.length > 0) {
        // 不参与排序
        let nonSortArr = [];
        let sortArr = [];
        arr.forEach(item => {
            if (item[column] == '-' || item[column] == null || item[column] == undefined || item[column] == 'nan' || item[column] == 'NaN' || item[column] == 'null'
                || item[column] == 'none' || item[column] == '' || item[column] == 'inf' || item[column] == Infinity || item[column] == 'Infinity') {
                nonSortArr.push(item);
            } else {
                sortArr.push(item);
            }
        });
        if (sortArr.length <= 1) {
            let result = [];
            sortArr.forEach(item => {
                result.push(item);
            });
            nonSortArr.forEach(item => {
                result.push(item);
            });
            return result;
        }
        // 排序
        // let result = quickSort(sortArr, 0, sortArr.length - 1, column, order, isString); // 快排
        let result = JsSort(sortArr, column, order, isString)
        nonSortArr.forEach(item => {
            result.push(item);
        });
        return result;
    }
    return arr;
}
const quickSort = (arr, left, right, column, order, isString) => {
    var len = arr.length,
        partitionIndex,
        left = typeof left != 'number' ? 0 : left,
        right = typeof right != 'number' ? len - 1 : right;

    if (left < right) {
        partitionIndex = partition(arr, left, right, column, order, isString);
        quickSort(arr, left, partitionIndex - 1, column, order, isString);
        quickSort(arr, partitionIndex + 1, right, column, order, isString);
    }
    return arr;
};
const partition = (arr, left, right, column, order, isString) => {
    var pivot = left,
        index = pivot + 1;
    for (var i = index; i <= right; i++) {
        if (order == 'ascending') {
            if (isString) {
                let a = arr[i][column];
                let b = arr[pivot][column];
                if (a < b) {
                    swap(arr, i, index);
                    index++;
                }
            } else {
                let a = parseFloat(arr[i][column]);
                let b = parseFloat(arr[pivot][column]);
                if (a < b) {
                    swap(arr, i, index);
                    index++;
                }
            }
        } else if (order == 'descending') {
            if (isString) {
                let a = arr[i][column];
                let b = arr[pivot][column];
                if (a >= b) {
                    swap(arr, i, index);
                    index++;
                }
            } else {
                let a = parseFloat(arr[i][column]);
                let b = parseFloat(arr[pivot][column]);
                if (a >= b) {
                    swap(arr, i, index);
                    index++;
                }
            }
        }
    }
    swap(arr, pivot, index - 1);
    return index - 1;
};
const swap = (arr, i, j) => {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};
const JsSort = (arr, column, order, isString) => {
    let result = arr;
    if (order == 'ascending' || order == 'asc') { // 升序
        if (isString) {
            result.sort(function (a, b) {
                return a[column] > b[column] ? 1 : -1;
            });
        } else {
            result.sort(function (a, b) {
                let aTmp = parseFloat(a[column]);
                let bTmp = parseFloat(b[column]);
                return aTmp > bTmp ? 1 : -1;
            });
        }
    } else if (order == 'descending' || order == 'desc') { // 降序
        if (isString) {
            result.sort(function (a, b) {
                return a[column] < b[column] ? 1 : -1;
            });
        } else {
            result.sort(function (a, b) {
                let aTmp = parseFloat(a[column]);
                let bTmp = parseFloat(b[column]);
                return aTmp < bTmp ? 1 : -1;
            });
        }
    }
    return result;
};

/**
 * 单数组排序
 * @param arr 数组
 * @param order 排序方式（ascending / descending）
 * @param isString 是否字符串排序
 * @returns {*}
 */
export function singleSort(arr, order, isString = false) {
    if (order == null) {
        return arr;
    } else if (Array.isArray(arr) && arr.length > 0) {
        // 不参与排序
        let nonSortArr = [];
        let sortArr = [];
        arr.forEach(item => {
            if (item == '-' || item == null || item == undefined || item == 'nan' || item == 'NaN' || item == 'null' || item == 'none' || item == '' || item == 'inf' || item == Infinity || item == 'Infinity') {
                nonSortArr.push(item);
            } else {
                sortArr.push(item);
            }
        });
        if (sortArr.length <= 1) {
            let result = [];
            sortArr.forEach(item => {
                result.push(item);
            });
            nonSortArr.forEach(item => {
                result.push(item);
            });
            return result;
        }
        // 排序
        let result = bubbleSort2(sortArr, order, isString);
        nonSortArr.forEach(item => {
            result.push(item);
        });
        return result;
    }
    return arr;
}
const bubbleSort2 = (arr, order, isString) => {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (isString) {
                let a = arr[j];
                let b = arr[j + 1];
                if (order == 'ascending') {
                    if (a > b) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                } else if (order == 'descending') {
                    if (a <= b) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            } else {
                let a = parseFloat(arr[j]);
                let b = parseFloat(arr[j + 1]);
                if (order == 'ascending') {
                    if (a > b) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                } else if (order == 'descending') {
                    if (a <= b) {
                        let temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
        }
    }
    return arr;
};

/**
 * 数据百分比处理
 * @param data：待处理数据
 * @param round： 保留小数有效数字
 * @param needMultiply：是否需要乘100
 * @param needPercent：是否需要百分号
 * @param isReturnNull: 是否当数据非法时返回 null
 * @returns {*}
 */
export function formatedPercentData(data, round = 2, needMultiply = false, needPercent = true, isReturnNull = false) {

    if (_.isNil(data) || data == 'nan' || data == 'NaN' || data == '-' || isNaN(data) || data == Infinity || data == 'Infinity' || data == 'inf' || data == '' || data == 'null') {
        if (isReturnNull) {
            return null;
        } else {
            return '-';
        }
    }
    if (needPercent) {
        if (needMultiply) {
            return _.round(((+data) * 100), round) + ' %';
        } else {
            return _.round((+data), round) + ' %';
        }
    } else {
        if (needMultiply) {
            return _.round(((+data) * 100), round);
        } else {
            return _.round((+data), round);
        }
    }
}

/**
 * 数据单位处理
 * @param data：数据
 * @param round: 保留小数
 * @param isReturnNull：是否返回 null
 * @returns
 */
export function numberUnitProcess(data, round = 2, isReturnNull = false) {
    if (_.isNil(data) || data == 'nan' || data == 'NaN' || data == '-' || isNaN(data) || data == Infinity || data == 'Infinity' || data == 'inf') {
        if (isReturnNull) {
            return {
                data: null,
                unit: null
            };
        } else {
            return {
                data: '-',
                unit: ''
            };
        }
    }
    if (+data < 10000) { // 数据小于 1 万
        return {
            data: formatedPercentData(+data, round, false, false, isReturnNull),
            unit: ''
        };
    } else if (10000 <= +data && +data < 1000000) { // 小于 1 百万
        return {
            data: formatedPercentData(+data / 10000, round, false, false, isReturnNull),
            unit: '万'
        };
    } else if (1000000 <= +data && +data < 100000000) { // 小于 1 亿
        return {
            data: formatedPercentData(+data / 1000000, round, false, false, isReturnNull),
            unit: '百万'
        };
    } else if (100000000 <= +data && +data < 10000000000) { // 大于 1 亿
        return {
            data: formatedPercentData(+data / 100000000, round, false, false, isReturnNull),
            unit: '亿'
        };
    } else if (10000000000 <= +data && +data < 1000000000000) { // 大于 1 亿
        return {
            data: formatedPercentData(+data / 10000000000, round, false, false, isReturnNull),
            unit: '百亿'
        };
    } else if (1000000000000 <= +data) { // 大于 1 亿
        return {
            data: formatedPercentData(+data / 1000000000000, round, false, false, isReturnNull),
            unit: '万亿'
        };
    }
}

/**
 * 数据单位处理
 * @param data：数据
 * @param isReturnNull：是否返回 null
 * @returns
 */
export function numberUnitProcessForScreen(data, isReturnNull = false) {
    if (_.isNil(data) || data == 'nan' || data == 'NaN' || data == '-' || isNaN(data) || data == Infinity || data == 'Infinity' || data == 'inf') {
        if (isReturnNull) {
            return {
                data: null,
                unit: null
            };
        } else {
            return {
                data: '-',
                unit: ''
            };
        }
    }
    if (+data < 10000) { // 数据小于 1 万
        return {
            data: formatedPercentData(+data, 0, false, false, isReturnNull),
            unit: ''
        };
    } else if (10000 <= +data && +data < 100000000) { // 小于 1 亿
        return {
            data: formatedPercentData(+data / 10000, 0, false, false, isReturnNull),
            unit: '万'
        };
    } else if (100000000 <= +data) { // 大于 1 亿
        return {
            data: formatedPercentData(+data / 100000000, 2, false, false, isReturnNull),
            unit: '亿'
        };
    }
}

/**
 * 数据单位处理
 * @param data：数据
 * @param isReturnNull：是否返回 null
 * @returns
 */
export function numberUnitProcessForScreenTwo(data, isReturnNull = false) {
    if (_.isNil(data) || data == 'nan' || data == 'NaN' || data == '-' || isNaN(data) || data == Infinity || data == 'Infinity' || data == 'inf') {
        if (isReturnNull) {
            return {
                data: null,
                unit: null
            };
        } else {
            return {
                data: '-',
                unit: ''
            };
        }
    }
    if (+data < 10000) { // 数据小于 1 万
        return {
            data: formatedPercentData(+data, 0, false, false, isReturnNull),
            unit: ''
        };
    } else if (10000 <= +data && +data < 100000000) { // 小于 1 亿
        return {
            data: formatedPercentData(+data / 10000, 2, false, false, isReturnNull),
            unit: '万'
        };
    } else if (100000000 <= +data) { // 大于 1 亿
        return {
            data: formatedPercentData(+data / 100000000, 3, false, false, isReturnNull),
            unit: '亿'
        };
    }
}

/**
 * 数据处理 check
 * @param data：数据
 * @param isReturnNull：是否返回 null
 * @returns
 */
export function numberCheckProcess(data, isReturnNull = false) {
    if (_.isNil(data) || data == 'nan' || data == 'NaN' || data == '-' || isNaN(data) || data == Infinity || data == 'Infinity' || data == 'inf' || data == '#NULL' || data == '') {
        if (isReturnNull) {
            return null;
        } else {
            return '-';
        }
    }
    return data;
}

/**
 *
 * @param data
 * @param isReturnNull
 * @returns {string|null|*}
 */
export function nullCheckProcess(data) {
    if (_.isNil(data) || data == 'nan' || data == 'NaN' || data == '-' || data == Infinity || data == 'Infinity' || data == 'inf' || data == '#NULL') {
        return null;
    }
    return data;
}

/**
 * 获取后端 widget 数据
 * @param params
 *
 * widgetId: params.widgetId,
 * cfg: JSON.stringify(params.cfg)
 *
 * @returns {*}
 */
export function getWidgetAggregateData(params) {
    if (!params) return;
    return Vue.$http.post('/dashboard/getWidgetAggregateData.do', qs.stringify({
        widgetId: params.widgetId,
        cfg: JSON.stringify(params.cfg)
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export function getUserHead(userId) {
    let bodyFormData = new FormData();
    // bodyFormData.append("kwaiId", "Vshougong")
    bodyFormData.append("userId", userId)
    let url = "/api/v1/common/getUserHead"
    let res = axios({
        method: 'post',
        url: url,
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': '0C67C329F616CAF191A38ADF3FA7DF72',
            "Access-Control-Allow-Headers": "*",
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        }
    })
    return res;
}

/**
 * 过滤方法
 * @param arr
 * @param column
 * @param indicator
 * @param condition
 * @returns {[]|*}
 */
export function numIndicatorFilter(arr, column, indicator, condition) {
    if (_.isNil(condition) || condition == '') {
        return arr;
    } else if (_.isArray(arr) && arr.length > 0) {
        let sortArr = [];
        arr.forEach(item => {
            if (_.isNil(item[column]) || item[column] == '' || item[column] == '-' || item[column] == null || item[column] == undefined || item[column] == 'NaN' || item[column] == 'null' || item[column] == Infinity || item[column] == 'Infinity' || item[column] == 'nan' || item[column] == '#NULL') {
                /**
                 *   TODO
                 *   Lucky : 2020/9/1 6:08 下午
                 **/
            } else {
                switch (indicator) {
                    case '>':
                        if (+item[column] > +condition) {
                            sortArr.push(item);
                        }
                        break;
                    case '>=':
                        if (+item[column] >= +condition) {
                            sortArr.push(item);
                        }
                        break;
                    case '<':
                        if (+item[column] < +condition) {
                            sortArr.push(item);
                        }
                        break;
                    case '<=':
                        if (+item[column] <= +condition) {
                            sortArr.push(item);
                        }
                        break;
                    case '=':
                        if (+item[column] == +condition) {
                            sortArr.push(item);
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return sortArr;
    }
    return arr;
}

/**
 * 数据千分位格式化
 * @param num
 * @returns {string}
 */
export function numFormat(num) {
    return num.toString().replace(/\d+/, (n) => { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
            return $1 + ",";
        });
    });
}

/**
 *
 * @param data 数据
 * @param initUnit 原始单位 列表：'Bit', 'Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'
 * @returns {{unit: *, data: *}}
 */
export function saveUnitExchange(data, initUnit, isReturnNull = false) {
    if (_.isNil(data) || data === 'nan' || data === 'NaN' || _.trim(data) === '-' || data === Infinity || data === 'Infinity' || data === 'inf' || data === '#NULL' || _.trim(data) === '') {
        if (isReturnNull) {
            return {
                data: null,
                unit: null,
            };
        } else {
            return {
                data: '-',
                unit: initUnit
            };
        }
    }
    let unitList = ['Bit', 'Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let initIndex = _.findIndex(unitList, (o) => {
        return o === initUnit;
    });

    let result = recursiveSaveUnit(+data, initIndex);

    return {
        data: _.toString(result[0]),
        unit: unitList[result[1]],
    }
}
const recursiveSaveUnit = (data, index) => {
    if (index === 0 && 8 < data) { // 初始类型为Bit
        index = index + 1;
        data = data / 8;
        return recursiveSaveUnit(data, index);
    } else if (0 < index && index < 10 && 1024 < data) {
        index = index + 1;
        data = data / 1024;
        return recursiveSaveUnit(data, index);
    } else {
        return [data, index];
    }
};

