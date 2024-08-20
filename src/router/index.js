import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages';
import ROUTE_NAME from './names';

/**
 * 子路由，here
 * @author zhanggaozhen03
 */
import home from './home/index';

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

const router = new Router({
    mode: 'history',
    base: !window.__POWERED_BY_QIANKUN__ ? '/notice/web' : '/notice/notice/web',
    routes: [
        {
            path: ROUTE_NAME.ROOT,
            name: ROUTE_NAME.ROOT,
            component: Index,
            redirect: {
                /* root 根路径默认对应的页面 */
                name: ROUTE_NAME.home.home
            },
            children: [
                home,
            ]
        },
    ]
});

/**
 * @author zhanggaozhen03
 *
 * SSO 登录后返回登录前页面判断：
 *
 * 步骤：
 *      1、如果用户没有登录：返回状态码 401，则在localStorage 中存储跳转前的页面地址。
 *      2、在路由跳转之前，判断是否存在 URL，然后进行跳转，并删除该 URL。
 */
router.beforeEach((to, from, next) => {
    let beforeSsoUrl = window.localStorage.getItem("beforeSsoUrl");
    if (!_.isNil(beforeSsoUrl)) {
        window.localStorage.removeItem("beforeSsoUrl");
        // window.localStorage.clear(); // 建议使用 removeItem
        next({
            path: beforeSsoUrl.split(window.location.protocol + '//' + window.location.hostname)[1],
        });
    } else {
        next();
    }
});

// resolve the problem of "Loading chunk xxx failed."
router.onError((error) => {
    console.error(error);
    const pattern = /Loading chunk/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed && error.type === 'missing') {
        router.push(targetPath);
    }
});

export default router;
