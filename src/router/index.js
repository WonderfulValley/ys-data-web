import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages';
import ROUTE_NAME from './names';

/**
 * 子路由，here
 * @author zhanggaozhen03
 */
import home from './home/index';
import tagging from './tagging/index';


Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

const router = new Router({
    mode: 'history',
    base: !window.__POWERED_BY_QIANKUN__ ? '/crawler/web' : '/crawler/crawler/web',
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
                tagging,
            ]
        },
    ]
});

export default router;
