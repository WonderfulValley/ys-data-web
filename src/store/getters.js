import _ from 'lodash';

const getters = {
    navbarActive(state) {
        return _.get(state, 'navbarActive');
    },
};

export default getters;