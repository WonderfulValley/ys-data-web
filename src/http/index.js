import instance from './instance';

class APIHandler {
    constructor (instance) {
        this.instance = instance;
    }

    install (Vue) {
        Object.assign(Vue.prototype, {
            $http: this.instance
        });
        Object.assign(Vue, {
            $http: this.instance
        });
    }
}

export default new APIHandler(instance);
