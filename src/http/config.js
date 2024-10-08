export const BASE_URL = process.env.VUE_APP_WEB_SERVICE_API_URL_PREFIX;
export const MAX_TIMEOUT = 100000;

const SUCCESS = 0;
const NOT_LOGIN = 1;
const NO_PERMISSION = 2;
const REDIRECT_MOVE_TEMPORARILY = 302;

const NEED_LOGIN = [
    NOT_LOGIN
];

export const STATUS_CODE = {
    SUCCESS,
    NO_PERMISSION,
    NEED_LOGIN,
    REDIRECT_MOVE_TEMPORARILY
};
