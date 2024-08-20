import axios from 'axios';
import _ from 'lodash';
import {BASE_URL, MAX_TIMEOUT, STATUS_CODE} from './config';

/**
 * 由于使用 Access-Token 方式进行身份验证
 * 这里不再向后台跨域传递 Cookie
 *
 * @type {AxiosInstance}
 */
const instance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL,
    timeout: MAX_TIMEOUT
});

instance.interceptors.request.use(
    config => {
        config.withCredentials = true;
        // console.log(window.location);
        return config;
    }, error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use((response) => {
    const dataPackage = response.data;
    const statusCode = dataPackage['status_code'];

    if (statusCode === STATUS_CODE.REDIRECT_MOVE_TEMPORARILY) {
        const headersLocation = response.headers['Location'];
        // console.log(headersLocation);
        window.location = headersLocation;
    }

    if (statusCode === STATUS_CODE.NO_PERMISSION) {
        showReLoginPrompt();
    }
    /**
     * 当后台返回的信息中
     * 标识码为需要重新登录时
     * 触发跳转
     */
    if (statusCode !== undefined && _.indexOf(STATUS_CODE.NEED_LOGIN, +statusCode) > -1) {
        // router.push({
        //     name: ROUTE_NAME.LOGIN.ROOT
        // });
        return Promise.reject({
            need_login: true
        });
    } else {
        return dataPackage;
    }
}, error => {
    if (error.response && error.response.status === 401) {
        window.localStorage.setItem("beforeSsoUrl", window.location.href);
        // window.location.href = "https://sso.corp.kuaishou.com/cas/login?service=https://" + window.location.host + BASE_URL;

    } else if (error.response && error.response.status === 403) { // 无访问权限
        return {
            status: 403,
            message: '暂无访问权限',
            data: error.response.data,
        }
    }
    return Promise.reject(error);
});

const showReLoginPrompt = () => {
    // TODO: 无权限访问提示消息
};

export default instance;
