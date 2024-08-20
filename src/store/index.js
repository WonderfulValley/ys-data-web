import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import modules from './modules';
import getters from './getters';
import actions from "./actions";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
    state,
    mutations,
    getters,
    actions: actions,
});

export default store;
