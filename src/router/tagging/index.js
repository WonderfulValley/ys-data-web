import ROUTE_NAME from './names';

import index from '@/pages/tagging/index';
import list from '@/pages/tagging/list';
import detail from '@/pages/tagging/detail';
import tagging from '@/pages/tagging/index';

export default {
    path: ROUTE_NAME.tagging,
    name: ROUTE_NAME.tagging,
    component: index,
    redirect: {
        name: ROUTE_NAME.list,
    },
    children: [
        {
            path: 'list',
            name: 'list',
            component: list,
        },
        {
            path: 'detail',
            name: 'detail',
            component: detail,
        }
        ,
        {
            path: 'tagging',
            name: 'tagging',
            component: tagging,
        }
    ]
};


