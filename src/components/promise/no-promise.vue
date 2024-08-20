<style scoped lang="less" type="text/scss">
    .content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-items: center;
    }
</style>

<template>
    <div class="content">
        <div style="margin: auto;">
            <div style="margin-top: -80px;">
                <el-image src="/notice/web/images/no-promise.png" style="width: 500px;"></el-image>
            </div>
            <div style="text-align: center; margin-top: -100px;z-index: 99;position: relative;color: #3e86ed;font-size: small; font-weight: bold;">
                <div style="margin-left: 55px;">1、Halo 申请业务线权限（推荐）</div>
                <div style="margin-top: 10px;">2、右上角 KIM 联系开通</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "no-promise",
        props: {
            url: {
                type: String,
                default: null,
            },
            isShowButton: {
                type: Boolean,
                default: true,
            },
        },
        methods: {
            requestPromise() {
                window.open(this.url, '_blank', 'left=400,top=200,height=500, width=800, menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1');
                // window.open(this.url, '_blank');
            },
        },
    }
</script>