import _ from 'lodash';

const getters = {

    /* 登陆用户名 */
    userInformation (state) {
        return _.get(state, 'userInformation');
    },

};

export default getters;
