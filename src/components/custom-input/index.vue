<style scoped lang="scss" type="text/scss">
    .search-container {
        height: 100%;
        display: flex;
        align-items: center;

        .input-wrapper {
            padding: 0 1rem;
            height: 2rem;
            display: flex;
            align-items: center;
            border-radius: $normal-border-radius-mini;
            transition: $normal-transition;
            width: 18rem;
            box-sizing: border-box;
            font-size: 0.8rem;

            &.focused {
                width: 22rem;
            }

            .icon {
                padding: 0 .2rem;
            }

            .search-flag {

            }

            input {
                width: 100%;
                color: gray;
                background-color: transparent;
                border: 0;
                font-size: x-small;
                &::-webkit-input-placeholder {
                    color: gray;
                }
            }

            &:hover {
                color: $theme-color-slave;
            }
        }
    }
</style>

<template>
    <div class="search-container">
        <div class="input-wrapper" :class="{'focused': searchFocused}">
            <i class="icon search-flag">&#xe639;</i>
            <input type="text" placeholder="全局搜索，敬请期待"
                   @focus="focusSearch" @blur="blurSearch">
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        data () {
            return {
                searchFocused: false
            };
        },
        methods: {
            focusSearch () {
                this.searchFocused = true;
            },
            blurSearch () {
                this.searchFocused = false;
            }
        }
    };
</script>
