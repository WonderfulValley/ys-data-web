import Vue from 'vue';
import axios from "axios";

const actions = {
    /**
     * 取消请求， 主动cancel
     */
    cancelQuest() {
        if (typeof this.source === 'function') {
            this.source('终止请求');
        }
    },

    /**
     * 查询数据 common 接口，有返回值（post 类型）
     * @params：
     *  path: 后端接口path
     *  param： post body 参数
     */
    queryDataCommonMethod({commit, rootGetters}, params) {

        let path = params.path;
        let param = params.param;

        let CancelToken = axios.CancelToken;
        const _this = this;
        return Vue.$http.post(path, param, {
            headers: {
                'Content-Type': 'application/json',
            },
            cancelToken: new CancelToken(function executor(c) {
                _this.source = c;
            })
        }).then(res => {
            if (res.status == 200) {
                return res.data;
            }
        }).catch(err => {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
                return {message: '请求已取消！'};
            } else {
                console.log(err);
            }
        });
    },

    /**
     * 查询数据 common 接口，无返回值 & 需要判断其他状态（post 类型）
     * @params：
     *  path: 后端接口path
     *  param： post body 参数
     */
    submitDataCommonMethod({commit, rootGetters}, params) {

        let path = params.path;
        let param = params.param;

        let CancelToken = axios.CancelToken;
        const _this = this;
        return Vue.$http.post(path, param, {
            headers: {
                'Content-Type': 'application/json',
            },
            cancelToken: new CancelToken(function executor(c) {
                _this.source = c;
            })
        }).then(res => {
            return res;
        }).catch(err => {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
                return {message: '请求已取消！'};
            } else {
                console.log(err);
            }
        });
    },

    /**
     * 通用下载（post 类型）
     * @params：
     *  path: 后端接口path
     *  param： post body 参数
     */
    queryDataCommonRemoteDownload({commit, rootGetters}, params) {

        let path = params.path;
        let param = params.param;

        return Vue.$http.post(path, param, {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'blob',
        }).then(res => {
            return res;
        }).catch(err => {
            console.log(err);
        });
    },
};

export default actions;
