<style scoped lang="scss" type="text/scss">
    .expect-for-navbar {
        flex: 1;
        overflow: hidden;
        display: flex;

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
                border-bottom: 1px solid $theme-color-master-light;

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
                background-color: $gray-white;
                border-top-left-radius: $normal-border-radius;
                display: flex;
                flex-direction: column;

                .except-for-crumb {
                    flex: 1;
                    overflow: hidden;
                }
            }
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
    <section class="expect-for-navbar">
        <section class="except-for-sidebar">
            <!--进行dashboard路由选择，装填容器-->
            <section class="content-wrapper">
                <div class="except-for-crumb">
                    <router-view></router-view>
                </div>
            </section>
        </section>
    </section>
</template>

<script>
    import ROUTER_NAME from "@/router/names";

    export default {
        name: '',
        components: {
        },
        data() {
            return {
                show: false
            };
        },
        computed: {
            name() {
                return this.$route.name;
            },
            query() {
                return this.$route.query;
            },
        },
        watch: {

        },
        beforeCreate() {
        },
    };
</script>
