<style scoped lang="less" type="text/scss">
    .index-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;

        .expect-for-navbar {
            flex: 1;
            overflow: hidden;
            display: flex;
            margin-top: 3rem;

            .except-for-sidebar {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;

                .crumb {
                    height: 2.6rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-sizing: border-box;
                    padding: 0 .5rem;
                    border-bottom: 1px solid #81D8CF;

                    .crumb-item {
                        display: flex;
                        align-items: center;

                        .icon {
                            margin-right: 20px;
                            font-size: 1rem;
                            color: #888;
                        }

                        .empty-text {
                            font-size: .8rem;
                            margin-right: .75rem;
                        }
                    }
                }

                .content-wrapper {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background-color: #F6F6F6;
                    border-top-left-radius: .2rem;
                    display: flex;
                    flex-direction: column;

                    .header {
                        height: 40px;
                        line-height: 40px;
                        padding: 0 10px;
                        display: flex;
                        background-color: #FFFFFF;
                        border-bottom: 1px solid #b0c4de;
                        font-size: small;
                    }

                    .except-for-crumb {
                        background-color: #FFFFFF;
                        flex: 1;
                        overflow: hidden;
                        height: calc(100% - 40px);
                    }
                }
            }
        }
    
        & /deep/ .sre-menu-component-navbar-container {
            z-index: 9;
        }
    }

    .notify {
        font-size: 0.75rem;
        color: #888;
        transition: all 0.5s;
    }
</style>

<style lang="less" type="text/scss">
    .el-breadcrumb {
        font-size: .75rem !important;

        .el-breadcrumb__inner {
            color: #888 !important;
        }
    }
</style>

<template>
    <div class="index-container">
        <section class="expect-for-navbar" :style="{ marginTop: isNil(isRunAsMicro) ? '3rem' : 0 }">
            <sidebar class="sidebar"></sidebar>
            <section class="except-for-sidebar">
                <section class="content-wrapper">
                    <div class="header">
                        <div style="flex: 1;">
                            <i class="icon">&#xe645;</i>
                            <span style="padding-left: 5px;font-size: x-small;color: #888888;">{{notifyInformation}}</span>
                        </div>
                        <div style="flex: 1;display: flex;justify-content: flex-end;">
                            <div style="margin-top: 2px;padding-right: 2px;"><i class="icon">&#xe98d;</i></div>
                            <div style="color: rgb(136, 136, 136);padding-left: 5px;cursor: pointer;font-size: x-small;padding-top: 2px;">
                                暂无通知
                            </div>
                        </div>
                    </div>
                    <div class="except-for-crumb">
                        <router-view></router-view>
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
    import sidebar from './sidebar';

    export default {
        name: '',
        components: {
            sidebar,
        },
        data() {
            return {
                notifyInformation: 'BASE WEB 模板',
                token: 'staing:ZGV2LWFub21hbHlEZXRlY3Rpb25NYW5hZ2VBcHAtZTIyMzg1ZmQtODU5Yi00OWUyLWFkMDItMTk5NTU5OGY0Yzc1',
            };
        },
        beforeMount() {
            // 加载登陆用户名
            /**
             *   TODO 加载登陆用户名
             *   Lucky : 2022/1/12 4:35 下午
             **/
            this.$store.dispatch('login/queryUserInformation').then(res => {
                this.$store.commit('login/updateUserInformation', res);
            }).catch(err => {
                console.log(err);
            });
        },
        computed: {
            userInformation() {
                // userInformation # 用户信息
                // 类型： obj
                // 字段： {
                //     avatar # 头像链接
                //     displayName # 中文名
                //     userName # 用户名（邮箱前缀）
                // }
                return this.$store.getters['login/userInformation'];
            },
            isRunAsMicro() {
                return window.__POWERED_BY_QIANKUN__;
            },
            path() {
                return this.$route.path;
            },
        },
        watch: {
            path: {
                immediate: true,
                handler() {
                    /**
                     *   TODO
                     *   Lucky : 2022/1/5 11:52 上午
                     **/
                }
            }
        },
        methods: {
            isNil(data) {
                return _.isNil(data);
            },
            kimEvent() {
                window.open('kim://username?username=liangluping', '_self');
            },
        },
    };
</script>
