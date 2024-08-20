<style scoped lang="less" type="text/scss">
    .content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-weight: normal;
        font-size: x-small;

        & /deep/ .el-select__tags-text {
            max-width: 50px;
            display: block;
            word-break: keep-all;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            -icab-text-overflow: ellipsis;
            -khtml-text-overflow: ellipsis;
            -moz-text-overflow: ellipsis;
            -webkit-text-overflow: ellipsis;
        }

        & /deep/ .el-tag.el-tag--info .el-tag__close {
            margin-top: -40px;
            margin-left: 40px;
        }

        & /deep/ .el-select__input {
            margin-left: 0px;
        }
    }
</style>

<template>
    <div class="content">
        <span v-for="item in filterProps" style="padding-right: 10px;">
           <span style="padding-right: 3px;">{{getProp(item, 'label')}}</span>
            <el-select
                    style="width:150px"
                    size="mini"
                    v-model="item.selected"
                    :multiple="getProp(item, 'isMultiSelection')"
                    clearable
                    collapse-tags
                    filterable
                    :placeholder="getProp(item, 'placeholder')">
            <el-option
                    v-for="(it, index) in getPropArr(item, 'optionList')"
                    :key="index"
                    :label="it"
                    :value="it">
            </el-option>
          </el-select>
        </span>
        <el-button size="mini" type="primary" plain @click="submit" v-if="filterProps.length > 0">筛选</el-button>
        <el-button size="mini" @click="reset" v-if="filterProps.length > 0">重置</el-button>
    </div>
</template>

<script>
    import _ from "lodash";
    import bus from 'table-common-bus.js';

    export default {
        name: "table-column-filter",
        props: {
            /**
             {
                    type: 'include',
                    label: 'AZ',
                    prop: 'az',
                    placeholder: '请选择',
                    isMultiSelection: true,
              }
             **/
            filterProp: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            tableData: {
                type: Array,
                default: function () {
                    return [];
                }
            },
        },
        data() {
            return {
                filterProps: [],
            };
        },
        watch: {
            tableData: {
                immediate: true,
                handler() {
                    this.filterProps = _.cloneDeep(this.filterProp);
                    this.filterProps.forEach(item => {
                        let prop = _.get(item, 'prop', null);
                        let tmpSet = new Set();
                        if (!_.isNil(prop)) {
                            this.tableData.forEach(dt => {
                                tmpSet.add(this.getProp(dt, prop));
                            });
                        }
                        item.optionList = Array.from(tmpSet);
                    });
                    this.filterProps = _.cloneDeep(this.filterProps);
                },
            },
        },
        methods: {
            getProp(data, prop) {
                return !_.isNil(_.get(data, prop, null)) && _.trim(_.get(data, prop, '-')) != '' ? _.get(data, prop, '-') : '-';
            },

            getPropArr(data, prop) {
                return !_.isNil(_.get(data, prop, null)) && _.trim(_.get(data, prop, '')) != '' ? _.get(data, prop, []) : [];
            },

            reset() {
                this.filterProps = _.cloneDeep(this.filterProp);
                this.filterProps.forEach(item => {
                    let prop = _.get(item, 'prop', null);
                    let tmpSet = new Set();
                    if (!_.isNil(prop)) {
                        this.tableData.forEach(dt => {
                            tmpSet.add(this.getProp(dt, prop));
                        });
                    }
                    item.optionList = Array.from(tmpSet);
                });
                this.filterProps = _.cloneDeep(this.filterProps);
                bus.$emit('submitFilter', []);
            },

            submit() {
                bus.$emit('submitFilter', this.filterProps);
            }
        },
    }
</script>