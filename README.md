# BASE-WEB (前端基础工程)

```text
目的：
1、简化框架搭建成本，
2、方便整合为SRE-Micro APP（这里以 路径名 作为二级项目标识），
3、使用户专注于业务逻辑的需求开发，
4、请勿修改侧边栏样式（宽度等）。
```

### 注意事项
```markdown
1、本最小开发单元基于VUE2框架，
2、整合ElementUI与Echart框架，
3、图标整合iconfont，
4、使用axios封装解决跨域问题。

建议:
1、在开发过程总尽量以组件的形式开发业务逻辑单元，使代码更加具有可读性、逻辑性，且便于后期维护、迭代更新，
2、在组件开发中，css lang 推荐使用 less 。
```

## 运行项目
```markdown
# node 16
# 引入项目依赖
npm install

# 本地开发环境，运行
npm run serve

# 本地项目编译，手动发布
npm run build

# Pipeline 编译发布
查看[参考配置](https://docs.corp.kuaishou.com/k/home/VDVhIJ8XxnoA/fcAA8lou1A5HexwnpEeo2G2Ip#section=vodka.nap68l8606co).
```

### 自定义配置
```markdown
查看 [参考配置](https://cli.vuejs.org/config/).
```

