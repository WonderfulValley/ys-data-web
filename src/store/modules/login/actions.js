import Vue from 'vue';

const actions = {
    /**
     * 返回用户信息，必须包含 displayName（展示中文名）、avatar（头像链接）【userName（可选，邮箱前缀）】
     * @returns {*}
     */
    queryUserInformation() {
        /**
         *   TODO @path 修改获取用户信息接口
         *   Lucky : 2022/1/5 4:53 下午
         **/
        let path = '/userInfo/queryUserInfo';
        return Vue.$http.get(path).then(res => {
            if (res.status == 200) {
                return res.data;
            }
        }).catch(err => {
            console.log(err);
        });
    },
};

export default actions;
