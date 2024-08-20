<style scoped lang="less" type="text/scss">
.sidebar-container {
  border-right: 0;
  background-color: #fff;
  width: 50px;

  .el-divider--horizontal {
    display: block;
    height: 2px;
    width: 100%;
    margin-top: -5px;
    margin-bottom: 7px;
    background-color: #ffffff;
  }

  .menu-css {
    height: calc(100vh);
    overflow-y: scroll;
    overflow-x: hidden;
    position: fixed;
    z-index: 8;
    border-right: 1px solid #b0c4de;
    background-color: #fff;

    &:hover {
      cursor: pointer;
    }

    .bottom {
      padding-left: 10px;
      padding-top: 5px;
      font-size: small;
    }

    .bottom:hover {
      cursor: pointer;
      color: #4169E1;
    }

    .icon {
      font-size: large;
      padding-right: 5px;
    }
  }

  .menu-css /deep/ .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 12rem;
  }

  .menu-css /deep/ .el-menu--collapse {
    width: 50px;
    pointer-events: none;
  }

  .menu-css /deep/ .el-menu-item.is-active {
    background-color: #fff;
    color: #4169E1;
  }

  .menu-css /deep/ .el-menu {
    background-color: #fff;
    border-right: 0;
    position: relative;
    height: calc(100% - 90px);
  }

  .menu-css /deep/ .el-menu-item.is-active {
    background-color: rgba(64, 158, 255, 0.1);
    border-right: 0;
  }

  .bottom-css /deep/ .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 5px;
    background-color: #b0c4de;
    margin-left: 3px;
  }

  .bottom {
    padding-left: 10px;
    padding-top: 5px;
    font-size: small;
  }

  .bottom:hover {
    cursor: pointer;
    color: #4169E1;
  }

  .icon {
    font-size: large;
    padding-right: 5px;
  }
}
</style>

<template>
  <div class="sidebar-container"
       :style="{width: !positionFixed && !isCollapse ? '12rem' : '50px'}">
    <div class="menu-css"
         :style="{position: positionFixed ? 'fixed' : 'relative'}"
         @mouseenter="hoverOpenMenu"
         @mouseleave="hoverCloseMenu">
      <el-menu
          :default-active="defaultActive"
          :collapse="isCollapse"
          class="el-menu-vertical-demo">
        <el-submenu
            :index="item.index"
            v-for="item in menus"
            :key="item.index"
            v-if="item.children"
            style="margin-left: -3px;">
          <template slot="title">
            <i class="icon" v-html="item.icon"></i>
            <span>{{ item.title }}</span>
          </template>
          <!--  二级 -->
          <el-menu-item :disabled="val.disable" :index="val.index" v-for="val in item.children"
                        :key="val.index" v-if="val.children == null" @click="route(val.index)">
            <i class="icon" v-html="val.icon"></i>
            <span>{{ val.title }}</span>
          </el-menu-item>
          <!--  三级 -->
          <el-submenu :index="val.index" v-for="val in item.children" :key="val.index" v-if="val.children">
            <template slot="title">
              <i class="icon" v-html="val.icon"></i>
              <span>{{ val.title }}</span>
            </template>
            <el-menu-item :disabled="child.disable" :index="child.index" v-for="child in val.children"
                          :key="child.index" @click="route(child.index)">
              <i class="icon" v-html="child.icon"></i>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <!-- 一级 -->
        <el-menu-item :index="item.index" :disabled="item.disable" v-for="item in menus" :key="item.index"
                      v-if="item.children == null" @click="route(item.index)">
          <i class="icon" v-html="item.icon" style="margin-left: -2px;"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
      <div class="bottom-css">
        <el-divider></el-divider>
      </div>
      <div class="bottom" @click="openClose">
        <i class="icon" v-if="isCollapse" style="padding-left: 10px;font-size: small;">&#xe65b;</i>
        <i class="icon" v-if="!isCollapse" style="font-size: medium; font-weight: bold;"
           v-html="positionFixed ? '&#xe6af;' : '&#xe8a3;'"></i>
        <span v-if="!isCollapse"
              style="padding-left: 10px;font-size: small;position: absolute; margin-top: 1px;">{{ positionFixed ? '锚定菜单' : '取消锚定' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ROUTER_NAME from "/src/router/names";

export default {
  name: "",
  components: {},
  data() {
    return {
      positionFixed: false,
      isCollapse: false,
      defaultActive: "1-1",
      menus: [
        {
          index: "1",
          title: "爬虫",
          icon: "&#xe685;",
          disable: false,
          children: [
            {
              index: '1-1',
              title: '爬虫总览',
              icon: '&#xe699;',
              disable: false,
            },
            {
              index: '1-2',
              title: '博主池管理',
              icon: '&#xe699;',
              disable: true,
            }
          ]
        },
        {
          index: '2',
          title: '标注',
          icon: '&#xe693;',
          disable: true,
          children: [
            {
              index: '2-1',
              title: '标注总览',
              icon: '&#xe699;',
              disable: false,
            },
            {
              index: '2-2',
              title: '标注',
              icon: '&#xe699;',
              disable: false,
            }
          ]
        },
      ],
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    }
  },
  watch: {
    currentPath: {
      immediate: true,
      handler(currentPath) {
        /**
         *   TODO
         *   Lucky : 2022/1/5 11:47 上午
         **/
      },
    },
  },
  methods: {
    // 展开/收起
    openClose() {
      // 锚定
      if (this.positionFixed) {
        this.positionFixed = false;
        this.isCollapse = false;

      } else if (!this.positionFixed) {
        this.positionFixed = true;
        this.isCollapse = true;
      }
    },
    // hover enter open
    hoverOpenMenu() {
      if (this.positionFixed) {
        this.isCollapse = false;
      }
    },
    // hover leave close
    hoverCloseMenu() {
      if (this.positionFixed) {
        this.isCollapse = true;
      }
    },

    route(index) {
      if (index == '1-1') {

      }
      if (index == '2-1'){
        this.$router.push({
          // path: "/tagging/tagging",
          name: ROUTER_NAME.tagging.tagging,
          query: {}
        });
      }
    },
  },
};
</script>
